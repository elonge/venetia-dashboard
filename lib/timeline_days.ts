import clientPromise from './mongodb';
import { TimelineDayDocument } from '@/types';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'timeline_days';

/**
 * Fetch a timeline day by date string (format: YYYY-MM-DD)
 */
export async function getTimelineDayByDate(dateString: string): Promise<TimelineDayDocument | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const day = await collection.findOne({ date_string: dateString });
    
    if (!day) {
      return null;
    }
    
    return mapDayToTimelineDayDocument(day);
  } catch (error) {
    console.error('Error fetching timeline day by date:', error);
    throw error;
  }
}

/**
 * Get the next timeline day after the given date
 */
export async function getNextTimelineDay(dateString: string): Promise<TimelineDayDocument | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const nextDay = await collection.findOne(
      { date_string: { $gt: dateString } },
      { sort: { date_string: 1 } }
    );
    
    if (!nextDay) {
      return null;
    }
    
    return mapDayToTimelineDayDocument(nextDay);
  } catch (error) {
    console.error('Error fetching next timeline day:', error);
    throw error;
  }
}

/**
 * Get the previous timeline day before the given date
 */
export async function getPreviousTimelineDay(dateString: string): Promise<TimelineDayDocument | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const previousDay = await collection.findOne(
      { date_string: { $lt: dateString } },
      { sort: { date_string: -1 } }
    );
    
    if (!previousDay) {
      return null;
    }
    
    return mapDayToTimelineDayDocument(previousDay);
  } catch (error) {
    console.error('Error fetching previous timeline day:', error);
    throw error;
  }
}

/**
 * Helper function to map a MongoDB document to TimelineDayDocument
 */
function mapDayToTimelineDayDocument(day: any): TimelineDayDocument {
  return {
    _id: day._id.toString(),
    date: day.date ? (typeof day.date === 'object' && '$date' in day.date 
      ? new Date(day.date.$date.$numberLong).toISOString()
      : day.date instanceof Date 
      ? day.date.toISOString()
      : String(day.date)) : '',
    date_string: day.date_string || '',
    prime_minister: {
      location: day.prime_minister?.location || '',
      meeting_with_venetia: day.prime_minister?.meeting_with_venetia || false,
      meeting_details: day.prime_minister?.meeting_details || '',
      letters_count: day.prime_minister?.letters_count || 0,
      letters: (day.prime_minister?.letters || []).map((letter: any) => ({
        summary: letter.summary || '',
        topics: letter.topics || [],
        count: typeof letter.count === 'object' && '$numberInt' in letter.count
          ? parseInt(letter.count.$numberInt)
          : typeof letter.count === 'object' && '$numberDouble' in letter.count
          ? parseFloat(letter.count.$numberDouble)
          : typeof letter.count === 'number'
          ? letter.count
          : 0,
        source_ref: letter.source_ref || letter.source || '',
      })),
      metrics: {
        emotional_score: typeof day.prime_minister?.metrics?.emotional_score === 'object' && '$numberInt' in day.prime_minister.metrics.emotional_score
          ? parseInt(day.prime_minister.metrics.emotional_score.$numberInt)
          : typeof day.prime_minister?.metrics?.emotional_score === 'object' && '$numberDouble' in day.prime_minister.metrics.emotional_score
          ? parseFloat(day.prime_minister.metrics.emotional_score.$numberDouble)
          : day.prime_minister?.metrics?.emotional_score || undefined,
        sharing_score: typeof day.prime_minister?.metrics?.sharing_score === 'object' && '$numberInt' in day.prime_minister.metrics.sharing_score
          ? parseInt(day.prime_minister.metrics.sharing_score.$numberInt)
          : typeof day.prime_minister?.metrics?.sharing_score === 'object' && '$numberDouble' in day.prime_minister.metrics.sharing_score
          ? parseFloat(day.prime_minister.metrics.sharing_score.$numberDouble)
          : day.prime_minister?.metrics?.sharing_score || undefined,
      },
    },
    venetia: {
      location: day.venetia?.location || '',
      activities: day.venetia?.activities || '',
      letters_to_edwin: (day.venetia?.letters_to_edwin || []).map((letter: any) => ({
        summary: letter.summary || '',
        topics: letter.topics || [],
        mood: letter.mood || '',
        pm_mentioned: letter.pm_mentioned || false,
        feelings_about_pm: letter.feelings_about_pm || null,
        pm_feelings_observed: letter.pm_feelings_observed || null,
        source: letter.source || '',
      })),
      inferred_letter_to_pm: day.venetia?.inferred_letter_to_pm || false,
    },
    context: {
      public_hansard: day.context?.public_hansard || '',
      secret_churchill: day.context?.secret_churchill || '',
    },
    diaries: (day.diaries || []).map((diary: any) => ({
      author: diary.author || '',
      is_diary_entry: diary.is_diary_entry || false,
      location: diary.location || '',
      entry: diary.entry || '',
      pm_mood_observation: diary.pm_mood_observation || '',
      venetia_mention: diary.venetia_mention || '',
      source: diary.source || '',
    })),
  };
}

/**
 * Fetch all timeline days
 */
export async function getAllTimelineDays(): Promise<TimelineDayDocument[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const days = await collection.find({}).sort({ date_string: 1 }).toArray();
    
    return days.map((day) => mapDayToTimelineDayDocument(day));
  } catch (error) {
    console.error('Error fetching timeline days:', error);
    throw error;
  }
}

