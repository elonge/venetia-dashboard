import { tool } from '@openai/agents';
import { z } from 'zod';
import { 
  searchPrimaryEntries, 
  searchSimilarChunks, 
  type SearchIntent,
  type SearchFilters 
} from '@/lib/vector-search';
import { getWeather } from '@/lib/weather';
import OpenAI from 'openai';
import { SearchIntentSchema, PlanSchema, AuthorEnum, RecipientEnum } from '@/types/chat';

// --- Shared Schemas ---
export { SearchIntentSchema, PlanSchema };

export const AnswersSchema = z.object({
  answers: z.array(z.object({
    text: z.string().describe('The answer text, formatted as a paragraph.'),
    link: z.string().describe('The name of the source document referenced (e.g. "Letter to Venetia, 1915-05-12").')
  }))
});

// --- Helper for Intent Analysis ---
// Reusing the logic from route.ts but making it self-contained
async function analyzeIntentLogic(query: string): Promise<SearchIntent> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const knowledgeBase = `
    Use this knowledge base to resolve named events into date ranges:
    - Marconi Scandal: 1912-04 to 1913-06-19 (Location: London)
    - Sicily Trip: 1912-01-11 to 1912-01-30 (Location: Sicily)
    - Asquith's Romantic Epiphany: 1912-02-25 (Location: Hurstly)
    - Curragh Incident: 1914-03-20 to 1914-03-24 (Location: Ireland)
    - Home Rule Crisis: 1914-07-21 to 1914-07-24 (Location: London)
    - Outbreak of War: 1914-08-04 (Location: London)
    - Fall of Antwerp: 1914-10-03 to 1914-10-10 (Location: Antwerp)
    - Sinking of HMS Audacious: 1914-10-27 (Location: Ireland)
    - Battle of Coronel: 1914-11-01 (Location: Chile)
    - Battle of the Falklands: 1914-12-08 (Location: South Atlantic)
    - Annus Mirabilis Letter: 1914-12-31 (Location: Walmer Castle)
    - Venetia's Nursing: 1915-01 to 1915-05 (Location: London Hospital)
    - Dardanelles Bombardment: 1915-02-19 to 1915-03-18 (Location: Turkey)
    - Neuve Chapelle: 1915-03-10 to 1915-03-13 (Location: France)
    - Shells Scandal: 1915-04-20 to 1915-05-14 (Location: London)
    - Gallipoli Landings: 1915-04-25 (Location: Turkey)
    - Sinking of Lusitania: 1915-05-07 (Location: Ireland)
    - Venetia's Engagement: 1915-05-12 (Location: Wimereux/London)
    - Resignation of Lord Fisher: 1915-05-15 (Location: London)
    - May Crisis / Coalition: 1915-05-17 to 1915-05-26 (Location: London)
    - Venetia's Marriage: 1915-07-12 to 1915-07-26 (Location: London)
    - Conscription Crisis: 1915-10 to 1916-01-27 (Location: London)
    - Death of Kitchener: 1916-06-05 (Location: Orkney)
    - Death of Raymond Asquith: 1916-09-15 (Location: France)
    - Fall of Asquith: 1916-12-01 to 1916-12-07 (Location: London)
    `;

    const analysisPrompt = `
    Analyze the user's historical query.
    ${knowledgeBase}
    
    Return a JSON object with:
    - type: 'specific_date', 'timeline', 'sentiment_trend', or 'general_context'
    - dateRange: { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' } (or null). 
    - sentiment: 'positive', 'negative', or null
    - author: The name of the person writing the letter (e.g., 'Edwin Montagu', 'H.H. Asquith', 'Margot Asquith', 'Venetia Stanley') if specified.
    - recipient: The name of the person receiving the letter if specified.
    - requiresSecondary: boolean
    - requiresWeather: boolean
    - locationContext: 'London', 'Oxford', or 'Alderley'
    - semanticQuery: A concise string optimized for VECTOR SEARCH if the user asks about a TOPIC, SECRET, OPINION, or EVENT content (e.g., "political secrets", "opinion on war", "shells scandal details"). Exclude dates/authors from this string if they are captured in other fields. If the query is purely date-based, leave null.
    
    Query: "${query}"
    `;

    try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: "You are a precise query analyzer." }, { role: "user", content: analysisPrompt }],
          response_format: { type: "json_object" },
          temperature: 0
        });
    
        const parsed = JSON.parse(completion.choices[0].message.content || '{}');
        console.log('Intent analysis response:', parsed);
        return SearchIntentSchema.parse(parsed);
    } catch (e) {
        console.error("Intent analysis failed:", e);
        return { 
            type: 'general_context', 
            requiresWeather: false,
            locationContext: 'London'
        };
    }
}

// --- Tools ---

