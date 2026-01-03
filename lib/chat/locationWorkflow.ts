import { Agent, run } from '@openai/agents';
import { KNOWLEDGE_BASE } from './knowledge';
import { 
  createGetPersonalChunksTool,
  createGetDailyLocationsTool,
  createGetHistorianOpinionTool,
  createGetParliamentChunksTool,
  createGetCabinetChunksTool,
  createGetNewspaperChunksTool
} from './tools';
import { LocationReasonAnswer, LocationReasonAnswerSchema } from '@/types';
import { LocationActivitiesAnswer, LocationActivitiesAnswerSchema, MeetingCheckerAnswer, MeetingCheckerAnswerSchema } from '../schemas';

// --- System Prompt ---
const LOCATION_SYSTEM_PROMPT = `You are an expert historian specializing in the Asquith-Venetia Stanley correspondence.

Your specific task is to explain WHY a specific person (The Prime Minister H.H. Asquith or Venetia Stanley) was in a specific location on a given date.

**Core Knowledge Base:**
${KNOWLEDGE_BASE}

**Available Tools:**
1.  **get_daily_locations_and_proximity**: Check the recorded location for the date.
2.  **get_personal_chunks_in_range**: Search private letters/diaries around the date for mentions of travel, visits, or reasons for being somewhere.
3.  **get_parliament_chunks_in_range**: Search Hansard/Parliament records. Use for official government statements, debates, or public stances.
4.  **get_cabinet_chunks_in_range**: Search Cabinet papers. Use for secret government decisions, war strategy, or "what really happened" vs public statements.
5.  **get_newspaper_chunks_in_range**: Search newspaper archives for public events, social happenings, or reported movements.
6.  **get_historian_opinion**: Search secondary sources for context on their movements.

**Strategy:**
--- first use *get_daily_locations_and_proximity* to confirm where they were.:
--- Check private correspondence and make sure to query up to a week before and after the request for context, as sometimes someone's location or activity is mentioned in letters a few days later or before.
--- Check parliament/cabinet records for official activities that days.
--- Check newspaper archives for any reported events or social happenings.
--- If cannot find answer, check historian opinions for their opinions.

**Output:**
- Return a **concise** explanation (1-2 sentences max), a probability rating (high, medium, low, unknown) indicating your confidence in the explanation based on the archival evidence, and a list of sources you used to derive the explanation.
- Focus solely on the *reason* or *context* for the location (e.g. "He was at The Wharf for his regular weekend break to play golf and escape London." or "She was at Penrhos visiting her family for the summer holidays.").
- Do not include footnotes or markdown formatting. Just plain text.
`;


export async function runLocationAnalysisWorkflow(
  date: string, 
  person: 'PM' | 'Venetia'
): Promise<LocationReasonAnswer> {
  const tools = [
    createGetDailyLocationsTool(),
    createGetPersonalChunksTool(),
    createGetParliamentChunksTool(),
    createGetCabinetChunksTool(),
    createGetNewspaperChunksTool(),
    createGetHistorianOpinionTool()
  ];

  const agent = new Agent({
    name: 'LocationHistorian',
    instructions: LOCATION_SYSTEM_PROMPT,
    model: 'gpt-5.2-2025-12-11', 
    tools: tools,
    outputType: LocationReasonAnswerSchema
  });

  const message = `Why was ${person} at their location on ${date}?`;

  try {
    const result = await run(agent, [{ role: 'user', content: message }]);
    
    if (result.finalOutput) {
        return result.finalOutput;
    }
    
    return { reason: "Reason for location could not be determined from the archives.", probability: 'unknown' };
  } catch (error) {
    console.error("Location workflow error:", error);
    return { reason: "Error determining location reason.", probability: 'unknown' };
  }
}

const LOCATION_ACTIVITIES_FINDER_SYSTEM_PROMPT = `You are an expert historian specializing in the Asquith-Venetia Stanley correspondence.

Your specific task is to find the best guess WHERE a specific person (The Prime Minister H.H. Asquith or Venetia Stanley) was on a given date, and what activities he/she was doing on that date.

**Core Knowledge Base:**
${KNOWLEDGE_BASE}

**Available Tools:**
2.  **get_personal_chunks_in_range**: Search private letters/diaries around the date for mentions of travel, visits, or reasons for being somewhere.
3.  **get_parliament_chunks_in_range**: Search Hansard/Parliament records. Use for official government statements, debates, or public stances.
4.  **get_cabinet_chunks_in_range**: Search Cabinet papers. Use for secret government decisions, war strategy, or "what really happened" vs public statements.
5.  **get_newspaper_chunks_in_range**: Search newspaper archives for public events, social happenings, or reported movements.
6.  **get_historian_opinion**: Search secondary sources for context on their movements.

**Strategy:**
--- Check private correspondence and make sure to query up to a week before and after the request for context, as sometimes someone's location or activity is mentioned in letters a few days later or before.
--- Check parliament/cabinet records for official activities that days.
--- Check newspaper archives for any reported events or social happenings.
--- If cannot find answer, check historian opinions for their opinions.

**Output:**
- Return a **concise** list of activities the person was doing on that date, the specific location details (if known), and a reason explaining WHY they were there.
- Focus solely on the *activities* and *location* for that date (e.g. "He was at The Wharf playing golf." or "She was at Penrhos visiting her family and hunting").
- Do not include footnotes or markdown formatting. Just plain text.
`;


