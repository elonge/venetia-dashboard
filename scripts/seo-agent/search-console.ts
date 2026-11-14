import { google } from "googleapis";
import type { SearchRow } from "./types";

export async function fetchSearchConsole(
  siteUrl: string,
  startDate: string,
  endDate: string,
): Promise<SearchRow[]> {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  const client = google.searchconsole({ version: "v1", auth });
  const rows: SearchRow[] = [];

  for (let startRow = 0; ; startRow += 25_000) {
    const response = await client.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        type: "web",
        dataState: "final",
        dimensions: ["date", "query", "page", "country", "device"],
        aggregationType: "byPage",
        rowLimit: 25_000,
        startRow,
      },
    });
    const batch = response.data.rows || [];
    for (const row of batch) {
      const keys = row.keys || [];
      rows.push({
        date: keys[0] || "",
        query: keys[1] || "",
        page: keys[2] || "",
        country: keys[3] || "",
        device: keys[4] || "",
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      });
    }
    if (batch.length < 25_000) break;
  }
  return rows;
}
