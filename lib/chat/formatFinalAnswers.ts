import OpenAI from "openai";
import { z } from "zod";
import { KNOWLEDGE_BASE } from "./knowledge";

export const ValidatedSourceIds = z.enum([
  "asquith-letters-full.txt",
  "Asquith - Roy Jenkins.txt",
  "The_Asquiths_Book-full.txt",
  "violet-diaries.txt",
  "Margot Asquith's Great War Diary - Michael Brock.txt",
  "venetia-stanley-letters-full.txt",
  "Charles_Lister_Letters-full.txt",
  "cynthia-diaries-full.txt",
  "Diana_Cooper-full.txt",
  "Frances_Stevenson-full.txt",
  "naomi_levine_full.txt",
  "Lord_Riddel-full.txt",
  "Maurice_Hankey-full.txt",
  "maurice_hunkey_man_of_secrets_relevant_years.txt",
  "Winston_Churchill_CAB_Part_2.3_1911_1914-full.txt",
  "Winston_Churchill_CAB_Part_3.1_1914_1915-full.txt",
  "Winston_Churchill_CAB_Part_3.2_1915_1916-full.txt",
  "Hansard 1912-1916.txt",
]);


export const FootnoteSchema = z.object({
  sourceId: ValidatedSourceIds.describe("A unique source identifier."),
  date: z.string().nullable().describe("for primary sources, the date of of diary / letter."),
});
export const FinalAnswerSchema = z.object({
  markdownText: z.string().describe("Final answer in Markdown."),
  footnotes: z.array(FootnoteSchema).describe("List of verified citations used in the answer."),
});

export type VerifiedSourceItem = z.infer<typeof FootnoteSchema>;

export const UnformatedAnswerSchema = z.object({
        answer: z.string().describe("Final answer in Markdown without any list of footnotes."),
        citations: z.array(            
            z.object({
                sourceId: ValidatedSourceIds.describe("A unique source identifier."),
                date: z.string().describe("for primary sources, the date of of diary / letter.").nullable(),
            }).describe("List of verified citations used in the answer."),
        ).describe("A text answer with citations."),
    });

export type UnformatedAnswer = z.infer<typeof UnformatedAnswerSchema>;
export type FinalAnswer = z.infer<typeof FinalAnswerSchema>;
export type footnote = z.infer<typeof FootnoteSchema>;

export async function formatFinalAnswers(
  answer: UnformatedAnswer,
  onStatus?: (status: string) => void
): Promise<FinalAnswer> {
  const defaultResponse: FinalAnswer = { markdownText: answer.answer, footnotes: [] };
  if (!process.env.OPENAI_API_KEY) return defaultResponse;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  onStatus?.("Finalizing response formatting...");
  console.log("📝 [Formatter] Formatting final answers with OpenAI...", answer);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional historical editor.

Use the following knowledge base only for context (do not add new facts):
${KNOWLEDGE_BASE}

You will receive a JSON object containing:
- "answer": a text answer 
- "citations": a list of verified sources used in the answer.

Your task is to:
1) Rewrite the "answer" to be clear, academic, and reader-friendly using Markdown (paragraphs, bullet points where helpful).
2) Provide a list of "footnotes" corresponding to the citations used as a specieal field (outside the markdown text).
3) If you include a direct quotation (quotation marks or a blockquote), ensure the source is listed in the "footnotes" array.
4) Use standard Markdown. Include link to footnotes like [^1]: ... in the text itself if you are providing them in the "footnotes" array.
5) In your response, the markdownText field should not contain footnote definitions; these should be in the footnotes array only.

Return ONLY valid JSON in the form: { "markdownText": "...", "footnotes": [{ "sourceId": "...", "date": "..." }] }`,
        },
        {
          role: "user",
          content: JSON.stringify(answer),
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message.content;
    if (!content) return defaultResponse;

    const parsed = FinalAnswerSchema.safeParse(JSON.parse(content));
    if (!parsed.success) return defaultResponse;

    return parsed.data;
  } catch (_e) {
    return defaultResponse;
  }
}