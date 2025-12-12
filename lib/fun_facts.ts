import clientPromise from './mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'fun_facts';

export interface FunFact {
  _id: string;
  fact: string;
  tags?: string[];
  source?: string;
  // Add other fields if they exist in the DB
  [key: string]: any;
}

/**
 * Fetch all fun facts from the database
 */
export async function getAllFunFacts(): Promise<FunFact[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const funFacts = await collection.find({}).toArray();
    const mappedFunFacts = funFacts.map((fact) => ({
      _id: fact._id.toString(),
      fact: fact.fact || fact.text || fact.content || '',
      tags: fact.tags || [],
      source: fact.source || '',
      ...fact,
    }));
    return mappedFunFacts;
  } catch (error) {
    console.error('Error fetching fun facts:', error);
    throw error;
  }
}

