import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { PEOPLE_DESCRIPTIONS } from '@/constants';

const DB_NAME = 'venetia_project';
const COLLECTION_NAME = 'people_bios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Try to find in MongoDB
    const personBio = await collection.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { id: name }
      ]
    });

    if (personBio) {
      return NextResponse.json(personBio);
    }

    // Fallback to constants
    const description = (PEOPLE_DESCRIPTIONS as any)[name];
    if (description) {
      return NextResponse.json({
        name,
        bio: description,
        source: 'constants'
      });
    }

    return NextResponse.json({ error: 'Person not found' }, { status: 404 });

  } catch (error) {
    console.error("Error fetching person bio:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
