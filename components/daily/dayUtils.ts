import { DayData } from './DailyWidget';

// Helper to parse date from datetime() format
function parseDateFromString(dateStr: string): string {
  // Handle datetime(1913, 1, 15) format
  const datetimeMatch = dateStr.match(/datetime\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (datetimeMatch) {
    const [, year, month, day] = datetimeMatch;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  
  // Already in YYYY-MM-DD format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  return dateStr;
}

// Helper to compare dates
function compareDates(date1: string, date2: string): number {
  const d1 = parseDateFromString(date1);
  const d2 = parseDateFromString(date2);
  return d1.localeCompare(d2);
}

/**
 * Get a day by date from an array of days
 */
export function getDayByDate(days: DayData[], date: string): DayData | null {
  const normalizedDate = parseDateFromString(date);
  console.log('normalizedDate', normalizedDate, days);
  return days.find(day => parseDateFromString(day.date) === normalizedDate) || null;
}

/**
 * Get the next day after the given date
 */
export function getNextDay(days: DayData[], currentDate: string): DayData | null {
  const sortedDays = [...days].sort((a, b) => compareDates(a.date, b.date));
  const currentIndex = sortedDays.findIndex(day => parseDateFromString(day.date) === parseDateFromString(currentDate));
  
  if (currentIndex === -1 || currentIndex === sortedDays.length - 1) {
    return null;
  }
  
  return sortedDays[currentIndex + 1];
}

/**
 * Get the previous day before the given date
 */
export function getPreviousDay(days: DayData[], currentDate: string): DayData | null {
  const sortedDays = [...days].sort((a, b) => compareDates(a.date, b.date));
  const currentIndex = sortedDays.findIndex(day => parseDateFromString(day.date) === parseDateFromString(currentDate));
  
  if (currentIndex === -1 || currentIndex === 0) {
    return null;
  }
  
  return sortedDays[currentIndex - 1];
}

/**
 * Load days from mock_days.json
 * Note: This assumes mock_days.json is imported or loaded as JSON
 */
export async function loadDaysFromMock(): Promise<DayData[]> {
  try {
    const response = await fetch('/mock_days.json');
    if (!response.ok) {
      throw new Error('Failed to load mock_days.json');
    }
    const data = await response.json();
    return data as DayData[];
  } catch (error) {
    console.error('Error loading days from mock_days.json:', error);
    return [];
  }
}

