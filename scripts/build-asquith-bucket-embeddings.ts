// Load environment variables BEFORE any other imports
require('dotenv').config({
  path: require('path').resolve(process.cwd(), '.env.local'),
});

import clientPromise from '../lib/mongodb';

const DB_NAME = 'venetia_project';

const DEFAULT_IN_COLLECTION = 'asquith_chunks';
const DEFAULT_OUT_COLLECTION = 'asquith_bucket_embeddings';

type Bucket = 'week' | 'month';

interface BuildOptions {
  inCollection: string;
  outCollection: string;
  bucket: Bucket;
  source?: string;
  clear: boolean;
  dryRun: boolean;
  from?: string;
  to?: string;
}

function parseArgs(argv: string[]): BuildOptions {
  const getArg = (name: string): string | undefined => {
    const idx = argv.indexOf(name);
    if (idx === -1) return undefined;
    return argv[idx + 1];
  };

  const hasFlag = (name: string): boolean => argv.includes(name);

  const bucketRaw = (getArg('--bucket') || 'week').toLowerCase();
  if (bucketRaw !== 'week' && bucketRaw !== 'month') {
    throw new Error('Invalid `--bucket`. Use `week` or `month`.');
  }

  return {
    inCollection: getArg('--in') || DEFAULT_IN_COLLECTION,
    outCollection: getArg('--out') || DEFAULT_OUT_COLLECTION,
    bucket: bucketRaw as Bucket,
    source: getArg('--source'),
    clear: hasFlag('--clear'),
    dryRun: hasFlag('--dryRun'),
    from: getArg('--from'),
    to: getArg('--to'),
  };
}

function parseISODateToUTCDate(iso: string): Date {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new Error(`Invalid ISO date (YYYY-MM-DD): "${iso}"`);
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  return new Date(Date.UTC(y, mo, d, 0, 0, 0, 0));
}

function startOfWeekUTC(date: Date): Date {
  const day = date.getUTCDay(); // 0=Sun..6=Sat
  const diffToMonday = (day + 6) % 7;
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - diffToMonday,
      0,
      0,
      0,
      0
    )
  );
}

function startOfMonthUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

function dateToBucketStartUTC(date: Date, bucket: Bucket): Date {
  return bucket === 'week' ? startOfWeekUTC(date) : startOfMonthUTC(date);
}

