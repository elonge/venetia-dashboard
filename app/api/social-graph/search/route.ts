import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'primary_sources';
const ALIAS_COLLECTION = 'name_alias_collection';
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function generateSnippet(debugInfo: {canonicalName: string, docId: string}, text: string, aliases: string[]): string {
  const { canonicalName, docId } = debugInfo;
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
    console.log(`No matches found for aliases in text.`, docId, canonicalName, aliases);
    return ""
    // return text.substring(0, 300) + "...";
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
  
  // Get context (approx 30 words)
  const beforeText = text.substring(0, index);
  const afterText = text.substring(index + matchedString.length);
  
  const wordsBefore = beforeText.match(/\S+/g) || [];
  const wordsAfter = afterText.match(/\S+/g) || [];
  
  const snippetBefore = wordsBefore.slice(-30).join(" ");
  const snippetAfter = wordsAfter.slice(0, 30).join(" ");
  
  return `...${snippetBefore} <mark class="bg-yellow-200 text-stone-900 font-medium rounded-sm px-0.5">${matchedString}</mark> ${snippetAfter}...`;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeDateParam(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseDateBound(value: string | null, endOfDay: boolean): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return null;
  if (endOfDay) {
    parsed.setHours(23, 59, 59, 999);
  } else {
    parsed.setHours(0, 0, 0, 0);
  }
  return parsed;
}

function isSimpleDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const authorParam = searchParams.get('author');
  const recipientParam = searchParams.get('recipient');
  const fromParam = normalizeDateParam(searchParams.get('from'));
  const toParam = normalizeDateParam(searchParams.get('to'));
  const pageParam = Number(searchParams.get('page') ?? '1');
  const pageSizeParam = Number(searchParams.get('page_size') ?? DEFAULT_PAGE_SIZE);

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
  const pageSizeRaw = Number.isFinite(pageSizeParam) ? Math.floor(pageSizeParam) : DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(Math.max(pageSizeRaw, 1), MAX_PAGE_SIZE);

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
    console.log(`Resolved query "${query}" to canonical name "${canonicalName}"`); 
    
    // 2. Fetch all aliases for this canonical name to use for highlighting
    const allAliasesDocs = await aliasCollection.find({ canonical: canonicalName }).toArray();
    
    // Parse aliases to handle conditional authors: "Alias[[Author1, Author2]]"
    const parsedAliases = allAliasesDocs.map(d => {
      const match = d.alias.match(/^(.+?)(\[\[(.+)\]\])?$/);
      if (match) {
        return { 
          text: match[1].trim(), 
          authors: match[3] ? match[3].split(',').map((s: string) => s.trim()) : null
        };
      }
      return { text: d.alias, authors: null };
    });

    // Add canonical name as unconditional alias if not present
    if (!parsedAliases.some(p => p.text === canonicalName)) {
        parsedAliases.push({ text: canonicalName, authors: null });
    }

    // 3. Search Primary Sources
    // Note: User specified 'normalized_persons' as the field name
    // Also filtering out where the searched person is the author to reduce noise
    const filters: Record<string, any> = { 
      normalized_persons: canonicalName,
      author: { $ne: canonicalName }
    };

    if (authorParam?.trim()) {
      filters.author = { $regex: escapeRegex(authorParam.trim()), $options: 'i' };
    }

    if (recipientParam?.trim()) {
      filters.recipient = { $regex: escapeRegex(recipientParam.trim()), $options: 'i' };
    }

    const fromDate = parseDateBound(fromParam, false);
    const toDate = parseDateBound(toParam, true);
    const dateClauses: Array<{ date: Record<string, string | Date> }> = [];

    if (fromDate || toDate) {
      const range: Record<string, Date> = {};
      if (fromDate) range.$gte = fromDate;
      if (toDate) range.$lte = toDate;
      if (Object.keys(range).length > 0) {
        dateClauses.push({ date: range });
      }
    }

    const fromString = fromParam && isSimpleDate(fromParam) ? fromParam : null;
    const toString = toParam && isSimpleDate(toParam) ? toParam : null;
    if (fromString || toString) {
      const range: Record<string, string> = {};
      if (fromString) range.$gte = fromString;
      if (toString) range.$lte = toString;
      dateClauses.push({ date: range });
    }

    if (dateClauses.length === 1) {
      Object.assign(filters, dateClauses[0]);
    } else if (dateClauses.length > 1) {
      filters.$or = dateClauses;
    }

    const totalCount = await primaryCollection.countDocuments(filters);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(page, totalPages);
    const docs = await primaryCollection.find(filters)
      .sort({ date: 1 })
      .skip((safePage - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return NextResponse.json({
      resolved_name: canonicalName,
      query: query,
      count: docs.length,
      total_count: totalCount,
      page: safePage,
      page_size: pageSize,
      total_pages: totalPages,
      documents: docs.map(doc => {
        // Filter aliases based on document author
        const relevantAliases = parsedAliases
          .filter(a => !a.authors || (doc.author && a.authors.includes(doc.author)))
          .map(a => a.text);

        return {
          _id: doc._id,
          date: doc.date,
          author: doc.author,
          recipient: doc.recipient,
          full_text: doc.full_text || '',
          snippet: generateSnippet({ canonicalName, docId: doc._id.toString() }, doc.full_text || '', relevantAliases), 
          source_type: doc.source_type
        };
      }),
    });

  } catch (error) {
    console.error("Database search error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
