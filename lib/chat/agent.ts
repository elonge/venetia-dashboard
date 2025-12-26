import { Agent, run } from '@openai/agents';
import type { AgentInputItem } from '@openai/agents';
import type { QuestionAnswer } from '@/lib/questions';
import {
  searchPrimaryEntries,
  searchSimilarChunks,
  type PrimaryEntryResult,
  type SearchResult,
} from '@/lib/vector-search';
import { getWeather } from '@/lib/weather';
import type { AgentPlan, SearchIntent } from '@/types/chat';
import { AnswersSchema, PlanSchema, SearchIntentSchema } from './tools';

export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type CombinedSource = {
  source: string;
  documentTitle?: string;
  chunkIndex: number;
  score: number;
};

const KNOWLEDGE_BASE = `
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
`.trim();

const HISTORIAN_SYSTEM_PROMPT = `You are an expert historian specializing in early 20th century British politics, particularly the Asquith government, World War I, and the relationships between Venetia Stanley, H.H. Asquith, and Edwin Montagu.

Answer questions based on the provided context from primary sources. When citing information, reference the specific source documents. Be precise and accurate, and if information is not available in the context, say so clearly.
STRICT RULE: Only state that a letter exists if the provided context explicitly shows a non-empty date tag from a PRIMARY SOURCE. If you find a date in a SECONDARY SOURCE (Book), you must state 'According to [Book Name]...' and not claim it is a direct letter date unless verified.

You must respond with a valid JSON object in the format:
{
  "answers": [
    { "text": "Paragraph", "link": "source_document_name_or_identifier" }
  ]
}

Each answer should be a distinct paragraph or section. The "link" field should reference the source document name (from the context provided).`;

const intentAgent = new Agent({
  name: 'Search Intent Extractor',
  instructions: `Extract a structured SearchIntent for a historical query.

${KNOWLEDGE_BASE}

Return only a valid object matching the output schema.`,
  model: process.env.OPENAI_INTENT_MODEL || 'gpt-4o-mini',
  modelSettings: { temperature: 0 },
  outputType: SearchIntentSchema,
});

const plannerAgent = new Agent({
  name: 'Tool Planner',
  instructions: `You create a step-by-step plan for what tools to call and with what parameters.

Available tools:
- get_primary_sources(params): search letters/diaries by metadata (date, author, recipient) or EXACT KEYWORDS. Use this ONLY for:
    1. "Show me letters from [Date]"
    2. "List letters by [Author]"
    3. "Find letters containing the exact word [Keyword]"
  Params: { dateRange?, author?, recipient?, sentiment?, topics?, entities?, textRegex?, limit? }.

- find_relevant_chunks(params): semantic vector search. Use this for ALL CONCEPTUAL, TOPIC, or MEANING-BASED queries, even if an author is specified.
  Examples: "What did Asquith say about secrets?", "Find mentions of military strategy", "How did Venetia feel about the war?".
  This tool supports filtering by author/recipient while searching for meaning.
  Params: { query?, limit?, filters?: { source?, dateRange?, author?, recipient? } }.

- get_weather_records(params): fetch historical weather records. Params: { startDate, endDate?, location? }.

Planning rules:
- **Default to find_relevant_chunks** for any question asking "What...", "How...", "Why...", or about "secrets", "opinions", "feelings", or "events".
- Use get_primary_sources ONLY when the user asks for a *list* of documents, a specific *date*, or *exact keyword* occurrences.
- If the user asks for "What did [Author] say about [Topic]?", use find_relevant_chunks with query="[Topic]" and filters={ author: "[Author]" }.
- Include get_weather_records only if intent.requiresWeather is true AND a dateRange exists.
- Output only a valid object matching the output schema.`,
  model: process.env.OPENAI_PLANNER_MODEL || 'gpt-4o-mini',
  modelSettings: { temperature: 0 },
  outputType: PlanSchema,
});

