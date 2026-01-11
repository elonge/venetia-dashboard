import { z } from 'zod';

// TODO : Think of a better way to manage these enums
export const AuthorEnum = z.enum([
  'Edwin Montagu',
  'H.H. Asquith',
  'Margot Asquith',
  'Venetia Stanley',
  'Violet Asquith',
  'Maurice Bonham Carter',
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
  'Edward Marsh',
  'Lord Murray',
  'Roderick Meiklejohn',
  'Lord Reading (Rufus Isaacs)',
  'Winston Churchill'
]);

export const RecipientEnum = z.enum([
  'Venetia Stanley',
  'Edwin Montagu',
  'Margot Asquith',
  'Violet Asquith',
  'Maurice Bonham Carter',
  'Hugh Godley',
  'Arnold Ward',
  'Archie Gordon',
  'H.H. Asquith',
  'Katharine Asquith',
  'Winston Churchill',
]);

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
