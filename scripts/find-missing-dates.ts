import { eachDayOfInterval, format, startOfYear, endOfYear } from 'date-fns';
import { majorDailyEvents } from '../major_daily_events';

const YEARS_TO_CHECK = [1912, 1913, 1914, 1915, 1916];

async function main() {
  console.log('Checking for missing and duplicate dates in majorDailyEvents...\n');

  // Check for Duplicates first
  const dateCounts = new Map<string, number>();
  const duplicates: string[] = [];
  
  for (const event of majorDailyEvents) {
    const count = (dateCounts.get(event.date) || 0) + 1;
    dateCounts.set(event.date, count);
    if (count === 2) {
      duplicates.push(event.date);
    }
  }

  if (duplicates.length > 0) {
    console.log(`--- DUPLICATES FOUND (${duplicates.length}) ---`);
    console.log(duplicates.sort().join(', '));
    console.log('\n');
  } else {
    console.log('--- NO DUPLICATES FOUND ---\n');
  }

  // Check for Missing Dates
  const existingDates = new Set(majorDailyEvents.map(event => event.date));
  let totalMissing = 0;

  for (const year of YEARS_TO_CHECK) {
    const startDate = startOfYear(new Date(year, 0, 1));
    const endDate = endOfYear(new Date(year, 0, 1));
    
    const allDatesInYear = eachDayOfInterval({ start: startDate, end: endDate });
    const missingDates: string[] = [];

    for (const date of allDatesInYear) {
      const dateString = format(date, 'yyyy-MM-dd');
      if (!existingDates.has(dateString)) {
        missingDates.push(dateString);
      }
    }

    if (missingDates.length > 0) {
      console.log(`--- ${year} (${missingDates.length} missing) ---`);
      for (let i = 0; i < missingDates.length; i += 5) {
          console.log(missingDates.slice(i, i + 5).join(', '));
      }
      totalMissing += missingDates.length;
      console.log(''); 
    } else {
      console.log(`--- ${year} (Complete) ---\n`);
    }
  }

  console.log(`Total missing dates across all years: ${totalMissing}`);
}

main().catch(console.error);
