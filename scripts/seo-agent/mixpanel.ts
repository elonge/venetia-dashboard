import { MongoClient } from "mongodb";
import { seoConfig } from "./config";
import { progress } from "./progress";

type RawMixpanelEvent = {
  event?: string;
  properties?: Record<string, unknown> & { $insert_id?: string; time?: number };
};

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function syncMixpanel(): Promise<string> {
  const username = process.env.MIXPANEL_SERVICE_ACCOUNT_USERNAME;
  const password = process.env.MIXPANEL_SERVICE_ACCOUNT_SECRET;
  const projectId = process.env.MIXPANEL_PROJECT_ID;
  const mongoUri = process.env.MONGODB_URI;
  if (!username || !password || !projectId || !mongoUri) {
    return "skipped (credentials not configured)";
  }

  const mongo = new MongoClient(mongoUri);
  await mongo.connect();
  try {
    const db = mongo.db(seoConfig.mongoDatabase);
    const state = await db.collection("sync_state").findOne({ source: "mixpanel" });
    const end = new Date();
    end.setUTCDate(end.getUTCDate() - 1);
    const start = state?.lastSuccessfulDate
      ? new Date(`${state.lastSuccessfulDate}T00:00:00Z`)
      : new Date(end);
    start.setUTCDate(
      start.getUTCDate() - (state ? seoConfig.mixpanelOverlapDays : 90),
    );

    const host = process.env.MIXPANEL_DATA_HOST || "https://data.mixpanel.com";
    const url = new URL("/api/2.0/export", host);
    url.searchParams.set("project_id", projectId);
    url.searchParams.set("from_date", dateOnly(start));
    url.searchParams.set("to_date", dateOnly(end));
    url.searchParams.set("time_in_ms", "true");
    progress(`Mixpanel: downloading events from ${dateOnly(start)} to ${dateOnly(end)}`);
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
        "Accept-Encoding": "gzip",
      },
      signal: AbortSignal.timeout(
        Number.parseInt(process.env.MIXPANEL_TIMEOUT_MS || "300000", 10),
      ),
    });
    if (!response.ok) throw new Error(`Mixpanel export failed: ${response.status}`);

    const responseText = await response.text();
    progress(`Mixpanel: download complete (${(Buffer.byteLength(responseText) / 1_048_576).toFixed(1)} MB); parsing events`);
    const events = responseText
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as RawMixpanelEvent);
    if (events.length) {
      progress(`Mixpanel: upserting ${events.length.toLocaleString()} events into MongoDB`);
      await db.collection("mixpanel_events").bulkWrite(
        events.map((event) => {
          const properties = event.properties || {};
          const fallbackId = `${event.event}:${properties.time}:${properties.distinct_id || ""}`;
          return {
            updateOne: {
              filter: {
                projectId,
                eventId: properties.$insert_id || fallbackId,
              },
              update: {
                $set: {
                  projectId,
                  eventId: properties.$insert_id || fallbackId,
                  event: event.event || "unknown",
                  properties,
                  syncedAt: new Date(),
                },
              },
              upsert: true,
            },
          };
        }),
        { ordered: false },
      );
    }
    await db.collection("sync_state").updateOne(
      { source: "mixpanel" },
      { $set: { lastSuccessfulDate: dateOnly(end), updatedAt: new Date() } },
      { upsert: true },
    );
    progress("Mixpanel: sync complete");
    return `synced ${events.length.toLocaleString()} raw events (${dateOnly(start)} to ${dateOnly(end)})`;
  } finally {
    await mongo.close();
  }
}
