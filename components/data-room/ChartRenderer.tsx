"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chrono } from "react-chrono";
import "react-chrono/dist/style.css";
import { transformMeetingDatesToTimelineItems } from "@/lib/react-chrono-transformers";
import { TimeSeries, TimeRange } from "pondjs";
import dynamic from "next/dynamic";

// Dynamically import the TimeSeriesChart component to avoid SSR issues
const TimeSeriesChart = dynamic(() => import("./TimeSeriesChart"), {
  ssr: false,
});
import {
  DataRoomData,
  ChartId,
  ZoomState,
  TooltipState,
  chronoTheme,
} from "./dataRoomTypes";
import {
  transformSentimentToTimeSeries,
  transformLetterCountToTimeSeries,
} from "./dataRoomUtils";
import { Calendar, X } from "lucide-react";
import { PEOPLE_DESCRIPTIONS } from "@/constants";
import ProximityTimeline from "./ProximityTimeline";
import ProximityMap from "./ProximityMap";

interface ChartRendererProps {
  dataRoomData: DataRoomData | null;
  activeChartId: ChartId;
  variant: "compact" | "modal";
  zoomStates: {
    sentiment: ZoomState;
    letterCount: ZoomState;
    meetingDates: ZoomState;
  };
  onResetZoom: (key: "sentiment" | "letterCount") => void;
  onShowTooltip: (
    e: React.MouseEvent<SVGElement | HTMLDivElement>,
    payload: Omit<TooltipState, "x" | "y">
  ) => void;
  onHideTooltip: () => void;
  brushRefs?: {
    sentiment: SVGSVGElement | null;
    letterCount: SVGSVGElement | null;
    meetingDates: SVGSVGElement | null;
  };
  onBrushMouseDown?: (
    widgetId: "sentiment" | "letterCount",
    e: React.MouseEvent<SVGSVGElement>
  ) => void;
  onBrushMouseMove?: (
    widgetId: "sentiment" | "letterCount",
    e: React.MouseEvent<SVGSVGElement>
  ) => void;
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
  const MAX_OVERLAY_DATE = "1916-12-31";
  const [termInput, setTermInput] = useState("");
  const [termOverlay, setTermOverlay] = useState<{
    term: string;
    definition?: string;
    points: Array<{ date: string; value: number }>;
  } | null>(null);
  const [termLoading, setTermLoading] = useState(false);
  const [termError, setTermError] = useState<string | null>(null);
  const termRequestRef = useRef<AbortController | null>(null);

