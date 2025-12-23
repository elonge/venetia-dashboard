// Load environment variables BEFORE any other imports
require('dotenv').config({
  path: require('path').resolve(process.cwd(), '.env.local'),
});

import { readFile } from 'fs/promises';
import OpenAI from 'openai';
import clientPromise from '../lib/mongodb';

const DB_NAME = 'venetia_project';

const DEFAULT_COLLECTION_NAME = 'asquith_chunks';
const DEFAULT_EMBEDDING_MODEL =
  process.env.EMBEDDING_MODEL || 'text-embedding-3-large';
const EMBEDDING_DIMENSIONS = 1536;

interface LetterSection {
  date: Date;
  dateISO: string; // YYYY-MM-DD
  headerLine: string;
  disambiguator?: string;
  pageSource?: string;
  content: string;
}

interface IngestOptions {
  filePath: string;
  collectionName: string;
  source: string;
  chunkSizeTokens: number;
  chunkOverlapTokens: number;
  batchSize: number;
  clear: boolean;
  dryRun: boolean;
  limitLetters?: number;
  embeddingModel: string;
}

function parseArgs(argv: string[]): IngestOptions {
  const getArg = (name: string): string | undefined => {
    const idx = argv.indexOf(name);
    if (idx === -1) return undefined;
    return argv[idx + 1];
  };

  const hasFlag = (name: string): boolean => argv.includes(name);

  const filePath =
    getArg('--file') ||
    argv.find((a) => a && !a.startsWith('-')) ||
    '';

  if (!filePath) {
    throw new Error(
      'Missing Asquith letters file path. Provide `--file /path/to/asquith_letters_full.txt`.'
    );
  }

  const collectionName = getArg('--collection') || DEFAULT_COLLECTION_NAME;
  const source = getArg('--source') || 'asquith_letters_full';
  const chunkSizeTokens = parseInt(getArg('--chunkSize') || '1000', 10);
  const chunkOverlapTokens = parseInt(getArg('--chunkOverlap') || '200', 10);
  const batchSize = parseInt(getArg('--batchSize') || '10', 10);
  const limitLettersRaw = getArg('--limitLetters');
  const limitLetters = limitLettersRaw
    ? parseInt(limitLettersRaw, 10)
    : undefined;
  const embeddingModel = getArg('--embeddingModel') || DEFAULT_EMBEDDING_MODEL;

  return {
    filePath,
    collectionName,
    source,
    chunkSizeTokens,
    chunkOverlapTokens,
    batchSize,
    clear: hasFlag('--clear'),
    dryRun: hasFlag('--dryRun'),
    limitLetters,
    embeddingModel,
  };
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  const tokens = estimateTokens(text);

  if (tokens <= chunkSize) {
    return [text];
  }

  let start = 0;
  const step = chunkSize - overlap;

  while (start < text.length) {
    let end = start + chunkSize * 4;
    if (end > text.length) end = text.length;

    let chunk = text.slice(start, end);

    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.');
      const lastNewline = chunk.lastIndexOf('\n\n');
      const breakPoint = Math.max(lastPeriod, lastNewline);
      if (breakPoint > chunk.length * 0.5) {
        chunk = chunk.slice(0, breakPoint + 1);
        end = start + breakPoint + 1;
      }
    }

    chunks.push(chunk.trim());

    if (end >= text.length) break;
    start += step * 4;
  }

  return chunks.filter((c) => c.length > 0);
}

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function toISODateUTC(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseAsquithDateHeader(line: string): {
  date: Date;
  dateISO: string;
  headerLine: string;
  disambiguator?: string;
  remainder?: string;
} | null {
  const trimmed = line.trim();

  // Examples:
  // 11 Feb 14 [i]
  // 12 Mar 14. Venetia had not replied...
  // 45 Sat 14 March 14.
  const m = trimmed.match(
    /^(?:(\d{1,3})\s+)?(?:(Mon|Tue|Tues|Wed|Thu|Thur|Fri|Sat|Sun)\w*\s+)?(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{2})(.*)$/
  );
  if (!m) return null;

  const dayNum = parseInt(m[3], 10);
  const monthRaw = m[4].toLowerCase().replace(/\.$/, '');
  const monthIdx = MONTHS[monthRaw];
  if (monthIdx === undefined) return null;

  const yy = parseInt(m[5], 10);
  const fullYear = 1900 + yy;
  const date = new Date(Date.UTC(fullYear, monthIdx, dayNum, 0, 0, 0, 0));
  const dateISO = toISODateUTC(date);

  let remainder = (m[6] || '').trim();
  let disambiguator: string | undefined;
  const dis = remainder.match(/\[([^\]]+)\]/);
  if (dis?.[1]) {
    disambiguator = dis[1].trim();
    remainder = remainder.replace(dis[0], '').trim();
  }

  remainder = remainder.replace(/^[.:]\s*/, '').trim();

  return {
    date,
    dateISO,
    headerLine: trimmed,
    disambiguator,
    remainder: remainder || undefined,
  };
}

