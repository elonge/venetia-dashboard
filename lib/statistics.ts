import clientPromise from './mongodb';

const DB_NAME = 'venetia_project';
const ENTRIES_COLLECTION = 'primary_sources';

export interface StatisticsFilter {
  dateRange?: { start: string; end: string };
  author?: string;
  recipient?: string;
  source_type?: string;
}

export async function getPrimarySourceCount(filter: StatisticsFilter): Promise<number> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(ENTRIES_COLLECTION);
  
  const query: any = {};
  
  if (filter.dateRange) {
    const start = new Date(filter.dateRange.start);
    let end = new Date(filter.dateRange.end);
    // If start and end are the same, assume full day coverage
    if (filter.dateRange.start === filter.dateRange.end) {
        end.setDate(end.getDate() + 1);
    }
    
    query.date = { $gte: start, $lte: end };
  }
  
  if (filter.author) {
    query.author = { $regex: filter.author, $options: 'i' };
  }
  
  if (filter.recipient) {
    query.recipient = { $regex: filter.recipient, $options: 'i' };
  }

  if (filter.source_type) {
    query.source_type = filter.source_type;
  }
  
  try {
    const count = await collection.countDocuments(query);
    return count;
  } catch (error) {
    console.error("Error counting primary sources:", error);
    return 0;
  }
}
