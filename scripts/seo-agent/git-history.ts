import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { GitChange } from "./types";

const execFileAsync = promisify(execFile);

function routeForFile(file: string) {
  const match = file.match(/^app\/(?:\([^/]+\)\/)?(.+?)\/(?:page|layout|head)\.tsx$/);
  if (!match) return undefined;
  return `/${match[1]}`.replace(/\/\[[^/]+\]/g, "/:dynamic");
}

function classify(files: string[]) {
  const types = new Set<string>();
  for (const file of files) {
    if (/page\.(tsx|ts)$/.test(file)) types.add("content_or_page");
    if (/(layout|head|sitemap|robots)\.(tsx|ts)$/.test(file)) types.add("metadata_or_indexing");
    if (/globals\.css|components\//.test(file)) types.add("presentation_or_navigation");
    if (/mixpanel|analytics/.test(file)) types.add("analytics");
  }
  return [...types];
}

export async function collectGitChanges(days = 120): Promise<GitChange[]> {
  const separator = "---SEO-COMMIT---";
  const { stdout } = await execFileAsync("git", [
    "log", `--since=${days} days ago`, "--date=iso-strict",
    `--pretty=format:${separator}%n%H%x09%aI%x09%s`, "--name-only", "--", "app", "components", "lib",
  ], { maxBuffer: 10 * 1024 * 1024 });
  return stdout.split(separator).slice(1).flatMap((block) => {
    const lines = block.trim().split("\n");
    const [commit, committedAt, subject] = (lines.shift() || "").split("\t");
    const files = lines.map((line) => line.trim()).filter(Boolean);
    if (!commit) return [];
    return [{
      commit, committedAt, subject: subject || "", files,
      affectedRoutes: [...new Set(files.map(routeForFile).filter((route): route is string => Boolean(route)))],
      changeTypes: classify(files),
    }];
  });
}
