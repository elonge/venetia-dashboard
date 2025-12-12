import { NextResponse } from 'next/server';
import { getQuestionById } from '@/lib/questions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const question = await getQuestionById(id);
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(question);
  } catch (error) {
    console.error('Error in question API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