const responderAgent = new Agent({
  name: 'Archival Historian',
  instructions: HISTORIAN_SYSTEM_PROMPT,
  model: process.env.OPENAI_MODEL || 'gpt-4o',
  modelSettings: { temperature: 0.2 },
  outputType: AnswersSchema,
});

function toAgentInputItems(history: ConversationMessage[]): AgentInputItem[] {
  return history.map((m) => ({ role: m.role, content: m.content }));
}

export function formatIntentSummary(intent: SearchIntent): string {
  const parts: string[] = [];
  parts.push(`Intent type: ${intent.type}`);
  if (intent.dateRange) {
    parts.push(`Date range: ${intent.dateRange.start} → ${intent.dateRange.end}`);
  }
  if (intent.author) parts.push(`Author: ${intent.author}`);
  if (intent.recipient) parts.push(`Recipient: ${intent.recipient}`);
  if (intent.sentiment) parts.push(`Sentiment: ${intent.sentiment}`);
  if (intent.requiresWeather) {
    parts.push(`Weather: yes${intent.locationContext ? ` (${intent.locationContext})` : ''}`);
  }
  if (intent.requiresSecondary === false) parts.push(`Secondary sources: no`);
  if (intent.textRegex) parts.push(`Text regex: /${intent.textRegex}/i`);
  return parts.join('\n');
}

export function formatPlanSummary(plan: AgentPlan): string {
  const lines: string[] = [];
  lines.push(`Goal: ${plan.goal}`);
  lines.push('');
  for (const step of plan.steps) {
    if (step.kind === 'ask_user') {
      lines.push(`- [ask_user] ${step.question}`);
      continue;
    }
    lines.push(`- [${step.tool}] ${step.purpose}`);
    lines.push(`  params: ${JSON.stringify(step.params)}`);
  }
  return lines.join('\n');
}

export async function detectIntent(args: {
  message: string;
  conversationHistory?: ConversationMessage[];
}): Promise<{ intent: SearchIntent; summary: string }> {
  const historyItems = toAgentInputItems(args.conversationHistory ?? []);
  const input: AgentInputItem[] = [
    ...historyItems,
    { role: 'user', content: args.message },
  ];

  try {
    const result = await run(intentAgent, input, { maxTurns: 1 });
    const intent = result.finalOutput as SearchIntent;
    return { intent, summary: formatIntentSummary(intent) };
  } catch (error) {
    console.error('Intent extraction failed:', error);
    const fallback: SearchIntent = {
      type: 'general_context',
      requiresSecondary: true,
      requiresWeather: false,
      locationContext: 'London',
    };
    return { intent: fallback, summary: formatIntentSummary(fallback) };
  }
}

function defaultPlanForIntent(intent: SearchIntent): AgentPlan {
  const steps: AgentPlan['steps'] = [
    {
      kind: 'tool',
      id: 'chunks',
      tool: 'find_relevant_chunks',
      purpose: 'Find secondary/context chunks relevant to the question and recent chat context.',
      params: { limit: 8 },
    },
  ];

  const wantsPrimary =
    intent.type !== 'general_context' ||
    !!intent.dateRange ||
    !!intent.author ||
    !!intent.recipient ||
    !!intent.sentiment ||
    !!intent.textRegex;

  if (wantsPrimary) {
    steps.unshift({
      kind: 'tool',
      id: 'primary',
      tool: 'get_primary_sources',
      purpose: 'Retrieve matching letters/diaries by metadata (and optional text regex).',
      params: {
        dateRange: intent.dateRange,
        author: intent.author,
        recipient: intent.recipient,
        sentiment: intent.sentiment,
        topics: intent.topics,
        entities: intent.entities,
        textRegex: intent.textRegex,
        limit: intent.type === 'timeline' ? 30 : 15,
      },
    });
  }

  if (intent.requiresWeather) {
    if (!intent.dateRange) {
      steps.push({
        kind: 'ask_user',
        id: 'weather_clarify',
        purpose: 'Need a date range to fetch weather records.',
        question: 'What date (or date range) and location should I use for the weather lookup?',
      });
    } else {
      steps.push({
        kind: 'tool',
        id: 'weather',
        tool: 'get_weather_records',
        purpose: 'Fetch historical weather records for the relevant dates and location.',
        params: {
          startDate: intent.dateRange.start,
          endDate: intent.dateRange.end,
          location: intent.locationContext,
        },
      });
    }
  }

  return { goal: 'Gather sources and context before answering', steps };
}

