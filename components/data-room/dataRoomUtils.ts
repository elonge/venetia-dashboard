import { ZoomState, ZoomKey, DataRoomData } from './dataRoomTypes';

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

