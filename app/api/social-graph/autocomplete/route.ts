import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'venetia_project';
const ALIAS_COLLECTION = 'name_alias_collection';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(ALIAS_COLLECTION);

    // Find matching aliases
    const allMatches = await collection
      .find({ alias: { $regex: query, $options: 'i' } })
      .limit(30) // Fetch more to allow for filtering duplicates
      .project({ alias: 1, canonical: 1, _id: 0 })
      .toArray();

    // Show only the first alias for each distinct canonical name
    const seenCanonical = new Set<string>();
    const suggestions: any[] = [];

    for (const match of allMatches) {
      if (!seenCanonical.has(match.canonical)) {
        seenCanonical.add(match.canonical);
        suggestions.push(match);
      }
      if (suggestions.length >= 10) break;
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Autocomplete error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