export async function createPlan(args: {
  message: string;
  conversationHistory?: ConversationMessage[];
  intent: SearchIntent;
}): Promise<{ plan: AgentPlan; summary: string }> {
  const historyItems = toAgentInputItems(args.conversationHistory ?? []);
  const input: AgentInputItem[] = [
    { role: 'system', content: `Intent:\n${JSON.stringify(args.intent)}` },
    ...historyItems,
    { role: 'user', content: args.message },
  ];

  try {
    const result = await run(plannerAgent, input, { maxTurns: 1 });
    const plan = result.finalOutput as AgentPlan;
    return { plan, summary: formatPlanSummary(plan) };
  } catch (error) {
    console.error('Plan generation failed:', error);
    const plan = defaultPlanForIntent(args.intent);
    return { plan, summary: formatPlanSummary(plan) };
  }
}

function buildQueryWithContext(currentMessage: string, conversationHistory: ConversationMessage[]): string {
  if (conversationHistory.length === 0) return currentMessage;

  const recentMessages = conversationHistory.slice(-4);
  const contextParts: string[] = [];

  for (const msg of recentMessages) {
    if (msg.role === 'user') contextParts.push(`Previous question: ${msg.content}`);
    if (msg.role === 'assistant') {
      const brief = msg.content.substring(0, 200);
      contextParts.push(`Previous answer: ${brief}${msg.content.length > 200 ? '...' : ''}`);
    }
  }

  return `${contextParts.join('\n')}\n\nCurrent question: ${currentMessage}`;
}

function buildCombinedContext(
  primaryResults: PrimaryEntryResult[],
  vectorResults: SearchResult[],
  weatherData: unknown
): string {
  let context = '';

  if (weatherData) {
    context += '--- WEATHER DATA ---\n';
    if (Array.isArray(weatherData)) {
      for (const w of weatherData as any[]) {
        context += `[Date: ${w.date}] [Location: ${w.location}] Temp: ${w.tmin}°C to ${w.tmax}°C (Avg: ${w.tavg}°C), Precipitation: ${w.prcp}mm\n`;
      }
    } else if ((weatherData as any).info) {
      context += `${(weatherData as any).info}\n`;
    }
    context += '\n';
  }

  if (primaryResults.length > 0) {
    context += '--- PRIMARY SOURCES (Letters/Diaries/Timeline) ---\n';
    for (const r of primaryResults as any[]) {
      const dateStr = r.date ? new Date(r.date).toISOString().split('T')[0] : 'Unknown Date';
      context += `[Author: ${r.author || 'Unknown'}] [Recipient: ${r.recipient || 'Unknown'}] [Date: ${dateStr}] [Sentiment: ${r.sentiment}]\n`;
      context += `Source: ${r.metadata?.documentTitle || r.source}\n`;
      context += `Content: ${String(r.content).substring(0, 1500)}\n\n`;
    }
  }

  if (vectorResults.length > 0) {
    context += '\n--- SECONDARY/CONTEXT SOURCES ---\n';
    for (const r of vectorResults) {
      context += `[Source: ${r.metadata?.documentTitle || r.source}]\n${r.content}\n\n`;
    }
  }

  return context || 'No relevant documents found.';
}

