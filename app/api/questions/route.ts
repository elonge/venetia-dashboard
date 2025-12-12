import { NextResponse } from 'next/server';
import { getAllQuestions } from '@/lib/questions';

export async function GET() {
  try {
    const questions = await getAllQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error in questions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

