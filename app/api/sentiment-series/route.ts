import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import clientPromise from '@/lib/mongodb';
import {
  Bucket,
  BucketEmbeddingDoc,
  ConceptExpansion,
  DEFAULT_BUCKET_COLLECTION,
  DEFAULT_CHAT_MODEL,
  DEFAULT_CONCEPT_COLLECTION,
  DEFAULT_DB_NAME,
  DEFAULT_EMBEDDING_DIMENSIONS,
  DEFAULT_EMBEDDING_MODEL,
  buildExpansionEmbeddingText,
  cosineSimilarity,
  expandConceptOnce,
  normalize0to100,
  rollingMean,
} from '@/lib/sentiment-series';

type SeriesPoint = {
  bucketStart: string; // ISO date
  raw: number;
  smooth: number;
  norm: number;
  chunkCount?: number;
};

type SentimentSeriesResponse = {
  term: string;
  bucket: Bucket;
  from?: string;
  to?: string;
  smoothingWindow: number;
  expansion: ConceptExpansion;
  series: SeriesPoint[];
};

const MAX_TO_DATE = new Date(Date.UTC(1916, 11, 31, 23, 59, 59, 999));

function parseBucket(value: string | null): Bucket {
  if (!value) return 'week';
  const v = value.toLowerCase();
  if (v === 'week' || v === 'month') return v;
  return 'week';
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return n;
}

function parseISODateOrUndefined(value: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d;
}

function clampToMaxDate(d: Date | undefined): Date | undefined {
  if (!d) return undefined;
  return d > MAX_TO_DATE ? new Date(MAX_TO_DATE) : d;
}

