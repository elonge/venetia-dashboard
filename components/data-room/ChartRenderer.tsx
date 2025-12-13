'use client';

import React, { useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { Chrono } from 'react-chrono';
import 'react-chrono/dist/style.css';
import { transformMeetingDatesToTimelineItems, transformWeeklyLetterCountToTimelineItems } from '@/lib/react-chrono-transformers';
import { TimeSeries, TimeRange } from 'pondjs';
import dynamic from 'next/dynamic';

// Dynamically import the TimeSeriesChart component to avoid SSR issues
const TimeSeriesChart = dynamic(
  () => import('./TimeSeriesChart'),
  { ssr: false }
);
import {
  DataRoomData,
  ChartId,
  ZoomState,
  TooltipState,
  chronoTheme,
} from './dataRoomTypes';
import {
  transformSentimentToTimeSeries,
  transformLetterCountToTimeSeries,
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
  // Transform sentiment data to TimeSeries (memoized at component level)
  const sentimentTimeSeries = useMemo(() => {
    if (!dataRoomData) return null;
    return transformSentimentToTimeSeries(dataRoomData.sentiment);
  }, [dataRoomData]);

  // Transform letter count data to TimeSeries (memoized at component level)
  const letterCountTimeSeries = useMemo(() => {
    if (!dataRoomData?.dailyLetterCount) return null;
    return transformLetterCountToTimeSeries(dataRoomData.dailyLetterCount);
  }, [dataRoomData]);

  const renderSentiment = () => {
    if (!dataRoomData) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No sentiment data available
        </div>
      );
    }

    // Get or transform sentiment data
    let transformed = sentimentTimeSeries;
    if (!transformed) {
      transformed = transformSentimentToTimeSeries(dataRoomData.sentiment);
    }

    if (!transformed) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No sentiment data available
        </div>
      );
    }

    const { tensionSeries, warmthSeries, anxietySeries } = transformed;

    if (!tensionSeries && !warmthSeries && !anxietySeries) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No sentiment data available
        </div>
      );
    }

    // Determine time range from the series
    const seriesArray = [tensionSeries, warmthSeries, anxietySeries].filter(Boolean) as TimeSeries[];
    let timerange: TimeRange | null = null;
    
    if (seriesArray.length > 0) {
      // Get all timeranges and find the min and max
      const ranges = seriesArray.map(s => s.timerange());
      const minTime = Math.min(...ranges.map(r => r.begin().getTime()));
      const maxTime = Math.max(...ranges.map(r => r.end().getTime()));
      timerange = new TimeRange(new Date(minTime), new Date(maxTime));
    }

    if (!timerange) {
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No sentiment data available
        </div>
      );
    }

    const chartHeight = variant === 'modal' ? 280 : 200;

    return (
      <div className={`${variant === 'modal' ? 'h-[360px]' : 'h-48'} bg-[#13243A] rounded relative p-4 flex flex-col`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">Emotional tone across timeline</h4>
        </div>
        <div className="flex-1" style={{ minHeight: 0 }}>
          <TimeSeriesChart
            timerange={timerange}
            series={{ tensionSeries, warmthSeries, anxietySeries }}
            variant="sentiment"
            height={chartHeight}
            rawData={{ sentiment: dataRoomData.sentiment }}
          />
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
      </div>
    );
  };

  const renderTopics = () => {
    if (!dataRoomData || !dataRoomData.topics || dataRoomData.topics.length === 0) {
      console.log('[DEBUG] Topics Rendering - No topics data available:', {
        hasDataRoomData: !!dataRoomData,
        hasTopics: !!dataRoomData?.topics,
        topicsLength: dataRoomData?.topics?.length || 0
      });
      return (
        <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
          No topics data available
        </div>
      );
    }

    console.log('[DEBUG] Topics Rendering - Rendering topics:', {
      count: dataRoomData.topics.length,
      topics: dataRoomData.topics.map(t => ({ topic: t.topic, value: t.value, color: t.color }))
    });

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
                    onShowTooltip(e, { title: item.topic, value: `${item.value}%`, subtitle: 'of letters contain this topic', color: item.color })
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

    let letterCountSeries = letterCountTimeSeries;

    // Try to transform the data if it hasn't been transformed yet
    if (!letterCountSeries) {
      letterCountSeries = transformLetterCountToTimeSeries(dataRoomData.dailyLetterCount);
      if (!letterCountSeries) {
        return (
          <div className="h-32 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">
            No letter count data available
          </div>
        );
      }
    }

    const timerange = letterCountSeries.timerange();
    const maxCount = letterCountSeries.max('count') || 0;
    const chartHeight = variant === 'modal' ? 400 : 300;

    return (
      <div className={`${variant === 'modal' ? 'h-[500px]' : 'h-[400px]'} bg-[#13243A] rounded p-4 flex flex-col`}>
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-white mb-1">Number of letters per week over time</h4>
          <div className="text-sm text-[#C8D5EA]">
            {dataRoomData.dailyLetterCount.weeks.length > 0 && (
              <>
                <span className="text-white font-semibold">{dataRoomData.dailyLetterCount.weeks.length}</span> weeks with letters recorded
                {dataRoomData.dailyLetterCount.dateRange.start && dataRoomData.dailyLetterCount.dateRange.end && (
                  <span className="block mt-1 text-xs">
                    {dataRoomData.dailyLetterCount.dateRange.start} - {dataRoomData.dailyLetterCount.dateRange.end}
                  </span>
                )}
                {dataRoomData.dailyLetterCount.peak.count > 0 && (
                  <span className="block mt-1 text-xs">
                    Peak: {dataRoomData.dailyLetterCount.peak.date} ({dataRoomData.dailyLetterCount.peak.count} letters/week)
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1" style={{ minHeight: 0 }}>
          <TimeSeriesChart
            timerange={timerange}
            series={{ letterCountSeries }}
            variant="letterCount"
            height={chartHeight}
            maxValue={maxCount}
            rawData={{ letterCount: dataRoomData.dailyLetterCount }}
          />
        </div>
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

