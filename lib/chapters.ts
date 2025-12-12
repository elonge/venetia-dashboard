import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'chapters';

export interface Location {
  name: string;
  lat: number;
  long: number;
}

export interface ChapterPerspectives {
  [key: string]: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface Chapter {
  _id: string;
  chapter_id: string;
  chapter_title: string;
  main_story: string;
  perspectives: ChapterPerspectives;
  fun_fact: string;
  locations: Location[];
  timeline?: TimelineEvent[];
  sources: string[];
}

/**
 * Fetch all chapters from the database
 */
export async function getAllChapters(): Promise<Chapter[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const chapters = await collection.find({}).toArray();
    const mappedChapters = chapters.map((chapter) => ({
      _id: chapter._id.toString(),
      chapter_id: chapter.chapter_id || '',
      chapter_title: chapter.chapter_title || '',
      main_story: chapter.main_story || '',
      perspectives: chapter.perspectives || {},
      fun_fact: chapter.fun_fact || '',
      locations: (chapter.locations || []).map((loc: any) => ({
        name: loc.name || '',
        lat: typeof loc.lat === 'object' && loc.lat.$numberDouble 
          ? parseFloat(loc.lat.$numberDouble) 
          : typeof loc.lat === 'number' 
          ? loc.lat 
          : 0,
        long: typeof loc.long === 'object' && loc.long.$numberDouble 
          ? parseFloat(loc.long.$numberDouble) 
          : typeof loc.long === 'number' 
          ? loc.long 
          : 0,
      })),
      timeline: chapter.timeline || [],
      sources: chapter.sources || [],
    }));
    return mappedChapters;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
}

/**
 * Fetch a specific chapter by ID
 */
export async function getChapterById(id: string): Promise<Chapter | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const chapter = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!chapter) {
      return null;
    }
    
    return {
      _id: chapter._id.toString(),
      chapter_id: chapter.chapter_id || '',
      chapter_title: chapter.chapter_title || '',
      main_story: chapter.main_story || '',
      perspectives: chapter.perspectives || {},
      fun_fact: chapter.fun_fact || '',
      locations: (chapter.locations || []).map((loc: any) => ({
        name: loc.name || '',
        lat: typeof loc.lat === 'object' && loc.lat.$numberDouble 
          ? parseFloat(loc.lat.$numberDouble) 
          : typeof loc.lat === 'number' 
          ? loc.lat 
          : 0,
        long: typeof loc.long === 'object' && loc.long.$numberDouble 
          ? parseFloat(loc.long.$numberDouble) 
          : typeof loc.long === 'number' 
          ? loc.long 
          : 0,
      })),
      timeline: chapter.timeline || [],
      sources: chapter.sources || [],
    };
  } catch (error) {
    console.error('Error fetching chapter by ID:', error);
    throw error;
  }
}

/**
 * Fetch a chapter by chapter_id (for URL-friendly routing)
 */
export async function getChapterByChapterId(chapterId: string): Promise<Chapter | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const chapter = await collection.findOne({ chapter_id: chapterId });
    
    if (!chapter) {
      return null;
    }
    
    return {
      _id: chapter._id.toString(),
      chapter_id: chapter.chapter_id || '',
      chapter_title: chapter.chapter_title || '',
      main_story: chapter.main_story || '',
      perspectives: chapter.perspectives || {},
      fun_fact: chapter.fun_fact || '',
      locations: (chapter.locations || []).map((loc: any) => ({
        name: loc.name || '',
        lat: typeof loc.lat === 'object' && loc.lat.$numberDouble 
          ? parseFloat(loc.lat.$numberDouble) 
          : typeof loc.lat === 'number' 
          ? loc.lat 
          : 0,
        long: typeof loc.long === 'object' && loc.long.$numberDouble 
          ? parseFloat(loc.long.$numberDouble) 
          : typeof loc.long === 'number' 
          ? loc.long 
          : 0,
      })),
      timeline: chapter.timeline || [],
      sources: chapter.sources || [],
    };
  } catch (error) {
    console.error('Error fetching chapter by chapter_id:', error);
    throw error;
  }
}

