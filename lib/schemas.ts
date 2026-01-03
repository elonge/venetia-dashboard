import { z } from 'zod';

export const ProbabilityEnum = z.enum([
  'high',
  'medium',
  'low',
  'unknown'
]);

const SourceTypes = z.enum([
  'Daily Location',
  'Personal',
  'Parliament',
  'Cabinet',
  'Newspaper',
  'Historian Opinion',
  'Core Knowledge Base'
]);

const FullLocationSchema = z.object({
  full_string: z.string().describe("The full location string as recorded."),
  venue: z.string().nullable().describe("The specific venue or place name."),
  area: z.string().nullable().describe("The broader area or region of the location."),
  context: z.string().nullable().describe("Additional context or notes about the location.")
});

const PersonActivitiesSchema = z.array(
  z.string().describe("A single, concise sentence describing one concrete action, meeting, or inferred behavior that occurred that day.One sentence only (max 20 words).Prefer verbs (“met”, “wrote”, “travelled”, “attended”).Use qualifying language (“likely”, “probably”) only if the action is inferred.Do not include background, explanation, or social context unless essential to the action itself")
).describe("A compact list of the day’s known or inferred activities, summarizing what happened without interpretation or narrative.");


export const LocationSourceSchema = z.object({
  sourceType: SourceTypes.describe("The type of source used for the location reason information."),
  sourceDetail: z.string().describe("Details about the specific source, such as document title or date.")
});

export const LocationReasonAnswerSchema = z.object({
  reason: z.string().describe("A concise 1-2 sentence explanation of why the person was at that location."),
  probability: ProbabilityEnum.optional().describe("Confidence level in the explanation provided."),
  source: z.array(LocationSourceSchema).optional().describe("Sources you used for the location reason information.")
});

export const LocationActivitiesAnswerSchema = z.object({
  activities: PersonActivitiesSchema,
  location: FullLocationSchema.optional().describe("The specific location details where the person was for that date."),
  reason: LocationReasonAnswerSchema.describe("The reason you think this was this person's location and activities on that date."),
});

export type LocationReasonAnswer = z.infer<typeof LocationReasonAnswerSchema>;
export type LocationActivitiesAnswer = z.infer<typeof LocationActivitiesAnswerSchema>;