  const [proximityPinnedDate, setProximityPinnedDate] = useState<string | null>(
    null
  );
  const [proximityHoverDate, setProximityHoverDate] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (activeChartId !== "asquith_venetia_proximity") return;
    const points = dataRoomData?.asquithVenetiaProximity?.points || [];
    if (points.length === 0) return;
    setProximityPinnedDate(points[points.length - 1].date);
    setProximityHoverDate(null);
  }, [activeChartId, dataRoomData]);

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

  type SentimentSeriesPoint = { bucketStart: string; norm: number };
  type SentimentSeriesApiResponse = {
    term?: string;
    expansion?: { definition?: string };
    series?: SentimentSeriesPoint[];
    error?: string;
  };

  const isSentimentSeriesApiResponse = (
    value: unknown
  ): value is SentimentSeriesApiResponse =>
    typeof value === "object" && value !== null;

  const fetchTermSeries = useCallback(async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    termRequestRef.current?.abort();
    const controller = new AbortController();
    termRequestRef.current = controller;

    setTermLoading(true);
    setTermError(null);

    try {
      const url = `/api/sentiment-series?term=${encodeURIComponent(
        trimmed
      )}&bucket=week&smoothingWindow=7&to=${MAX_OVERLAY_DATE}`;
      const resp = await fetch(url, { signal: controller.signal });
      const json = (await resp.json()) as unknown;
      const data: SentimentSeriesApiResponse = isSentimentSeriesApiResponse(
        json
      )
        ? (json as SentimentSeriesApiResponse)
        : {};

      if (!resp.ok) {
        const message =
          typeof data?.error === "string"
            ? data.error
            : `Request failed (${resp.status})`;
        throw new Error(message);
      }

      if (!Array.isArray(data?.series)) {
        throw new Error("Unexpected response from sentiment-series");
      }

      const points = data.series
        .filter(
          (p): p is SentimentSeriesPoint =>
            typeof p?.bucketStart === "string" && typeof p?.norm === "number"
        )
        .filter((p) => p.bucketStart <= MAX_OVERLAY_DATE)
        .map((p) => ({
          date: p.bucketStart,
          value: Math.max(0, Math.min(10, p.norm / 10)),
        }));

      setTermOverlay({
        term: String(data?.term || trimmed),
        definition:
          typeof data?.expansion?.definition === "string"
            ? data.expansion.definition
            : undefined,
        points,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Failed to load series";
      setTermError(msg);
      setTermOverlay(null);
    } finally {
      setTermLoading(false);
    }
  }, []);
  const renderSentiment = () => {
    if (!dataRoomData)
      return <DataUnavailable message="No sentiment data available" />;

    let transformed =
      sentimentTimeSeries ||
      transformSentimentToTimeSeries(dataRoomData.sentiment);
    if (!transformed)
      return <DataUnavailable message="Sentiment mapping failed" />;

    const { tensionSeries, warmthSeries, anxietySeries } = transformed;
    const seriesArray = [tensionSeries, warmthSeries, anxietySeries].filter(
      Boolean
    ) as TimeSeries[];

    if (seriesArray.length === 0)
      return <DataUnavailable message="Sentiment series is empty" />;

    const minTime = Math.min(
      ...seriesArray.map((s) => s.timerange().begin().getTime())
    );
    const maxTime = Math.max(
      ...seriesArray.map((s) => s.timerange().end().getTime())
    );
    const timerange = new TimeRange(new Date(minTime), new Date(maxTime));

    const extraSeries = termOverlay
      ? [
          {
            key: "termOverlay",
            name: `Concept: ${termOverlay.term}`,
            color: "#2563EB",
            strokeDasharray: "6 4",
            points: termOverlay.points,
          },
        ]
      : undefined;

    return (
      <div
        className={`flex flex-col bg-[#F5F0E8] border border-[#D4CFC4] rounded-sm p-8 relative overflow-hidden ${
          variant === "modal" ? "h-[560px]" : "h-72"
        }`}
      >
        {/* 1. LOADING OVERLAY: Appears during the 30s calculation */}
        {termLoading && (
          <div className="absolute inset-0 z-50 bg-[#F5F0E8]/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 border-4 border-[#D4CFC4] border-t-[#2563EB] rounded-full animate-spin mb-6"></div>
            <h3 className="text-[11px] font-black text-[#1A2A40] uppercase tracking-[0.4em] mb-2">
              Executing NLP Scan
            </h3>
            <p className="text-sm font-serif italic text-[#5A6472] max-w-xs leading-relaxed">
              Cross-referencing "{termInput}" against 500+ letters. This
              historical modeling usually takes 15-30 seconds.
            </p>
            <div className="mt-8 w-48 h-1 bg-[#D4CFC4] rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] animate-[loading_30s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}

        {/* HEADER & ANALYTICAL INPUT */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h4 className="text-[10px] font-black text-[#8B4513] uppercase tracking-[0.3em] mb-1">
              Emotional Intensity
            </h4>
            <p className="text-[13px] font-serif italic text-[#5A6472]">
              Fluctuations in tone across the archive
            </p>
          </div>

<div className="flex flex-col items-end gap-3">
  <form
    className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 border border-[#D4CFC4] rounded-sm shadow-inner"
    onSubmit={(e) => {
      e.preventDefault();
      fetchTermSeries(termInput);
    }}
  >
    <div className="relative flex items-center px-2">
      <input
        value={termInput}
        onChange={(e) => setTermInput(e.target.value)}
        placeholder="Track emotional motif (e.g. longing, guilty, despair)..."
        disabled={termLoading}
        /* Increased width to avoid cutting off your long placeholder */
        className="h-8 w-[380px] bg-transparent text-[12px] font-serif italic text-[#1A2A40] placeholder:text-[#A67C52] placeholder:opacity-70 focus:outline-none disabled:opacity-50"
        maxLength={80}
      />
    {/* The Fixed Button: Solid background for visibility */}
    <button
      type="submit"
      disabled={termLoading || termInput.trim().length === 0}
      className="h-8 px-4! bg-[#1A2A40]! hover:bg-[#4A7C59] text-white! text-[10px] font-black uppercase tracking-widest transition-all rounded-sm disabled:opacity-30"
    >
      {termLoading ? "SCANNING..." : "SCAN"}
    </button>
    
    {termOverlay && !termLoading && (
      <button
        type="button"
        onClick={() => setTermOverlay(null)}
        className="h-8 px-2 text-[#6B7280] hover:text-[#DC2626] transition-colors"
      >
        <X size={16} />
      </button>
    )}

    </div>

  </form>
</div>        </div>

        {/* CHART AREA */}
        <div className="flex-1 relative flex flex-col" style={{ minHeight: 0 }}>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
            <LegendItem color="#DC2626" label="Political Unburdening" />
            <LegendItem color="#4A7C59" label="Romantic Adoration" />
            <LegendItem color="#F59E0B" label="Emotional Desolation" />
            {termOverlay && !termLoading && (
              <div className="flex items-center gap-2 px-3 py-0.5 bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-full">
                <div className="w-3 h-0 border-t-2 border-dashed border-[#2563EB]"></div>
                <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-tighter">
                  QUERY: {termOverlay.term}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            <TimeSeriesChart
              timerange={timerange}
              series={{ tensionSeries, warmthSeries, anxietySeries }}
              variant="sentiment"
              height={variant === "modal" ? 340 : 180}
              rawData={{ sentiment: dataRoomData.sentiment }}
              extraSeries={extraSeries}
            />

            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[9px] font-black text-[#A67C52]/40 uppercase pointer-events-none">
              <span className="flex items-center gap-2">
                Intense <div className="w-4 h-px bg-[#D4CFC4]"></div>
              </span>
              <span className="flex items-center gap-2">
                Moderate <div className="w-4 h-px bg-[#D4CFC4]"></div>
              </span>
              <span className="flex items-center gap-2">
                Formal <div className="w-4 h-px bg-[#D4CFC4]"></div>
              </span>
            </div>
          </div>
        </div>

        {/* ARCHIVAL FOOTER */}
        <div className="mt-6 pt-4 border-t border-dashed border-[#D4CFC4] flex justify-between items-center">
          <div className="text-[9px] text-[#8B4513]/60 font-black uppercase tracking-widest">
            Source: letters to venetia stanley // NLP Processing Group
          </div>
          {termOverlay?.definition && !termLoading && (
            <div className="text-[10px] text-[#5A6472] font-serif italic max-w-md text-right leading-tight">
              {termOverlay.definition}
            </div>
          )}
        </div>

        {/* Keyframe Animation for the 15s bar */}
        <style jsx>{`
          @keyframes loading {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
        `}</style>
      </div>
    );
  };
  const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2 group cursor-help">
      <div
        className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] font-bold text-[#1A2A40] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  const DataUnavailable = ({ message }: { message: string }) => (
    <div className="h-32 bg-white/40 border border-[#D4CFC4] rounded-lg border-dashed flex items-center justify-center text-xs font-bold uppercase tracking-widest text-[#6B7280]">
      {message}
    </div>
  );

  const renderTopics = () => {
    if (!dataRoomData?.topics || dataRoomData.topics.length === 0) {
      return (
        <div className="h-32 bg-white/40 border-2 border-dashed border-[#D4CFC4] rounded-lg flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
          No archival topics detected
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col bg-[#F5F0E8] border border-[#D4CFC4] rounded-lg p-6 ${
          variant === "modal" ? "h-[500px]" : "h-64"
        }`}
      >
        {/* Header with Categorical Context */}
        <div className="mb-6">
          <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-1">
            Lexical Analysis
          </h4>
          <p className="text-sm font-serif italic text-[#4B5563]">
            Dominant themes identified in the record group
          </p>
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
          {dataRoomData.topics.map((item) => (
            <div
              key={item.topic}
              className="group cursor-default"
              onMouseMove={(e) =>
                variant === "modal" &&
                onShowTooltip(e, {
                  title: item.topic,
                  value: `${item.value}%`,
                  subtitle: "Topic density in correspondence",
                  color: item.color,
                })
              }
              onMouseLeave={variant === "modal" ? onHideTooltip : undefined}
            >
              {/* Label & Value */}
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[11px] font-black text-[#1A2A40] uppercase tracking-widest transition-colors group-hover:text-[#4A7C59]">
                  {item.topic}
                </span>
                <span className="text-xs font-serif italic text-[#6B7280]">
                  {item.value}%
                </span>
              </div>

              {/* Archival Style Progress Bar */}
              <div className="relative h-2 w-full bg-[#E8E4DC] border border-[#D4CFC4]/50 overflow-hidden shadow-inner">
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: item.color,
                    opacity: 0.8, // Slightly muted to blend with parchment
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Scholarly Methodology Footer */}
        <footer className="mt-6 pt-4 border-t border-dashed border-[#D4CFC4] flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-[#9CA3AF]">
          <span>NLP Analysis</span>
          <span className="italic font-serif lowercase tracking-normal text-[#6B7280]">
            weighted by mention frequency
          </span>
        </footer>
      </div>
    );
  };
  const renderLetterCount = () => {
    if (!dataRoomData?.dailyLetterCount)
      return <DataUnavailable message="No letter count data available" />;

    let letterCountSeries =
      letterCountTimeSeries ||
      transformLetterCountToTimeSeries(dataRoomData.dailyLetterCount);
    if (!letterCountSeries) return null;

    const timerange = letterCountSeries.timerange();

    // Ensure maxCount is an integer for axis scaling
    const maxCount = Math.ceil(letterCountSeries.max("count") || 0);
    const chartHeight = variant === "modal" ? 360 : 220;

    return (
      <div
        className={`flex flex-col bg-[#F5F0E8] border border-[#D4CFC4] rounded-lg p-6 ${
          variant === "modal" ? "h-[500px]" : "h-72"
        }`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-1">
              Archive Volume
            </h4>
            <p className="text-sm font-serif italic text-[#4B5563]">
              The rhythm of their weekly correspondence
            </p>
          </div>

          <div className="text-right">
            <span className="block text-[10px] font-bold text-[#4A7C59] uppercase tracking-widest">
              Peak Activity
            </span>
            <span className="text-sm font-serif text-[#1A2A40]">
              {/* Using Math.round here just in case the data source has floats */}
              {Math.round(dataRoomData.dailyLetterCount.peak.count)} letters /
              week
            </span>
          </div>
        </div>

        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          <TimeSeriesChart
            timerange={timerange}
            series={{ letterCountSeries }}
            variant="letterCount"
            height={chartHeight}
            maxValue={maxCount}
            rawData={{ letterCount: dataRoomData.dailyLetterCount }}
            valueFormatter={(val) => Math.round(val).toString()} // Now this prop will be recognized
          />
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[8px] font-black text-[#6B7280]/60 uppercase pointer-events-none pb-8">
            <span>{maxCount} Letters</span>
            <span>0</span>
          </div>
        </div>

        <footer className="mt-4 pt-3 border-t border-dashed border-[#D4CFC4] flex justify-between text-[9px] font-bold uppercase tracking-widest text-[#9CA3AF]">
          <span>
            Total: {dataRoomData.dailyLetterCount.weeks.length} active weeks
          </span>
        </footer>
      </div>
    );
  };
  const renderPeople = () => {
    if (!dataRoomData?.people || dataRoomData.people.length === 0) {
      return (
        <div className="h-32 bg-white/40 border-2 border-dashed border-[#D4CFC4] rounded-lg flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
          No historical entities found in records
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col bg-[#F5F0E8] border border-[#D4CFC4] rounded-lg p-6 ${
          variant === "modal" ? "h-[600px]" : "h-64"
        }`}
      >
        {/* Module Header */}
        <div className="mb-6">
          <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-1">
            Entity Frequency
          </h4>
          <p className="text-sm font-serif italic text-[#4B5563]">
            Most cited individuals within the record group
          </p>
        </div>

        {/* People Dossier List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-3">
          {dataRoomData.people.map((person, idx) => (
            <div
              key={person.name}
              className="group flex items-center justify-between bg-white border border-[#D4CFC4] rounded px-4 py-3 shadow-sm hover:border-[#4A7C59] transition-all cursor-default"
              onMouseMove={(e) =>
                variant === "modal" &&
                onShowTooltip(e, {
                  title: person.name,
                  value: `${person.count} citations`,
                  subtitle:
                    PEOPLE_DESCRIPTIONS[
                      person.name as keyof typeof PEOPLE_DESCRIPTIONS
                    ] || "Historical figure in the Asquith circle.",
                  color: "#4A7C59",
                })
              }
              onMouseLeave={variant === "modal" ? onHideTooltip : undefined}
            >
              {/* Index and Name Section */}
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-serif italic text-[#6B7280] w-5">
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-[#1A2A40] uppercase tracking-widest group-hover:text-[#4A7C59] transition-colors">
                    {person.name}
                  </span>
                  {/* Visualizing the description as a sub-label in the modal view */}
                </div>
              </div>

              {/* Data Badge - Changed QTY to CIT. */}
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-serif font-bold text-[#4A7C59] leading-none">
                    {person.count}
                  </span>
                  <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-tighter">
                    Cit.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology Footer */}
        <footer className="mt-6 pt-4 border-t border-dashed border-[#D4CFC4] flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-[#9CA3AF]">
          <div className="flex gap-4">
            <span>Processing: Frequency Aggregation</span>
            <span className="text-[#D4CFC4]">|</span>
            <span>Source: Cabinet Office Logs</span>
          </div>
          <span className="italic font-serif lowercase tracking-normal text-[#6B7280]">
            showing top entities
          </span>
        </footer>
      </div>
    );
  };
  const renderMeetingDates = () => {
    if (!dataRoomData?.meetingDates?.dates.length) return null;

    const meetings = dataRoomData.meetingDates.dates;
    const SILENCE_THRESHOLD = 21; // 3 weeks

    // Scholarly Date Formatter (23 January 1912)
    const formatScholarlyDate = (dateStr: string) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    return (
      <div className="flex flex-col h-full bg-[#F5F0E8]">
        {/* Header Summary */}
        <div className="p-6 border-b border-[#D4CFC4]">
          <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-1">
            The Chronology
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#1A2A40]">
              {meetings.length}
            </span>
            <span className="text-sm text-[#4B5563] italic font-serif">
              Confirmed Encounters
            </span>
          </div>
        </div>

        {/* Timeline Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#E8E4DC]/20">
          <div className="relative border-l-2 border-[#D4CFC4] ml-4 pl-10">
            {meetings.map((meeting, idx) => {
              const currentItemDate = new Date(meeting.date);
              const prevItemDate =
                idx > 0 ? new Date(meetings[idx - 1].date) : null;

              // Calculate Temporal Gap (Visual Spacing)
              let gapDays = 0;
              if (prevItemDate) {
                gapDays = Math.floor(
                  (currentItemDate.getTime() - prevItemDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                );
              }

              return (
                <React.Fragment key={meeting.date}>
                  {/* Silence Marker: Only show if gap is significant */}
                  {gapDays > SILENCE_THRESHOLD && (
                    <div className="relative py-6 flex items-center group/silence">
                      <div className="absolute -left-[45px] w-2 h-2 rounded-full bg-[#A67C52] opacity-40 group-hover/silence:opacity-100 transition-opacity" />
                      <div className="flex-1 border-t border-dashed border-[#A67C52]/30" />
                      <span className="px-4 text-[9px] font-black text-[#A67C52]/60 uppercase tracking-widest italic">
                        {gapDays} days of silence
                      </span>
                      <div className="flex-1 border-t border-dashed border-[#A67C52]/30" />
                    </div>
                  )}

                  {/* Meeting Card */}
                  <div
                    className="relative mb-10 group"
                    style={{
                      marginTop:
                        prevItemDate && gapDays < SILENCE_THRESHOLD
                          ? `${Math.min(gapDays * 2, 40)}px`
                          : "0px",
                    }}
                  >
                    {/* Timeline Node */}
                    <div className="absolute -left-[51px] top-4 w-5 h-5 rounded-full bg-[#4A7C59] border-[5px] border-[#F5F0E8] shadow-sm z-10 transition-transform group-hover:scale-125" />

                    {/* Clickable Card Wrapper */}
                    <a
                      href={`/daily/${meeting.date}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white border border-[#D4CFC4] rounded-lg p-5 shadow-sm hover:shadow-xl hover:border-[#4A7C59] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group/card"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <time className="text-[11px] font-black text-[#4A7C59] uppercase tracking-[0.2em]">
                          {formatScholarlyDate(meeting.date)}
                        </time>
                        <div className="text-[9px] font-bold text-[#6B7280] opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center gap-1 uppercase">
                          Open Archive Records{" "}
                          <span className="text-lg leading-none">→</span>
                        </div>
                      </div>

                      <p className="text-[#1A2A40] font-serif italic text-base leading-relaxed border-l-2 border-[#F5F0E8] pl-4 group-hover:border-[#4A7C59]/30 transition-colors">
                        {meeting.meeting_details ||
                          "No supplementary details recorded."}
                      </p>
                    </a>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderProximity = () => {
    const proximity = dataRoomData?.asquithVenetiaProximity;
    if (!proximity?.points?.length) {
      return <DataUnavailable message="No proximity data available" />;
    }

    const points = proximity.points;
    const byDate = new Map(points.map((p) => [p.date, p]));

    const displayDate =
      proximityHoverDate ||
      proximityPinnedDate ||
      points[points.length - 1].date;
    const selected = byDate.get(displayDate) || points[points.length - 1];

    const pmLabel = selected.calculated_from?.pm;
    const venLabel = selected.calculated_from?.venetia;

    const chartHeight = variant === "modal" ? 260 : 160;
    const mapHeight = variant === "modal" ? "h-full" : "h-[220px]";
    const layoutClass =
      variant === "modal"
        ? "grid grid-cols-2 gap-6 flex-1 min-h-0"
        : "flex flex-col gap-4 flex-1 min-h-0";

    return (
      <div
        className={`flex flex-col bg-[#F5F0E8] border border-[#D4CFC4] rounded-lg p-6 ${
          variant === "modal" ? "h-[560px]" : "h-[520px]"
        }`}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-1">
              Spatial Proximity
            </h4>
            <p className="text-sm font-serif italic text-[#4B5563]">
              Distance between Asquith and Venetia locations over time
            </p>
          </div>

          <div className="text-right">
            <span className="block text-[10px] font-bold text-[#4A7C59] uppercase tracking-widest">
              {displayDate}
            </span>
            <span className="text-sm font-serif text-[#1A2A40]">
              {selected.distance_km.toFixed(1)} km
            </span>
            {selected.status ? (
              <span className="block text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mt-1">
                {selected.status}
              </span>
            ) : null}
          </div>
        </div>

        <div className={layoutClass} style={{ minHeight: 0 }}>
          <div className="min-h-0">
            <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#9CA3AF]">
              Timeline (click to pin)
            </div>
            <ProximityTimeline
              points={points.map((p) => ({
                date: p.date,
                distance_km: p.distance_km,
                status: p.status,
              }))}
              height={chartHeight}
              maxDistanceKm={proximity.maxDistanceKm}
              selectedDate={proximityPinnedDate}
              hoverDate={proximityHoverDate}
              onHoverDate={setProximityHoverDate}
              onSelectDate={setProximityPinnedDate}
            />
            <div className="mt-2 text-[14px] text-[#6B7280] font-serif italic">
              {pmLabel || venLabel ? (
                <>
                  <span className="font-bold not-italic text-[#1A2A40]">
                    Asquith:
                  </span>{" "}
                  {pmLabel ? `${pmLabel}` : "—"};{" "}
                  <span className="font-bold not-italic text-[#1A2A40]">
                    Venetia:
                  </span>{" "}                  
                  {venLabel ? `${venLabel}` : "—"}
                </>
              ) : (
                "Hover or click a point to inspect that day."
              )}
            </div>
          </div>

          <div className={`min-h-0 ${mapHeight}`}>
            <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#9CA3AF]">
              Map (selected day)
            </div>
            <div className="h-full">
              <ProximityMap
                pm={selected.geo_coords.pm}
                venetia={selected.geo_coords.venetia}
              />
            </div>
          </div>
        </div>

        <footer className="mt-4 pt-3 border-t border-dashed border-[#D4CFC4] flex justify-between text-[9px] font-bold uppercase tracking-widest text-[#9CA3AF]">
          <span>Total: {points.length} days</span>
          <span className="italic font-serif lowercase tracking-normal text-[#6B7280]">
            derived from daily_records
          </span>
        </footer>
      </div>
    );
  };

  switch (activeChartId) {
    case "sentiment":
      return renderSentiment();
    case "topics":
      return renderTopics();
    case "weekly-letter-count":
      return renderLetterCount();
    case "people":
      return renderPeople();
    case "meeting-dates":
      return renderMeetingDates();
    case "asquith_venetia_proximity":
      return renderProximity();
    default:
      return null;
  }
}
