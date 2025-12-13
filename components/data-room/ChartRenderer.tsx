'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Chrono } from 'react-chrono';
import 'react-chrono/dist/style.css';
import { transformMeetingDatesToTimelineItems } from '@/lib/react-chrono-transformers';
import {
  DataRoomData,
  ChartId,
  ZoomState,
  TooltipState,
  chronoTheme,
} from './dataRoomTypes';
import {
  transformPoints,
  getDateFromX,
  getYValueFromY,
  generateHorizontalTicks,
  generateVerticalTicksSentiment,
  generateVerticalTicksLetterCount,
  pointsToPath,
} from './dataRoomUtils';

interface ChartRendererProps {
  dataRoomData: DataRoomData | null;
  activeChartId: ChartId;
  variant: 'compact' | 'modal';
  zoomStates: {
    sentiment: ZoomState;
    letterCount: ZoomState;
    meetingDates: ZoomState;
  };
  onResetZoom: (key: 'sentiment' | 'letterCount') => void;
  onShowTooltip: (e: React.MouseEvent<SVGElement | HTMLDivElement>, payload: Omit<TooltipState, 'x' | 'y'>) => void;
  onHideTooltip: () => void;
  brushRefs?: {
    sentiment: SVGSVGElement | null;
    letterCount: SVGSVGElement | null;
    meetingDates: SVGSVGElement | null;
  };
  onBrushMouseDown?: (widgetId: 'sentiment' | 'letterCount', e: React.MouseEvent<SVGSVGElement>) => void;
  onBrushMouseMove?: (widgetId: 'sentiment' | 'letterCount', e: React.MouseEvent<SVGSVGElement>) => void;
  onBrushMouseUp?: () => void;
}

