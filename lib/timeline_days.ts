import clientPromise from './mongodb';
import { DailyRecordDocument, DailyRecordLocation } from '@/types';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'daily_records';

/**
 * Fetch a timeline day by date string (format: YYYY-MM-DD)
 */
export async function getTimelineDayByDate(dateString: string): Promise<DailyRecordDocument | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<DailyRecordDocument>(COLLECTION_NAME);
    
    const day = await collection.findOne({ date_string: dateString });
    
    if (!day) {
      return null;
    }
    
    return day;
  } catch (error) {
    console.error('Error fetching timeline day by date:', error);
    throw error;
  }
}

/**
 * Get the next timeline day after the given date
 */
export async function getNextTimelineDay(dateString: string): Promise<DailyRecordDocument | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<DailyRecordDocument>(COLLECTION_NAME);
    
    const nextDay = await collection.findOne(
      { date_string: { $gt: dateString } },
      { sort: { date_string: 1 } }
    );
    
    if (!nextDay) {
      return null;
    }
    
    return nextDay;
  } catch (error) {
    console.error('Error fetching next timeline day:', error);
    throw error;
  }
}

/**
 * Get the previous timeline day before the given date
 */
export async function getPreviousTimelineDay(dateString: string): Promise<DailyRecordDocument | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<DailyRecordDocument>(COLLECTION_NAME);
    
    const previousDay = await collection.findOne(
      { date_string: { $lt: dateString } },
      { sort: { date_string: -1 } }
    );
    
    if (!previousDay) {
      return null;
    }
    
    return previousDay;
  } catch (error) {
    console.error('Error fetching previous timeline day:', error);
    throw error;
  }
}

/**
 * Fetch all timeline days
 */
export async function getAllTimelineDays(): Promise<DailyRecordDocument[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<DailyRecordDocument>(COLLECTION_NAME);
    
    const days = await collection.find({}).sort({ date_string: 1 }).toArray();
    
    return days;
  } catch (error) {
    console.error('Error fetching timeline days:', error);
    throw error;
  }
}
