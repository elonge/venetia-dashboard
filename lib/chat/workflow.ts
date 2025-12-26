import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { 
  createDetectIntentTool, 
  createGetPrimarySourcesTool, 
  createFindRelevantChunksTool, 
  createGetWeatherRecordsTool 
} from './tools';

// --- Types ---
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const AnswerSchema = z.object({
  answers: z.array(z.object({
    text: z.string().describe('The answer text, formatted as a paragraph.'),
    link: z.string().describe('The name of the source document referenced (e.g. "Letter to Venetia, 1915-05-12").')
  }))
});

// --- System Prompt ---
const SYSTEM_PROMPT = `You are an expert historian specializing in early 20th century British politics.

Your task is to answer the LATEST user message accurately using the provided tools. 
You are provided with conversation history for context, but you must only call tools to resolve the most recent question.

Workflow:
1.  **Analyze**: Call 'detect_intent' EXACTLY ONCE for the latest user message to understand its requirements.
2.  **Plan & Gather**: Based on that intent, call search tools ('get_primary_sources', 'find_relevant_chunks', 'get_weather_records').
    - If searching for topics/content, use 'find_relevant_chunks'.
    - If looking for specific letters by date/metadata, use 'get_primary_sources'.
3.  **Synthesize**: Answer the question based ONLY on retrieved sources. Cite them in 'link'.

You must return a structured JSON object matching the AnswerSchema.
`;

// --- Runner ---
export async function runAgentWorkflow(
  message: string, 
  history: Message[],
  onStatus?: (status: string) => void
) {
  // To prevent the agent from re-running tools for every message in history,
  // we pass the history as a single context message and only one active user message.
  const historyContext = history
    .filter(m => m.content)
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const inputs = [
    { role: 'system' as const, content: `Conversation Context:\n${historyContext}` },
    { role: 'user' as const, content: message }
  ];

  const tools = [
    createDetectIntentTool(message, onStatus),
    createGetPrimarySourcesTool(onStatus),
    createFindRelevantChunksTool(onStatus),
    createGetWeatherRecordsTool(onStatus)
  ];

  const historianAgent = new Agent({
    name: 'Historian',
    instructions: SYSTEM_PROMPT,
    model: 'gpt-4o', 
    tools: tools,
    outputType: AnswerSchema
  });

  try {
    console.log('🤖 [Agent] Executing workflow for message:', message);
    const result = await run(historianAgent, inputs);
    
    const sources: any[] = [];
    console.log('📝 [Agent] Final Answer Generated');

    for (const msg of result.history) {
       if (msg.role === 'tool' && msg.content) {
          try {
             const data = JSON.parse(msg.content as string);
             if (Array.isArray(data)) {
                data.forEach((item: any) => {
                   if (item.source || item.metadata) {
                      sources.push({
                         source: item.source || 'Unknown',
                         documentTitle: item.metadata?.documentTitle || item.source,
                         chunkIndex: item.chunkIndex || 0,
                         score: item.score || 1.0,
                         content: item.content
                      });
                   }
                });
             } else if (data && (data.info || Array.isArray(data))) {
                 if (data.info) {
                     sources.push({ source: 'Weather Records', documentTitle: 'Historical Weather', chunkIndex: 0, score: 1.0 });
                 }
             }
          } catch (e) {}
       }
    }

    const uniqueSources = Array.from(new Map(sources.map(s => [s.source + s.chunkIndex, s])).values());

    return {
        answers: result.finalOutput.answers,
        sources: uniqueSources
    };
  } catch (error) {
    console.error("Agent workflow error:", error);
    throw error;
  }
}
