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

  if (!day || !day.letters?.length || day.letters?.length < 1) {
    return {
      title: `Archive: ${date}`,
      description: 'No letters from Asquith to Venetia found for this date.',
      // 🛑 STOP GOOGLE HERE
      robots: {
        index: false,
        follow: true, // Let them follow links (like "Next Day"), but don't save this page
      },
    };
  }

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
