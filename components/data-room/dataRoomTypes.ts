export type ChartId = 'sentiment' | 'topics' | 'weekly-letter-count' | 'people' | 'meeting-dates';

export interface SentimentData {
  tension: Array<{ x: number; y: number }>;
  warmth: Array<{ x: number; y: number }>;
  anxiety: Array<{ x: number; y: number }>;
  dateRange: { start: string; end: string };
}

export interface TopicData {
  topic: string;
  value: number;
  color: string;
}

export interface DailyLetterCountData {
  data: Array<{ x: number; y: number }>;
  peak: { date: string; count: number };
  dateRange: { start: string; end: string };
}

export interface PeopleData {
  name: string;
  count: number;
}

export interface MeetingDatesData {
  dates: Array<{ date: string; meeting_details: string }>;
  total: number;
  dateRange: { start: string; end: string };
  timeline: Array<{ x: number; date: string }>;
}

export interface DataRoomData {
  sentiment: SentimentData;
  topics: TopicData[];
  dailyLetterCount: DailyLetterCountData;
  people: PeopleData[];
  meetingDates: MeetingDatesData;
}

export type ZoomKey = 'sentiment' | 'letterCount' | 'meetingDates';
export type ZoomState = { minX: number; maxX: number };

export interface TooltipState {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  value?: string;
  color?: string;
}

export const chartDefinitions: Array<{ id: ChartId; label: string; description: string }> = [
  { id: 'sentiment', label: 'Sentiment Over Time', description: 'Emotional tone across the correspondence' },
  { id: 'topics', label: 'Topic Frequency', description: 'Dominant themes bubbling up' },
  { id: 'weekly-letter-count', label: 'Weekly Letter Count', description: 'Rhythm of their correspondence' },
  { id: 'people', label: 'People Mentioned', description: 'Most cited figures in the archive' },
  { id: 'meeting-dates', label: 'Meeting Dates', description: 'When they met face to face' },
];

export const zoomDefaults: Record<ZoomKey, ZoomState> = {
  sentiment: { minX: 0, maxX: 200 },
  letterCount: { minX: 0, maxX: 200 },
  meetingDates: { minX: 0, maxX: 200 },
};

// React-Chrono theme configuration to match DataRoom dark theme
export const chronoTheme = {
  primary: '#4A7C59',           // Accent green color
  secondary: '#C8D5EA',          // Text color
  cardBgColor: '#0F1F34',        // Card background
  cardForeColor: '#C8D5EA',      // Card text color (description)
  titleColor: '#FFFFFF',         // Title color (date)
  titleColorActive: '#4A7C59',   // Active title color
};

