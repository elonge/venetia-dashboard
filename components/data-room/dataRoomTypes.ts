export type ChartId =
  | 'sentiment'
  | 'topics'
  | 'weekly-letter-count'
  | 'people'
  | 'meeting-dates'
  | 'asquith_venetia_proximity';

export interface SentimentData {
  tension: Array<{ x: number; y: number; date?: string }>;
  warmth: Array<{ x: number; y: number; date?: string }>;
  anxiety: Array<{ x: number; y: number; date?: string }>;
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
  weeks: Array<{ weekStartDate: string; letterCount: number }>; // Weekly data with dates for react-chrono
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

export interface AsquithVenetiaProximityData {
  points: Array<{
    date: string;
    distance_km: number;
    status?: string;
    calculated_from?: { pm?: string; venetia?: string };
    geo_coords: { pm: { lat: number; lng: number }; venetia: { lat: number; lng: number } };
  }>;
  dateRange: { start: string; end: string };
  maxDistanceKm: number;
}

export interface DataRoomData {
  sentiment: SentimentData;
  topics: TopicData[];
  dailyLetterCount: DailyLetterCountData;
  people: PeopleData[];
  meetingDates: MeetingDatesData;
  asquithVenetiaProximity: AsquithVenetiaProximityData;
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
  { id: 'meeting-dates', label: 'Meeting Dates', description: 'When they met face to face' },
  {
    id: 'asquith_venetia_proximity',
    label: 'Proximity Timeline',
    description: 'Distance between their inferred locations',
  },
  { id: 'sentiment', label: 'Sentiment Over Time', description: 'Emotional tone across the correspondence' },
  { id: 'topics', label: 'Topic Frequency', description: 'Dominant themes bubbling up' },
  { id: 'weekly-letter-count', label: 'Weekly Letter Count', description: 'Rhythm of their correspondence' },
  { id: 'people', label: 'People Mentioned', description: 'Most cited figures in the archive' },
];

export const zoomDefaults: Record<ZoomKey, ZoomState> = {
  sentiment: { minX: 0, maxX: 200 },
  letterCount: { minX: 0, maxX: 200 },
  meetingDates: { minX: 0, maxX: 200 },
};

// React-Chrono theme configuration to match site palette
export const chronoTheme = {
  primary: '#4A7C59',
  secondary: '#1A2A40',
  cardBgColor: '#F5F0E8',
  cardForeColor: '#1A2A40',
  titleColor: '#1A2A40',
  titleColorActive: '#4A7C59',
};
