import { z } from 'zod';

// TODO : Think of a better way to manage these enums
export const AuthorEnum = z.enum([
  'Edwin Montagu',
  'H.H. Asquith',
  'Margot Asquith',
  'Venetia Stanley'
]);

export const RecipientEnum = z.enum([
  'Venetia Stanley',
  'Edwin Montagu'
]);

export const SearchIntentSchema = z.object({
  type: z.enum(['specific_date', 'timeline', 'sentiment_trend', 'general_context']),
  dateRange: z.object({
    start: z.string(),
    end: z.string(),
  }).nullable().optional(),
  sentiment: z.enum(['positive', 'negative']).nullable().optional(),
  author: AuthorEnum.nullable().optional(),
  recipient: RecipientEnum.nullable().optional(),
  requiresSecondary: z.boolean().nullable().optional(),
  requiresWeather: z.boolean(),
  locationContext: z.string().nullable().optional(),
  topics: z.array(z.string()).nullable().optional(),
  entities: z.array(z.string()).nullable().optional(),
  textRegex: z.string().nullable().optional(),
  semanticQuery: z.string().nullable().optional(),
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
