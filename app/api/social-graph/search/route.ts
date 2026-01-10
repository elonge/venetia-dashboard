import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'primary_sources';
const ALIAS_COLLECTION = 'name_alias_collection';

function generateSnippet(text: string, aliases: string[]): string {
  if (!text) return "";
  
  // Escape regex special chars in aliases and sort by length
  const escapedAliases = aliases
    .filter(a => a && a.trim().length > 0)
    .map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length);
  
  if (escapedAliases.length === 0) return text.substring(0, 300) + "...";

  // Find all matches
  const pattern = new RegExp(`(${escapedAliases.join('|')})`, 'gi');
  const matches = Array.from(text.matchAll(pattern));
  
  if (matches.length === 0) {
      return text.substring(0, 300) + "...";
  }
  
  // Find the match with the longest string length
  let bestMatch = matches[0];
  for (const m of matches) {
      if (m[0].length > bestMatch[0].length) {
          bestMatch = m;
      }
  }
  
  const index = bestMatch.index!;
  const matchedString = bestMatch[0];
  
  // Get context (approx 10 words)
  const beforeText = text.substring(0, index);
  const afterText = text.substring(index + matchedString.length);
  
  const wordsBefore = beforeText.match(/\S+/g) || [];
  const wordsAfter = afterText.match(/\S+/g) || [];
  
  const snippetBefore = wordsBefore.slice(-10).join(" ");
  const snippetAfter = wordsAfter.slice(0, 10).join(" ");
  
  return `...${snippetBefore} <mark class="bg-yellow-200 text-stone-900 font-medium rounded-sm px-0.5">${matchedString}</mark> ${snippetAfter}...`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const aliasCollection = db.collection(ALIAS_COLLECTION);
    const primaryCollection = db.collection(COLLECTION_NAME);

    // 1. Resolve Name
    let canonicalName = query;
    const aliasDoc = await aliasCollection.findOne({ alias: { $regex: new RegExp(`^${query}$`, 'i') } });
    
    if (aliasDoc) {
        canonicalName = aliasDoc.canonical;
    } 
    
    // 2. Fetch all aliases for this canonical name to use for highlighting
    const allAliasesDocs = await aliasCollection.find({ canonical: canonicalName }).toArray();
    const allAliases = allAliasesDocs.map(d => d.alias);
    if (!allAliases.includes(canonicalName)) {
        allAliases.push(canonicalName);
    }

    // 3. Search Primary Sources
    // Note: User specified 'normalized_persons' as the field name
    const docs = await primaryCollection.find({
      normalized_persons: canonicalName
    }).limit(100).toArray();

    return NextResponse.json({
      resolved_name: canonicalName,
      query: query,
      count: docs.length,
      documents: docs.map(doc => ({
        _id: doc._id,
        date: doc.date,
        author: doc.author,
        recipient: doc.recipient,
        full_text: doc.full_text || '',
        snippet: generateSnippet(doc.full_text || '', allAliases), // Generate snippet
        source_type: doc.source_type
      }))
    });

  } catch (error) {
    console.error("Database search error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
