import OpenAI from 'openai';

export const DEFAULT_DB_NAME = 'venetia_project';
export const DEFAULT_BUCKET_COLLECTION = 'asquith_bucket_embeddings';
export const DEFAULT_CONCEPT_COLLECTION = 'sentiment_concepts';

export const DEFAULT_EMBEDDING_MODEL =
  process.env.EMBEDDING_MODEL || 'text-embedding-3-large';
export const DEFAULT_CHAT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
export const DEFAULT_EMBEDDING_DIMENSIONS = 1536;

export type Bucket = 'week' | 'month';

export interface BucketEmbeddingDoc {
  bucket: Bucket;
  bucketStart: Date;
  embedding: number[];
  chunkCount?: number;
  source?: string;
}

export interface ConceptExpansion {
  term: string;
  definition: string;
  synonyms: string[];
  indicators: string[];
  exclusions: string[];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    dot += x * y;
    normA += x * x;
    normB += y * y;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function rollingMean(values: number[], windowSize: number): number[] {
  if (windowSize <= 1) return values.slice();
  const out = new Array<number>(values.length);
  let sum = 0;
  const window: number[] = [];

  for (let i = 0; i < values.length; i++) {
    const v = values[i] || 0;
    window.push(v);
    sum += v;

    if (window.length > windowSize) {
      sum -= window.shift() || 0;
    }

    out[i] = sum / window.length;
  }

  return out;
}

export function normalize0to100(values: number[]): number[] {
  if (values.length === 0) return [];
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) {
    return values.map(() => 0);
  }
  return values.map((v) => ((v - min) / (max - min)) * 100);
}

export function buildExpansionEmbeddingText(expansion: ConceptExpansion): string {
  const lines = [
    `Term: ${expansion.term}`,
    `Definition: ${expansion.definition}`,
    `Synonyms: ${expansion.synonyms.join(', ')}`,
    `Indicators: ${expansion.indicators.join(' | ')}`,
  ];

  if (expansion.exclusions.length > 0) {
    lines.push(`Not this: ${expansion.exclusions.join(' | ')}`);
  }

  return lines.join('\n');
}

export async function expandConceptOnce(
  openai: OpenAI,
  term: string,
  chatModel: string
): Promise<ConceptExpansion> {
  const prompt = [
    'You are helping build a semantic search time-series over H.H. Asquith letters.',
    'Given a user-provided concept term, produce a compact concept expansion that will be embedded.',
    'Return ONLY valid JSON with keys: term, definition, synonyms, indicators, exclusions.',
    '',
    'Guidelines:',
    '- definition: 1-2 sentences, concrete, avoid academic tone.',
    '- synonyms: 5-12 single words/short phrases.',
    '- indicators: 8-16 short phrases likely to appear in letters (first-person, period-appropriate).',
    '- exclusions: 4-10 related but distinct concepts to avoid confusing (e.g. shame vs guilt).',
    '- Keep arrays unique and concise.',
    '',
    `Term: ${term}`,
  ].join('\n');

  const resp = await openai.chat.completions.create({
    model: chatModel,
    messages: [
      { role: 'system', content: 'You output strict JSON only.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    max_completion_tokens: 600,
  });

  const content = resp.choices[0]?.message?.content || '';
  const parsed = JSON.parse(content);

  const expansion: ConceptExpansion = {
    term: String(parsed.term || term),
    definition: String(parsed.definition || ''),
    synonyms: Array.isArray(parsed.synonyms)
      ? parsed.synonyms.map((s: any) => String(s)).filter(Boolean)
      : [],
    indicators: Array.isArray(parsed.indicators)
      ? parsed.indicators.map((s: any) => String(s)).filter(Boolean)
      : [],
    exclusions: Array.isArray(parsed.exclusions)
      ? parsed.exclusions.map((s: any) => String(s)).filter(Boolean)
      : [],
  };

  if (!expansion.definition) {
    throw new Error('Concept expansion missing definition');
  }

  return expansion;
}

