'use client';

import React, { useMemo } from 'react';
import { TimeSeries, TimeRange, Event } from 'pondjs';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { transformSentimentToRecharts, transformWeeklyLetterCountToRecharts } from '@/lib/recharts-transformers';
import { SentimentData, DailyLetterCountData } from './dataRoomTypes';

interface TimeSeriesChartProps {
  timerange: any;
  series: {
    tensionSeries?: TimeSeries | null;
    warmthSeries?: TimeSeries | null;
    anxietySeries?: TimeSeries | null;
  } | {
    letterCountSeries?: TimeSeries | null;
  };
  variant: 'sentiment' | 'letterCount';
  height: number;
  maxValue?: number;
  // Add raw data for recharts transformation
  rawData?: {
    sentiment?: SentimentData;
    letterCount?: DailyLetterCountData;
  };
}

// Helper to convert TimeSeries to date-value pairs
function timeSeriesToDataPoints(series: TimeSeries, column: string): Array<{ date: string; value: number }> {
  const events = series.events();
  return events.map((event: Event) => {
    const timestamp = event.timestamp();
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return {
      date: `${year}-${month}-${day}`,
      value: event.get(column) || 0,
    };
  }).sort((a: { date: string; value: number }, b: { date: string; value: number }) => a.date.localeCompare(b.date));
}

// Custom tooltip for dark theme
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D1B2A] border border-[#23354D] rounded-md px-3 py-2 text-xs shadow-xl">
        <p className="text-[#C8D5EA] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Format date for X-axis
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

export default function TimeSeriesChart({ timerange, series, variant, height, maxValue, rawData }: TimeSeriesChartProps) {
  const chartData = useMemo(() => {
    if (variant === 'sentiment') {
      const { tensionSeries, warmthSeries, anxietySeries } = series as {
        tensionSeries?: TimeSeries | null;
        warmthSeries?: TimeSeries | null;
        anxietySeries?: TimeSeries | null;
      };

      // Try to use raw data if available (more accurate)
      if (rawData?.sentiment) {
        const transformed = transformSentimentToRecharts(rawData.sentiment);
        // Merge all series by date
        const dateMap = new Map<string, { date: string; tension?: number; warmth?: number; anxiety?: number }>();
        
        transformed.tension.forEach(item => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)!.tension = item.value;
        });
        
        transformed.warmth.forEach(item => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)!.warmth = item.value;
        });
        
        transformed.anxiety.forEach(item => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)!.anxiety = item.value;
        });
        
        return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
      }

      // Fallback to TimeSeries conversion
      const allData: Array<{ date: string; tension?: number; warmth?: number; anxiety?: number }> = [];
      const dateMap = new Map<string, { date: string; tension?: number; warmth?: number; anxiety?: number }>();

      if (tensionSeries) {
        timeSeriesToDataPoints(tensionSeries, 'tension').forEach(item => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)!.tension = item.value;
        });
      }

      if (warmthSeries) {
        timeSeriesToDataPoints(warmthSeries, 'warmth').forEach(item => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)!.warmth = item.value;
        });
      }

      if (anxietySeries) {
        timeSeriesToDataPoints(anxietySeries, 'anxiety').forEach(item => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)!.anxiety = item.value;
        });
      }

      return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    } else {
      const { letterCountSeries } = series as { letterCountSeries?: TimeSeries | null };

      // Try to use raw data if available
      if (rawData?.letterCount) {
        return transformWeeklyLetterCountToRecharts(rawData.letterCount).map(item => ({
          date: item.date,
          letters: item.letters,
        }));
      }

      // Fallback to TimeSeries conversion
      if (!letterCountSeries) {
        return [];
      }

      return timeSeriesToDataPoints(letterCountSeries, 'count').map(item => ({
        date: item.date,
        letters: item.value,
      }));
    }
  }, [variant, series, rawData]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[#C8D5EA] text-sm">
        No data available
      </div>
    );
  }

  if (variant === 'sentiment') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="2 2" stroke="#4A7C59" opacity={0.2} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#C8D5EA"
            tick={{ fill: '#C8D5EA', fontSize: 11 }}
            axisLine={{ stroke: '#C8D5EA' }}
          />
          <YAxis
            label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft', fill: '#C8D5EA', style: { fontSize: 11 } }}
            domain={[0, 10]}
            stroke="#C8D5EA"
            tick={{ fill: '#C8D5EA', fontSize: 11 }}
            axisLine={{ stroke: '#C8D5EA' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="tension"
            stroke="#DC2626"
            strokeWidth={2}
            dot={false}
            name="Political Unburdening"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="warmth"
            stroke="#4A7C59"
            strokeWidth={2}
            dot={false}
            name="Romantic Adoration"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="anxiety"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
            name="Emotional Desolation"
            connectNulls
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  } else {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="2 2" stroke="#4A7C59" opacity={0.2} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#C8D5EA"
            tick={{ fill: '#C8D5EA', fontSize: 11 }}
            axisLine={{ stroke: '#C8D5EA' }}
          />
          <YAxis
            label={{ value: 'Letters per Week', angle: -90, position: 'insideLeft', fill: '#C8D5EA', style: { fontSize: 11 } }}
            domain={[0, maxValue ? maxValue * 1.1 : 'auto']}
            stroke="#C8D5EA"
            tick={{ fill: '#C8D5EA', fontSize: 11 }}
            axisLine={{ stroke: '#C8D5EA' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="letters"
            stroke="#4A7C59"
            strokeWidth={2}
            dot={false}
            name="Letters"
            connectNulls
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }
}
