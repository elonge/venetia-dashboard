"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Calendar, TrendingUp, BarChart3, Mail, Users, MapPin } from "lucide-react";
import {
  DataRoomData,
  chartDefinitions,
  zoomDefaults,
  ChartId,
  ZoomKey,
  ZoomState,
  TooltipState,
} from "./dataRoomTypes";
import ChartRenderer from "./ChartRenderer";

// Constants to resolve the data discrepancies found in the review
const SUMMARY_STATS = {
  verifiedPoints: 69,
  startYear: 1912,
  endYear: 1915, // Synced to match the header range
};

interface DataRoomFullProps {
  initialChartIndex?: number;
  initialZoomStates?: Record<ZoomKey, ZoomState>;
  onChartIndexChange?: (index: number) => void;
  onZoomStatesChange?: (states: Record<ZoomKey, ZoomState>) => void;
}

export default function DataRoomFull({
  initialChartIndex = 0,
  initialZoomStates,
  onChartIndexChange,
  onZoomStatesChange,
}: DataRoomFullProps) {
  const [activeChartIndex, setActiveChartIndex] = useState(initialChartIndex);
  const [dataRoomData, setDataRoomData] = useState<DataRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomStates, setZoomStates] = useState<Record<ZoomKey, ZoomState>>(
    initialZoomStates || zoomDefaults
  );

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

  // Logic for external prop updates
  useEffect(() => {
    if (initialChartIndex !== undefined) setActiveChartIndex(initialChartIndex);
  }, [initialChartIndex]);

  useEffect(() => {
    if (initialZoomStates) setZoomStates(initialZoomStates);
  }, [initialZoomStates]);

  const handleChartIndexChange = (index: number) => {
    setActiveChartIndex(index);
    onChartIndexChange?.(index);
  };

  const handleZoomStatesChange = useCallback(
    (updater: (prev: Record<ZoomKey, ZoomState>) => Record<ZoomKey, ZoomState>) => {
      setZoomStates((prev) => {
        const newStates = updater(prev);
        onZoomStatesChange?.(newStates);
        return newStates;
      });
    },
    [onZoomStatesChange]
  );

  useEffect(() => {
    async function fetchDataRoom() {
      try {
        const response = await fetch("/api/data-room");
        if (response.ok) {
          const data = await response.json();
          setDataRoomData(data);
        }
      } catch (error) {
        console.error("Archive fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDataRoom();
  }, []);

  // Brush logic for timeline scrubbing
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
      handleZoomStatesChange((prev) => ({ ...prev, [brushDragging]: { minX, maxX } }));
    };

    const handleGlobalMouseUp = () => {
      setBrushDragging(null);
      setBrushStart(null);
    };

    if (brushDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [brushDragging, brushStart, handleZoomStatesChange]);

  const handleBrushMouseDown = (widgetId: ZoomKey, e: React.MouseEvent<SVGSVGElement>) => {
    const svg = brushRefs.current[widgetId];
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    setBrushDragging(widgetId);
    setBrushStart(Math.max(0, Math.min(200, x)));
    e.preventDefault();
  };

  const showTooltip = (e: React.MouseEvent<SVGElement | HTMLDivElement>, payload: Omit<TooltipState, "x" | "y">) => {
    if (!modalChartRef.current) return;
    const rect = modalChartRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTooltip({ ...payload, x, y });
  };

  const chartIcons: Record<ChartId, React.ReactElement> = {
    "meeting-dates": <Calendar className="w-5 h-5" />,
    asquith_venetia_proximity: <MapPin className="w-5 h-5" />,
    sentiment: <TrendingUp className="w-5 h-5" />,
    topics: <BarChart3 className="w-5 h-5" />,
    "weekly-letter-count": <Mail className="w-5 h-5" />,
    people: <Users className="w-5 h-5" />,
  };

  return (
    <div className="h-full font-sans antialiased text-[#1A2A40] selection:bg-[#4A7C59] selection:text-white">
      <div className="relative mx-auto w-full h-full bg-[#F5F0E8] rounded-lg border border-[#D4CFC4] shadow-2xl flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="px-8 py-6 bg-[#F5F0E8] border-b border-[#D4CFC4] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-[#4A7C59] uppercase tracking-[0.3em]">
                Intelligence Repository
              </span>
              <div className="h-[1px] w-8 bg-[#D4CFC4]" />
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
                Data Room Navigator
              </span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-[#1A2A40]">
              {activeChart.label}
            </h2>
            <p className="text-sm text-[#4B5563] italic font-serif">
              {activeChart.description}
            </p>
          </div>

          <div className="flex gap-10">
            <div className="text-right">
              <span className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Historical Range</span>
              <span className="text-2xl font-serif text-[#1A2A40] leading-none">
                {SUMMARY_STATS.startYear} — {SUMMARY_STATS.endYear}
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-85 bg-[#EBE7DF] border-r border-[#D4CFC4] p-6 flex flex-col gap-6 overflow-y-auto">
            <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">
              Navigation Modules
            </span>

            <nav className="flex flex-col gap-3">
              {chartDefinitions.map((chart, idx) => {
                const isActive = idx === activeChartIndex;
                return (
                  <button
                    key={chart.id}
                    onClick={() => handleChartIndexChange(idx)}
                    className={`group w-full p-4! text-left transition-all border rounded-md flex gap-4 items-start ${
                      isActive
                        ? "bg-[#F5F0E8] border-[#D4CFC4] border-l-[#4A7C59] border-l-4 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-[#F5F0E8]/50"
                    }`}
                  >
                    <div className={`${isActive ? "text-[#4A7C59]" : "text-[#9CA3AF] group-hover:text-[#6B7280]"}`}>
                      {chartIcons[chart.id]}
                    </div>
                    <div className="flex-1">
                      <div className={`text-[12px] font-bold uppercase tracking-widest mb-1 ${isActive ? "text-[#1A2A40]" : "text-[#6B7280]"}`}>
                        {chart.label}
                      </div>
                      <div className={`text-xs font-serif italic leading-snug ${isActive ? "text-[#4A7C59]" : "text-[#9CA3AF]"}`}>
                        {chart.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* MAIN VISUALIZATION AREA */}
          <main className="flex-1 p-8 bg-[#E8E4DC] flex flex-col gap-6 overflow-hidden">
            <div 
              ref={modalChartRef}
              className="flex-1 bg-[#F5F0E8] rounded-xl border border-[#D4CFC4] shadow-inner p-8 relative overflow-hidden"
            >
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-[#4A7C59]/20 border-t-[#4A7C59] rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6B7280]">Consulting Archives</span>
                </div>
              ) : (
                <ChartRenderer
                  dataRoomData={dataRoomData}
                  activeChartId={activeChart.id}
                  variant="modal"
                  zoomStates={zoomStates}
                  onResetZoom={(key) => handleZoomStatesChange(prev => ({ ...prev, [key]: zoomDefaults[key] }))}
                  onShowTooltip={showTooltip}
                  onHideTooltip={() => setTooltip(null)}
                  brushRefs={brushRefs.current}
                  onBrushMouseDown={handleBrushMouseDown}
                  onBrushMouseMove={() => {}} // Controlled by global handler
                  onBrushMouseUp={() => {}}
                />
              )}

              {/* TOOLTIP RENDERING */}
              {tooltip && (
                <div
                  className="absolute z-50 bg-[#FDFBF7] border border-[#D4CFC4] rounded p-3 shadow-2xl pointer-events-none"
                  style={{ left: `${tooltip.x}%`, top: `${tooltip.y}%`, transform: "translate(-50%, -120%)" }}
                >
                  <div className="font-serif font-bold text-sm text-[#1A2A40] mb-0.5">{tooltip.title}</div>
                  {tooltip.subtitle && <div className="text-[10px] text-[#6B7280] italic mb-1">{tooltip.subtitle}</div>}
                  {tooltip.value && <div className="font-bold text-xs" style={{ color: tooltip.color || "#4A7C59" }}>{tooltip.value}</div>}
                </div>
              )}
            </div>

            {/* FOOTER LEGEND */}
            <footer className="flex items-center justify-between border-t border-[#D4CFC4]/50 pt-4 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
              <div className="flex gap-8">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A7C59]" />
                  <span className="text-[#6B7280]">Confirmed Meeting</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67C52]" />
                  <span className="text-[#6B7280]">Correspondence Silence</span>
                </span>
              </div>
              <div className="italic font-serif lowercase tracking-normal flex gap-2">
                <span className="text-[#9CA3AF]">source:</span>
                <span className="text-[#6B7280]">Letters to Venetia Stanley</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
