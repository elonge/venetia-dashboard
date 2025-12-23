import { NextResponse } from 'next/server';
import { getAllDailyRecords } from '@/lib/daily_records';

export async function GET() {
  try {
    const days = await getAllDailyRecords();
    return NextResponse.json(days);
  } catch (error) {
    console.error('Error in daily_records API:', error);
    return NextResponse.json({ error: 'Failed to fetch daily records' }, { status: 500 });
  }
}

