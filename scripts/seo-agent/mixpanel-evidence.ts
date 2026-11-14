import { MongoClient } from "mongodb";
import { seoConfig } from "./config";
import type { MixpanelEvidence } from "./types";

export async function collectMixpanelEvidence(status: string): Promise<MixpanelEvidence> {
  if (!process.env.MONGODB_URI) return { status };
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const collection = client.db(seoConfig.mongoDatabase).collection("mixpanel_events");
    const [totalStoredEvents, topEvents, topPages, organicEvents] = await Promise.all([
      collection.countDocuments(),
      collection.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$event", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 20 },
      ]).toArray(),
      collection.aggregate<{ _id: string; count: number }>([
        { $project: { page: { $ifNull: ["$properties.current_url", { $ifNull: ["$properties.pathname", "$properties.page"] }] } } },
        { $match: { page: { $type: "string", $ne: "" } } },
        { $group: { _id: "$page", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 20 },
      ]).toArray(),
      collection.countDocuments({ $or: [
        { "properties.$initial_referring_domain": /google|bing/i },
        { "properties.$referring_domain": /google|bing/i },
        { "properties.utm_source": /google|bing/i },
        { "properties.$referrer": /google\.|bing\./i },
      ] }),
    ]);
    return {
      status, totalStoredEvents,
      topEvents: topEvents.map((item) => ({ event: item._id || "unknown", count: item.count })),
      topPages: topPages.map((item) => ({ page: item._id, count: item.count })),
      organicAttributionAvailable: organicEvents > 0, organicEvents,
    };
  } finally {
    await client.close();
  }
}
