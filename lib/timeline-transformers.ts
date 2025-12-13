// Data transformation utilities for converting DataRoom data to vis.js Timeline format

export interface VisTimelineItem {
  id: string | number;
  start: Date;
  end?: Date;
  content: string;
  group?: string | number;
  className?: string;
  type?: 'box' | 'point' | 'range';
  title?: string;
  // Custom metadata for tooltips
  metadata?: {
    value?: number | string;
    label?: string;
    color?: string;
    date?: string;
  };
}

export interface VisTimelineGroup {
  id: string | number;
  content: string;
  className?: string;
}

/**
 * Convert normalized x coordinate (0-200) to Date based on date range
 */
export function xToDate(x: number, dateRange: { start: string; end: string }): Date {
  const ratio = x / 200;
  const startYear = parseInt(dateRange.start) || 1910;
  const endYear = parseInt(dateRange.end) || 1915;
  const year = startYear + (endYear - startYear) * ratio;
  // Use mid-year as the date
  return new Date(Math.round(year), 5, 15); // June 15th of the year
}

/**
 * Convert year string to Date
 */
export function yearStringToDate(yearStr: string): Date {
  const year = parseInt(yearStr) || 1910;
  return new Date(year, 5, 15); // June 15th
}

/**
 * Convert normalized x coordinate range to Date range
 */
export function xRangeToDateRange(
  minX: number,
  maxX: number,
  dateRange: { start: string; end: string }
): { start: Date; end: Date } {
  return {
    start: xToDate(minX, dateRange),
    end: xToDate(maxX, dateRange),
  };
}

/**
 * Convert Date range back to normalized x coordinates
 */
export function dateRangeToXRange(
  startDate: Date,
  endDate: Date,
  dateRange: { start: string; end: string }
): { minX: number; maxX: number } {
  const startYear = parseInt(dateRange.start) || 1910;
  const endYear = parseInt(dateRange.end) || 1915;
  const totalYears = endYear - startYear;
  
  const startYearNum = startDate.getFullYear();
  const endYearNum = endDate.getFullYear();
  
  const minX = ((startYearNum - startYear) / totalYears) * 200;
  const maxX = ((endYearNum - startYear) / totalYears) * 200;
  
  return {
    minX: Math.max(0, Math.min(200, minX)),
    maxX: Math.max(0, Math.min(200, maxX)),
  };
}

/**
 * Transform sentiment data to vis.js Timeline items with groups
 */
export function transformSentimentData(
  sentimentData: {
    tension: Array<{ x: number; y: number }>;
    warmth: Array<{ x: number; y: number }>;
    anxiety: Array<{ x: number; y: number }>;
    dateRange: { start: string; end: string };
  },
  zoomState?: { minX: number; maxX: number }
): { items: VisTimelineItem[]; groups: VisTimelineGroup[] } {
  const groups: VisTimelineGroup[] = [
    { id: 'tension', content: 'Political Unburdening', className: 'sentiment-tension' },
    { id: 'warmth', content: 'Romantic Adoration', className: 'sentiment-warmth' },
    { id: 'anxiety', content: 'Emotional Desolation', className: 'sentiment-anxiety' },
  ];

  const items: VisTimelineItem[] = [];
  const minX = zoomState?.minX ?? 0;
  const maxX = zoomState?.maxX ?? 200;

  // Transform tension data
  sentimentData.tension
    .filter((p) => p.x >= minX && p.x <= maxX)
    .forEach((point, idx) => {
      const date = xToDate(point.x, sentimentData.dateRange);
      items.push({
        id: `tension-${idx}`,
        start: date,
        content: `${point.y.toFixed(2)}`,
        group: 'tension',
        type: 'point',
        className: 'sentiment-point sentiment-tension',
        metadata: {
          value: point.y,
          label: 'Political Unburdening',
          color: '#DC2626',
          date: date.toISOString().split('T')[0],
        },
      });
    });

  // Transform warmth data
  sentimentData.warmth
    .filter((p) => p.x >= minX && p.x <= maxX)
    .forEach((point, idx) => {
      const date = xToDate(point.x, sentimentData.dateRange);
      items.push({
        id: `warmth-${idx}`,
        start: date,
        content: `${point.y.toFixed(2)}`,
        group: 'warmth',
        type: 'point',
        className: 'sentiment-point sentiment-warmth',
        metadata: {
          value: point.y,
          label: 'Romantic Adoration',
          color: '#4A7C59',
          date: date.toISOString().split('T')[0],
        },
      });
    });

  // Transform anxiety data
  sentimentData.anxiety
    .filter((p) => p.x >= minX && p.x <= maxX)
    .forEach((point, idx) => {
      const date = xToDate(point.x, sentimentData.dateRange);
      items.push({
        id: `anxiety-${idx}`,
        start: date,
        content: `${point.y.toFixed(2)}`,
        group: 'anxiety',
        type: 'point',
        className: 'sentiment-point sentiment-anxiety',
        metadata: {
          value: point.y,
          label: 'Emotional Desolation',
          color: '#F59E0B',
          date: date.toISOString().split('T')[0],
        },
      });
    });

  return { items, groups };
}

/**
 * Transform letter count data to vis.js Timeline items
 */
export function transformLetterCountData(
  letterCountData: {
    data: Array<{ x: number; y: number }>;
    peak: { date: string; count: number };
    dateRange: { start: string; end: string };
  },
  zoomState?: { minX: number; maxX: number }
): { items: VisTimelineItem[]; groups?: VisTimelineGroup[] } {
  const items: VisTimelineItem[] = [];
  const minX = zoomState?.minX ?? 0;
  const maxX = zoomState?.maxX ?? 200;

  // Find peak point
  const peakPoint = letterCountData.data.reduce((min, p) => (p.y < min.y ? p : min), letterCountData.data[0]);

  letterCountData.data
    .filter((p) => p.x >= minX && p.x <= maxX)
    .forEach((point, idx) => {
      const date = xToDate(point.x, letterCountData.dateRange);
      const isPeak = point.x === peakPoint.x && point.y === peakPoint.y;
      items.push({
        id: `letter-${idx}`,
        start: date,
        content: `${Math.round(point.y)}`,
        type: 'point',
        className: isPeak ? 'letter-point letter-peak' : 'letter-point',
        metadata: {
          value: point.y,
          label: isPeak ? 'Peak correspondence' : 'Letters per week',
          color: isPeak ? '#DC2626' : '#4A7C59',
          date: date.toISOString().split('T')[0],
        },
      });
    });

  return { items };
}

/**
 * Transform meeting dates data to vis.js Timeline items
 */
export function transformMeetingDatesData(
  meetingDatesData: {
    dates: string[];
    total: number;
    dateRange: { start: string; end: string };
    timeline: Array<{ x: number; date: string }>;
  },
  zoomState?: { minX: number; maxX: number }
): { items: VisTimelineItem[]; groups?: VisTimelineGroup[] } {
  const items: VisTimelineItem[] = [];
  const minX = zoomState?.minX ?? 0;
  const maxX = zoomState?.maxX ?? 200;

  meetingDatesData.timeline
    .filter((point) => point.x >= minX && point.x <= maxX)
    .forEach((point, idx) => {
      // Parse date string (format: YYYY-MM-DD)
      const [year, month, day] = point.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      items.push({
        id: `meeting-${idx}`,
        start: date,
        content: 'Meeting',
        type: 'point',
        className: 'meeting-point',
        metadata: {
          label: 'Meeting recorded',
          date: point.date,
          value: 'Seen together',
        },
      });
    });

  return { items };
}

