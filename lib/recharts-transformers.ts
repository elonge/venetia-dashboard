// Data transformation utilities for converting DataRoom data to recharts format

interface SentimentData {
  tension: Array<{ x: number; y: number; date?: string }>;
  warmth: Array<{ x: number; y: number; date?: string }>;
  anxiety: Array<{ x: number; y: number; date?: string }>;
  dateRange: { start: string; end: string };
}

interface DailyLetterCountData {
  data: Array<{ x: number; y: number }>;
  peak: { date: string; count: number };
  dateRange: { start: string; end: string };
  weeks: Array<{ weekStartDate: string; letterCount: number }>;
}

/**
 * Convert x coordinate (0-200) back to a date string
 * The x coordinate is scaled from the actual data range (first day to last day)
 */
function getDateFromX(x: number, dateRange: { start: string; end: string }): string {
  const ratio = x / 200;
  const startYear = parseInt(dateRange.start) || 1910;
  const endYear = parseInt(dateRange.end) || 1915;
  
  // Calculate approximate date within the range
  const startDate = new Date(startYear, 0, 1);
  const endDate = new Date(endYear, 11, 31);
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysFromStart = Math.floor(totalDays * ratio);
  
  const resultDate = new Date(startDate);
  resultDate.setDate(resultDate.getDate() + daysFromStart);
  
  const year = resultDate.getFullYear();
  const month = String(resultDate.getMonth() + 1).padStart(2, '0');
  const day = String(resultDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Convert y coordinate to actual value (inverted, y=10 is max, y=70 is min)
 */
function getValueFromY(y: number, minValue: number = 0, maxValue: number = 10): number {
  const yTop = 10;
  const yBottom = 70;
  const normalized = (yBottom - y) / (yBottom - yTop);
  return minValue + (maxValue - minValue) * normalized;
}

/**
 * Apply rolling average (moving average) to smooth data
 */
function applyRollingAverage(
  data: Array<{ date: string; value: number }>,
  windowSize: number = 30
): Array<{ date: string; value: number }> {
  if (data.length === 0) return [];
  if (windowSize <= 1) return data;

  const smoothed: Array<{ date: string; value: number }> = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(data.length - 1, i + halfWindow);
    const window = data.slice(start, end + 1);
    
    const sum = window.reduce((acc, item) => acc + item.value, 0);
    const average = sum / window.length;
    
    smoothed.push({
      date: data[i].date,
      value: average,
    });
  }

  return smoothed;
}

/**
 * Transform sentiment data to recharts format with separate series for small multiples
 */
export function transformSentimentToRecharts(
  data: SentimentData,
  windowSize: number = 30
): {
  tension: Array<{ date: string; value: number }>;
  warmth: Array<{ date: string; value: number }>;
  anxiety: Array<{ date: string; value: number }>;
} {
  // Process each sentiment line separately
  const tensionData: Array<{ date: string; value: number }> = [];
  const warmthData: Array<{ date: string; value: number }> = [];
  const anxietyData: Array<{ date: string; value: number }> = [];

  // Process tension
  data.tension.forEach((point) => {
    const date = point.date || getDateFromX(point.x, data.dateRange);
    const value = getValueFromY(point.y);
    tensionData.push({ date, value });
  });

  // Process warmth
  data.warmth.forEach((point) => {
    const date = point.date || getDateFromX(point.x, data.dateRange);
    const value = getValueFromY(point.y);
    warmthData.push({ date, value });
  });

  // Process anxiety
  data.anxiety.forEach((point) => {
    const date = point.date || getDateFromX(point.x, data.dateRange);
    const value = getValueFromY(point.y);
    anxietyData.push({ date, value });
  });

  // Sort by date
  tensionData.sort((a, b) => a.date.localeCompare(b.date));
  warmthData.sort((a, b) => a.date.localeCompare(b.date));
  anxietyData.sort((a, b) => a.date.localeCompare(b.date));

  // Apply rolling average smoothing
  return {
    tension: applyRollingAverage(tensionData, windowSize),
    warmth: applyRollingAverage(warmthData, windowSize),
    anxiety: applyRollingAverage(anxietyData, windowSize),
  };
}

/**
 * Transform weekly letter count data to recharts format
 */
export function transformWeeklyLetterCountToRecharts(data: DailyLetterCountData): Array<{
  date: string;
  letters: number;
}> {
  return data.weeks.map((week) => ({
    date: week.weekStartDate,
    letters: week.letterCount,
  })).sort((a, b) => a.date.localeCompare(b.date));
}

