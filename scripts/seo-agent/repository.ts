import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import type { RepoPage } from "./types";

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !entry.name.startsWith(".") && entry.name !== "api")
      .map((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
      }),
  );
  return nested.flat();
}

function routeFromFile(file: string) {
  const relative = path.relative(path.resolve("app"), path.dirname(file));
  const parts = relative
    .split(path.sep)
    .filter((part) => part && !part.startsWith("("));
  return `/${parts.join("/")}`.replace(/\/$/, "") || "/";
}

function firstString(source: string, field: string) {
  const match = source.match(new RegExp(`${field}\\s*:\\s*(["'\x60])([\\s\\S]*?)\\1`));
  return match?.[2]?.replace(/\s+/g, " ").trim();
}

function matches(source: string, pattern: RegExp) {
  return [...source.matchAll(pattern)].map((match) => match[1]).filter(Boolean);
}

export async function inspectRepository(): Promise<RepoPage[]> {
  const rootLayout = await fs.readFile(path.resolve("app/layout.tsx"), "utf8");
  const files = (await walk(path.resolve("app"))).filter((file) =>
    /page\.(tsx|ts|jsx|js)$/.test(file),
  );
  return Promise.all(
    files.map(async (file) => {
      const text = await fs.readFile(file, "utf8");
      const siblingLayout = path.join(path.dirname(file), "layout.tsx");
      let combined = text;
      try {
        combined += await fs.readFile(siblingLayout, "utf8");
      } catch {
        // A route does not need its own layout.
      }
      if (routeFromFile(file) === "/") combined += rootLayout;
      return {
        route: routeFromFile(file),
        source: path.relative(process.cwd(), file),
        hasMetadata: /(?:generateMetadata|export const metadata)/.test(combined),
        hasCanonical: /canonical\s*:/.test(combined),
        hasStructuredData: /application\/ld\+json/.test(combined),
        title: firstString(combined, "title"),
        description: firstString(combined, "description"),
        headings: matches(combined, /<h[1-3][^>]*>(?:\s*{[^}]+}\s*)?([^<{][^<]*)<\/h[1-3]>/g),
        internalLinks: [...new Set(matches(combined, /href\s*=\s*["'](\/[^"'#?]*)/g))],
        contentHash: createHash("sha256").update(combined).digest("hex").slice(0, 16),
      };
    }),
  );
}
