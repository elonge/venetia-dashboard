'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, RotateCcw, X } from 'lucide-react';

type ChartId = 'sentiment' | 'topics' | 'weekly-letter-count' | 'people' | 'meeting-dates';

interface SentimentData {
  tension: Array<{ x: number; y: number }>;
  warmth: Array<{ x: number; y: number }>;
  anxiety: Array<{ x: number; y: number }>;
  dateRange: { start: string; end: string };
}

interface TopicData {
  topic: string;
  value: number;
  color: string;
}

interface DailyLetterCountData {
  data: Array<{ x: number; y: number }>;
  peak: { date: string; count: number };
  dateRange: { start: string; end: string };
}

interface PeopleData {
  name: string;
  count: number;
}

interface MeetingDatesData {
  dates: string[];
  total: number;
  dateRange: { start: string; end: string };
  timeline: Array<{ x: number; date: string }>;
}

interface DataRoomData {
  sentiment: SentimentData;
  topics: TopicData[];
  dailyLetterCount: DailyLetterCountData;
  people: PeopleData[];
  meetingDates: MeetingDatesData;
}

type ZoomKey = 'sentiment' | 'letterCount' | 'meetingDates';
type ZoomState = { minX: number; maxX: number };

interface TooltipState {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  value?: string;
  color?: string;
}

const chartDefinitions: Array<{ id: ChartId; label: string; description: string }> = [
  { id: 'sentiment', label: 'Sentiment Over Time', description: 'Emotional tone across the correspondence' },
  { id: 'topics', label: 'Topic Frequency', description: 'Dominant themes bubbling up' },
  { id: 'weekly-letter-count', label: 'Weekly Letter Count', description: 'Rhythm of their correspondence' },
  { id: 'people', label: 'People Mentioned', description: 'Most cited figures in the archive' },
  { id: 'meeting-dates', label: 'Meeting Dates', description: 'When they met face to face' },
];

const zoomDefaults: Record<ZoomKey, ZoomState> = {
  sentiment: { minX: 0, maxX: 200 },
  letterCount: { minX: 0, maxX: 200 },
  meetingDates: { minX: 0, maxX: 200 },
};

