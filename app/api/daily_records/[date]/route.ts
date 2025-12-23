import { NextResponse } from 'next/server';
import { getDailyRecordByDate } from '@/lib/daily_records';

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

    const day = await getDailyRecordByDate(normalizedDate);
    if (!day) {
      const alt = normalizedDate !== dateString ? await getDailyRecordByDate(dateString) : null;
      if (!alt) {
        return NextResponse.json({ error: 'Daily record not found' }, { status: 404 });
      }
      return NextResponse.json(alt);
    }

    return NextResponse.json(day);
  } catch (error) {
    console.error('Error in daily_records/[date] API:', error);
    return NextResponse.json({ error: 'Failed to fetch daily record' }, { status: 500 });
  }
}

