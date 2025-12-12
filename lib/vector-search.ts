import clientPromise from './mongodb';
import OpenAI from 'openai';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'document_chunks';
const INDEX_NAME = process.env.VECTOR_SEARCH_INDEX_NAME || 'vector_index';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-large';

export interface SearchResult {
  content: string;
  source: string;
  chunkIndex: number;
  score: number;
  metadata: {
    documentTitle?: string;
    dateRange?: { start: string; end: string };
    pageNumber?: number;
  };
}

export interface SearchFilters {
  source?: string | string[];
  dateRange?: { start: string; end: string };
}

// Generate embedding for query text
async function generateQueryEmbedding(
  query: string
): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: query,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating query embedding:', error);
    throw error;
  }
}

// Build filter for MongoDB query
function buildFilter(filters?: SearchFilters): any {
  if (!filters) return {};

  const mongoFilter: any = {};

  if (filters.source) {
    if (Array.isArray(filters.source)) {
      mongoFilter.source = { $in: filters.source };
    } else {
      mongoFilter.source = filters.source;
    }
  }

  if (filters.dateRange) {
    mongoFilter['metadata.dateRange'] = {
      $elemMatch: {
        start: { $lte: filters.dateRange.end },
        end: { $gte: filters.dateRange.start },
      },
    };
  }

  return mongoFilter;
}

/**
 * Search for similar document chunks using vector search
 * @param query - The search query text
 * @param limit - Maximum number of results to return (default: 10)
 * @param filters - Optional filters for source, date range, etc.
 * @returns Array of search results with content, source, and similarity scores
 */
export async function searchSimilarChunks(
  query: string,
  limit: number = 10,
  filters?: SearchFilters
): Promise<SearchResult[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Generate embedding for the query
    const queryEmbedding = await generateQueryEmbedding(query);

    // Build the vector search aggregation pipeline
    const pipeline: any[] = [
      {
        $vectorSearch: {
          index: INDEX_NAME,
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: Math.max(limit * 10, 100), // Search more candidates for better results
          limit: limit,
        },
      },
      {
        $project: {
          _id: 0,
          content: 1,
          source: 1,
          chunkIndex: 1,
          metadata: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];

    // Apply filters if provided
    const mongoFilter = buildFilter(filters);
    if (Object.keys(mongoFilter).length > 0) {
      // Add filter stage after vector search
      pipeline.push({
        $match: mongoFilter,
      });
    }

    const results = await collection.aggregate(pipeline).toArray();

    return results.map((result) => ({
      content: result.content,
      source: result.source,
      chunkIndex: result.chunkIndex,
      score: result.score || 0,
      metadata: result.metadata || {},
    }));
  } catch (error) {
    console.error('Error in vector search:', error);
    
    // Fallback: if vector search fails, try keyword search
    if (error instanceof Error && error.message.includes('vectorSearch')) {
      console.log('Falling back to keyword search...');
      return await fallbackKeywordSearch(query, limit, filters);
    }
    
    throw error;
  }
}

/**
 * Fallback keyword search if vector search is not available
 */
async function fallbackKeywordSearch(
  query: string,
  limit: number,
  filters?: SearchFilters
): Promise<SearchResult[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const mongoFilter = buildFilter(filters);
    
    // Simple text search using regex (case-insensitive)
    const searchTerms = query.split(/\s+/).filter(term => term.length > 2);
    if (searchTerms.length > 0) {
      mongoFilter.content = {
        $regex: searchTerms.join('|'),
        $options: 'i',
      };
    }

    const results = await collection
      .find(mongoFilter)
      .limit(limit)
      .toArray();

    return results.map((result) => ({
      content: result.content,
      source: result.source,
      chunkIndex: result.chunkIndex,
      score: 0.5, // Default score for keyword search
      metadata: result.metadata || {},
    }));
  } catch (error) {
    console.error('Error in fallback keyword search:', error);
    throw error;
  }
}

/**
 * Get unique sources from the document chunks collection
 */
export async function getAvailableSources(): Promise<string[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const sources = await collection.distinct('source');
    return sources.sort();
  } catch (error) {
    console.error('Error fetching sources:', error);
    return [];
  }
}