function parsePageSource(line: string): string | null {
  const trimmed = line.trim();
  const m = trimmed.match(/^SOURCE:\s*(.+)$/i);
  if (!m) return null;
  return m[1].trim();
}

function shouldSkipLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed === '=== PAGE BREAK ===') return true;
  if (/^=+$/.test(trimmed)) return true;
  return false;
}

function extractLetterSections(text: string): LetterSection[] {
  const lines = text.split(/\r?\n/);
  const sections: LetterSection[] = [];

  let current: Omit<LetterSection, 'content'> & { contentLines: string[] } | null =
    null;
  let currentPageSource: string | undefined;

  for (const line of lines) {
    const pageSource = parsePageSource(line);
    if (pageSource) {
      currentPageSource = pageSource;
      continue;
    }

    if (shouldSkipLine(line)) continue;

    const header = parseAsquithDateHeader(line);
    if (header) {
      if (current) {
        const content = current.contentLines.join('\n').trim();
        if (content) {
          sections.push({
            date: current.date,
            dateISO: current.dateISO,
            headerLine: current.headerLine,
            disambiguator: current.disambiguator,
            pageSource: current.pageSource,
            content,
          });
        }
      }

      current = {
        date: header.date,
        dateISO: header.dateISO,
        headerLine: header.headerLine,
        disambiguator: header.disambiguator,
        pageSource: currentPageSource,
        contentLines: header.remainder ? [header.remainder] : [],
      };
      continue;
    }

    if (current) current.contentLines.push(line);
  }

  if (current) {
    const content = current.contentLines.join('\n').trim();
    if (content) {
      sections.push({
        date: current.date,
        dateISO: current.dateISO,
        headerLine: current.headerLine,
        disambiguator: current.disambiguator,
        pageSource: current.pageSource,
        content,
      });
    }
  }

  return sections;
}

async function generateEmbedding(
  openai: OpenAI,
  model: string,
  text: string
): Promise<number[]> {
  const response = await openai.embeddings.create({
    model,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return response.data[0].embedding;
}

async function ingestAsquithLetters(options: IngestOptions) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const fileText = await readFile(options.filePath, 'utf-8');
  const letters = extractLetterSections(fileText);

  if (letters.length === 0) {
    throw new Error(
      'No dated letter sections found. Check the date header format in the input file.'
    );
  }

  const limitedLetters =
    typeof options.limitLetters === 'number'
      ? letters.slice(0, options.limitLetters)
      : letters;

  console.log('Parsed Asquith letters', {
    filePath: options.filePath,
    lettersFound: letters.length,
    lettersToProcess: limitedLetters.length,
    firstDate: letters[0]?.dateISO,
    lastDate: letters[letters.length - 1]?.dateISO,
  });

  if (options.dryRun) return;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(options.collectionName);

  try {
    await db.createCollection(options.collectionName).catch(() => {});

    if (options.clear) {
      const del = await collection.deleteMany({ source: options.source });
      console.log(
        `Cleared ${del.deletedCount} existing chunk(s) for source="${options.source}" in "${options.collectionName}".`
      );
    }

    let globalChunkIndex = 0;
    let inserted = 0;

    for (let letterIndex = 0; letterIndex < limitedLetters.length; letterIndex++) {
      const letter = limitedLetters[letterIndex];
      const chunks = chunkText(
        letter.content,
        options.chunkSizeTokens,
        options.chunkOverlapTokens
      );

      for (let i = 0; i < chunks.length; i += options.batchSize) {
        const batch = chunks.slice(i, i + options.batchSize);
        const embeddings = await Promise.all(
          batch.map((chunk) =>
            generateEmbedding(openai, options.embeddingModel, chunk)
          )
        );

        const docs = batch.map((content, batchIdx) => {
          const letterChunkIndex = i + batchIdx;
          const embedding = embeddings[batchIdx];
          return {
            content,
            embedding,
            source: options.source,
            chunkIndex: globalChunkIndex++,
            metadata: {
              documentTitle: 'Asquith Letters',
              date: letter.date,
              dateISO: letter.dateISO,
              headerLine: letter.headerLine,
              disambiguator: letter.disambiguator,
              pageSource: letter.pageSource,
              letterIndex,
              letterChunkIndex,
            },
          };
        });

        if (docs.length > 0) {
          await collection.insertMany(docs);
          inserted += docs.length;
        }
      }

      if ((letterIndex + 1) % 10 === 0 || letterIndex === limitedLetters.length - 1) {
        console.log(
          `Processed letters ${letterIndex + 1}/${limitedLetters.length} (inserted chunks: ${inserted})`
        );
      }
    }

    console.log('Ingestion complete', {
      collection: options.collectionName,
      source: options.source,
      insertedChunks: inserted,
    });
  } finally {
    await client.close();
  }
}

const options = parseArgs(process.argv.slice(2));

ingestAsquithLetters(options)
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
