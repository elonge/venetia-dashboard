import './load-env';
import OpenAI from 'openai';
import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = 'venetia_project';
const SOURCE_COLLECTION = 'primary_sources';
const TARGET_COLLECTION = 'document_chunks';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-large';
const EMBEDDING_DIMENSIONS = 1536;

interface PrimarySourceDoc {
  _id: any;
  date: Date;
  author: string;
  recipient: string;
  full_text: string;
  source_type: string;
}

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

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const sourceColl = db.collection<PrimarySourceDoc>(SOURCE_COLLECTION);
  const targetColl = db.collection(TARGET_COLLECTION);

  console.log(`Reading from ${SOURCE_COLLECTION}...`);
  const cursor = sourceColl.find({});
  
  // Clear existing primary chunks to avoid duplicates if re-running
  // We assume primary sources in document_chunks are marked with source_type='primary_entry'
  // Actually, we should probably delete by specific source name if possible, but 'primary_entry' is generic.
  // For safety, let's delete strictly where metadata.source_type is 'primary_entry'.
  
  const deleteResult = await targetColl.deleteMany({ "metadata.source_type": "primary_entry" });
  console.log(`Cleared ${deleteResult.deletedCount} existing primary source chunks.`);

  let processed = 0;
  let chunkCount = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc || !doc.full_text) continue;

    const chunks = chunkText(doc.full_text);

    // Process chunks in parallel
    const embeddings = await Promise.all(
        chunks.map(chunk => generateEmbedding(openai, chunk))
    );

    const newDocs = chunks.map((content, idx) => ({
      content,
      embedding: embeddings[idx],
      source: `Primary: ${doc.author} to ${doc.recipient}`, // Descriptive source name
      chunkIndex: idx,
      metadata: {
        documentTitle: `Letter: ${doc.author} to ${doc.recipient} (${doc.date ? new Date(doc.date).toISOString().split('T')[0] : 'Unknown'})`,
        source_type: 'primary_entry',
        author: doc.author,
        recipient: doc.recipient,
        date: doc.date,
        original_id: doc._id
      }
    }));

    if (newDocs.length > 0) {
      await targetColl.insertMany(newDocs);
      chunkCount += newDocs.length;
    }

    processed++;
    if (processed % 10 === 0) {
        process.stdout.write(`Processed ${processed} docs, generated ${chunkCount} chunks...\r`);
    }
  }

  console.log(`\n\nDone! Processed ${processed} documents and inserted ${chunkCount} chunks.`);
  await client.close();
}

main().catch(console.error);
