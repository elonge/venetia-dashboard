import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type MixpanelEvent = {
  event?: string;
  properties?: Record<string, unknown> & {
    $insert_id?: string;
    time?: number | string;
  };
};

const HOURS_24_MS = 24 * 60 * 60 * 1000;

function dateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseArgs(args: string[]): { output: string } {
  let output = "mixpanel-events-last-24-hours.csv";

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--output" || argument === "-o") {
      const value = args[index + 1];
      if (!value) throw new Error(`${argument} requires a file path`);
      output = value;
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      console.log(
        "Usage: npm run analytics:export:24h -- [--output path/to/events.csv]",
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return { output: path.resolve(output) };
}

function eventTimeMs(event: MixpanelEvent): number | null {
  const value = event.properties?.time;
  const numeric = typeof value === "string" ? Number(value) : value;
  if (typeof numeric !== "number" || !Number.isFinite(numeric)) return null;

  // Mixpanel normally returns seconds, or milliseconds when time_in_ms=true.
  return numeric < 10_000_000_000 ? numeric * 1_000 : numeric;
}

function csvCell(value: unknown): string {
  if (value === undefined || value === null) return "";
  const text =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function eventsToCsv(events: MixpanelEvent[]): string {
  const propertyNames = [
    ...new Set(events.flatMap((event) => Object.keys(event.properties ?? {}))),
  ].sort((left, right) => left.localeCompare(right));
  const headers = [
    "event",
    "timestamp_utc",
    ...propertyNames.map((name) => `property.${name}`),
  ];
  const rows = events.map((event) => {
    const timestamp = eventTimeMs(event);
    return [
      event.event ?? "",
      timestamp === null ? "" : new Date(timestamp).toISOString(),
      ...propertyNames.map((name) => event.properties?.[name]),
    ]
      .map(csvCell)
      .join(",");
  });

  return `${headers.map(csvCell).join(",")}\n${rows.join("\n")}${rows.length ? "\n" : ""}`;
}

function deduplicateEvents(events: MixpanelEvent[]): MixpanelEvent[] {
  const seenInsertIds = new Set<string>();

  return events.filter((event) => {
    const insertId = event.properties?.$insert_id;
    if (!insertId) return true;
    if (seenInsertIds.has(insertId)) return false;

    seenInsertIds.add(insertId);
    return true;
  });
}

async function main(): Promise<void> {
  const { output } = parseArgs(process.argv.slice(2));
  const username = process.env.MIXPANEL_SERVICE_ACCOUNT_USERNAME;
  const password = process.env.MIXPANEL_SERVICE_ACCOUNT_SECRET;
  const projectId = process.env.MIXPANEL_PROJECT_ID;

  if (!username || !password || !projectId) {
    throw new Error(
      "Missing MIXPANEL_SERVICE_ACCOUNT_USERNAME, MIXPANEL_SERVICE_ACCOUNT_SECRET, or MIXPANEL_PROJECT_ID",
    );
  }

  const now = new Date();
  const cutoffMs = now.getTime() - HOURS_24_MS;

  // The Export API accepts calendar dates in the Mixpanel project's timezone and
  // rejects future end dates. An extra starting day covers timezone offsets;
  // exact rolling-window filtering happens below.
  const from = new Date(cutoffMs - HOURS_24_MS);
  const to = now;
  const host = process.env.MIXPANEL_DATA_HOST || "https://data.mixpanel.com";
  const url = new URL("/api/2.0/export", host);
  url.searchParams.set("project_id", projectId);
  url.searchParams.set("from_date", dateOnly(from));
  url.searchParams.set("to_date", dateOnly(to));
  url.searchParams.set("time_in_ms", "true");

  console.log(`Downloading Mixpanel events from ${dateOnly(from)} to ${dateOnly(to)}...`);
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      "Accept-Encoding": "gzip",
    },
    signal: AbortSignal.timeout(
      Number.parseInt(process.env.MIXPANEL_TIMEOUT_MS || "300000", 10),
    ),
  });

  if (!response.ok) {
    const details = (await response.text()).slice(0, 500);
    throw new Error(
      `Mixpanel export failed (${response.status} ${response.statusText}): ${details}`,
    );
  }

  const responseText = await response.text();
  const rawEvents = responseText
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as MixpanelEvent)
    .filter((event) => {
      const timestamp = eventTimeMs(event);
      return timestamp !== null && timestamp >= cutoffMs && timestamp <= now.getTime();
    });
  const events = deduplicateEvents(rawEvents)
    .sort((left, right) => (eventTimeMs(left) ?? 0) - (eventTimeMs(right) ?? 0));
  const duplicatesRemoved = rawEvents.length - events.length;

  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, eventsToCsv(events), "utf8");
  console.log(
    `Wrote ${events.length.toLocaleString()} unique events from the last 24 hours to ${output}`,
  );
  console.log(`Removed ${duplicatesRemoved.toLocaleString()} duplicate copies by $insert_id`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
