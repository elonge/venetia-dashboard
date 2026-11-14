import { seoConfig } from "./config";
import type { ProductionPage, RepoPage } from "./types";

function match(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function matches(html: string, pattern: RegExp) {
  return [...html.matchAll(pattern)]
    .map((item) => item[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
    .filter((item): item is string => Boolean(item));
}

export async function verifyProduction(repoPages: RepoPage[]): Promise<ProductionPage[]> {
  const routes = repoPages
    .map((page) => page.route)
    .filter((route) => !route.includes("[") && !route.includes(":") && route !== "/chapter")
    .filter((route) => route === "/" || /venetia|edwin|precipice|about|lab/.test(route));
  const urls = ["/robots.txt", "/sitemap.xml", ...routes].map((route) => new URL(route, seoConfig.siteUrl).toString());
  return Promise.all(urls.map(async (url) => {
    try {
      const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20_000) });
      const contentType = response.headers.get("content-type") || "";
      const html = contentType.includes("text/html") ? await response.text() : "";
      return {
        url, status: response.status, finalUrl: response.url,
        title: match(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
        canonical: match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)
          || match(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i),
        robots: match(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i),
        h1: match(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
        headings: matches(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi),
        internalLinks: [...new Set(matches(html, /<a[^>]+href=["'](\/[^"'#?]*)/gi))],
        structuredDataTypes: [...new Set(matches(html, /["']@type["']\s*:\s*["']([^"']+)/gi))],
      };
    } catch (error) {
      return { url, error: error instanceof Error ? error.message : "unknown error" };
    }
  }));
}
