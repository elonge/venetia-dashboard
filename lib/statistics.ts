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

export interface GroupedStatisticsResult {
  _id: string;
  count: number;
}

export async function getGroupedPrimarySourceCount(
  filter: StatisticsFilter,
  groupBy: 'author' | 'recipient' | 'source_type' | 'year' | 'month' | 'year_month'
): Promise<GroupedStatisticsResult[]> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(ENTRIES_COLLECTION);

  const query: any = {};

  if (filter.dateRange) {
    const start = new Date(filter.dateRange.start);
    let end = new Date(filter.dateRange.end);
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

  let groupStage: any = {};

  switch (groupBy) {
    case 'author':
    case 'recipient':
    case 'source_type':
      groupStage = { _id: `$${groupBy}`, count: { $sum: 1 } };
      break;
    case 'year':
      groupStage = {
        _id: { $dateToString: { format: "%Y", date: "$date" } },
        count: { $sum: 1 }
      };
      break;
    case 'month':
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        count: { $sum: 1 }
      };
      break;
      case 'year_month':
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        count: { $sum: 1 }
      };
      break;
    default:
       groupStage = { _id: `$${groupBy}`, count: { $sum: 1 } };
  }

  try {
    const pipeline = [
      { $match: query },
      { $group: groupStage },
      { $sort: { count: -1 } as any } 
    ];

    const results = await collection.aggregate<GroupedStatisticsResult>(pipeline).toArray();
    return results;
  } catch (error) {
    console.error("Error grouping primary sources:", error);
    return [];
  }
}
