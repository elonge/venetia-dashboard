import fs from "node:fs/promises";
import path from "node:path";
import { clusterQuery, isRelevantQuery, type QueryCluster } from "./query-clusters";
import { seoConfig } from "./config";
import type { EvidencePackage, SearchRow } from "./types";

export type Metrics = { clicks: number; impressions: number; ctr: number; position: number };

export async function loadEvidence(): Promise<EvidencePackage> {
  const file = path.join(seoConfig.outputDir, "evidence", "latest.json");
  return JSON.parse(await fs.readFile(file, "utf8")) as EvidencePackage;
}

export function metrics(rows: SearchRow[]): Metrics {
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const weightedPosition = rows.reduce((sum, row) => sum + row.position * row.impressions, 0);
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: impressions ? weightedPosition / impressions : 0 };
}

function aggregate<T>(rows: SearchRow[], key: (row: SearchRow) => string, map: (key: string, rows: SearchRow[]) => T) {
  const grouped = new Map<string, SearchRow[]>();
  for (const row of rows) grouped.set(key(row), [...(grouped.get(key(row)) || []), row]);
  return [...grouped].map(([value, items]) => map(value, items));
}

export function dailySeries(rows: SearchRow[]) {
  return aggregate(rows, (row) => row.date, (date, items) => ({ date, ...metrics(items) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function relevant(rows: SearchRow[]) { return rows.filter((row) => isRelevantQuery(row.query)); }

export function seoOverview(evidence: EvidencePackage) {
  const current = relevant(evidence.searchConsole.current);
  const comparison = relevant(evidence.searchConsole.comparison);
  const clusters = aggregate(current, (row) => clusterQuery(row.query), (cluster, items) => ({ cluster, ...metrics(items) }))
    .sort((a, b) => b.impressions - a.impressions);
  const pages = aggregate(current, (row) => row.page, (page, items) => ({ page, ...metrics(items) }))
    .sort((a, b) => b.impressions - a.impressions).slice(0, 15);
  return {
    generatedAt: evidence.generatedAt, period: evidence.period,
    current: metrics(current), comparison: metrics(comparison),
    queryClusters: clusters, topLandingPages: pages,
    sources: evidence.sources, dataQuality: evidence.dataQuality,
  };
}

export function analyzeQueryEvidence(evidence: EvidencePackage, query: string, cluster?: QueryCluster) {
  const predicate = cluster
    ? (row: SearchRow) => clusterQuery(row.query) === cluster
    : (row: SearchRow) => row.query.toLowerCase().includes(query.toLowerCase());
  const current = evidence.searchConsole.current.filter(predicate);
  const comparison = evidence.searchConsole.comparison.filter(predicate);
  return {
    query, cluster: cluster || undefined,
    current: metrics(current), comparison: metrics(comparison), daily: dailySeries(current),
    landingPages: aggregate(current, (row) => row.page, (page, items) => ({ page, ...metrics(items) }))
      .sort((a, b) => b.impressions - a.impressions).slice(0, 20),
    variants: aggregate(current, (row) => row.query, (value, items) => ({ query: value, ...metrics(items) }))
      .sort((a, b) => b.impressions - a.impressions).slice(0, 30),
  };
}

export function analyzePageEvidence(evidence: EvidencePackage, page: string) {
  const matchPage = (row: SearchRow) => row.page === page || new URL(row.page).pathname === page;
  const current = evidence.searchConsole.current.filter(matchPage);
  const comparison = evidence.searchConsole.comparison.filter(matchPage);
  const route = page.startsWith("http") ? new URL(page).pathname : page;
  return {
    page: route, current: metrics(current), comparison: metrics(comparison), daily: dailySeries(current),
    queries: aggregate(current, (row) => row.query, (query, items) => ({ query, cluster: clusterQuery(query), ...metrics(items) }))
      .sort((a, b) => b.impressions - a.impressions).slice(0, 40),
    repository: evidence.repository.pages.find((item) => item.route === route),
    production: evidence.production.pages.find((item) => new URL(item.url).pathname === route),
    changes: evidence.git.changes.filter((change) => change.affectedRoutes.includes(route)).slice(0, 30),
    engagement: evidence.mixpanel.topPages?.filter((item) => item.page.includes(route)).slice(0, 10) || [],
  };
}

export function changeTimeline(evidence: EvidencePackage, page: string, start?: string, end?: string) {
  const analysis = analyzePageEvidence(evidence, page);
  const within = (date: string) => (!start || date >= start) && (!end || date <= end);
  return {
    page: analysis.page,
    search: analysis.daily.filter((item) => within(item.date)),
    changes: analysis.changes.filter((item) => within(item.committedAt.slice(0, 10))),
    production: analysis.production,
    caveat: "Temporal proximity is correlation evidence only; Google crawl/index timing is not observed directly.",
  };
}
