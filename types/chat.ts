import { z } from 'zod';

// TODO : Think of a better way to manage these enums
export const AuthorEnum = z.enum([
  'Edwin Montagu',
  'H.H. Asquith',
  'Margot Asquith',
  'Venetia Stanley',
  'Violet Asquith',
  'M.B.C.',
  'Hugh Godley',
  'Venetia Montagu',
  'Arnold Ward',
  'Archie Gordon',
  'Arthur Asquith',
  'Raymond Asquith',
  'A Suffragette',
  'Alick Carmichael',
  'Arthur Godley',
  'Augustine Birrell',
  'Dudley Gordon',
  'Eddie Marsh',
  'Lord Murray',
  'Roderick Meiklejohn',
  'Rufus Isaacs',
  'Winston Churchill'
]);

export const RecipientEnum = z.enum([
  'Venetia Stanley',
  'Edwin Montagu',
  'Margot Asquith',
  'Violet Asquith',
  'M.B.C.',
  'Hugh Godley',
  'Arnold Ward',
  'Archie Gordon',
  'H.H. Asquith',
  'Katharine Asquith',
  'Winston Churchill',
]);

export const SearchIntentSchema = z.object({
  type: z.enum(['specific_date', 'timeline', 'sentiment_trend', 'general_context'])
    .describe('The type of search intent.'),
  dateRange: z.object({
    start: z.string().describe('YYYY-MM-DD'),
    end: z.string().describe('YYYY-MM-DD'),
  }).nullable().optional()
    .describe('Date range for the query. Required for specific_date and timeline types.'),
  sentiment: z.enum(['positive', 'negative']).nullable().optional()
    .describe('Filter for positive or negative sentiment.'),
  author: AuthorEnum.nullable().optional()
    .describe('The author of the letter/diary entry.'),
  recipient: RecipientEnum.nullable().optional()
    .describe('The recipient of the letter.'),
  requiresSecondary: z.boolean().nullable().optional()
    .describe('Whether secondary sources (books, articles) are required/allowed.'),
  requiresWeather: z.boolean()
    .describe('True if the user asks about weather, rain, temperature, or if the conditions of a specific day are relevant.'),
  locationContext: z.string().nullable().optional()
    .describe("Location for weather lookup (e.g., 'London', 'Oxford', 'Alderley'). Default to 'London' if weather is required but location unspecified."),
  topics: z.array(z.string()).nullable().optional()
    .describe('List of topics or keywords to filter by.'),
  entities: z.array(z.string()).nullable().optional()
    .describe('List of named entities (people, places) mentioned.'),
  textRegex: z.string().nullable().optional()
    .describe('Regex pattern for text matching.'),
  semanticQuery: z.string().nullable().optional()
    .describe('A concise string optimized for VECTOR SEARCH if the user asks about a TOPIC, SECRET, OPINION, or EVENT content. Exclude dates/authors from this string if captured in other fields. If purely date-based, leave null.'),
});

export type SearchIntent = z.infer<typeof SearchIntentSchema>;

export const AgentPlanStepSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('tool'),
    id: z.string(),
    tool: z.enum(['get_primary_sources', 'find_relevant_chunks', 'get_weather_records']),
    purpose: z.string(),
    params: z.any(),
  }),
  z.object({
    kind: z.literal('ask_user'),
    id: z.string(),
    purpose: z.string(),
    question: z.string(),
  }),
]);

export const PlanSchema = z.object({
  goal: z.string(),
  steps: z.array(AgentPlanStepSchema),
});

export type AgentPlan = z.infer<typeof PlanSchema>;
export type AgentPlanStep = z.infer<typeof AgentPlanStepSchema>;

export const AnswersSchema = z.object({
  answers: z.array(
    z.object({
      text: z.string(),
      link: z.string().default(''),
    })
  ),
});

export type Answers = z.infer<typeof AnswersSchema>;
