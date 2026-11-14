#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { analyzePageEvidence, analyzeQueryEvidence, changeTimeline, loadEvidence, seoOverview } from "./analytics";
import { clusterQuery } from "./query-clusters";

const server = new McpServer({ name: "venetia-seo", version: "1.0.0" });
const annotations = { readOnlyHint: true, destructiveHint: false, openWorldHint: false, idempotentHint: true };
const result = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  structuredContent: { data: value },
});

server.registerTool("get_seo_overview", {
  description: "Get the current UK-first organic-search overview for relevant Venetia Stanley and Edwin Montagu topics. Use this first when reviewing SEO performance.",
  inputSchema: {}, annotations,
}, async () => result(seoOverview(await loadEvidence())));

server.registerTool("analyze_query", {
  description: "Analyze a search query or topic cluster, including daily performance, variants, and landing-page distribution. Use it to investigate intent, page competition, gains, or declines.",
  inputSchema: {
    query: z.string().default("").describe("Query text or substring, for example 'venetia stanley'. Ignored when cluster is supplied."),
    cluster: z.enum(["venetia_biography", "venetia_asquith", "venetia_edwin", "marriage_conversion", "later_life_family", "letters_archive", "edwin_biography", "edwin_politics", "precipice", "out_of_scope"]).optional(),
  }, annotations,
}, async ({ query, cluster }) => result(analyzeQueryEvidence(await loadEvidence(), query, cluster)));

server.registerTool("analyze_page", {
  description: "Analyze one site page across Search Console, repository content, production verification, Git changes, and available Mixpanel engagement.",
  inputSchema: { page: z.string().describe("Absolute URL or route such as /venetia") }, annotations,
}, async ({ page }) => result(analyzePageEvidence(await loadEvidence(), page)));

server.registerTool("get_change_timeline", {
  description: "Build a unified daily search and Git-change timeline for a page. Use it to investigate whether a visibility movement followed a code or content change; temporal proximity is not proof of causation.",
  inputSchema: {
    page: z.string().describe("Absolute URL or route"),
    start: z.string().optional().describe("Optional YYYY-MM-DD start date"),
    end: z.string().optional().describe("Optional YYYY-MM-DD end date"),
  }, annotations,
}, async ({ page, start, end }) => result(changeTimeline(await loadEvidence(), page, start, end)));

server.registerTool("get_serp", {
  description: "Get stored Google SERP results for a query, market, and device. Returns the latest successful snapshot even if the newest collection failed.",
  inputSchema: {
    query: z.string(), market: z.enum(["GB", "US"]).optional(), device: z.enum(["desktop", "mobile"]).optional(),
  }, annotations,
}, async ({ query, market, device }) => {
  const evidence = await loadEvidence();
  const items = evidence.serp.current.filter((item) =>
    item.query.toLowerCase().includes(query.toLowerCase()) && (!market || item.market === market) && (!device || item.device === device),
  );
  return result({ query, market, device, lastSuccessfulSnapshot: evidence.serp.lastSuccessfulSnapshot, results: items });
});

server.registerTool("get_organic_engagement", {
  description: "Get the stored Mixpanel engagement summary and attribution-coverage warning. Use it to assess whether organic landing-page engagement can be measured reliably.",
  inputSchema: { page: z.string().optional().describe("Optional route or URL filter") }, annotations,
}, async ({ page }) => {
  const evidence = await loadEvidence();
  return result({ ...evidence.mixpanel, topPages: page ? evidence.mixpanel.topPages?.filter((item) => item.page.includes(page)) : evidence.mixpanel.topPages });
});

server.registerTool("inspect_site_content", {
  description: "Inspect stored repository and deployed-page evidence for a route, including metadata, headings, internal links, content hash, and production result.",
  inputSchema: { route: z.string().describe("Route such as /edwin-montagu-precipice") }, annotations,
}, async ({ route }) => {
  const evidence = await loadEvidence();
  return result({
    repository: evidence.repository.pages.find((page) => page.route === route),
    production: evidence.production.pages.find((page) => new URL(page.url).pathname === route),
  });
});

server.registerTool("get_data_quality", {
  description: "Check freshness, failures, limitations, and coverage for every SEO evidence source before drawing conclusions.",
  inputSchema: {}, annotations,
}, async () => {
  const evidence = await loadEvidence();
  return result({ generatedAt: evidence.generatedAt, period: evidence.period, sources: evidence.sources, warnings: evidence.dataQuality });
});

server.registerTool("classify_query", {
  description: "Classify a query into the site's maintained Venetia/Edwin topic taxonomy. Useful when interpreting spelling variants or determining relevance.",
  inputSchema: { query: z.string() }, annotations,
}, async ({ query }) => result({ query, cluster: clusterQuery(query) }));

async function main() {
  await server.connect(new StdioServerTransport());
  console.error("venetia-seo MCP server running on stdio");
}

main().catch((error) => { console.error(error); process.exit(1); });
