import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'popuplar_questions';

export interface QuestionAnswer {
  text: string;
  link: string;
}

export interface Question {
  _id: string;
  Question: string;
  Answer: QuestionAnswer[];
}

/**
 * Fetch all questions from the database
 */
export async function getAllQuestions(): Promise<Question[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const questions = await collection.find({}).toArray();
    
    return questions.map((q) => ({
      _id: q._id.toString(),
      Question: q.Question,
      Answer: q.Answer || [],
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

/**
 * Fetch a specific question by ID
 */
export async function getQuestionById(id: string): Promise<Question | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const question = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!question) {
      return null;
    }
    
    return {
      _id: question._id.toString(),
      Question: question.Question,
      Answer: question.Answer || [],
    };
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    throw error;
  }
}

/**
 * Fetch a question by question text (for URL-friendly routing)
 */
export async function getQuestionByText(questionText: string): Promise<Question | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const question = await collection.findOne({ Question: questionText });
    
    if (!question) {
      return null;
    }
    
    return {
      _id: question._id.toString(),
      Question: question.Question,
      Answer: question.Answer || [],
    };
  } catch (error) {
    console.error('Error fetching question by text:', error);
    throw error;
  }
}

