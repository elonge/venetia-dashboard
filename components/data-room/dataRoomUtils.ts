import { ZoomState, ZoomKey, DataRoomData, SentimentData, DailyLetterCountData } from './dataRoomTypes';
import { TimeSeries, TimeRange, TimeRangeEvent } from 'pondjs';

export const transformPoints = (
  points: Array<{ x: number; y: number }>,
  zoom: ZoomState
): Array<{ x: number; y: number; originalX: number }> => {
  if (zoom.minX === 0 && zoom.maxX === 200) {
    return points.map((p) => ({ ...p, originalX: p.x }));
  }

  const zoomWidth = zoom.maxX - zoom.minX || 1;
  return points
    .filter((p) => p.x >= zoom.minX && p.x <= zoom.maxX)
    .map((p) => ({
      x: ((p.x - zoom.minX) / zoomWidth) * 200,
      y: p.y,
      originalX: p.x,
    }));
};

export const getDateFromX = (x: number, dateRange: { start: string; end: string }): string => {
  const ratio = x / 200;
  const startYear = parseInt(dateRange.start) || 1910;
  const endYear = parseInt(dateRange.end) || 1915;
  const year = Math.round(startYear + (endYear - startYear) * ratio);
  return year.toString();
};

export const getYValueFromY = (y: number, minValue: number = 0, maxValue: number = 10, yTop: number = 10, yBottom: number = 70): number => {
  const normalized = (yBottom - y) / (yBottom - yTop);
  return minValue + (maxValue - minValue) * normalized;
};

export const generateHorizontalTicks = (minX: number, maxX: number, dateRange: { start: string; end: string }, numTicks: number = 5) => {
  const ticks: Array<{ x: number; label: string }> = [];
  const zoomWidth = maxX - minX || 1;
  const tickSpacing = zoomWidth / (numTicks - 1);

  for (let i = 0; i < numTicks; i++) {
    const x = minX + i * tickSpacing;
    const transformedX = ((x - minX) / zoomWidth) * 200;
    const label = getDateFromX(x, dateRange);
    ticks.push({ x: transformedX, label });
  }

  return ticks;
};

export const generateVerticalTicksSentiment = (numTicks: number = 5) => {
  const ticks: Array<{ y: number; value: number }> = [];
  const yTop = 10;
  const yBottom = 70;
  const minValue = 0;
  const maxValue = 10;

  for (let i = 0; i < numTicks; i++) {
    const value = minValue + ((maxValue - minValue) * i) / (numTicks - 1);
    const y = yBottom - ((value - minValue) / (maxValue - minValue)) * (yBottom - yTop);
    ticks.push({ y, value });
  }

  return ticks;
};

export const generateVerticalTicksLetterCount = (maxCount: number, numTicks: number = 5) => {
  if (maxCount === 0) return [];
  const yTop = 10;
  const yBottom = 70;
  const minValue = 0;
  const ticks: Array<{ y: number; value: number }> = [];

  for (let i = 0; i < numTicks; i++) {
    const value = minValue + ((maxCount - minValue) * i) / (numTicks - 1);
    const y = yBottom - ((value - minValue) / (maxCount - minValue)) * (yBottom - yTop);
    ticks.push({ y, value: Math.round(value) });
  }

  return ticks;
};

export const pointsToPath = (points: Array<{ x: number; y: number }>) => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  return sortedPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
};

// Transform sentiment data to TimeSeries format for react-timeseries-charts
export const transformSentimentToTimeSeries = (sentimentData: SentimentData) => {
  // Helper to convert date string to Date
  const dateStringToDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Reverse the y coordinate scaling to get back original score (0-10)
  // Original scaling: score 0 -> yBottom (70), score 10 -> yTop (10)
  // y = yBottom - (score/10) * (yBottom - yTop)
  // So: score = ((yBottom - y) / (yBottom - yTop)) * 10
  const yToScore = (y: number): number => {
    const yTop = 10;
    const yBottom = 70;
    const normalized = (yBottom - y) / (yBottom - yTop);
    return Math.max(0, Math.min(10, normalized * 10));
  };

  // Transform each sentiment type - only use points with dates
  const tensionEvents = sentimentData.tension
    .filter(p => p.date)
    .map(p => ({
      timestamp: dateStringToDate(p.date!),
      value: yToScore(p.y),
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const warmthEvents = sentimentData.warmth
    .filter(p => p.date)
    .map(p => ({
      timestamp: dateStringToDate(p.date!),
      value: yToScore(p.y),
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const anxietyEvents = sentimentData.anxiety
    .filter(p => p.date)
    .map(p => ({
      timestamp: dateStringToDate(p.date!),
      value: yToScore(p.y),
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Create TimeSeries for each sentiment
  const tensionSeries = tensionEvents.length > 0
    ? new TimeSeries({
        name: 'tension',
        columns: ['time', 'tension'],
        points: tensionEvents.map(e => [e.timestamp.getTime(), e.value]),
      })
    : null;

  const warmthSeries = warmthEvents.length > 0
    ? new TimeSeries({
        name: 'warmth',
        columns: ['time', 'warmth'],
        points: warmthEvents.map(e => [e.timestamp.getTime(), e.value]),
      })
    : null;

  const anxietySeries = anxietyEvents.length > 0
    ? new TimeSeries({
        name: 'anxiety',
        columns: ['time', 'anxiety'],
        points: anxietyEvents.map(e => [e.timestamp.getTime(), e.value]),
      })
    : null;

  return { tensionSeries, warmthSeries, anxietySeries };
};

// Transform weekly letter count data to TimeSeries format
export const transformLetterCountToTimeSeries = (letterCountData: DailyLetterCountData) => {
  // Convert weekStartDate to timestamp and use letterCount as value
  const events = letterCountData.weeks
    .map(week => {
      const [year, month, day] = week.weekStartDate.split('-').map(Number);
      return {
        timestamp: new Date(year, month - 1, day),
        count: week.letterCount,
      };
    })
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  if (events.length === 0) {
    return null;
  }

  return new TimeSeries({
    name: 'letterCount',
    columns: ['time', 'count'],
    points: events.map(e => [e.timestamp.getTime(), e.count]),
  });
};

