'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DataRoomData, chartDefinitions, zoomDefaults, ChartId, ZoomKey, ZoomState, TooltipState } from './dataRoomTypes';
import ChartRenderer from './ChartRenderer';

interface DataRoomFullProps {
  onClose: () => void;
  initialChartIndex?: number;
  initialZoomStates?: Record<ZoomKey, ZoomState>;
  onChartIndexChange?: (index: number) => void;
  onZoomStatesChange?: (states: Record<ZoomKey, ZoomState>) => void;
}

export default function DataRoomFull({ 
  onClose, 
  initialChartIndex = 0, 
  initialZoomStates,
  onChartIndexChange,
  onZoomStatesChange,
}: DataRoomFullProps) {
  const [activeChartIndex, setActiveChartIndex] = useState(initialChartIndex);
  const [dataRoomData, setDataRoomData] = useState<DataRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomStates, setZoomStates] = useState<Record<ZoomKey, ZoomState>>(initialZoomStates || zoomDefaults);

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

  // Update local state when external props change
  useEffect(() => {
    if (initialChartIndex !== undefined) {
      setActiveChartIndex(initialChartIndex);
    }
  }, [initialChartIndex]);

  useEffect(() => {
    if (initialZoomStates) {
      setZoomStates(initialZoomStates);
    }
  }, [initialZoomStates]);

  const handleChartIndexChange = (index: number) => {
    setActiveChartIndex(index);
    if (onChartIndexChange) {
      onChartIndexChange(index);
    }
  };

  const handleZoomStatesChange = useCallback((updater: (prev: Record<ZoomKey, ZoomState>) => Record<ZoomKey, ZoomState>) => {
    setZoomStates((prev) => {
      const newStates = updater(prev);
      if (onZoomStatesChange) {
        onZoomStatesChange(newStates);
      }
      return newStates;
    });
  }, [onZoomStatesChange]);

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

      handleZoomStatesChange((prev) => ({
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
  }, [brushDragging, brushStart, handleZoomStatesChange]);

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

    handleZoomStatesChange((prev) => ({
      ...prev,
      [widgetId]: { minX, maxX },
    }));
  };

  const handleBrushMouseUp = () => {
    setBrushDragging(null);
    setBrushStart(null);
  };

  const resetZoom = (key: ZoomKey) => {
    handleZoomStatesChange((prev) => ({ ...prev, [key]: zoomDefaults[key] }));
  };

  const handlePrevChart = () => {
    const newIndex = activeChartIndex === 0 ? chartDefinitions.length - 1 : activeChartIndex - 1;
    handleChartIndexChange(newIndex);
    setTooltip(null);
  };

  const handleNextChart = () => {
    const newIndex = activeChartIndex === chartDefinitions.length - 1 ? 0 : activeChartIndex + 1;
    handleChartIndexChange(newIndex);
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

  const chartZoomKey: Record<ChartId, ZoomKey | null> = {
    sentiment: 'sentiment',
    'weekly-letter-count': 'letterCount',
    'meeting-dates': null,
    topics: null,
    people: null,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6 py-10">
      <div className="relative w-[80vw] max-w-7xl h-[80vh] bg-[#0D1B2A] text-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
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
              onClick={onClose}
              className="p-2 rounded-full bg-[#4A7C59] hover:bg-[#5A8C69] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-[minmax(0,3fr),minmax(320px,1fr)] gap-4">
          <div ref={modalChartRef} className="relative bg-[#101C2D] border border-[#1F3350] rounded-xl p-4 overflow-hidden">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-[#C8D5EA]">Loading data...</div>
            ) : (
              <ChartRenderer
                dataRoomData={dataRoomData}
                activeChartId={activeChart.id}
                variant="modal"
                zoomStates={zoomStates}
                onResetZoom={resetZoom}
                onShowTooltip={showTooltip}
                onHideTooltip={hideTooltip}
                brushRefs={brushRefs.current}
                onBrushMouseDown={handleBrushMouseDown}
                onBrushMouseMove={handleBrushMouseMove}
                onBrushMouseUp={handleBrushMouseUp}
              />
            )}
            {renderTooltip()}
          </div>

          <aside className="bg-[#0F1F34] border border-[#1F3350] rounded-xl p-4 flex flex-col gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-[#9AAFD0] mb-2">Jump between charts</div>
              <div className="grid grid-cols-2 gap-2">
                {chartDefinitions.map((chart, idx) => (
                  <button
                    key={chart.id}
                    onClick={() => handleChartIndexChange(idx)}
                    className={`text-xs px-2 py-2 rounded-md text-left border transition-colors ${
                      idx === activeChartIndex
                        ? 'bg-[#4A7C59] border-[#4A7C59] text-white'
                        : 'bg-[#101C2D] border-[#1F3350] text-[#C8D5EA] hover:bg-[#15263E]'
                    }`}
                  >
                    <div className="font-semibold">{chart.label}</div>
                    <div className="text-[11px] text-[#9AAFD0] line-clamp-1">{chart.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="flex items-center justify-between text-xs text-[#C8D5EA]">
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
  );
}

