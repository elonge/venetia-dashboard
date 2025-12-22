import { NextResponse } from 'next/server';
import { getNextTimelineDay } from '@/lib/timeline_days';

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
    
    const nextDay = await getNextTimelineDay(normalizedDate);
    
    if (!nextDay) {
      return NextResponse.json(
        { error: 'No next timeline day found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(nextDay);
  } catch (error) {
    console.error('Error in next timeline day API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch next timeline day' },
      { status: 500 }
    );
  }
}


