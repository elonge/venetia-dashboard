import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import clientPromise from "@/lib/mongodb";
import {
  ConceptExpansion,
  DEFAULT_CHAT_MODEL,
  DEFAULT_CONCEPT_COLLECTION,
  DEFAULT_DB_NAME,
  DEFAULT_EMBEDDING_DIMENSIONS,
  DEFAULT_EMBEDDING_MODEL,
  buildExpansionEmbeddingText,
  expandConceptOnce,
} from "@/lib/sentiment-series";

type TopicFrequencyResponse = {
  query: string;
  matchedQuery: string;
  definition?: string;
  letterCount: number;
  totalLetters: number;
  percent: number;
  scoreThreshold: number;
  sampleSize: number;
};

const ASQUITH_CHUNKS_COLLECTION = "asquith_chunks";
const DEFAULT_SOURCE = "asquith_letters_full";
const DEFAULT_VECTOR_INDEX =
  process.env.ASQUITH_VECTOR_SEARCH_INDEX_NAME ||
  process.env.VECTOR_SEARCH_INDEX_NAME ||
  "vector_index";
const DEFAULT_SAMPLE_SIZE = 400;
const DEFAULT_SCORE_THRESHOLD = 0.55;

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedAtMs = 0;
let cachedTotalLetters = 0;

function parseTopicQuery(request: NextRequest): string | null {
  const url = new URL(request.url);
  const q = (url.searchParams.get("topic") || "").trim();
  if (!q) return null;
  if (q.length > 120) return null;
  return q;
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return n;
}

function parseScoreThreshold(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = parseFloat(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}

async function getOrCreateConcept(params: {
  openai: OpenAI;
  term: string;
  scope: string;
  chatModel: string;
  embeddingModel: string;
}) {
  const client = await clientPromise;
  const db = client.db(DEFAULT_DB_NAME);
  const col = db.collection(DEFAULT_CONCEPT_COLLECTION);

  const key = {
    term: params.term,
    scope: params.scope,
    chatModel: params.chatModel,
    embeddingModel: params.embeddingModel,
    dimensions: DEFAULT_EMBEDDING_DIMENSIONS,
  };

  const existing = await col.findOne(key, {
    projection: { _id: 0, expansion: 1, queryEmbedding: 1 },
  });

  if (
    existing?.expansion &&
    existing?.queryEmbedding &&
    Array.isArray(existing.queryEmbedding)
  ) {
    return {
      expansion: existing.expansion as ConceptExpansion,
      queryEmbedding: existing.queryEmbedding as number[],
    };
  }

  const expansion = await expandConceptOnce(params.openai, params.term, params.chatModel);
  const embeddingText = buildExpansionEmbeddingText(expansion);
  const embeddingResp = await params.openai.embeddings.create({
    model: params.embeddingModel,
    input: embeddingText,
    dimensions: DEFAULT_EMBEDDING_DIMENSIONS,
  });
  const queryEmbedding = embeddingResp.data[0].embedding;

  await col.updateOne(
    key,
    {
      $set: {
        ...key,
        expansion,
        queryEmbedding,
        embeddingText,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  return { expansion, queryEmbedding };
}

async function getTotalLetters(params: { source: string }): Promise<number> {
  const now = Date.now();
  if (now - cachedAtMs < CACHE_TTL_MS && cachedTotalLetters > 0) {
    return cachedTotalLetters;
  }

  const client = await clientPromise;
  const db = client.db(DEFAULT_DB_NAME);
  const col = db.collection(ASQUITH_CHUNKS_COLLECTION);

  const distinct = await col.distinct("metadata.letterIndex", { source: params.source });
  const totalLetters = Array.isArray(distinct) ? distinct.length : 0;

  cachedAtMs = now;
  cachedTotalLetters = totalLetters;
  return totalLetters;
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const query = parseTopicQuery(request);
    if (!query) {
      return NextResponse.json({ error: "Invalid `topic`" }, { status: 400 });
    }

    const source = (url.searchParams.get("source") || DEFAULT_SOURCE).trim();
    const sampleSize = parsePositiveInt(
      url.searchParams.get("sampleSize"),
      DEFAULT_SAMPLE_SIZE
    );
    const scoreThreshold = parseScoreThreshold(
      url.searchParams.get("minScore"),
      DEFAULT_SCORE_THRESHOLD
    );
    const debug = url.searchParams.get("debug") === "1";

    const chatModel = url.searchParams.get("chatModel") || DEFAULT_CHAT_MODEL;
    const embeddingModel =
      url.searchParams.get("embeddingModel") || DEFAULT_EMBEDDING_MODEL;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { expansion, queryEmbedding } = await getOrCreateConcept({
      openai,
      term: query,
      scope: "asquith_topic_frequency",
      chatModel,
      embeddingModel,
    });

    const client = await clientPromise;
    const db = client.db(DEFAULT_DB_NAME);
    const col = db.collection(ASQUITH_CHUNKS_COLLECTION);

    const pipeline: any[] = [
      {
        $vectorSearch: {
          index: DEFAULT_VECTOR_INDEX,
          path: "embedding",
          queryVector: queryEmbedding,
          filter: { source },
          numCandidates: Math.max(sampleSize * 10, 500),
          limit: sampleSize,
        },
      },
      {
        $project: {
          _id: 0,
          source: 1,
          score: { $meta: "vectorSearchScore" },
          "metadata.letterIndex": 1,
        },
      },
    ];

    const results = await col.aggregate(pipeline).toArray();
    const matchedLetterIndexes = new Set<number>();

    const scores: number[] = [];
    for (const r of results) {
      const score = typeof r?.score === "number" ? r.score : 0;
      scores.push(score);
      if (score < scoreThreshold) continue;
      const idx = r?.metadata?.letterIndex;
      if (typeof idx === "number" && Number.isFinite(idx)) {
        matchedLetterIndexes.add(idx);
      }
    }

    const totalLetters = await getTotalLetters({ source });
    const letterCount = matchedLetterIndexes.size;
    const percent =
      totalLetters > 0 ? Math.round((letterCount / totalLetters) * 100) : 0;

    const payload: TopicFrequencyResponse = {
      query,
      matchedQuery: expansion.term || query,
      definition: expansion.definition,
      letterCount,
      totalLetters,
      percent,
      scoreThreshold,
      sampleSize,
    };

    if (!debug) return NextResponse.json(payload);

    const sortedScores = scores.slice().sort((a, b) => a - b);
    const pick = (p: number) => {
      if (sortedScores.length === 0) return 0;
      const idx = Math.min(
        sortedScores.length - 1,
        Math.max(0, Math.floor(p * (sortedScores.length - 1)))
      );
      return sortedScores[idx] || 0;
    };

    return NextResponse.json({
      ...payload,
      debug: {
        resultCount: results.length,
        scoreStats: {
          min: pick(0),
          p50: pick(0.5),
          p90: pick(0.9),
          max: pick(1),
        },
        matchedLetters: matchedLetterIndexes.size,
        top: results.slice(0, 10).map((r: any) => ({
          score: typeof r?.score === "number" ? r.score : 0,
          letterIndex: r?.metadata?.letterIndex,
          source: r?.source,
        })),
      },
    });
  } catch (error) {
    console.error("Error in topic-frequency GET:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
