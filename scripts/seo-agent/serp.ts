import { SEO_QUERIES, seoConfig } from "./config";
import { progress } from "./progress";
import type { SerpResult } from "./types";

type DfsItem = {
  type?: string;
  rank_absolute?: number;
  domain?: string;
  url?: string;
  title?: string;
  description?: string;
};

export async function fetchSerps(): Promise<SerpResult[]> {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) return [];

  const checkedAt = new Date().toISOString();
  const requests = seoConfig.markets.flatMap((market) =>
    SEO_QUERIES.flatMap((keyword) =>
      ["desktop", "mobile"].map((device) => ({
        market,
        task: {
          keyword,
          location_code: market.locationCode,
          language_code: market.languageCode,
          device,
          depth: 10,
        },
      })),
    ),
  );
  const output: SerpResult[] = [];
  let nextRequest = 0;
  let completedRequests = 0;
  const timeoutMs = Number.parseInt(process.env.DATAFORSEO_TIMEOUT_MS || "180000", 10);

  // Live SERP accepts exactly one task per HTTP request. A small worker pool keeps
  // a weekly run reasonably quick without producing a burst of 56 connections.
  async function runTaskWithRetry(market: (typeof seoConfig.markets)[number], task: Record<string, unknown>) {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(
          "https://api.dataforseo.com/v3/serp/google/organic/live/advanced",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify([task]),
            signal: AbortSignal.timeout(timeoutMs),
          },
        );
        const responseText = await response.text();
        if (!response.ok) {
          const detail = responseText.replace(/\s+/g, " ").slice(0, 300);
          throw new Error(`DataForSEO failed: HTTP ${response.status}${detail ? ` — ${detail}` : ""}`);
        }
        const payload = JSON.parse(responseText) as {
          status_code?: number;
          status_message?: string;
          tasks?: Array<{
            status_code?: number;
            status_message?: string;
            data?: { keyword?: string; device?: string };
            result?: Array<{ items?: DfsItem[] }>;
          }>;
        };
        const failedTask = payload.tasks?.find((item) => item.status_code !== 20000);
        if (payload.status_code !== 20000 || failedTask) {
          const code = failedTask?.status_code || payload.status_code || "unknown";
          const msg = failedTask?.status_message || payload.status_message || "unknown error";
          throw new Error(`DataForSEO task failed: ${code} — ${msg}`);
        }
        for (const t of payload.tasks || []) {
          for (const item of t.result?.[0]?.items || []) {
            if (!item.url || !item.rank_absolute) continue;
            output.push({
              query: t.data?.keyword || "",
              market: market.code,
              device: t.data?.device || "",
              checkedAt,
              rank: item.rank_absolute,
              domain: item.domain || new URL(item.url).hostname,
              url: item.url,
              title: item.title || "",
              description: item.description || "",
              resultType: item.type || "organic",
            });
          }
        }
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Do not retry auth/account errors (e.g. 40200-40299)
        if (/402\d\d/.test(lastError.message) || attempt === 3) {
          throw lastError;
        }
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      }
    }
  }

  async function worker() {
    while (nextRequest < requests.length) {
      const request = requests[nextRequest++];
      const { market, task } = request;
      await runTaskWithRetry(market, task);
      completedRequests += 1;
      if (completedRequests % 4 === 0 || completedRequests === requests.length) {
        progress(`DataForSEO: ${completedRequests}/${requests.length} SERPs completed`);
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, () => worker()));
  return output;
}
