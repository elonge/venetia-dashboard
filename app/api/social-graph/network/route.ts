import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'primary_sources';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const pipeline = [
      {
        $match: {
          normalized_persons: { $exists: true, $ne: [] },
          author: { $exists: true, $ne: "" }
        }
      },
      {
        $project: {
          author: 1,
          normalized_persons: 1
        }
      },
      {
        $unwind: "$normalized_persons"
      },
      {
        $group: {
          _id: {
            source: "$author",
            target: "$normalized_persons"
          },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          $expr: { $ne: ["$_id.source", "$_id.target"] }
        }
      },
      {
        $sort: { count: -1 } as any
      },
      {
        $group: {
          _id: "$_id.source",
          mentions: { $push: { target: "$_id.target", value: "$count" } }
        }
      },
      {
        $project: {
          mentions: { $slice: ["$mentions", 20] } // Top 20 per author
        }
      },
      {
        $unwind: "$mentions"
      },
      {
        $project: {
          source: "$_id",
          target: "$mentions.target",
          value: "$mentions.value",
          _id: 0
        }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();

    // Transform to nodes/links format
    const nodesMap = new Map<string, { id: string, group: number, val: number }>();
    let links: any[] = [];

    results.forEach((item: any) => {
      const source = item.source;
      const target = item.target;
      const value = item.value;

      // Add nodes
      // Filter when source and target are the same
      if (source === target) return;
      // Source is always an author -> Group 1
      if (!nodesMap.has(source)) {
        nodesMap.set(source, { id: source, group: 1, val: 0 }); 
      } else {
        // Upgrade to group 1 if strictly mentioned before
        nodesMap.get(source)!.group = 1;
      }

      // Target is mentioned -> Group 2 (unless already Group 1)
      if (!nodesMap.has(target)) {
        nodesMap.set(target, { id: target, group: 2, val: 0 }); 
      }

      // Update node weight (degree)
      const sNode = nodesMap.get(source)!;
      const tNode = nodesMap.get(target)!;
      sNode.val += value;
      tNode.val += value;

      links.push({
        source,
        target,
        value
      });
    });
    const nodes = Array.from(nodesMap.values())

    return NextResponse.json({ nodes, links });

  } catch (error) {
    console.error("Network graph aggregation error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}