// Data transformation utilities for converting DataRoom data to react-chrono TimelineItem format

import type { TimelineItem } from 'react-chrono';

interface MeetingDatesData {
  dates: string[];
  total: number;
  dateRange: { start: string; end: string };
  timeline: Array<{ x: number; date: string }>;
}

/**
 * Format a date string (YYYY-MM-DD) to a readable format
 */
function formatDateForTimeline(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[month - 1];
  
  return `${monthName} ${day}, ${year}`;
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

/**
 * Calculate days between consecutive meetings
 */
function calculateIntervals(dates: string[]): number[] {
  const intervals: number[] = [];
  for (let i = 1; i < dates.length; i++) {
    const [y1, m1, d1] = dates[i - 1].split('-').map(Number);
    const [y2, m2, d2] = dates[i].split('-').map(Number);
    const date1 = new Date(y1, m1 - 1, d1);
    const date2 = new Date(y2, m2 - 1, d2);
    const diff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
    intervals.push(diff);
  }
  return intervals;
}

/**
 * Transform meeting dates data into react-chrono TimelineItem format
 */
export function transformMeetingDatesToTimelineItems(
  meetingDatesData: MeetingDatesData
): TimelineItem[] {
  const intervals = calculateIntervals(meetingDatesData.dates);
  
  return meetingDatesData.dates.map((date, index) => {
    const formattedDate = formatDateForTimeline(date);
    const longDate = formatDateLong(date);
    
    // Calculate days since previous meeting (if not the first)
    const daysSinceLast = index > 0 ? intervals[index - 1] : null;
    
    let cardDetailedText = `Meeting recorded on ${longDate}.`;
    if (daysSinceLast !== null) {
      cardDetailedText += ` ${daysSinceLast} day${daysSinceLast !== 1 ? 's' : ''} since previous meeting.`;
    }
    
    return {
      title: formattedDate,
      cardTitle: longDate,
    //   cardSubtitle: longDate,
      cardDetailedText: cardDetailedText,
    };
  });
}

