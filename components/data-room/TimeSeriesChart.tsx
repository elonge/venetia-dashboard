"use client";

import React, { useMemo } from "react";
import { TimeSeries, TimeRange, Event } from "pondjs";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  transformSentimentToRecharts,
  transformWeeklyLetterCountToRecharts,
} from "@/lib/recharts-transformers";
import { SentimentData, DailyLetterCountData } from "./dataRoomTypes";

type ExtraRechartsSeries = {
  key: string;
  name: string;
  color: string;
  points: Array<{ date: string; value: number }>;
  strokeDasharray?: string;
};

interface TimeSeriesChartProps {
  timerange: any;
  series:
    | {
        tensionSeries?: TimeSeries | null;
        warmthSeries?: TimeSeries | null;
        anxietySeries?: TimeSeries | null;
      }
    | {
        letterCountSeries?: TimeSeries | null;
      };
  variant: "sentiment" | "letterCount";
  height: number;
  maxValue?: number;
  valueFormatter?: (value: number) => string;
  // Add raw data for recharts transformation
  rawData?: {
    sentiment?: SentimentData;
    letterCount?: DailyLetterCountData;
  };
  extraSeries?: ExtraRechartsSeries[];
}

// Helper to convert TimeSeries to date-value pairs
function timeSeriesToDataPoints(
  series: TimeSeries,
  column: string
): Array<{ date: string; value: number }> {
  const events = series.events();
  return events
    .map((event: Event) => {
      const timestamp = event.timestamp();
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return {
        date: `${year}-${month}-${day}`,
        value: event.get(column) || 0,
      };
    })
    .sort(
      (
        a: { date: string; value: number },
        b: { date: string; value: number }
      ) => a.date.localeCompare(b.date)
    );
}

// Update the CustomTooltip to accept and use the 'variant' prop
const CustomTooltip = ({ active, payload, label, variant }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#F5F0E8] border border-[#D4CFC4] rounded-md px-3 py-2 text-xs shadow-xl">
        <p className="text-[#6B7280] mb-1 font-serif italic">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-bold uppercase tracking-wider">
            {entry.name}: {
              typeof entry.value === 'number' 
                ? (variant === 'letterCount' ? Math.round(entry.value) : entry.value.toFixed(2)) 
                : entry.value
            }
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
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

export default function TimeSeriesChart({
  timerange,
  series,
  variant,
  height,
  maxValue,
  rawData,
  extraSeries,
}: TimeSeriesChartProps) {
  const chartData = useMemo(() => {
    if (variant === "sentiment") {
      const { tensionSeries, warmthSeries, anxietySeries } = series as {
        tensionSeries?: TimeSeries | null;
        warmthSeries?: TimeSeries | null;
        anxietySeries?: TimeSeries | null;
      };

      const dateMap = new Map<
        string,
        {
          date: string;
          tension?: number;
          warmth?: number;
          anxiety?: number;
          [key: string]: any;
        }
      >();

      // Try to use raw data if available (more accurate)
      if (rawData?.sentiment) {
        const transformed = transformSentimentToRecharts(rawData.sentiment);

        transformed.tension.forEach((item) => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)!.tension = item.value;
        });

        transformed.warmth.forEach((item) => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)!.warmth = item.value;
        });

        transformed.anxiety.forEach((item) => {
          if (!dateMap.has(item.date)) {
            dateMap.set(item.date, { date: item.date });
          }
          dateMap.get(item.date)!.anxiety = item.value;
        });
      } else {
        // Fallback to TimeSeries conversion
        if (tensionSeries) {
          timeSeriesToDataPoints(tensionSeries, "tension").forEach((item) => {
            if (!dateMap.has(item.date)) {
              dateMap.set(item.date, { date: item.date });
            }
            dateMap.get(item.date)!.tension = item.value;
          });
        }

        if (warmthSeries) {
          timeSeriesToDataPoints(warmthSeries, "warmth").forEach((item) => {
            if (!dateMap.has(item.date)) {
              dateMap.set(item.date, { date: item.date });
            }
            dateMap.get(item.date)!.warmth = item.value;
          });
        }

        if (anxietySeries) {
          timeSeriesToDataPoints(anxietySeries, "anxiety").forEach((item) => {
            if (!dateMap.has(item.date)) {
              dateMap.set(item.date, { date: item.date });
            }
            dateMap.get(item.date)!.anxiety = item.value;
          });
        }
      }

      extraSeries?.forEach((extra) => {
        extra.points.forEach((p) => {
          if (!dateMap.has(p.date)) {
            dateMap.set(p.date, { date: p.date });
          }
          dateMap.get(p.date)![extra.key] = p.value;
        });
      });

      return Array.from(dateMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
      );
    } else {
      const { letterCountSeries } = series as {
        letterCountSeries?: TimeSeries | null;
      };

      // Try to use raw data if available
      if (rawData?.letterCount) {
        return transformWeeklyLetterCountToRecharts(rawData.letterCount).map(
          (item) => ({
            date: item.date,
            letters: item.letters,
          })
        );
      }

      // Fallback to TimeSeries conversion
      if (!letterCountSeries) {
        return [];
      }

      return timeSeriesToDataPoints(letterCountSeries, "count").map((item) => ({
        date: item.date,
        letters: item.value,
      }));
    }
  }, [variant, series, rawData]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-sm">
        No data available
      </div>
    );
  }

  if (variant === "sentiment") {
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
            stroke="#6B7280"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={{ stroke: "#D4CFC4" }}
          />
          <YAxis
            label={{
              value: "Sentiment Score",
              angle: -90,
              position: "insideLeft",
              fill: "#6B7280",
              style: { fontSize: 11 },
            }}
            domain={[0, 10]}
            stroke="#6B7280"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={{ stroke: "#D4CFC4" }}
          />
          <Tooltip
            content={<CustomTooltip variant="sentiment" />}
          />
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
          {extraSeries?.map((extra) => (
            <Line
              key={extra.key}
              type="monotone"
              dataKey={extra.key}
              stroke={extra.color}
              strokeWidth={2}
              dot={false}
              name={extra.name}
              connectNulls
              strokeDasharray={extra.strokeDasharray}
            />
          ))}
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
            stroke="#6B7280"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={{ stroke: "#D4CFC4" }}
          />
          <YAxis
            label={{
              value: "Letters per Week",
              angle: -90,
              position: "insideLeft",
              fill: "#6B7280",
              style: { fontSize: 11 },
            }}
            domain={[0, maxValue ? Math.ceil(maxValue) : "auto"]}
            allowDecimals={false} // This prevents Recharts from creating 0.5, 1.5, etc.
            stroke="#6B7280"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={{ stroke: "#D4CFC4" }}
          />{" "}
          <Tooltip content={<CustomTooltip variant="letterCount" />} />
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
