import { Metadata } from 'next';
import { getDailyRecordByDate, getNextDailyRecordByDate, getPreviousDailyRecordByDate } from '@/lib/daily_records';
import { normalizeDayDate } from '@/components/daily/dayUtils';
import DailyPageClient from '@/components/daily/DailyPageClient';

type Props = {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const normalizedDate = normalizeDayDate(decodeURIComponent(date));
  const day = await getDailyRecordByDate(normalizedDate);

  if (!day) return { title: 'Day Not Found | The Venetia Project' };

  return {
    title: `Daily Entry: ${normalizedDate} | The Venetia Project`,
    description: `Daily activities and correspondence for ${normalizedDate}. Letters: ${day.total_number_letters || 0}.`,
  };
}

export default async function DailyPage({ params }: Props) {
  const { date } = await params;
  const normalizedDate = normalizeDayDate(decodeURIComponent(date));
  
  // Parallel fetch for performance
  const [day, nextDay, prevDay] = await Promise.all([
    getDailyRecordByDate(normalizedDate),
    getNextDailyRecordByDate(normalizedDate),
    getPreviousDailyRecordByDate(normalizedDate)
  ]);

  return (
    <DailyPageClient 
        day={day} 
        date={normalizedDate}
        nextDate={nextDay ? normalizeDayDate(nextDay.date) : null}
        prevDate={prevDay ? normalizeDayDate(prevDay.date) : null}
    />
  );
}
