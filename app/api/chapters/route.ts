import { NextResponse } from 'next/server';
import { getAllChapters } from '@/lib/chapters';

export async function GET() {
  try {
    const chapters = await getAllChapters();
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Error in chapters API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}

