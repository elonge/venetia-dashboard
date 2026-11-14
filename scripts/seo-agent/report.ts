import fs from "node:fs/promises";
import path from "node:path";
import { seoOverview } from "./analytics";
import type { EvidencePackage } from "./types";

function pct(value: number) { return `${(value * 100).toFixed(2)}%`; }
function change(current: number, previous: number) {
  if (!previous) return current ? "new" : "0%";
  const result = ((current - previous) / previous) * 100;
  return `${result >= 0 ? "+" : ""}${result.toFixed(1)}%`;
}
function esc(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] || char);
}

export function renderEvidenceMarkdown(evidence: EvidencePackage) {
  const overview = seoOverview(evidence);
  const sources = Object.entries(evidence.sources).map(([name, status]) => `- **${name}:** ${status}`).join("\n");
  const quality = evidence.dataQuality.length ? evidence.dataQuality.map((item) => `- ${item}`).join("\n") : "- No collector warnings.";
  const clusters = overview.queryClusters.map((item) =>
    `| ${item.cluster} | ${item.clicks} | ${item.impressions} | ${pct(item.ctr)} | ${item.position.toFixed(1)} |`,
  ).join("\n");
  const pages = overview.topLandingPages.map((item) =>
    `| ${item.page} | ${item.clicks} | ${item.impressions} | ${pct(item.ctr)} | ${item.position.toFixed(1)} |`,
  ).join("\n");
  return `# The Venetia Project — SEO Evidence Summary

Generated: ${evidence.generatedAt}

This file reports collected evidence only. It intentionally contains no automated recommendations.

## Relevant organic performance

| Metric | Current | Comparison | Change |
|---|---:|---:|---:|
| Clicks | ${overview.current.clicks} | ${overview.comparison.clicks} | ${change(overview.current.clicks, overview.comparison.clicks)} |
| Impressions | ${overview.current.impressions} | ${overview.comparison.impressions} | ${change(overview.current.impressions, overview.comparison.impressions)} |
| CTR | ${pct(overview.current.ctr)} | ${pct(overview.comparison.ctr)} | — |
| Average position | ${overview.current.position.toFixed(1)} | ${overview.comparison.position.toFixed(1)} | — |

## Query clusters

| Cluster | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
${clusters}

## Landing pages

| Page | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
${pages}

## Source status

${sources}

## Data quality

${quality}

## Collected context

- Repository pages: ${evidence.repository.pages.length}
- Production checks: ${evidence.production.pages.length}
- Git changes: ${evidence.git.changes.length}
- SERP results: ${evidence.serp.current.length}
- Mixpanel events stored: ${evidence.mixpanel.totalStoredEvents?.toLocaleString() || "unavailable"}
`;
}

export function renderEvidenceHtml(evidence: EvidencePackage) {
  const body = renderEvidenceMarkdown(evidence).split("\n").map((line) => {
    if (line.startsWith("## ")) return `<h2>${esc(line.slice(3))}</h2>`;
    if (line.startsWith("# ")) return `<h1>${esc(line.slice(2))}</h1>`;
    if (line.startsWith("- ")) return `<p>• ${esc(line.slice(2))}</p>`;
    if (line.startsWith("|")) return `<pre>${esc(line)}</pre>`;
    return line ? `<p>${esc(line).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>` : "";
  }).join("\n");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Venetia SEO evidence</title><style>body{font:16px/1.5 system-ui;max-width:1100px;margin:40px auto;padding:0 24px;background:#faf9f6;color:#17202a}h1,h2{font-family:Georgia,serif;color:#24364b}h2{margin-top:2rem;border-bottom:1px solid #ddd;padding-bottom:.3rem}pre{margin:0;background:#fff;padding:.3rem;overflow:auto}</style></head><body>${body}</body></html>`;
}

export async function writeEvidence(evidence: EvidencePackage, outputDir: string) {
  const runId = evidence.generatedAt.replace(/[:.]/g, "-");
  const evidenceDir = path.join(outputDir, "evidence");
  const summaryDir = path.join(outputDir, "summaries");
  await Promise.all([fs.mkdir(path.join(evidenceDir, "runs"), { recursive: true }), fs.mkdir(path.join(summaryDir, "runs"), { recursive: true })]);
  const json = JSON.stringify(evidence, null, 2);
  const markdown = renderEvidenceMarkdown(evidence);
  const html = renderEvidenceHtml(evidence);
  const files = {
    evidence: path.join(evidenceDir, "latest.json"),
    markdown: path.join(summaryDir, "latest.md"),
    html: path.join(summaryDir, "latest.html"),
  };
  await Promise.all([
    fs.writeFile(files.evidence, json), fs.writeFile(path.join(evidenceDir, "runs", `${runId}.json`), json),
    fs.writeFile(files.markdown, markdown), fs.writeFile(path.join(summaryDir, "runs", `${runId}.md`), markdown),
    fs.writeFile(files.html, html), fs.writeFile(path.join(summaryDir, "runs", `${runId}.html`), html),
  ]);
  return files;
}