export const createDetectIntentTool = (currentMessage: string, onStatus?: (status: string) => void) => tool({
    name: 'detect_intent',
    description: 'Analyze the latest user query to determine the search intent, date ranges, entities, and required data types.',
    parameters: z.object({
        query: z.string().describe('The latest user message. (Optional, will use context if not provided)')
    }),
    execute: async ({ query }) => {
        const textToAnalyze = currentMessage || query;
        onStatus?.('Analyzing your question...');
        console.log('🔍 [Tool: detect_intent] Analyzing:', textToAnalyze);
        const intent = await analyzeIntentLogic(textToAnalyze);
        console.log('🧠 [Intent Detected]:', JSON.stringify(intent, null, 2));
        return JSON.stringify(intent);
    }
});

export const createGetPrimarySourcesTool = (onStatus?: (status: string) => void) => tool({
    name: 'get_primary_sources',
    description: 'Search for primary source documents (letters, diaries) based on metadata like date, author, recipient, and sentiment.',
    parameters: z.object({
        start_date: z.string().nullable().describe('Start date in YYYY-MM-DD format'),
        end_date: z.string().nullable().describe('End date in YYYY-MM-DD format'),
        author: AuthorEnum.nullable(),
        recipient: RecipientEnum.nullable(),
        sentiment: z.enum(['positive', 'negative']).nullable(),
        topics: z.array(z.string()).nullable(),
        limit: z.number().nullable().default(15)
    }),
    execute: async (args) => {
        onStatus?.('Searching letters and diaries...');
        console.log('📜 [Tool: get_primary_sources] Called with:', JSON.stringify(args));
        const intent: SearchIntent = {
            type: args.start_date || args.author ? 'specific_date' : 'general_context',
            requiresWeather: false, // Not relevant for this specific tool call
            dateRange: args.start_date && args.end_date ? { start: args.start_date, end: args.end_date } : null,
            author: args.author,
            recipient: args.recipient,
            sentiment: args.sentiment,
            topics: args.topics,
            requiresSecondary: true
        };
        const results = await searchPrimaryEntries(intent, args.limit || 15);
        console.log(`📜 [Tool: get_primary_sources] Found ${results.length} docs`);
        return JSON.stringify(results);
    }
});

export const createFindRelevantChunksTool = (onStatus?: (status: string) => void) => tool({
    name: 'find_relevant_chunks',
    description: 'Semantic vector search over all documents (primary and secondary sources) to find relevant text chunks.',
    parameters: z.object({
        query: z.string().describe('The search query text'),
        limit: z.number().nullable().default(10),
        source_filter: z.array(z.string()).nullable(),
        start_date: z.string().nullable(),
        end_date: z.string().nullable(),
        author: AuthorEnum.nullable().describe('Filter by author (e.g., "Asquith")'),
        recipient: RecipientEnum.nullable().describe('Filter by recipient')
    }),
    execute: async (args) => {
        onStatus?.('Reading through documents...');
        console.log('🔎 [Tool: find_relevant_chunks] Called with:', JSON.stringify(args));
        const filters: SearchFilters = {};
        if (args.source_filter && args.source_filter.length > 0) {
            filters.source = args.source_filter;
        }
        if (args.start_date && args.end_date) {
            filters.dateRange = { start: args.start_date, end: args.end_date };
        }
        if (args.author) {
            filters.author = args.author;
        }
        if (args.recipient) {
            filters.recipient = args.recipient;
        }
        
        const results = await searchSimilarChunks(args.query, args.limit || 10, filters);
        console.log(`🔎 [Tool: find_relevant_chunks] Found ${results.length} chunks`, filters);

        // Return metadata only (omit full chunk content to reduce payload/token usage)
        const redactedResults = results.map((r: any) => {
            if (!r || typeof r !== 'object') return r;
            // Common field name used for chunk text
            const { content, ...rest } = r;
            return rest;
        });
        return JSON.stringify(results);
    }
});

export const createGetWeatherRecordsTool = (onStatus?: (status: string) => void) => tool({
    name: 'get_weather_records',
    description: 'Fetch historical weather records for a specific date range and location.',
    parameters: z.object({
        start_date: z.string().describe('YYYY-MM-DD'),
        end_date: z.string().describe('YYYY-MM-DD'),
        location: z.string().nullable().default('London')
    }),
    execute: async (args) => {
        onStatus?.('Checking weather records...');
        console.log('☀️ [Tool: get_weather_records] Called with:', JSON.stringify(args));
        const results = await getWeather(args.start_date, args.end_date, args.location || 'London');
        console.log(`☀️ [Tool: get_weather_records] Found data`);
        return JSON.stringify(results);
    }
});

// --- Backward Compatibility ---
export const detectIntentTool = createDetectIntentTool('');
export const getPrimarySourcesTool = createGetPrimarySourcesTool();
export const findRelevantChunksTool = createFindRelevantChunksTool();
export const getWeatherRecordsTool = createGetWeatherRecordsTool();