export async function runLocationFinderWorkflow(
  date: string, 
  person: 'PM' | 'Venetia'
): Promise<LocationActivitiesAnswer> {
  const tools = [
    createGetPersonalChunksTool(),
    createGetParliamentChunksTool(),
    createGetCabinetChunksTool(),
    createGetNewspaperChunksTool(),
    createGetHistorianOpinionTool()
  ];

  const agent = new Agent({
    name: 'LocationFinderHistorian',
    instructions: LOCATION_ACTIVITIES_FINDER_SYSTEM_PROMPT,
    model: 'gpt-5.2-2025-12-11', 
    tools: tools,
    outputType: LocationActivitiesAnswerSchema
  });

  const message = `What's the best guess you can give on  ${person} location and activities on ${date}?`;

  try {
    const result = await run(agent, [{ role: 'user', content: message }]);
    
    if (result.finalOutput) {
        return result.finalOutput;
    }
    
    return { activities: [], reason: { reason: "Could not determine activities from the archives.", probability: 'unknown' } };
  } catch (error) {
    console.error("Location workflow error:", error);
    return { activities: [], reason: { reason: "Error determining location reason.", probability: 'unknown' } };
  }
}

const MEETING_CHECKER_SYSTEM_PROMPT = `You are an expert historian specializing in the Asquith-Venetia Stanley correspondence.

Your specific task is to determine whether a meeting likely took place between the Prime Minister H.H. Asquith and Venetia Stanley on a given date.

**Core Knowledge Base:**
${KNOWLEDGE_BASE}

**Available Tools:**
2.  **get_personal_chunks_in_range**: Search private letters/diaries around the date for mentions of travel, visits, or reasons for being somewhere.
3.  **get_parliament_chunks_in_range**: Search Hansard/Parliament records. Use for official government statements, debates, or public stances.
4.  **get_cabinet_chunks_in_range**: Search Cabinet papers. Use for secret government decisions, war strategy, or "what really happened" vs public statements.
5.  **get_newspaper_chunks_in_range**: Search newspaper archives for public events, social happenings, or reported movements.
6.  **get_historian_opinion**: Search secondary sources for context on their movements.

**Strategy:**
--- Check private correspondence and make sure to query up to a week before and after the request for context, as sometimes someone's location or activity is mentioned in letters a few days later or before.
--- Check parliament/cabinet records for official activities that days.
--- Check newspaper archives for any reported events or social happenings.
--- If cannot find answer, check historian opinions for their opinions.

**Output:**
- Return a **concise** determination of whether a meeting likely took place between Venetia and the Prime Minister on the given date.
- If relevant, include additional context or details about the meeting.
- Provide a reason or context supporting the determination.
- Do not include footnotes or markdown formatting. Just plain text.
`;


export async function runMeetingCheckerWorkflow(
  date: string, 
): Promise<MeetingCheckerAnswer> {
  const tools = [
    createGetPersonalChunksTool(),
    createGetParliamentChunksTool(),
    createGetCabinetChunksTool(),
    createGetNewspaperChunksTool(),
    createGetHistorianOpinionTool()
  ];

  const agent = new Agent({
    name: 'MeetingCheckerHistorian',
    instructions: MEETING_CHECKER_SYSTEM_PROMPT,
    model: 'gpt-5.2-2025-12-11', 
    tools: tools,
    outputType: MeetingCheckerAnswerSchema
  });

  const message = `What's the best guess you can give on whether Venetia and the Prime Minister met on ${date}?`;

  try {
    const result = await run(agent, [{ role: 'user', content: message }]);
    
    if (result.finalOutput) {
        return result.finalOutput;
    }
    
    return { met: false, reason: { reason: "Could not determine meeting possibility from the archives.", probability: 'unknown' } };
  } catch (error) {
    console.error("Location workflow error:", error);
    return { met: false, reason: { reason: "Error determining meeting possibility.", probability: 'unknown' } };
  }
}
