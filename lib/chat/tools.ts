import { tool } from "@openai/agents";
import { z } from "zod";
import { searchPrimaryEntries, searchSimilarChunks } from "@/lib/vector-search";
import { getWeather } from "@/lib/weather";
import { getAsquithVenetiaProximitySeries } from "@/lib/daily_records";
import { getPrimarySourceCount, getGroupedPrimarySourceCount } from "@/lib/statistics";
import OpenAI from "openai";
import { AuthorEnum, RecipientEnum } from "@/types/chat";
import { KNOWLEDGE_BASE } from "./knowledge";
import {
  formatFinalAnswers,
  UnformatedAnswerSchema,
  type VerifiedSourceItem,
} from "./formatFinalAnswers";

// --- Helper Functions ---

async function extractSnippetWithLLM(
  text: string,
  query: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) return text.substring(0, 300) + "...";
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert historian. Using the following knowledge base for context:
${KNOWLEDGE_BASE}

Extract a concise, relevant excerpt (approx 200-300 characters) from the following letter that directly relates to the query: "${query}". Keep the original wording. Return ONLY the excerpt.`,
        },
        { role: "user", content: text },
      ],
      max_tokens: 150,
      temperature: 0,
    });
    return (
      response.choices[0].message.content || text.substring(0, 300) + "..."
    );
  } catch (_e) {
    return text.substring(0, 300) + "...";
  }
}

async function scoreTextWithLLM(text: string, metric: string): Promise<number> {
  // A simplified metric scorer using a cheap model
  if (!process.env.OPENAI_API_KEY) return 0;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast model
      messages: [
        {
          role: "system",
          content: `You are an expert historian and sentiment analyzer. Use this knowledge base for context:
${KNOWLEDGE_BASE}

