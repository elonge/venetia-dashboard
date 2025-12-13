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

