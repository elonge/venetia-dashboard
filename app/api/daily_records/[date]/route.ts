import { NextResponse } from 'next/server';
import { getDailyRecordByDate } from '@/lib/daily_records';
import { majorDailyEvents } from '@/major_daily_events';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;
    const dateString = decodeURIComponent(date);

    const normalizedDate = dateString.match(/^(\d{4})-(\d{2})-(\d{1,2})$/)
      ? dateString.replace(/^(\d{4})-(\d{2})-(\d)$/, '$1-$2-0$3')
      : dateString;

    let day = await getDailyRecordByDate(normalizedDate);
    
    // Try alternate format if not found
    if (!day && normalizedDate !== dateString) {
       day = await getDailyRecordByDate(dateString);
    }

    if (!day) {
        return NextResponse.json({ error: 'Daily record not found' }, { status: 404 });
    }

    // Attach major event if exists
    const event = majorDailyEvents.find(e => e.date === normalizedDate);
    const responseData = {
        ...day,
        major_event: event ? event.news : undefined
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in daily_records/[date] API:', error);
    return NextResponse.json({ error: 'Failed to fetch daily record' }, { status: 500 });
  }
}