function normalizeSources(
  primaryResults: PrimaryEntryResult[],
  vectorResults: SearchResult[],
  weatherData: unknown,
  weatherLocation: string | undefined
): CombinedSource[] {
  const combined: CombinedSource[] = [];

  for (const r of primaryResults as any[]) {
    combined.push({
      source: r.source,
      documentTitle: r.metadata?.documentTitle,
      chunkIndex: 0,
      score: 1.0,
    });
  }

  for (const r of vectorResults) {
    combined.push({
      source: r.source,
      documentTitle: r.metadata?.documentTitle,
      chunkIndex: r.chunkIndex,
      score: r.score,
    });
  }

  if (weatherData && !(weatherData as any).info) {
    combined.push({
      source: 'Historical Weather Records',
      documentTitle: `Weather: ${weatherLocation || 'Unknown'}`,
      chunkIndex: 0,
      score: 1.0,
    });
  }

  return combined;
}

export async function executePlanAndAnswer(args: {
  message: string;
  conversationHistory?: ConversationMessage[];
  intent: SearchIntent;
  plan?: AgentPlan;
}): Promise<{ answers: QuestionAnswer[]; sources: CombinedSource[] }> {
  const history = args.conversationHistory ?? [];
  const plan = args.plan;

  const toolSteps = plan?.steps?.filter((s) => s.kind === 'tool') ?? [];
  const wantPrimary =
    toolSteps.some((s) => s.kind === 'tool' && s.tool === 'get_primary_sources') ||
    (!!args.intent.dateRange && args.intent.type !== 'general_context') ||
    !!args.intent.author ||
    !!args.intent.recipient ||
    !!args.intent.sentiment ||
    !!args.intent.textRegex;

  const primaryLimit =
    args.intent.type === 'timeline' ? 30 : args.intent.type === 'general_context' ? 0 : 15;

  const primaryPromise = wantPrimary
    ? searchPrimaryEntries(args.intent, primaryLimit)
    : Promise.resolve([]);

  const chunkStep = toolSteps.find(
    (s): s is Extract<(typeof toolSteps)[number], { tool: 'find_relevant_chunks' }> =>
      s.kind === 'tool' && s.tool === 'find_relevant_chunks'
  );
  const queryWithContext =
    chunkStep?.params.query || buildQueryWithContext(args.message, history);
  const chunkLimit = chunkStep?.params.limit ?? 8;
  const vectorPromise = searchSimilarChunks(queryWithContext, chunkLimit, chunkStep?.params.filters);

  const weatherStep = toolSteps.find(
    (s): s is Extract<(typeof toolSteps)[number], { tool: 'get_weather_records' }> =>
      s.kind === 'tool' && s.tool === 'get_weather_records'
  );

  const wantsWeather = args.intent.requiresWeather || !!weatherStep;
  const weatherPromise =
    wantsWeather && args.intent.dateRange
      ? getWeather(
          weatherStep?.params.startDate || args.intent.dateRange.start,
          weatherStep?.params.endDate || args.intent.dateRange.end,
          weatherStep?.params.location || args.intent.locationContext
        )
      : Promise.resolve(null);

  const [primaryResults, vectorResults, weatherData] = await Promise.all([
    primaryPromise,
    vectorPromise,
    weatherPromise,
  ]);

  const context = buildCombinedContext(primaryResults, vectorResults, weatherData);

  const sources = normalizeSources(
    primaryResults,
    vectorResults,
    weatherData,
    weatherStep?.params.location || args.intent.locationContext
  );

  const responderInput: AgentInputItem[] = [
    { role: 'system', content: `Intent:\n${JSON.stringify(args.intent)}` },
    { role: 'system', content: `Context:\n${context}` },
    ...toAgentInputItems(history),
    { role: 'user', content: args.message },
  ];

  const response = await run(responderAgent, responderInput, { maxTurns: 1 });
  const parsed = response.finalOutput as unknown;
  const answers = AnswersSchema.parse(parsed).answers;

  return { answers, sources };
}
