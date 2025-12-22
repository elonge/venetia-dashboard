import { NextResponse } from 'next/server';
import { getPreviousTimelineDay } from '@/lib/timeline_days';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateString = searchParams.get('date');
    
    if (!dateString) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }
    
    // Normalize date string
    const normalizedDate = dateString.match(/^(\d{4})-(\d{2})-(\d{1,2})$/)
      ? dateString.replace(/^(\d{4})-(\d{2})-(\d)$/, '$1-$2-0$3')
      : dateString;
    
    const previousDay = await getPreviousTimelineDay(normalizedDate);
    
    if (!previousDay) {
      return NextResponse.json(
        { error: 'No previous timeline day found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(previousDay);
  } catch (error) {
    console.error('Error in previous timeline day API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch previous timeline day' },
      { status: 500 }
    );
  }
}


