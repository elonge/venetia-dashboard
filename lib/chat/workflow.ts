import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { 
  createGetCorrespondenceMetricsTool,
  createGetParliamentChunksTool,
  createGetCabinetChunksTool,
  createGetPersonalChunksTool,
  createGetHistorianOpinionTool,
  createGetDailyLocationsTool,
  createFindCorrespondenceDatesTool,
  createGetWeatherRecordsTool,
  createFormatFinalResponseTool
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
const SYSTEM_PROMPT = `You are an expert historian specializing in early 20th century British politics, specifically the Asquith-Venetia Stanley correspondence.

Your goal is to answer user questions by intelligently selecting and combining information from multiple specialized tools.

**Available Tools:**
1.  **get_correspondence_metrics**: Analyze sentiment trends (e.g. "romantic intensity", "anxiety"). Use this for questions about feelings, "mood", or correlations between events and emotions.
2.  **get_personal_chunks_in_range**: Search private letters/diaries. Use this for specific quotes, opinions on people (Churchill, Montagu), or personal events.
3.  **get_parliament_chunks_in_range**: Search Hansard/Parliament records. Use for official government statements, debates, or public stances.
4.  **get_cabinet_chunks_in_range**: Search Cabinet papers. Use for secret government decisions, war strategy, or "what really happened" vs public statements.
5.  **get_historian_opinion**: Search secondary sources (books). Use for context, analysis, or consensus views.
6.  **get_daily_locations_and_proximity**: Get geo-spatial data. Use for "where were they?", "were they together?", or mapping movements.
7.  **find_dates_of_venetia_asquith_correspondance**: Find specific dates of letters matching a topic.
8.  **get_weather_records**: Check historical weather.
9.  **format_final_response**: Use this to reformat your synthesized answer into a clear, structured response with bullet points.

**Strategy:**
- **Triangulate**: If asked about an event (e.g. Shells Scandal), check *Personal* (letters), *Cabinet* (reality), and *Historian* (analysis) sources to compare perspectives.
- **Visualize**: If asked about trends/correlations, use *Metrics*.
- **Contextualize**: If asked about "Why...", use *Historian* opinions + *Personal* letters.

**Output:**
- **Refine**: Once you have synthesized your answer from tool outputs, ALWAYS call 'format_final_response' with your synthesized text to ensure clear formatting (bullets, paragraphs) before returning.
- Answer clearly and cite your sources in the 'link' field of your response.
- If you use multiple tools, synthesize the findings into a coherent narrative.
`;

// --- Runner ---
export async function runAgentWorkflow(
  message: string, 
  history: Message[],
  onStatus?: (status: string) => void
) {
  const historyContext = history
    .slice(-8) // Only pass the last 8 interactions
    .filter(m => m.content)
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const inputs = [
    { role: 'system' as const, content: `Conversation Context:\n${historyContext}` },
    { role: 'user' as const, content: message }
  ];

  // Note: createGetWeatherRecordsTool was in previous file but I need to make sure it exists or re-add it to tools.ts
  // I will check tools.ts content again. I might have missed exporting it in the previous step.
  // Ideally, I should re-add it to tools.ts if I want to use it.
  // For now I will comment it out if it's missing, but the prompt mentions it.
  
  const tools = [
    createGetCorrespondenceMetricsTool(onStatus),
    createGetParliamentChunksTool(onStatus),
    createGetCabinetChunksTool(onStatus),
    createGetPersonalChunksTool(onStatus),
    createGetHistorianOpinionTool(onStatus),
    createGetDailyLocationsTool(onStatus),
    createFindCorrespondenceDatesTool(onStatus),
    createGetWeatherRecordsTool(onStatus),
    createFormatFinalResponseTool(onStatus)
  ];

  const historianAgent = new Agent({
    name: 'Historian',
    instructions: SYSTEM_PROMPT,
    model: 'gpt-4o-mini', 
    tools: tools,
    outputType: AnswerSchema
  });

  try {
    console.log('🤖 [Agent] Executing workflow for message:', message);
    const result = await run(historianAgent, inputs);

    if (!result.finalOutput) {
      throw new Error('Agent run completed without a final output.');
    }
    
    const sources: any[] = [];
    console.log('📝 [Agent] Final Answer Generated');

    for (const msg of result.history) {
      if (msg.type !== 'function_call_result') continue;

      const outputText =
        typeof msg.output === 'string'
          ? msg.output
          : msg.output && typeof msg.output === 'object' && 'type' in msg.output && msg.output.type === 'text'
            ? msg.output.text
            : null;

      if (!outputText) continue;

      try {
        const data = JSON.parse(outputText);
        if (!Array.isArray(data)) continue;

        for (const item of data) {
          if (item?.content && (item.source || item.metadata)) {
            sources.push({
              source: item.source || item.metadata?.documentTitle || 'Unknown',
              documentTitle: item.metadata?.documentTitle || item.source,
              chunkIndex: item.chunkIndex || 0,
              score: item.score || 1.0,
              content: item.content
            });
          } else if (item?.date && item.geo_coords) {
            sources.push({
              source: 'Daily Locations',
              documentTitle: `Location Data: ${item.date}`,
              chunkIndex: 0,
              score: 1.0
            });
          } else if (typeof item?.score === 'number') {
            sources.push({
              source: 'Sentiment Analysis',
              documentTitle: `Analysis: ${item.date}`,
              chunkIndex: 0,
              score: 1.0
            });
          }
        }
      } catch (_e) {}
    }

    const uniqueSources = Array.from(
      new Map(sources.map((s) => [s.source + s.chunkIndex, s])).values()
    );

    return {
      answers: result.finalOutput.answers,
      sources: uniqueSources
    };
  } catch (error) {
    console.error("Agent workflow error:", error);
    throw error;
  }
}
