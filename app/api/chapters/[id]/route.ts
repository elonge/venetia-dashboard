import { NextResponse } from 'next/server';
import { getChapterByChapterId } from '@/lib/chapters';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chapter = await getChapterByChapterId(id);
    
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Error in chapter API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    );
  }
}