function bucketKey(bucketStart: Date): string {
  const y = bucketStart.getUTCFullYear();
  const m = String(bucketStart.getUTCMonth() + 1).padStart(2, '0');
  const d = String(bucketStart.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isEmbedding(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === 'number' &&
    Number.isFinite(value[0] as number)
  );
}

type BucketAccumulator = {
  bucketStart: Date;
  count: number;
  sum: Float64Array;
  minDate: Date;
  maxDate: Date;
};

function addEmbedding(acc: BucketAccumulator, embedding: number[]) {
  for (let i = 0; i < embedding.length; i++) {
    acc.sum[i] += embedding[i] || 0;
  }
  acc.count += 1;
}

function finalizeMean(acc: BucketAccumulator): number[] {
  const mean = new Array<number>(acc.sum.length);
  for (let i = 0; i < acc.sum.length; i++) {
    mean[i] = acc.sum[i] / acc.count;
  }
  return mean;
}

async function buildAsquithBucketEmbeddings(options: BuildOptions) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const inCol = db.collection(options.inCollection);
  const outCol = db.collection(options.outCollection);

  const match: any = {
    embedding: { $exists: true },
    'metadata.date': { $exists: true },
  };
  if (options.source) match.source = options.source;
  if (options.from || options.to) {
    match['metadata.date'] = {};
    if (options.from) match['metadata.date'].$gte = parseISODateToUTCDate(options.from);
    if (options.to) match['metadata.date'].$lte = parseISODateToUTCDate(options.to);
  }

  console.log('Building bucket embeddings', {
    inCollection: options.inCollection,
    outCollection: options.outCollection,
    bucket: options.bucket,
    source: options.source,
    from: options.from,
    to: options.to,
    clear: options.clear,
    dryRun: options.dryRun,
  });

  if (options.dryRun) {
    const count = await inCol.countDocuments(match);
    console.log('Dry run: matched chunk docs', { count });
    await client.close();
    return;
  }

  await db.createCollection(options.outCollection).catch(() => {});

  if (options.clear) {
    const deleteFilter: any = { bucket: options.bucket };
    if (options.source) deleteFilter.source = options.source;
    const del = await outCol.deleteMany(deleteFilter);
    console.log('Cleared existing bucket docs', { deletedCount: del.deletedCount });
  }

  const cursor = inCol
    .find(match, {
      projection: {
        embedding: 1,
        source: 1,
        metadata: { date: 1 },
      },
    })
    .batchSize(500);

  const first = await inCol.findOne(match, { projection: { embedding: 1 } });
  if (!first?.embedding || !isEmbedding(first.embedding)) {
    throw new Error('No embeddings found (or invalid embedding format).');
  }
  const dims = first.embedding.length;

  const accByBucket = new Map<string, BucketAccumulator>();
  let processed = 0;
  let seenMinDate: Date | null = null;
  let seenMaxDate: Date | null = null;
  let sourceSeen: string | undefined;

  for await (const doc of cursor) {
    processed += 1;

    const embedding = doc.embedding;
    if (!isEmbedding(embedding) || embedding.length !== dims) continue;

    const dateValue = doc?.metadata?.date;
    const date =
      dateValue instanceof Date ? dateValue : new Date(dateValue as string);
    if (Number.isNaN(date.getTime())) continue;

    const bucketStart = dateToBucketStartUTC(date, options.bucket);
    const key = bucketKey(bucketStart);

    if (!sourceSeen && typeof doc.source === 'string') sourceSeen = doc.source;

    let acc = accByBucket.get(key);
    if (!acc) {
      acc = {
        bucketStart,
        count: 0,
        sum: new Float64Array(dims),
        minDate: date,
        maxDate: date,
      };
      accByBucket.set(key, acc);
    }

    addEmbedding(acc, embedding);
    if (date < acc.minDate) acc.minDate = date;
    if (date > acc.maxDate) acc.maxDate = date;

    if (!seenMinDate || date < seenMinDate) seenMinDate = date;
    if (!seenMaxDate || date > seenMaxDate) seenMaxDate = date;

    if (processed % 5000 === 0) {
      console.log('Progress', { processed, buckets: accByBucket.size });
    }
  }

  const bucketDocs = Array.from(accByBucket.values())
    .sort((a, b) => a.bucketStart.getTime() - b.bucketStart.getTime())
    .map((acc) => ({
      bucket: options.bucket,
      bucketStart: acc.bucketStart,
      embedding: finalizeMean(acc),
      chunkCount: acc.count,
      minDate: acc.minDate,
      maxDate: acc.maxDate,
      source: options.source || sourceSeen || 'asquith_letters_full',
    }));

  if (bucketDocs.length === 0) {
    console.log('No bucket docs produced.');
    await client.close();
    return;
  }

  // Replace docs for this scope (bucket + source) to keep it simple and idempotent.
  const replaceFilter: any = { bucket: options.bucket };
  if (options.source || sourceSeen) replaceFilter.source = options.source || sourceSeen;
  await outCol.deleteMany(replaceFilter);
  await outCol.insertMany(bucketDocs);

  console.log('Bucket embedding build complete', {
    processedChunks: processed,
    buckets: bucketDocs.length,
    dims,
    minDate: seenMinDate?.toISOString(),
    maxDate: seenMaxDate?.toISOString(),
    outCollection: options.outCollection,
  });

  await client.close();
}

const options = parseArgs(process.argv.slice(2));

buildAsquithBucketEmbeddings(options)
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