export default function ChartRenderer({
  dataRoomData,
  activeChartId,
  variant,
  zoomStates,
  onResetZoom,
  onShowTooltip,
  onHideTooltip,
  brushRefs,
  onBrushMouseDown,
  onBrushMouseMove,
  onBrushMouseUp,
}: ChartRendererProps) {
  const renderSentiment = () => {
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
    const horizontalTicks = generateHorizontalTicks(zoom.minX, zoom.maxX, dataRoomData.sentiment.dateRange, variant === 'modal' ? 9 : 5);
    const verticalTicks = generateVerticalTicksSentiment(variant === 'modal' ? 7 : 5);

    const showPoints = variant === 'modal';

    return (
      <div className={`${variant === 'modal' ? 'h-[360px]' : 'h-48'} bg-[#13243A] rounded relative p-4`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">Emotional tone across timeline</h4>
          {(zoom.minX !== 0 || zoom.maxX !== 200) && (
            <button
              onClick={() => onResetZoom('sentiment')}
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
                      onShowTooltip(e, {
                        title: p.label,
                        value: getYValueFromY(p.y).toFixed(2),
                        subtitle: getDateFromX(p.originalX, dataRoomData.sentiment.dateRange),
                        color: p.color,
                      })
                    }
                    onMouseLeave={onHideTooltip}
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
        {variant === 'modal' && brushRefs && onBrushMouseDown && onBrushMouseMove && onBrushMouseUp && (
          <div className="h-6 bg-[#0F1F34] rounded mt-3 relative overflow-hidden">
            <svg
              ref={(el) => {
                if (brushRefs) brushRefs.sentiment = el;
              }}
              viewBox="0 0 200 20"
              className="w-full h-full cursor-crosshair"
              onMouseDown={(e) => onBrushMouseDown('sentiment', e)}
              onMouseMove={(e) => onBrushMouseMove('sentiment', e)}
              onMouseUp={onBrushMouseUp}
              onMouseLeave={onBrushMouseUp}
            >
              <line x1="0" y1="10" x2="200" y2="10" stroke="#4A7C59" strokeWidth="1" opacity="0.3" />
              <rect x={zoom.minX} y="0" width={zoom.maxX - zoom.minX} height="20" fill="#4A7C59" opacity="0.3" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  const renderTopics = () => {
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
                    onShowTooltip(e, { title: item.topic, value: `${item.value}%`, subtitle: 'Share of letters', color: item.color })
                  }
                  onMouseLeave={variant === 'modal' ? onHideTooltip : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLetterCount = () => {
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

    const horizontalTicks = generateHorizontalTicks(zoom.minX, zoom.maxX, dataRoomData.dailyLetterCount.dateRange, variant === 'modal' ? 9 : 5);
    const verticalTicks = generateVerticalTicksLetterCount(dataRoomData.dailyLetterCount.peak.count, variant === 'modal' ? 7 : 5);
    const showPoints = variant === 'modal';

    return (
      <div className={`${variant === 'modal' ? 'h-[340px]' : 'h-48'} bg-[#13243A] rounded p-4`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">Number of letters per week over time</h4>
          {(zoom.minX !== 0 || zoom.maxX !== 200) && (
            <button
              onClick={() => onResetZoom('letterCount')}
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
                  onShowTooltip(e, {
                    title: 'Peak correspondence',
                    value: `${dataRoomData.dailyLetterCount.peak.count} letters/week`,
                    subtitle: dataRoomData.dailyLetterCount.peak.date,
                    color: '#DC2626',
                  })
                }
                onMouseLeave={onHideTooltip}
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
                    onShowTooltip(e, {
                      title: 'Letters per week',
                      value: getYValueFromY(p.y, 0, dataRoomData.dailyLetterCount.peak.count).toFixed(1),
                      subtitle: getDateFromX(p.originalX, dataRoomData.dailyLetterCount.dateRange),
                      color: '#4A7C59',
                    })
                  }
                  onMouseLeave={onHideTooltip}
                />
              ))}
          </svg>
        </div>
        <p className="text-sm text-[#C8D5EA] mt-3">
          Peak correspondence: {dataRoomData.dailyLetterCount.peak.date} ({dataRoomData.dailyLetterCount.peak.count} letters/week)
        </p>
        {variant === 'modal' && brushRefs && onBrushMouseDown && onBrushMouseMove && onBrushMouseUp && (
          <div className="h-6 bg-[#0F1F34] rounded mt-2 relative overflow-hidden">
            <svg
              ref={(el) => {
                if (brushRefs) brushRefs.letterCount = el;
              }}
              viewBox="0 0 200 20"
              className="w-full h-full cursor-crosshair"
              onMouseDown={(e) => onBrushMouseDown('letterCount', e)}
              onMouseMove={(e) => onBrushMouseMove('letterCount', e)}
              onMouseUp={onBrushMouseUp}
              onMouseLeave={onBrushMouseUp}
            >
              <line x1="0" y1="10" x2="200" y2="10" stroke="#4A7C59" strokeWidth="1" opacity="0.3" />
              <rect x={zoom.minX} y="0" width={zoom.maxX - zoom.minX} height="20" fill="#4A7C59" opacity="0.3" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  const renderPeople = () => {
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
                onShowTooltip(e, { title: person.name, value: `${person.count} mentions`, subtitle: `Rank #${idx + 1}` })
              }
              onMouseLeave={variant === 'modal' ? onHideTooltip : undefined}
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

  const renderMeetingDates = () => {
    if (!dataRoomData || !dataRoomData.meetingDates || dataRoomData.meetingDates.dates.length === 0) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No meeting dates data available
        </div>
      );
    }

    const timelineItems = transformMeetingDatesToTimelineItems(dataRoomData.meetingDates);
    
    // Calculate average interval between meetings for summary
    const dates = dataRoomData.meetingDates.dates.map((meeting) => {
      const [y, m, day] = meeting.date.split('-').map(Number);
      return new Date(y, m - 1, day);
    });
    const intervals: number[] = [];
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.floor((dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
      intervals.push(diff);
    }
    const avgInterval = intervals.length > 0 ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : 0;

    return (
      <div className={`${variant === 'modal' ? 'h-[500px]' : 'h-[400px]'} bg-[#13243A] rounded p-4 flex flex-col`}>
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-white mb-1">Dates when they met</h4>
          <div className="text-sm text-[#C8D5EA]">
            <span className="text-white font-semibold">{dataRoomData.meetingDates.total}</span> meeting
            {dataRoomData.meetingDates.total !== 1 ? 's' : ''} recorded
            {dataRoomData.meetingDates.dateRange.start && dataRoomData.meetingDates.dateRange.end && (
              <span className="block mt-1 text-xs">
                {dataRoomData.meetingDates.dateRange.start} - {dataRoomData.meetingDates.dateRange.end}
              </span>
            )}
            {avgInterval > 0 && (
              <span className="block mt-1 text-xs">Average: {avgInterval} days between meetings</span>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden dataroom-chrono-wrapper dataroom-chrono-scrollable">
          <Chrono
            items={timelineItems}
            mode={variant === 'modal' ? 'vertical' : 'horizontal'}
            theme={chronoTheme}
            fontSizes={{
              cardSubtitle: '0.875rem',
              cardText: '0.875rem',
              cardTitle: '1rem',
              title: '0.9rem'
            }}
            layout={{
              cardHeight: variant === 'modal' ? 120 : 100,
              itemWidth: variant === 'modal' ? 250 : 200,
            }}
            style={{
              classNames: {
                card: 'bg-[#0F1F34] border border-[#23354D]',
                cardMedia: 'bg-[#13243A]',
                cardSubTitle: 'text-[#C8D5EA]',
                cardText: 'text-[#C8D5EA]',
                cardTitle: 'text-white',
                controls: 'text-[#C8D5EA]',
                title: 'text-[#4A7C59]',
              }
            }}
            display={{ 
              toolbar: { enabled: false } 
            }}
            scrollable={variant === 'modal' ? { scrollbar: true } : false}
          />
        </div>
      </div>
    );
  };

  switch (activeChartId) {
    case 'sentiment':
      return renderSentiment();
    case 'topics':
      return renderTopics();
    case 'weekly-letter-count':
      return renderLetterCount();
    case 'people':
      return renderPeople();
    case 'meeting-dates':
      return renderMeetingDates();
    default:
      return null;
  }
}

