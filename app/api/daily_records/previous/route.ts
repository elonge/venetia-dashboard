import { NextResponse } from 'next/server';
import { getPreviousDailyRecordByDate } from '@/lib/daily_records';
import { majorDailyEvents } from '@/major_daily_events';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateString = searchParams.get('date');

    if (!dateString) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const normalizedDate = dateString.match(/^(\d{4})-(\d{2})-(\d{1,2})$/)
      ? dateString.replace(/^(\d{4})-(\d{2})-(\d)$/, '$1-$2-0$3')
      : dateString;

    const previousDay = await getPreviousDailyRecordByDate(normalizedDate);
    if (!previousDay) {
      return NextResponse.json({ error: 'No previous daily record found' }, { status: 404 });
    }

    // Attach major event if exists
    const dateStr = previousDay.date_string || (previousDay.date instanceof Date ? previousDay.date.toISOString().split('T')[0] : String(previousDay.date));
    const event = majorDailyEvents.find(e => e.date === dateStr);
    
    const responseData = {
        ...previousDay,
        major_event: event ? event.news : undefined
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in previous daily record API:', error);
    return NextResponse.json({ error: 'Failed to fetch previous daily record' }, { status: 500 });
  }
}

