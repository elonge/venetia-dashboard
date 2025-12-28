import clientPromise from './mongodb';
import OpenAI from 'openai';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'document_chunks';
const INDEX_NAME = process.env.VECTOR_SEARCH_INDEX_NAME || 'vector_index';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-large';
const ENTRIES_COLLECTION = 'primary_sources'; // The new collection for letters/diaries


export interface PrimaryEntryResult {
  content: string;
  date: Date;
  source: string;
  sentiment: number;
  score: number; // Artificial score for ranking
  metadata: any;
}

export interface PrimaryEntryFilter {
  dateRange?: { start: string; end: string }; // ISO date strings
  sentiment?: 'positive' | 'negative'; // Sentiment filter
  topics?: string[]; // Topics/keywords to search for
  author?: string; // Author name filter
  recipient?: string; // Recipient name filter
  textRegex?: string; // Optional regex to match in text content
}



export interface SearchResult {
  content: string;
  source: string;
  chunkIndex: number;
  score: number;
  metadata: {
    dateRange?: { start: string; end: string };
    pageNumber?: number;
    date?: string | Date;
    author?: string;
    recipient?: string;
    source_type?: string;
    source?: string;
  };
}

export interface SearchFilters {
  source?: string | string[];
  dateRange?: { start: string; end: string };
  author?: string;
  recipient?: string;
  source_type?: string;
}

// ...

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
      dimensions: 1536, // Match MongoDB index dimensions
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating query embedding:', error);
    throw error;
  }
}

export async function searchPrimaryEntries(
  filter: PrimaryEntryFilter,
  limit: number = 10
): Promise<PrimaryEntryResult[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(ENTRIES_COLLECTION);

    const query: any = {  };

    // 1. Date Filter (The "Calendar" Logic)
    if (filter.dateRange) {
      const start = new Date(filter.dateRange.start);
      // If end is the same day, make it end of day
      let end = new Date(filter.dateRange.end);
      if (filter.dateRange.start === filter.dateRange.end) {
          end.setDate(end.getDate() + 1); 
      }
      
      query.date = { 
        $gte: start, 
        $lte: end 
      };
    }

    // 2. Sentiment Filter (The "Mood" Logic)
    if (filter.sentiment === 'negative') {
      query.sentiment_score = { $lt: -0.4 };
    } else if (filter.sentiment === 'positive') {
      query.sentiment_score = { $gt: 0.4 };
    }

    if (filter.author) {
      query.author = { $regex: filter.author, $options: 'i' };
    }
    if (filter.recipient) {
      query.recipient = { $regex: filter.recipient, $options: 'i' };
    }
    // 3. Topic Keyword Filter (Simple Regex)
    if (filter.topics && filter.topics.length > 0) {
       // Create an OR condition: at least one of the topics must be present in full_text
       query.$or = filter.topics.map(t => ({ full_text: { $regex: t, $options: 'i' } }));
    }
    
    // 4. Explicit Text Regex (if provided)
    if (filter.textRegex) {
        query.full_text = { $regex: filter.textRegex, $options: 'i' };
    }

    console.log('📅 Executing Primary Search:', JSON.stringify(query));

    const docs = await collection
      .find(query)
      .sort({ date: 1 }) // Chronological order
      .limit(limit)
      .toArray();

    return docs.map(doc => ({
      content: doc.full_text,
      date: doc.date,
      source: doc.source_type, // or doc.filename
      sentiment: doc.sentiment_score || 0,
      author: doc.author,      
      recipient: doc.recipient,
      score: 1.0, // High confidence because it's an exact metadata match
      metadata: {
        documentTitle: `Letter/Entry: ${doc.date ? doc.date.toISOString().split('T')[0] : 'Unknown'} `,
        topics: doc.topics
      }
    }));

  } catch (error) {
    console.error('Error in primary entry search:', error);
    return [];
  }
}

// Build filter for MongoDB query
function buildFilter(filters?: SearchFilters): any {
  if (!filters) return {};

  const mongoFilter: any = {};

  if (filters.source) {
    if (Array.isArray(filters.source)) {
      mongoFilter['new_metadata.source'] = { $in: filters.source };
    } else {
      mongoFilter['new_metadata.source'] = filters.source;
    }
  }

  if (filters.dateRange) {
    // Queries against new_metadata.date (single date)
    const start = new Date(filters.dateRange.start);
    const end = new Date(filters.dateRange.end);
    // Ensure full day coverage if same day
    if (filters.dateRange.start === filters.dateRange.end) {
       end.setDate(end.getDate() + 1);
    }

    mongoFilter['new_metadata.date'] = {
      $gte: start, 
      $lte: end 
    };
  }
  
  // Support for Primary Source metadata filtering
  if (filters.author) {
      mongoFilter['new_metadata.author'] = { $eq: filters.author };
  }
  if (filters.recipient) {
      mongoFilter['new_metadata.recipient'] = { $eq: filters.recipient };
  }
  if (filters.source_type) {
      mongoFilter['new_metadata.source_type'] = filters.source_type;
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
    // We fetch more results initially (pre-filter limit) to allow for metadata filtering
    // because standard $match happens AFTER vector search.
    const preFilterLimit = limit;  // Fetch 20x the requested limit to ensure we find matches
    
    const mongoFilter = buildFilter(filters);
    console.log('🔍 Executing Vector Search with filter:', JSON.stringify(mongoFilter));
    const pipeline: any[] = [
      {
        $vectorSearch: {
          index: INDEX_NAME,
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: Math.max(preFilterLimit * 10, 500), 
          limit: preFilterLimit,
          filter: mongoFilter
        },
      },
      {
        $project: {
          _id: 0,
          content: 1,
          new_metadata: 1,
          chunkIndex: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];

    // Limit the final results to the requested amount
    pipeline.push({ $limit: limit });

    const results = await collection.aggregate(pipeline).toArray();

    return results.map((result) => ({
      content: result.content,
      source: result.new_metadata?.source || '',
      chunkIndex: result.chunkIndex, 
      score: result.score || 0,
      metadata: {
        author: result.new_metadata?.author,
        recipient: result.new_metadata?.recipient,
        date: result.new_metadata?.date,
        source_type: result.new_metadata?.source_type,
        source: result.new_metadata?.source || '',
      },
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
      source: result.new_metadata?.source || 'Unknown',
      chunkIndex: 0,
      score: 0.5, // Default score for keyword search
      metadata: {
        documentTitle: result.new_metadata?.source || 'Untitled',
        author: result.new_metadata?.author,
        recipient: result.new_metadata?.recipient,
        date: result.new_metadata?.date
      },
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

    const sources = await collection.distinct('new_metadata.source');
    return sources.sort();
  } catch (error) {
    console.error('Error fetching sources:', error);
    return [];
  }
}

