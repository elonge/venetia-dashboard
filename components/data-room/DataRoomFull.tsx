'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Calendar, TrendingUp, BarChart3, Mail, Users } from 'lucide-react';
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
        console.log('[DEBUG] DataRoomFull - Fetching data room...');
        const response = await fetch('/api/data-room');
        if (response.ok) {
          const data = await response.json();
          console.log('[DEBUG] DataRoomFull - Data received:', {
            hasSentiment: !!data.sentiment,
            hasTopics: !!data.topics,
            topicsCount: data.topics?.length || 0,
            topics: data.topics || []
          });
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

  const chartIcons: Record<ChartId, React.ReactNode> = {
    'meeting-dates': <Calendar className="w-6 h-6" />,
    'sentiment': <TrendingUp className="w-6 h-6" />,
    'topics': <BarChart3 className="w-6 h-6" />,
    'weekly-letter-count': <Mail className="w-6 h-6" />,
    'people': <Users className="w-6 h-6" />,
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-6 py-10" style={{ zIndex: 9999 }}>
      <div className="relative w-[80vw] max-w-7xl h-[80vh] bg-[#0D1B2A] text-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4" style={{ zIndex: 10000 }}>
        <div className="flex items-center justify-between">
          <div className="relative z-10">
            <div className="text-xs uppercase tracking-wide text-[#9AAFD0] mb-1">Data Room Navigator</div>
            <div className="text-2xl font-semibold text-white">{activeChart.label}</div>
            <div className="relative z-10 text-sm text-[#C8D5EA]">{activeChart.description}</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#4A7C59] hover:bg-[#5A8C69] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-3 gap-3">
          {chartDefinitions.map((chart, idx) => {
            const isActive = idx === activeChartIndex;
            return (
              <button
                key={chart.id}
                onClick={() => handleChartIndexChange(idx)}
                className={`relative !p-4 rounded-lg border-2 transition-all text-left group ${
                  isActive
                    ? 'bg-[#15263E] border-[#4A7C59] shadow-[0_0_0_2px_rgba(74,124,89,0.2),0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'
                    : 'bg-[#0F1F34] border-[#1F3350] hover:bg-[#15263E] hover:border-[#23354D]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#4A7C59]' : 'text-[#4A7C59] group-hover:text-[#5A8C69]'
                  }`}>
                    {chartIcons[chart.id]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1 text-white">
                      {chart.label}
                    </div>
                    <div className="text-xs text-[#9AAFD0] line-clamp-2">
                      {chart.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chart Display */}
        <div className="flex-1 min-h-0">
          <div ref={modalChartRef} className="relative w-full h-full bg-[#101C2D] border border-[#1F3350] rounded-xl p-4 overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}

