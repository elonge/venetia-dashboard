import fs from 'fs';
import path from 'path';
import './load-env';
import OpenAI from 'openai';
import clientPromise from '../lib/mongodb';

const DB_NAME = 'venetia_project';
const TARGET_COLLECTION = 'document_chunks';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;
const INPUT_DIR = '/Users/elongecht/code/venetia/test_scan/more_newspaper';

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function chunkText(text: string, chunkSize: number = 800, overlap: number = 100): string[] {
  if (!text) return [];
  const chunks: string[] = [];
  const tokens = estimateTokens(text);

  if (tokens <= chunkSize) {
    return [text];
  }

  let start = 0;
  // Approximation: 1 token ~ 4 chars
  const charChunkSize = chunkSize * 4;
  const charOverlap = overlap * 4;
  const step = charChunkSize - charOverlap;

  while (start < text.length) {
    let end = start + charChunkSize;
    if (end > text.length) end = text.length;

    let chunk = text.slice(start, end);

    // Try to break at a sentence or paragraph
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
    start += step;
  }

  return chunks.filter((c) => c.length > 0);
}

async function generateEmbedding(openai: OpenAI, text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return response.data[0].embedding;
}

function parseDateFromFilename(filename: string, isTimes: boolean): { date: Date | null; newspaperName: string } {
  if (isTimes) {
    // Format: yyyy-mm-dd_ID.txt
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})_/);
    if (match && match[1]) {
      const date = new Date(match[1]);
      if (!isNaN(date.getTime())) {
        return { date, newspaperName: "The Times" };
      }
    }
  } else {
    // Format: NewspaperName_YYYY_MM_DD.txt (e.g., DailyMirror_1914_07_20.txt)
    const parts = filename.replace(/\.[^/.]+$/, "").split('_');
    if (parts.length >= 4) {
      const day = parts.pop();
      const month = parts.pop();
      const year = parts.pop();
      const name = parts.join(" "); // Reconstruct name if it had underscores
      
      const dateStr = `${year}-${month}-${day}`;
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return { date, newspaperName: name };
      }
    }
  }
  
  return { date: null, newspaperName: "" };
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  // Check if input directory exists
  if (!fs.existsSync(INPUT_DIR)) {
    throw new Error(`Input directory not found: ${INPUT_DIR}`);
  }

  const isTimes = INPUT_DIR.toLowerCase().includes('_times');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const targetColl = db.collection(TARGET_COLLECTION);

  console.log(`Reading files from ${INPUT_DIR}...`);
  const files = fs.readdirSync(INPUT_DIR).filter(f => !f.startsWith('.')); // Ignore hidden files

  let processed = 0;
  let chunkCount = 0;

  for (const file of files) {
    const filePath = path.join(INPUT_DIR, file);
    const stats = fs.statSync(filePath);
    
    if (!stats.isFile()) continue;

    const { date, newspaperName } = parseDateFromFilename(file, isTimes);
    if (!date) {
      console.warn(`Could not parse date/name from filename: ${file}. Skipping.`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) {
      console.warn(`Empty file: ${file}. Skipping.`);
      continue;
    }

    const chunks = chunkText(content);
    
    // Process chunks in parallel for this file
    const embeddings = await Promise.all(
        chunks.map(chunk => generateEmbedding(openai, chunk))
    );

    const newDocs = chunks.map((chunkContent, idx) => {
      const new_metadata = {
        source_type: "newspaper",
        source: newspaperName,
        date: date,
        filename: file,
        is_primary: true
      };

      return {
        content: chunkContent,
        embedding: embeddings[idx],
        source: `Newspaper: ${newspaperName} (${date.toISOString().split('T')[0]})`,
        chunkIndex: idx,
        metadata: {
          documentTitle: `${newspaperName} - ${date.toDateString()}`,
          source_type: "newspaper",
          source: newspaperName,
          date: date,
          filename: file
        },
        new_metadata
      };
    });

    if (newDocs.length > 0) {
      await targetColl.insertMany(newDocs);
      chunkCount += newDocs.length;
    }

    processed++;
    if (processed % 5 === 0) {
        process.stdout.write(`Processed ${processed} files, generated ${chunkCount} chunks...\r`);
    }
  }

  console.log(`\n\nDone! Processed ${processed} files and inserted ${chunkCount} chunks.`);
  await client.close();
}

main().catch(console.error);