async function getOrCreateConcept(
  openai: OpenAI,
  params: { term: string; scope: string; chatModel: string; embeddingModel: string }
) {
  const client = await clientPromise;
  const db = client.db(DEFAULT_DB_NAME);
  const col = db.collection(DEFAULT_CONCEPT_COLLECTION);

  const key = {
    term: params.term,
    scope: params.scope,
    chatModel: params.chatModel,
    embeddingModel: params.embeddingModel,
    dimensions: DEFAULT_EMBEDDING_DIMENSIONS,
  };

  const existing = await col.findOne(key, {
    projection: { _id: 0, expansion: 1, queryEmbedding: 1 },
  });

  if (existing?.expansion && Array.isArray(existing.queryEmbedding)) {
    return {
      expansion: existing.expansion as ConceptExpansion,
      queryEmbedding: existing.queryEmbedding as number[],
      cached: true,
    };
  }

  const expansion = await expandConceptOnce(openai, params.term, params.chatModel);
  const embeddingText = buildExpansionEmbeddingText(expansion);
  const embeddingResp = await openai.embeddings.create({
    model: params.embeddingModel,
    input: embeddingText,
    dimensions: DEFAULT_EMBEDDING_DIMENSIONS,
  });
  const queryEmbedding = embeddingResp.data[0].embedding;

  await col.updateOne(
    key,
    {
      $set: {
        ...key,
        expansion,
        queryEmbedding,
        embeddingText,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  return { expansion, queryEmbedding, cached: false };
}

async function fetchBucketDocs(params: {
  bucket: Bucket;
  from?: Date;
  to?: Date;
  source?: string;
}): Promise<BucketEmbeddingDoc[]> {
  const client = await clientPromise;
  const db = client.db(DEFAULT_DB_NAME);
  const col = db.collection(DEFAULT_BUCKET_COLLECTION);

  const filter: any = { bucket: params.bucket };
  if (params.source) filter.source = params.source;
  if (params.from || params.to) {
    filter.bucketStart = {};
    if (params.from) filter.bucketStart.$gte = params.from;
    if (params.to) filter.bucketStart.$lte = params.to;
  }

  const docs = await col
    .find(filter, {
      projection: { _id: 0, bucket: 1, bucketStart: 1, embedding: 1, chunkCount: 1, source: 1 },
    })
    .sort({ bucketStart: 1 })
    .toArray();

  return docs as any;
}

function isoDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function bucketIncrement(bucket: Bucket, d: Date): Date {
  if (bucket === 'month') {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  }
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 7, 0, 0, 0, 0));
}

function backfillSeries(
  bucket: Bucket,
  docs: Array<{ bucketStart: Date; raw: number; chunkCount?: number }>,
  from?: Date,
  to?: Date
): Array<{ bucketStart: Date; raw: number; chunkCount?: number }> {
  if (docs.length === 0) return [];
  const start = from ? new Date(from) : new Date(docs[0].bucketStart);
  const end = to ? new Date(to) : new Date(docs[docs.length - 1].bucketStart);

  const byKey = new Map<string, { raw: number; chunkCount?: number }>();
  for (const d of docs) {
    byKey.set(isoDateOnly(d.bucketStart), { raw: d.raw, chunkCount: d.chunkCount });
  }

  const out: Array<{ bucketStart: Date; raw: number; chunkCount?: number }> = [];
  for (let cur = new Date(start); cur <= end; cur = bucketIncrement(bucket, cur)) {
    const key = isoDateOnly(cur);
    const found = byKey.get(key);
    out.push({
      bucketStart: new Date(cur),
      raw: found?.raw ?? 0,
      chunkCount: found?.chunkCount,
    });
  }
  return out;
}

async function handle(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  const url = new URL(request.url);
  const term = (url.searchParams.get('term') || url.searchParams.get('q') || '').trim();
  if (!term || term.length > 80) {
    return NextResponse.json({ error: 'Invalid `term`' }, { status: 400 });
  }

  const bucket = parseBucket(url.searchParams.get('bucket'));
  const smoothingWindow = parsePositiveInt(url.searchParams.get('smoothingWindow'), 7);
  const from = clampToMaxDate(parseISODateOrUndefined(url.searchParams.get('from')));
  const to = clampToMaxDate(parseISODateOrUndefined(url.searchParams.get('to')) ?? MAX_TO_DATE);
  const source = url.searchParams.get('source') || undefined;

  const chatModel = url.searchParams.get('chatModel') || DEFAULT_CHAT_MODEL;
  const embeddingModel = url.searchParams.get('embeddingModel') || DEFAULT_EMBEDDING_MODEL;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { expansion, queryEmbedding } = await getOrCreateConcept(openai, {
    term,
    scope: 'asquith',
    chatModel,
    embeddingModel,
  });

  const bucketDocs = await fetchBucketDocs({ bucket, from, to, source });
  if (bucketDocs.length === 0) {
    const empty: SentimentSeriesResponse = {
      term,
      bucket,
      from: from ? isoDateOnly(from) : undefined,
      to: to ? isoDateOnly(to) : undefined,
      smoothingWindow,
      expansion,
      series: [],
    };
    return NextResponse.json(empty);
  }

  const scored = bucketDocs.map((doc) => ({
    bucketStart: new Date(doc.bucketStart),
    raw: cosineSimilarity(queryEmbedding, doc.embedding),
    chunkCount: doc.chunkCount,
  }));

  const filled = backfillSeries(bucket, scored, from, to);
  const rawValues = filled.map((p) => p.raw);
  const smoothValues = rollingMean(rawValues, smoothingWindow);
  const normValues = normalize0to100(smoothValues);

  const series: SeriesPoint[] = filled.map((p, idx) => ({
    bucketStart: isoDateOnly(p.bucketStart),
    raw: rawValues[idx],
    smooth: smoothValues[idx],
    norm: normValues[idx],
    chunkCount: p.chunkCount,
  }));

  const response: SentimentSeriesResponse = {
    term,
    bucket,
    from: from ? isoDateOnly(from) : undefined,
    to: to ? isoDateOnly(to) : undefined,
    smoothingWindow,
    expansion,
    series,
  };

  return NextResponse.json(response);
}

export async function GET(request: NextRequest) {
  try {
    return await handle(request);
  } catch (error) {
    console.error('Error in sentiment-series GET:', error);
    const msg = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const url = new URL(request.url);

    for (const [k, v] of Object.entries(body || {})) {
      if (v === undefined || v === null) continue;
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        url.searchParams.set(k, String(v));
      }
    }

    return await handle(new NextRequest(url.toString(), request));
  } catch (error) {
    console.error('Error in sentiment-series POST:', error);
    const msg = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
