// Data transformation utilities for converting DataRoom data to react-chrono TimelineItem format

import type { TimelineItem } from 'react-chrono';

interface MeetingDatesData {
  dates: Array<{ date: string; meeting_details: string }>;
  total: number;
  dateRange: { start: string; end: string };
  timeline: Array<{ x: number; date: string }>;
}

/**
 * Format a date string to a longer, more descriptive format
 */
function formatDateLong(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[month - 1];
  
  return `${monthName} ${day}, ${year}`;
}

interface WeeklyLetterCountData {
  weeks: Array<{ weekStartDate: string; letterCount: number }>;
  peak: { date: string; count: number };
  dateRange: { start: string; end: string };
}

/**
 * Transform meeting dates data into react-chrono TimelineItem format
 */
export function transformMeetingDatesToTimelineItems(
  meetingDatesData: MeetingDatesData
): TimelineItem[] {
  return meetingDatesData.dates.map((meeting) => {
    const longDate = formatDateLong(meeting.date);
    
    return {
      cardTitle: longDate,
      cardDetailedText: meeting.meeting_details || '',
    };
  });
}

/**
 * Transform weekly letter count data into react-chrono TimelineItem format
 */
export function transformWeeklyLetterCountToTimelineItems(
  letterCountData: WeeklyLetterCountData
): TimelineItem[] {
  return letterCountData.weeks.map((week) => {
    const longDate = formatDateLong(week.weekStartDate);
    const letterText = week.letterCount === 1 ? 'letter' : 'letters';
    
    return {
      cardTitle: longDate,
      cardDetailedText: `${week.letterCount} ${letterText} this week`,
    };
  });
}