Rate the following text for the metric: "${metric}". Return ONLY a number between 0 and 100.`,
        },
        { role: "user", content: text },
      ],
      max_tokens: 10,
      temperature: 0,
    });
    const score = parseInt(response.choices[0].message.content || "0", 10);
    return isNaN(score) ? 0 : score;
  } catch (_e) {
    return 0;
  }
}

// --- Tools ---

export const createGetCorrespondenceMetricsTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "get_correspondence_metrics",
    description:
      'Analyze correspondence sentiment and metrics over a time range. Useful for "Political-Emotional" correlation, "Coded Language" decoder, etc.',
    parameters: z.object({
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
      sender: AuthorEnum.nullable().optional(),
      recipient: RecipientEnum.nullable().optional(),
      topic: z
        .string()
        .describe(
          'The topic or entity to analyze, e.g. "Churchill", "The War"'
        ),
      metric: z
        .string()
        .describe(
          'The metric to score, e.g. "sentiment", "anxiety", "romantic intensity"'
        ),
    }),
    execute: async (args) => {
      onStatus?.("Analyzing correspondence metrics...");
      console.log(
        "📊 [Tool: get_correspondence_metrics] Running analysis for:",
        JSON.stringify(args)
      );

      // 1. Fetch relevant chunks using Vector Search
      // We use source_type='letter' to target correspondence
      const docs = await searchSimilarChunks(args.topic, 50, {
        dateRange: { start: args.start_date, end: args.end_date },
        author: args.sender || undefined,
        recipient: args.recipient || undefined,
        source_type: args.recipient ? "letter" : "diary",
      });

      console.log(
        `📊 [Tool: get_correspondence_metrics] Found ${docs.length} relevant chunks for topic "${args.topic}".`
      );

      // 2. Calculate metrics for each chunk
      const results = await Promise.all(
        docs.map(async (doc) => {
          const score = await scoreTextWithLLM(doc.content, args.metric);

          return {
            date: doc.metadata.date,
            score,
            source: doc.source,
            text_snippet: doc.content.substring(0, 200) + "...",
          };
        })
      );

      // Filter out null dates if any
      const validResults = results.filter((r) => r.date);

      console.log(
        `📊 [Tool: get_correspondence_metrics] Completed scoring for ${validResults.length} data points.`
      );
      return JSON.stringify(validResults);
    },
  });

export const createGetParliamentChunksTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "get_parliament_chunks_in_range",
    description:
      "Search Parliament/Hansard records for specific topics or mentions within a date range.",
    parameters: z.object({
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
      query: z
        .string()
        .describe('Search query, e.g., "shells scandal", "conscription"'),
    }),
    execute: async (args) => {
      onStatus?.("Searching Parliament records...");
      console.log(
        "🏛️ [Tool: get_parliament_chunks] Searching Parliament records for:",
        JSON.stringify(args)
      );

      // Use the new source_type: 'hansard' filter directly in vector search
      const results = await searchSimilarChunks(args.query, 10, {
        dateRange: { start: args.start_date, end: args.end_date },
        source_type: "hansard",
      });

      if (results.length === 0) {
        console.log(
          "🏛️ [Tool: get_parliament_chunks] No Hansard results found."
        );
        return JSON.stringify([{Message: "No Hansard records found on these dates and query."}]);
      }

      console.log(
        `🏛️ [Tool: get_parliament_chunks] Found ${results.length} relevant Hansard chunks.`
      );
      return JSON.stringify(results);
    },
  });

export const createGetCabinetChunksTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "get_cabinet_chunks_in_range",
    description:
      "Search Cabinet papers and records for discussions on specific topics within a date range.",
    parameters: z.object({
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
      query: z
        .string()
        .describe('Search query, e.g., "Dardanelles", "munitions"'),
    }),
    execute: async (args) => {
      onStatus?.("Searching Cabinet papers...");
      console.log(
        "🗄️ [Tool: get_cabinet_chunks] Searching Cabinet papers for:",
        JSON.stringify(args)
      );

      // Use the new source_type: 'churchill_cabinet' filter directly in vector search
      const results = await searchSimilarChunks(args.query, 10, {
        dateRange: { start: args.start_date, end: args.end_date },
        source_type: "churchill_cabinet",
      });

      if (results.length === 0) {
        console.log("🗄️ [Tool: get_cabinet_chunks] No Cabinet papers found.");
        return JSON.stringify([]);
      }

      console.log(
        `🗄️ [Tool: get_cabinet_chunks] Found ${results.length} relevant chunks.`
      );
      return JSON.stringify([{Message: "No Cabinet papers found on these dates and query."}]);
    },
  });

export const createGetNewspaperChunksTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "get_newspaper_chunks_in_range",
    description:
      "Search newspaper archives for public events, social happenings, or reported movements within a date range.",
    parameters: z.object({
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
      query: z
        .string()
        .describe('Search query, e.g., "Venetia", "Prime Minister"'),
    }),
    execute: async (args) => {
      onStatus?.("Searching newspapers...");
      console.log(
        "🗄️ [Tool: get_newspaper_chunks] Searching newspapers for:",
        JSON.stringify(args)
      );

      // Use the new source_type: 'newspaper' filter directly in vector search
      const results = await searchSimilarChunks(args.query, 10, {
        dateRange: { start: args.start_date, end: args.end_date },
        source_type: "newspaper",
      });

      if (results.length === 0) {
        console.log("🗄️ [Tool: get_newspaper_chunks] No newspapers found.");
        return JSON.stringify([]);
      }

      console.log(
        `🗄️ [Tool: get_newspaper_chunks] Found ${results.length} relevant chunks.`
      );
      return JSON.stringify([{Message: "No newspapers found on these dates and query."}]);
    },
  });

export const createGetPersonalChunksTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "get_personal_chunks_in_range",
    description:
      "Search private letters and diaries (Asquith, Venetia, etc.) for specific content.",
    parameters: z.object({
      author: AuthorEnum.nullable().optional(),
      recipient: RecipientEnum.nullable().optional(),
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
      query: z
        .string()
        .describe('Search query, e.g., "opinion on Churchill", "the assyrian"'),
    }),
    execute: async (args) => {
      onStatus?.("Searching private correspondence...");
      console.log(
        "💌 [Tool: get_personal_chunks] Searching correspondence for:",
        JSON.stringify(args)
      );

      const results = await searchSimilarChunks(args.query, 15, {
        dateRange: { start: args.start_date, end: args.end_date },
        author: args.author || undefined,
        recipient: args.recipient || undefined,
        source_type: args.recipient ? "letter" : "diary",
      });

      // If vector search returns nothing, try primary search fallback (regex)
      if (results.length === 0) {
        console.log(
          "💌 [Tool: get_personal_chunks] Vector search empty, trying keyword fallback..."
        );
        const primaryDocs = await searchPrimaryEntries(
          {
            dateRange: { start: args.start_date, end: args.end_date },
            author: args.author as string | undefined,
            recipient: args.recipient as string | undefined,
            textRegex: args.query, // Naive use of query as regex
          },
          10
        );
        console.log(
          `💌 [Tool: get_personal_chunks] Found ${primaryDocs.length} docs via keyword fallback.`
        );
        if (primaryDocs.length === 0) {
          return JSON.stringify([{Message: "No personal correspondence found on these dates and query."}]);
        }
        return JSON.stringify(primaryDocs);
      }

      console.log(
        `💌 [Tool: get_personal_chunks] Found ${results.length} relevant chunks.`
      );
      return JSON.stringify(results);
    },
  });

export const createGetHistorianOpinionTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "get_historian_opinion",
    description:
      "Find secondary source analysis and historian opinions on a topic.",
    parameters: z.object({
      topic: z.string().describe('Topic to research, e.g. "Venetia influence"'),
      historians: z
        .array(z.string())
        .nullable()
        .optional()
        .describe(
          'List of historian names to filter by (e.g. "Jenkins"), or null for all.'
        ),
    }),
    execute: async (args) => {
      onStatus?.("Checking scholarly perspectives...");
      console.log(
        "📚 [Tool: get_historian_opinion] Consulting historians for:",
        JSON.stringify(args)
      );

      const results = await searchSimilarChunks(args.topic, 10, {
        // Filter for 'book' source type if we had it, or exclude primary
        source_type: "book", // As per new_metadata logic
        author: args.historians ? args.historians[0] : undefined, // Simple filter for now
      });
      console.log(
        `📚 [Tool: get_historian_opinion] Found ${results.length} relevant chunks.`
      );
      if (results.length === 0) {
        return JSON.stringify([{Message: "No historian opinions found on this topic."}]);
      }
      return JSON.stringify(results);
    },
  });

export const createGetDailyLocationsTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "get_daily_locations_and_proximity",
    description:
      "Get location data and proximity between Asquith and Venetia for a date range.",
    parameters: z.object({
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
    }),
    execute: async (args) => {
      onStatus?.("Checking locations...");
      console.log(
        "📍 [Tool: get_daily_locations] Checking locations for:",
        JSON.stringify(args)
      );

      const allPoints = await getAsquithVenetiaProximitySeries();
      const start = new Date(args.start_date);
      const end = new Date(args.end_date);

      const filtered = allPoints.filter((p) => {
        const d = new Date(p.date);
        return d >= start && d <= end;
      });

      console.log(
        `📍 [Tool: get_daily_locations] Found ${filtered.length} daily location points.`
      );
      return JSON.stringify(filtered);
    },
  });

export const createFindCorrespondenceDatesTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "find_dates_of_venetia_asquith_correspondance",
    description:
      "Identify specific dates where letters were exchanged matching a query. Restricts search to letters from Asquith to Venetia.",
    parameters: z.object({
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
      query: z
        .string()
        .describe('Content query, e.g. "she doesn\'t write enough"'),
    }),
    execute: async (args) => {
      onStatus?.("Scanning correspondence dates...");
      console.log(
        "📅 [Tool: find_correspondence_dates] Scanning dates for:",
        JSON.stringify(args)
      );

      const docs = await searchSimilarChunks(args.query, 20, {
        dateRange: { start: args.start_date, end: args.end_date },
        source_type: "letter",
        author: "H.H. Asquith",
        recipient: "Venetia Stanley",
      });

      const results = await Promise.all(
        docs.map(async (d) => ({
          date: d.metadata.date,
          excerpt: await extractSnippetWithLLM(d.content, args.query),
        }))
      );

      const validResults = results.filter((r) => r.date);

      console.log(
        `📅 [Tool: find_correspondence_dates] Found ${validResults.length} matches.`
      );
      return JSON.stringify(validResults);
    },
  });

export const createGetWeatherRecordsTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "get_weather_records",
    description:
      "Fetch historical weather records for a specific date range and location.",
    parameters: z.object({
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
      location: z.string().nullable().default("London"),
    }),
    execute: async (args) => {
      onStatus?.("Checking weather records...");
      console.log(
        "☀️ [Tool: get_weather_records] Checking weather records for:",
        JSON.stringify(args)
      );
      const results = await getWeather(
        args.start_date,
        args.end_date,
        args.location || "London"
      );
      console.log(
        `☀️ [Tool: get_weather_records] Found ${ 
          Array.isArray(results) ? results.length : 0 
        } records.`
      );
      return JSON.stringify(results);
    },
  });

export const createGetPrimarySourceStatisticsTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "get_primary_source_statistics",
    description: "Get quantitative statistics about primary sources, such as the number of letters exchanged between specific people over a period. Can also group results by fields like author, recipient, year, etc.",
    parameters: z.object({
      start_date: z.string().nullable().describe("YYYY-MM-DD"),
      end_date: z.string().nullable().describe("YYYY-MM-DD"),
      sender: AuthorEnum.nullable().describe("Sender name or null for all"),
      recipient: RecipientEnum.nullable().describe("Recipient name or null for all"),
      source_type: z.string().nullable().describe("Type of source to count, e.g. 'letter', 'diary', or null for all"),
      group_by: z.enum(['author', 'recipient', 'source_type', 'year', 'month', 'year_month']).nullable().optional().describe("Field to group statistics by")
    }),
    execute: async (args) => {
      onStatus?.("Calculating statistics...");
      console.log("📈 [Tool: get_primary_source_statistics] Counting for:", JSON.stringify(args));
      
      const startDate = args.start_date || "1900-01-01";
      const endDate = args.end_date || "1930-12-31";
      const filter = {
        dateRange: { start: startDate, end: endDate },
        author: args.sender || undefined,
        recipient: args.recipient || undefined,
        source_type: args.source_type || undefined
      };

      if (args.group_by) {
        const results = await getGroupedPrimarySourceCount(filter, args.group_by);
         console.log(`📈 [Tool: get_primary_source_statistics] Grouped result:`, results);
         return JSON.stringify(results);
      } else {
        const count = await getPrimarySourceCount(filter);
        console.log(`📈 [Tool: get_primary_source_statistics] Count result: ${count}`);
        return JSON.stringify({ count, message: `Found ${count} ${args.source_type || 'entries'} matching the criteria.` });
      }
    }
  });

export const createFormatFinalResponseTool = (
  onStatus?: (status: string) => void
) =>
  tool({
    name: "format_final_response",
    description:
      "Format the synthesized findings into a clear, academic structure using Markdown and adding footnotes for direct quotes.",
    // NOTE: Tools are registered with strict JSON schemas; all properties must be required.
    parameters: UnformatedAnswerSchema,
    execute: async (args) => {
      console.log("✨ [Tool: format_final_response] Formatting structured answers...", args.answer);
      const formatted = await formatFinalAnswers(
        args,
        onStatus
      );
      return JSON.stringify(formatted);
    },
  });