export default function DataRoom() {
  const [activeChartIndex, setActiveChartIndex] = useState(0);
  const [dataRoomData, setDataRoomData] = useState<DataRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [zoomStates, setZoomStates] = useState<Record<ZoomKey, ZoomState>>(zoomDefaults);
  const [brushDragging, setBrushDragging] = useState<ZoomKey | null>(null);
  const [brushStart, setBrushStart] = useState<number | null>(null);
  const brushRefs = useRef<Record<ZoomKey, SVGSVGElement | null>>({
    sentiment: null,
    letterCount: null,
    meetingDates: null,
  });

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const modalChartRef = useRef<HTMLDivElement | null>(null);

  const activeChart = chartDefinitions[activeChartIndex];

  useEffect(() => {
    async function fetchDataRoom() {
      try {
        const response = await fetch('/api/data-room');
        if (response.ok) {
          const data = await response.json();
          setDataRoomData(data);
        } else {
          console.error('Error fetching data room: HTTP', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error fetching data room:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDataRoom();
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!brushDragging || brushStart === null) return;
      const svg = brushRefs.current[brushDragging];
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 200;
      const clampedX = Math.max(0, Math.min(200, x));

      const minX = Math.min(brushStart, clampedX);
      const maxX = Math.max(brushStart, clampedX);

      if (maxX - minX < 10) return;

      setZoomStates((prev) => ({
        ...prev,
        [brushDragging]: { minX, maxX },
      }));
    };

    const handleGlobalMouseUp = () => {
      setBrushDragging(null);
      setBrushStart(null);
    };

    if (brushDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [brushDragging, brushStart]);

  const handleBrushMouseDown = (widgetId: ZoomKey, e: React.MouseEvent<SVGSVGElement>) => {
    const svg = brushRefs.current[widgetId];
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    const clampedX = Math.max(0, Math.min(200, x));

    setBrushDragging(widgetId);
    setBrushStart(clampedX);
    e.preventDefault();
  };

  const handleBrushMouseMove = (widgetId: ZoomKey, e: React.MouseEvent<SVGSVGElement>) => {
    if (!brushDragging || brushDragging !== widgetId || brushStart === null) return;
    const svg = brushRefs.current[widgetId];
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    const clampedX = Math.max(0, Math.min(200, x));

    const minX = Math.min(brushStart, clampedX);
    const maxX = Math.max(brushStart, clampedX);
    if (maxX - minX < 10) return;

    setZoomStates((prev) => ({
      ...prev,
      [widgetId]: { minX, maxX },
    }));
  };

  const handleBrushMouseUp = () => {
    setBrushDragging(null);
    setBrushStart(null);
  };

  const resetZoom = (key: ZoomKey) => {
    setZoomStates((prev) => ({ ...prev, [key]: zoomDefaults[key] }));
  };

  const transformPoints = (
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

  const getDateFromX = (x: number, dateRange: { start: string; end: string }): string => {
    const ratio = x / 200;
    const startYear = parseInt(dateRange.start) || 1910;
    const endYear = parseInt(dateRange.end) || 1915;
    const year = Math.round(startYear + (endYear - startYear) * ratio);
    return year.toString();
  };

  const getYValueFromY = (y: number, minValue: number = 0, maxValue: number = 10, yTop: number = 10, yBottom: number = 70): number => {
    const normalized = (yBottom - y) / (yBottom - yTop);
    return minValue + (maxValue - minValue) * normalized;
  };

  const generateHorizontalTicks = (minX: number, maxX: number, dateRange: { start: string; end: string }, numTicks: number = 5) => {
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

  const generateVerticalTicksSentiment = (numTicks: number = 5) => {
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

  const generateVerticalTicksLetterCount = (maxCount: number, numTicks: number = 5) => {
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

  const pointsToPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M${points[0].x},${points[0].y}`;
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    return sortedPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  };

  const handlePrevChart = () => {
    setActiveChartIndex((prev) => (prev === 0 ? chartDefinitions.length - 1 : prev - 1));
    setTooltip(null);
  };

  const handleNextChart = () => {
    setActiveChartIndex((prev) => (prev === chartDefinitions.length - 1 ? 0 : prev + 1));
    setTooltip(null);
  };

  const showTooltip = (e: React.MouseEvent<SVGElement | HTMLDivElement>, payload: Omit<TooltipState, 'x' | 'y'>) => {
    if (!modalChartRef.current) return;
    const rect = modalChartRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTooltip({ ...payload, x, y });
  };

  const hideTooltip = () => setTooltip(null);

  const chartZoomKey: Record<ChartId, ZoomKey | null> = {
    sentiment: 'sentiment',
    'weekly-letter-count': 'letterCount',
    'meeting-dates': 'meetingDates',
    topics: null,
    people: null,
  };

  const renderTooltip = () => {
    if (!tooltip) return null;
    return (
      <div
        className="absolute z-20 bg-[#0D1B2A] border border-[#23354D] rounded-md px-3 py-2 text-xs shadow-xl"
        style={{ left: `${tooltip.x}%`, top: `${tooltip.y}%`, transform: 'translate(-50%, -115%)' }}
      >
        <div className="font-semibold text-white">{tooltip.title}</div>
        {tooltip.subtitle && <div className="text-[#C8D5EA]">{tooltip.subtitle}</div>}
        {tooltip.value && (
          <div className="text-[#9EE6B3] font-semibold" style={{ color: tooltip.color || '#9EE6B3' }}>
            {tooltip.value}
          </div>
        )}
      </div>
    );
  };

  const renderSentiment = (variant: 'compact' | 'modal') => {
    if (!dataRoomData) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No sentiment data available
        </div>
      );
    }

    const zoom = zoomStates.sentiment;
    const transformedAnxiety = transformPoints(dataRoomData.sentiment.anxiety, zoom);
    const transformedWarmth = transformPoints(dataRoomData.sentiment.warmth, zoom);
    const transformedTension = transformPoints(dataRoomData.sentiment.tension, zoom);
    const horizontalTicks = generateHorizontalTicks(zoom.minX, zoom.maxX, dataRoomData.sentiment.dateRange, variant === 'modal' ? 7 : 5);
    const verticalTicks = generateVerticalTicksSentiment(variant === 'modal' ? 7 : 5);

    const showPoints = variant === 'modal';

    return (
      <div className={`${variant === 'modal' ? 'h-[360px]' : 'h-48'} bg-[#13243A] rounded relative p-4`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">Emotional tone across timeline</h4>
          {(zoom.minX !== 0 || zoom.maxX !== 200) && (
            <button
              onClick={() => resetZoom('sentiment')}
              className="text-xs text-[#C8D5EA] hover:text-white flex items-center gap-1 transition-colors"
              title="Reset zoom"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        <div className="w-full h-[calc(100%-64px)]">
          <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
            {verticalTicks.map((tick, idx) => (
              <g key={`v-${idx}`}>
                <line x1="0" y1={tick.y} x2="200" y2={tick.y} stroke="#4A7C59" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,2" />
                <line x1="0" y1={tick.y} x2="5" y2={tick.y} stroke="#C8D5EA" strokeWidth="1" />
                <text x="8" y={tick.y} textAnchor="start" dominantBaseline="middle" className="text-[8px] fill-[#C8D5EA]">
                  {tick.value.toFixed(1)}
                </text>
              </g>
            ))}
            {horizontalTicks.map((tick, idx) => (
              <g key={`h-${idx}`}>
                <line x1={tick.x} y1="0" x2={tick.x} y2="80" stroke="#4A7C59" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,2" />
                <line x1={tick.x} y1="70" x2={tick.x} y2="80" stroke="#C8D5EA" strokeWidth="1" />
                <text x={tick.x} y="75" textAnchor="middle" dominantBaseline="middle" className="text-[8px] fill-[#C8D5EA]">
                  {tick.label}
                </text>
              </g>
            ))}

            <path d={pointsToPath(transformedAnxiety)} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pointsToPath(transformedWarmth)} fill="none" stroke="#4A7C59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pointsToPath(transformedTension)} fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

            {showPoints &&
              [...transformedAnxiety.map((p) => ({ ...p, label: 'Emotional Desolation', color: '#F59E0B' })), ...transformedWarmth.map((p) => ({ ...p, label: 'Romantic Adoration', color: '#4A7C59' })), ...transformedTension.map((p) => ({ ...p, label: 'Political Unburdening', color: '#DC2626' }))]
                .map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r="3"
                    fill={p.color}
                    opacity={0.9}
                    onMouseMove={(e) =>
                      showTooltip(e, {
                        title: p.label,
                        value: getYValueFromY(p.y).toFixed(2),
                        subtitle: getDateFromX(p.originalX, dataRoomData.sentiment.dateRange),
                        color: p.color,
                      })
                    }
                    onMouseLeave={hideTooltip}
                  />
                ))}
          </svg>
        </div>
        <div className="flex gap-3 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <span className="text-[#EAF2FF]">Political Unburdening</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4A7C59]" />
            <span className="text-[#EAF2FF]">Romantic Adoration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-[#EAF2FF]">Emotional Desolation</span>
          </div>
        </div>
        {variant === 'modal' && (
          <div className="h-6 bg-[#0F1F34] rounded mt-3 relative overflow-hidden">
            <svg
              ref={(el) => (brushRefs.current.sentiment = el)}
              viewBox="0 0 200 20"
              className="w-full h-full cursor-crosshair"
              onMouseDown={(e) => handleBrushMouseDown('sentiment', e)}
              onMouseMove={(e) => handleBrushMouseMove('sentiment', e)}
              onMouseUp={handleBrushMouseUp}
              onMouseLeave={handleBrushMouseUp}
            >
              <line x1="0" y1="10" x2="200" y2="10" stroke="#4A7C59" strokeWidth="1" opacity="0.3" />
              <rect x={zoom.minX} y="0" width={zoom.maxX - zoom.minX} height="20" fill="#4A7C59" opacity="0.3" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  const renderTopics = (variant: 'compact' | 'modal') => {
    if (!dataRoomData || !dataRoomData.topics || dataRoomData.topics.length === 0) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No topics data available
        </div>
      );
    }

    return (
      <div className={`${variant === 'modal' ? 'h-[320px]' : 'h-48'} bg-[#13243A] rounded p-4 overflow-y-auto`}>
        <h4 className="text-sm font-semibold text-white mb-3">Dominant themes in correspondence</h4>
        <div className="space-y-3">
          {dataRoomData.topics.map((item) => (
            <div key={item.topic} className="group">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-medium">{item.topic}</span>
                <span className="text-[#C8D5EA] font-semibold">{item.value}%</span>
              </div>
              <div className="h-2.5 bg-[#15263E] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  onMouseMove={(e) =>
                    variant === 'modal' &&
                    showTooltip(e, { title: item.topic, value: `${item.value}%`, subtitle: 'Share of letters', color: item.color })
                  }
                  onMouseLeave={variant === 'modal' ? hideTooltip : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLetterCount = (variant: 'compact' | 'modal') => {
    if (!dataRoomData || !dataRoomData.dailyLetterCount) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No letter count data available
        </div>
      );
    }

    const zoom = zoomStates.letterCount;
    const transformedData = transformPoints(dataRoomData.dailyLetterCount.data, zoom);
    const peakPoint = dataRoomData.dailyLetterCount.data.reduce((min, p) => (p.y < min.y ? p : min));
    const isPeakVisible = peakPoint.x >= zoom.minX && peakPoint.x <= zoom.maxX;
    const transformedPeak = isPeakVisible
      ? {
          x: ((peakPoint.x - zoom.minX) / (zoom.maxX - zoom.minX || 1)) * 200,
          y: peakPoint.y,
          originalX: peakPoint.x,
        }
      : null;

    const horizontalTicks = generateHorizontalTicks(zoom.minX, zoom.maxX, dataRoomData.dailyLetterCount.dateRange, variant === 'modal' ? 7 : 5);
    const verticalTicks = generateVerticalTicksLetterCount(dataRoomData.dailyLetterCount.peak.count, variant === 'modal' ? 7 : 5);
    const showPoints = variant === 'modal';

    return (
      <div className={`${variant === 'modal' ? 'h-[340px]' : 'h-48'} bg-[#13243A] rounded p-4`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">Number of letters per week over time</h4>
          {(zoom.minX !== 0 || zoom.maxX !== 200) && (
            <button
              onClick={() => resetZoom('letterCount')}
              className="text-xs text-[#C8D5EA] hover:text-white flex items-center gap-1 transition-colors"
              title="Reset zoom"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        <div className="w-full h-[calc(100%-64px)]">
          <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
            {verticalTicks.map((tick, idx) => (
              <g key={`v-${idx}`}>
                <line x1="0" y1={tick.y} x2="200" y2={tick.y} stroke="#4A7C59" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,2" />
                <line x1="0" y1={tick.y} x2="5" y2={tick.y} stroke="#C8D5EA" strokeWidth="1" />
                <text x="8" y={tick.y} textAnchor="start" dominantBaseline="middle" className="text-[8px] fill-[#C8D5EA]">
                  {tick.value}
                </text>
              </g>
            ))}
            {horizontalTicks.map((tick, idx) => (
              <g key={`h-${idx}`}>
                <line x1={tick.x} y1="0" x2={tick.x} y2="80" stroke="#4A7C59" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,2" />
                <line x1={tick.x} y1="60" x2={tick.x} y2="80" stroke="#C8D5EA" strokeWidth="1" />
                <text x={tick.x} y="75" textAnchor="middle" dominantBaseline="middle" className="text-[8px] fill-[#C8D5EA]">
                  {tick.label}
                </text>
              </g>
            ))}

            <path d={pointsToPath(transformedData)} fill="none" stroke="#4A7C59" strokeWidth="2" />
            {transformedPeak && (
              <circle
                cx={transformedPeak.x}
                cy={transformedPeak.y}
                r="3"
                fill="#DC2626"
                onMouseMove={(e) =>
                  showTooltip(e, {
                    title: 'Peak correspondence',
                    value: `${dataRoomData.dailyLetterCount.peak.count} letters/week`,
                    subtitle: dataRoomData.dailyLetterCount.peak.date,
                    color: '#DC2626',
                  })
                }
                onMouseLeave={hideTooltip}
              />
            )}
            {showPoints &&
              transformedData.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  fill="#4A7C59"
                  opacity={0.9}
                  onMouseMove={(e) =>
                    showTooltip(e, {
                      title: 'Letters per week',
                      value: getYValueFromY(p.y, 0, dataRoomData.dailyLetterCount.peak.count).toFixed(1),
                      subtitle: getDateFromX(p.originalX, dataRoomData.dailyLetterCount.dateRange),
                      color: '#4A7C59',
                    })
                  }
                  onMouseLeave={hideTooltip}
                />
              ))}
          </svg>
        </div>
        <p className="text-sm text-[#C8D5EA] mt-3">
          Peak correspondence: {dataRoomData.dailyLetterCount.peak.date} ({dataRoomData.dailyLetterCount.peak.count} letters/week)
        </p>
        {variant === 'modal' && (
          <div className="h-6 bg-[#0F1F34] rounded mt-2 relative overflow-hidden">
            <svg
              ref={(el) => (brushRefs.current.letterCount = el)}
              viewBox="0 0 200 20"
              className="w-full h-full cursor-crosshair"
              onMouseDown={(e) => handleBrushMouseDown('letterCount', e)}
              onMouseMove={(e) => handleBrushMouseMove('letterCount', e)}
              onMouseUp={handleBrushMouseUp}
              onMouseLeave={handleBrushMouseUp}
            >
              <line x1="0" y1="10" x2="200" y2="10" stroke="#4A7C59" strokeWidth="1" opacity="0.3" />
              <rect x={zoom.minX} y="0" width={zoom.maxX - zoom.minX} height="20" fill="#4A7C59" opacity="0.3" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  const renderPeople = (variant: 'compact' | 'modal') => {
    if (!dataRoomData || !dataRoomData.people || dataRoomData.people.length === 0) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No people data available
        </div>
      );
    }

    return (
      <div className={`${variant === 'modal' ? 'h-[320px]' : 'h-48'} bg-[#13243A] rounded p-4 overflow-y-auto`}>
        <h4 className="text-sm font-semibold text-white mb-3">Most mentioned individuals</h4>
        <div className="space-y-3">
          {dataRoomData.people.map((person, idx) => (
            <div
              key={person.name}
              className="flex items-center justify-between text-sm bg-[#0F1F34] rounded px-3 py-2"
              onMouseMove={(e) =>
                variant === 'modal' &&
                showTooltip(e, { title: person.name, value: `${person.count} mentions`, subtitle: `Rank #${idx + 1}` })
              }
              onMouseLeave={variant === 'modal' ? hideTooltip : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="text-[#EAF2FF] w-5 font-medium">{idx + 1}.</span>
                <span className="text-white font-semibold">{person.name}</span>
              </div>
              <span className="text-[#9EE6B3] font-bold">{person.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMeetingDates = (variant: 'compact' | 'modal') => {
    if (!dataRoomData || !dataRoomData.meetingDates || dataRoomData.meetingDates.dates.length === 0) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No meeting dates data available
        </div>
      );
    }

    const zoom = zoomStates.meetingDates;
    const horizontalTicks = generateHorizontalTicks(zoom.minX, zoom.maxX, dataRoomData.meetingDates.dateRange, variant === 'modal' ? 7 : 5);

    return (
      <div className={`${variant === 'modal' ? 'h-[340px]' : 'h-48'} bg-[#13243A] rounded p-4`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Dates when they met</h4>
          {(zoom.minX !== 0 || zoom.maxX !== 200) && (
            <button
              onClick={() => resetZoom('meetingDates')}
              className="text-xs text-[#C8D5EA] hover:text-white flex items-center gap-1 transition-colors"
              title="Reset zoom"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        <div className="mb-3 text-sm text-[#C8D5EA]">
          <span className="text-white font-semibold">{dataRoomData.meetingDates.total}</span> meeting
          {dataRoomData.meetingDates.total !== 1 ? 's' : ''} recorded
          {dataRoomData.meetingDates.dateRange.start && dataRoomData.meetingDates.dateRange.end && (
            <span className="block mt-1 text-xs">
              {dataRoomData.meetingDates.dateRange.start} - {dataRoomData.meetingDates.dateRange.end}
            </span>
          )}
        </div>

        <div className="h-32 bg-[#0F1F34] rounded relative p-3 mb-3">
          <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
            {horizontalTicks.map((tick, idx) => (
              <g key={`h-${idx}`}>
                <line x1={tick.x} y1="0" x2={tick.x} y2="80" stroke="#4A7C59" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,2" />
                <line x1={tick.x} y1="40" x2={tick.x} y2="50" stroke="#C8D5EA" strokeWidth="1" />
                <text x={tick.x} y="45" textAnchor="middle" dominantBaseline="middle" className="text-[8px] fill-[#C8D5EA]">
                  {tick.label}
                </text>
              </g>
            ))}

            <line x1="0" y1="40" x2="200" y2="40" stroke="#4A7C59" strokeWidth="2" />

            {dataRoomData.meetingDates.timeline
              .filter((point) => point.x >= zoom.minX && point.x <= zoom.maxX)
              .map((point, idx) => {
                const transformedX = ((point.x - zoom.minX) / (zoom.maxX - zoom.minX || 1)) * 200;
                return (
                  <g key={idx}>
                    <line x1={transformedX} y1="35" x2={transformedX} y2="45" stroke="#4A7C59" strokeWidth="1.5" />
                    <g transform={`translate(${transformedX - 6}, 20)`}>
                      <circle
                        cx="4"
                        cy="6"
                        r="4"
                        stroke="#4A7C59"
                        strokeWidth="1.5"
                        fill="#0F1F34"
                        onMouseMove={(e) =>
                          showTooltip(e, { title: 'Meeting recorded', subtitle: point.date, value: 'Seen together' })
                        }
                        onMouseLeave={hideTooltip}
                      />
                      <circle cx="4" cy="5" r="1.5" fill="#4A7C59" />
                      <circle
                        cx="8"
                        cy="6"
                        r="4"
                        stroke="#4A7C59"
                        strokeWidth="1.5"
                        fill="#0F1F34"
                        onMouseMove={(e) =>
                          showTooltip(e, { title: 'Meeting recorded', subtitle: point.date, value: 'Seen together' })
                        }
                        onMouseLeave={hideTooltip}
                      />
                      <circle cx="8" cy="5" r="1.5" fill="#4A7C59" />
                    </g>
                  </g>
                );
              })}
          </svg>
        </div>

        {variant === 'modal' && (
          <div className="h-6 bg-[#0F1F34] rounded mb-3 relative overflow-hidden">
            <svg
              ref={(el) => (brushRefs.current.meetingDates = el)}
              viewBox="0 0 200 20"
              className="w-full h-full cursor-crosshair"
              onMouseDown={(e) => handleBrushMouseDown('meetingDates', e)}
              onMouseMove={(e) => handleBrushMouseMove('meetingDates', e)}
              onMouseUp={handleBrushMouseUp}
              onMouseLeave={handleBrushMouseUp}
            >
              <line x1="0" y1="10" x2="200" y2="10" stroke="#4A7C59" strokeWidth="1" opacity="0.3" />
              {dataRoomData.meetingDates.timeline.map((point, idx) => (
                <circle key={idx} cx={point.x} cy="10" r="1.5" fill="#4A7C59" opacity="0.6" />
              ))}
              <rect x={zoom.minX} y="0" width={zoom.maxX - zoom.minX} height="20" fill="#4A7C59" opacity="0.3" />
            </svg>
          </div>
        )}
        <div className="text-xs text-[#C8D5EA] space-y-1">
          {(() => {
            const dates = dataRoomData.meetingDates.dates.map((d) => {
              const [y, m, day] = d.split('-').map(Number);
              return new Date(y, m - 1, day);
            });

            const intervals: number[] = [];
            for (let i = 1; i < dates.length; i++) {
              const diff = Math.floor((dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
              intervals.push(diff);
            }

            const avgInterval = intervals.length > 0 ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : 0;
            return avgInterval > 0 ? <span>Average: {avgInterval} days between meetings</span> : null;
          })()}
        </div>
      </div>
    );
  };

  const renderActiveChart = (variant: 'compact' | 'modal') => {
    switch (activeChart.id) {
      case 'sentiment':
        return renderSentiment(variant);
      case 'topics':
        return renderTopics(variant);
      case 'weekly-letter-count':
        return renderLetterCount(variant);
      case 'people':
        return renderPeople(variant);
      case 'meeting-dates':
        return renderMeetingDates(variant);
      default:
        return null;
    }
  };

  const renderCarouselContent = () => {
    if (loading) {
      return <div className="h-48 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">Loading data...</div>;
    }
    return renderActiveChart('compact');
  };

  return (
    <div className="bg-[#0D1B2A] border border-[#23354D] rounded-lg p-5 mb-4 text-[#EAF2FF]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-semibold uppercase tracking-wide text-white mb-1">The Data Room</h3>
          <p className="text-sm text-[#C8D5EA]">A living analytical view of the Asquith–Venetia archive.</p>
          <p className="text-xs text-[#9AAFD0] mt-1">
            Browse all charts with the arrows; click to open the large navigator for zoom + tooltips.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevChart}
            className="p-2 rounded-full bg-[#15263E] hover:bg-[#1F3350] border border-[#1F3350] transition-colors"
            aria-label="Previous chart"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextChart}
            className="p-2 rounded-full bg-[#15263E] hover:bg-[#1F3350] border border-[#1F3350] transition-colors"
            aria-label="Next chart"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-[#9AAFD0]">Currently showing</div>
          <div className="text-lg font-semibold text-white">{activeChart.label}</div>
          <div className="text-sm text-[#C8D5EA]">{activeChart.description}</div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-[#4A7C59] text-white rounded-md text-sm font-semibold hover:bg-[#5A8C69] transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
          Open full room
        </button>
      </div>

      <div className="relative">
        <div className="rounded-lg overflow-hidden border border-[#1F3350] bg-[#101C2D]">{renderCarouselContent()}</div>
        <div className="flex justify-center gap-2 mt-3">
          {chartDefinitions.map((chart, idx) => (
            <button
              key={chart.id}
              onClick={() => setActiveChartIndex(idx)}
              className={`w-3 h-3 rounded-full ${idx === activeChartIndex ? 'bg-[#4A7C59]' : 'bg-[#23354D] hover:bg-[#2C4160]'}`}
              aria-label={`Go to ${chart.label}`}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6 py-10">
          <div className="relative w-[75vw] max-w-6xl h-[75vh] bg-[#0D1B2A] text-white rounded-2xl shadow-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-[#9AAFD0]">Data Room Navigator</div>
                <div className="text-2xl font-semibold text-white">{activeChart.label}</div>
                <div className="text-sm text-[#C8D5EA]">{activeChart.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevChart}
                  className="p-2 rounded-full bg-[#15263E] hover:bg-[#1F3350] border border-[#1F3350] transition-colors"
                  aria-label="Previous chart"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextChart}
                  className="p-2 rounded-full bg-[#15263E] hover:bg-[#1F3350] border border-[#1F3350] transition-colors"
                  aria-label="Next chart"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full bg-[#4A7C59] hover:bg-[#5A8C69] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={modalChartRef} className="relative flex-1 overflow-hidden rounded-xl border border-[#1F3350] bg-[#101C2D] p-4">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-[#C8D5EA]">Loading data...</div>
              ) : (
                renderActiveChart('modal')
              )}
              {renderTooltip()}
            </div>

            <div className="flex items-center justify-between text-xs text-[#C8D5EA] mt-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4A7C59]" />
                Drag the mini-map to zoom; hover for tooltips in this view.
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#23354D]" />
                {chartZoomKey[activeChart.id] ? 'Zoom persists as you change charts.' : 'No zoom controls for this chart.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
