import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { KNOWLEDGE_BASE } from './knowledge';
import {
  FinalAnswerSchema,
} from './formatFinalAnswers';
import { 
  createGetCorrespondenceMetricsTool,
  createGetParliamentChunksTool,
  createGetCabinetChunksTool,
  createGetNewspaperChunksTool,
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

// --- System Prompt ---
const SYSTEM_PROMPT = `You are an expert historian specializing in early 20th century British politics, specifically the Asquith-Venetia Stanley correspondence.

Your goal is to answer user questions by intelligently selecting and combining information from multiple specialized tools.

**Core Knowledge Base:**
${KNOWLEDGE_BASE}

**Available Tools:**
1.  **get_correspondence_metrics**: Analyze sentiment trends (e.g. "romantic intensity", "anxiety"). Use this for questions about feelings, "mood", or correlations between events and emotions.
2.  **get_personal_chunks_in_range**: Search private letters/diaries. Use this for specific quotes, opinions on people (Churchill, Montagu), or personal events.
3.  **get_parliament_chunks_in_range**: Search Hansard/Parliament records. Use for official government statements, debates, or public stances.
4.  **get_cabinet_chunks_in_range**: Search Cabinet papers. Use for secret government decisions, war strategy, or "what really happened" vs public statements.
5.  **get_newspaper_chunks_in_range**: Search newspaper archives for public events, social happenings, or reported movements.
6.  **get_historian_opinion**: Search secondary sources (books). Use for context, analysis, or consensus views.
7.  **get_daily_locations_and_proximity**: Get geo-spatial data. Use for "where were they?", "were they together?", or mapping movements.
8.  **find_dates_of_venetia_asquith_correspondance**: Find specific dates of letters matching a topic.
9.  **get_weather_records**: Check historical weather.
10.  **format_final_response**: Use this to polish your synthesized findings into a clear, academic structure with Markdown and footnotes.

**Strategy:**
- **Date-Check**: If asked about someone's location or activity on a specific date (or date range):
--- first use *get_daily_locations_and_proximity* to confirm where they were.:
--- Check private correspondence and make sure to query up to a week before and after the request for context, as sometimes someone's location or activity is mentioned in letters a few days later or before.
--- Check parliament/cabinet records for official activities that days.
--- Check newspaper archives for any reported events or social happenings.
--- If cannot find answer, check historian opinions for their opinions.
- **Triangulate**: If asked about an event (e.g. Shells Scandal), check *Personal* (letters), *Cabinet* (reality), and *Historian* (analysis) sources to compare perspectives.
- **Visualize**: If asked about trends/correlations, use *Metrics*.
- **Contextualize**: If asked about "Why...", use *Historian* opinions + *Personal* letters.
- **Fact-Check**: If asked to find or check quotes, dates, or locations, use the relevant tools. 

**Output:**
- **Refine**: Once you have synthesized your answer from tool outputs, call 'format_final_response' to ensure clear formatting and academic footnotes.
- Return a response containing "markdownText" and "footnotes".
- Only cite verified sources (i.e., sources that came back from tool outputs); do not invent sources.
- If you include any direct quotation, use a Markdown footnote marker (e.g. [^1]).
- synthesize the findings into a coherent narrative.
- At the end of your response, suggest a follow-up question or topic for further exploration.
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

  const tools = [
    createGetCorrespondenceMetricsTool(onStatus),
    createGetParliamentChunksTool(onStatus),
    createGetCabinetChunksTool(onStatus),
    createGetPersonalChunksTool(onStatus),
    createGetNewspaperChunksTool(onStatus),
    createGetHistorianOpinionTool(onStatus),
    createGetDailyLocationsTool(onStatus),
    createFindCorrespondenceDatesTool(onStatus),
    createGetWeatherRecordsTool(onStatus),
    createFormatFinalResponseTool(onStatus)
  ];

  const historianAgent = new Agent({
    name: 'Historian',
    instructions: SYSTEM_PROMPT,
    model: 'gpt-5.2-2025-12-11', 
    tools: tools,
    outputType: FinalAnswerSchema
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

    return result.finalOutput;
  } catch (error) {
    console.error("Agent workflow error:", error);
    throw error;
  }
}
