// Load environment variables BEFORE any other imports
// Using require() to ensure it runs before ES6 imports are hoisted
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import OpenAI from 'openai';
import clientPromise from '../lib/mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'document_chunks';

// Configuration
const CHUNK_SIZE = 1000; // tokens (approximate)
const CHUNK_OVERLAP = 200; // tokens (approximate)
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-large';

interface DocumentChunk {
  content: string;
  embedding: number[];
  source: string;
  chunkIndex: number;
  metadata: {
    documentTitle?: string;
    dateRange?: { start: string; end: string };
    pageNumber?: number;
  };
}

// Simple token estimation (rough approximation)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4); // Rough estimate: ~4 chars per token
}

// Chunk text with overlap
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  const tokens = estimateTokens(text);
  
  if (tokens <= chunkSize) {
    return [text];
  }

  let start = 0;
  const step = chunkSize - overlap;
  
  while (start < text.length) {
    let end = start + chunkSize * 4; // Convert tokens to chars (rough)
    if (end > text.length) {
      end = text.length;
    }
    
    let chunk = text.slice(start, end);
    
    // Try to break at sentence boundaries
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
    start += step * 4; // Convert tokens to chars
  }
  
  return chunks.filter(chunk => chunk.length > 0);
}

// Generate embedding for text
async function generateEmbedding(
  openai: OpenAI,
  text: string
): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: 1536, // Match MongoDB index dimensions
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Extract source name from filename
function extractSourceName(filename: string): string {
  return filename
    .replace(/\.txt$/i, '')
    .replace(/\.md$/i, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
}

// Recursively find all text files in directory and subdirectories
async function findAllTextFiles(dir: string): Promise<Array<{ path: string; name: string }>> {
  const textFiles: Array<{ path: string; name: string }> = [];
  
  async function walkDirectory(currentDir: string) {
    const entries = await readdir(currentDir);
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        // Recursively process subdirectories
        await walkDirectory(fullPath);
      } else if (stats.isFile() && (entry.endsWith('.txt') || entry.endsWith('.md'))) {
        textFiles.push({ path: fullPath, name: entry });
      }
    }
  }
  
  await walkDirectory(dir);
  return textFiles;
}

// Process a single document file
async function processDocument(
  filePath: string,
  filename: string,
  openai: OpenAI,
  db: any
): Promise<number> {
  console.log(`Processing: ${filename}`);
  
  const content = await readFile(filePath, 'utf-8');
  const source = extractSourceName(filename);
  const chunks = chunkText(content, CHUNK_SIZE, CHUNK_OVERLAP);
  
  console.log(`  Split into ${chunks.length} chunks`);
  
  const collection = db.collection(COLLECTION_NAME);
  let processed = 0;
  
  // Process chunks in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    
    const chunkPromises = batch.map(async (chunk, index) => {
      const chunkIndex = i + index;
      const embedding = await generateEmbedding(openai, chunk);
      
      const document: DocumentChunk = {
        content: chunk,
        embedding,
        source,
        chunkIndex,
        metadata: {
          documentTitle: filename,
        },
      };
      
      return document;
    });
    
    const documents = await Promise.all(chunkPromises);
    
    // Insert into MongoDB
    if (documents.length > 0) {
      await collection.insertMany(documents);
      processed += documents.length;
      console.log(`  Processed ${processed}/${chunks.length} chunks`);
    }
    
    // Small delay to avoid rate limits
    if (i + batchSize < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return processed;
}

// Main ingestion function
async function ingestDocuments(documentsDir: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const client = await clientPromise;
  const db = client.db(DB_NAME);
  
  // Ensure collection exists
  await db.createCollection(COLLECTION_NAME).catch(() => {
    // Collection might already exist, that's fine
  });

  try {
    // Recursively find all text files in directory and subdirectories
    const textFiles = await findAllTextFiles(documentsDir);

    if (textFiles.length === 0) {
      console.log('No text files found in directory');
      return;
    }

    console.log(`Found ${textFiles.length} text files to process (including subdirectories)`);
    
    let totalChunks = 0;
    for (const { path: filePath, name: fileName } of textFiles) {
      const chunks = await processDocument(filePath, fileName, openai, db);
      totalChunks += chunks;
    }

    console.log(`\nIngestion complete! Processed ${totalChunks} total chunks.`);
    console.log('\nNext steps:');
    console.log('1. Create a vector search index in MongoDB Atlas');
    console.log('2. Use the index configuration from setup-vector-index');
    
  } catch (error) {
    console.error('Error during ingestion:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run if called directly
const documentsDir = process.argv[2] || './documents';

ingestDocuments(documentsDir)
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

export { ingestDocuments, chunkText, generateEmbedding };

