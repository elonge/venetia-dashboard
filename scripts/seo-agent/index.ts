import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { seoConfig } from "./config";
import { collectGitChanges } from "./git-history";
import { syncMixpanel } from "./mixpanel";
import { collectMixpanelEvidence } from "./mixpanel-evidence";
import { progress } from "./progress";
import { verifyProduction } from "./production";
import { inspectRepository } from "./repository";
import { writeEvidence } from "./report";
import { fetchSearchConsole } from "./search-console";
import { fetchSerps } from "./serp";
import type { EvidencePackage, MixpanelEvidence, SearchRow, SerpResult } from "./types";

function dateOnly(date: Date) { return date.toISOString().slice(0, 10); }
function periods() {
  const end = new Date(); end.setUTCDate(end.getUTCDate() - seoConfig.dataLagDays);
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - seoConfig.lookbackDays + 1);
  const comparisonEnd = new Date(start); comparisonEnd.setUTCDate(comparisonEnd.getUTCDate() - 1);
  const comparisonStart = new Date(comparisonEnd); comparisonStart.setUTCDate(comparisonStart.getUTCDate() - seoConfig.lookbackDays + 1);
  return { start: dateOnly(start), end: dateOnly(end), comparisonStart: dateOnly(comparisonStart), comparisonEnd: dateOnly(comparisonEnd) };
}
async function readFixture(file?: string): Promise<SearchRow[]> {
  return file ? JSON.parse(await fs.readFile(path.resolve(file), "utf8")) as SearchRow[] : [];
}
async function priorEvidence(): Promise<EvidencePackage | undefined> {
  try { return JSON.parse(await fs.readFile(path.join(seoConfig.outputDir, "evidence", "latest.json"), "utf8")) as EvidencePackage; }
  catch { return undefined; }
}

async function main() {
  progress("Starting SEO evidence collection");
  const period = periods();
  const previousEvidence = await priorEvidence();
  const sources: Record<string, string> = {};
  const dataQuality = [
    "Search Console query/page data can omit anonymized and low-volume rows.",
    "Git commit time is used as a deployment-time proxy until Vercel deployment data is connected.",
  ];

  progress("Repository: extracting metadata, links, headings, and content hashes");
  const repoPages = await inspectRepository();
  sources.repository = `inspected ${repoPages.length} routes`;

  let current: SearchRow[] = [];
  let comparison: SearchRow[] = [];
  if (process.env.SEO_SEARCH_CONSOLE_FIXTURE) {
    current = await readFixture(process.env.SEO_SEARCH_CONSOLE_FIXTURE);
    comparison = await readFixture(process.env.SEO_SEARCH_CONSOLE_PREVIOUS_FIXTURE);
    sources.searchConsole = "loaded fixtures";
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SEARCH_CONSOLE_ENABLED === "true") {
    progress(`Search Console: fetching ${period.comparisonStart} to ${period.end}`);
    try {
      [current, comparison] = await Promise.all([
        fetchSearchConsole(seoConfig.searchConsoleProperty, period.start, period.end),
        fetchSearchConsole(seoConfig.searchConsoleProperty, period.comparisonStart, period.comparisonEnd),
      ]);
      sources.searchConsole = `loaded ${current.length} current and ${comparison.length} comparison rows`;
    } catch (error) {
      sources.searchConsole = `failed (${error instanceof Error ? error.message : "unknown error"})`;
      dataQuality.push("Search Console collection failed; search evidence is incomplete.");
    }
  } else sources.searchConsole = "skipped (credentials not configured)";

  let serpResults: SerpResult[] = [];
  let lastSuccessfulSnapshot: string | undefined;
  if (process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD) {
    progress("DataForSEO: collecting tracked SERPs");
    try {
      serpResults = await fetchSerps();
      sources.serp = `loaded ${serpResults.length} results`;
      lastSuccessfulSnapshot = new Date().toISOString();
    } catch (error) {
      sources.serp = `failed (${error instanceof Error ? error.message : "unknown error"})`;
      serpResults = previousEvidence?.serp.current || [];
      lastSuccessfulSnapshot = previousEvidence?.serp.lastSuccessfulSnapshot;
      dataQuality.push(`Current SERP collection failed; ${serpResults.length ? "using the previous snapshot" : "no historical snapshot is available"}.`);
    }
  } else sources.serp = "skipped (credentials not configured)";

  progress("Mixpanel: syncing delta and calculating aggregates");
  let mixpanelStatus: string;
  try { mixpanelStatus = await syncMixpanel(); }
  catch (error) { mixpanelStatus = `failed (${error instanceof Error ? error.message : "unknown error"})`; }
  sources.mixpanel = mixpanelStatus;
  const mixpanel: MixpanelEvidence = await collectMixpanelEvidence(mixpanelStatus).catch((error) => ({
    status: `aggregate failed (${error instanceof Error ? error.message : "unknown error"})`,
  }));
  if (!mixpanel.organicAttributionAvailable) dataQuality.push("Mixpanel has no recognized Google/Bing attribution properties; organic engagement cannot yet be isolated reliably.");

  progress("Git: collecting route-affecting history");
  const gitChanges = await collectGitChanges();
  sources.git = `loaded ${gitChanges.length} commits from the last 120 days`;

  progress("Production: verifying important deployed pages");
  const productionPages = await verifyProduction(repoPages);
  sources.production = `checked ${productionPages.length} URLs`;
  if (productionPages.some((page) => page.error || (page.status && page.status >= 400))) dataQuality.push("One or more production verification requests failed.");

  const evidence: EvidencePackage = {
    schemaVersion: 2, generatedAt: new Date().toISOString(), period, sources, dataQuality,
    searchConsole: { current, comparison }, serp: { current: serpResults, lastSuccessfulSnapshot },
    repository: { pages: repoPages }, production: { checkedAt: new Date().toISOString(), pages: productionPages },
    git: { changes: gitChanges }, mixpanel,
  };
  progress("Output: writing immutable evidence and factual summaries");
  const files = await writeEvidence(evidence, seoConfig.outputDir);
  progress("Finished");
  console.log(`SEO evidence written:\n- ${files.evidence}\n- ${files.markdown}\n- ${files.html}`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
