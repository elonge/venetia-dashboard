import { NextResponse } from 'next/server';
import { getTimelineDayByDate } from '@/lib/timeline_days';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;
    // Decode the date parameter (in case it's URL encoded)
    const dateString = decodeURIComponent(date);
    
    // Normalize date string to ensure it's in YYYY-MM-DD format
    // Handle cases like "1915-05-1" -> "1915-05-01"
    // Match pattern: YYYY-MM-D where D is a single digit at the end
    const normalizedDate = dateString.match(/^(\d{4})-(\d{2})-(\d{1,2})$/)
      ? dateString.replace(/^(\d{4})-(\d{2})-(\d)$/, '$1-$2-0$3') // Single digit day
      : dateString;
    
    const timelineDay = await getTimelineDayByDate(normalizedDate);
    
    if (!timelineDay) {
      // Try the original date string as well in case normalization changed it incorrectly
      const altTimelineDay = normalizedDate !== dateString 
        ? await getTimelineDayByDate(dateString)
        : null;
      
      if (!altTimelineDay) {
        return NextResponse.json(
          { error: 'Timeline day not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(altTimelineDay);
    }
    
    return NextResponse.json(timelineDay);
  } catch (error) {
    console.error('Error in timeline_days API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline day' },
      { status: 500 }
    );
  }
}

