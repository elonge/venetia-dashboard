'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { DataRoomData, chartDefinitions, zoomDefaults, ChartId, ZoomKey, ZoomState } from './dataRoomTypes';
import ChartRenderer from './ChartRenderer';

interface DataRoomPreviewProps {
  onOpenFull?: () => void;
  activeChartIndex?: number;
  onChartIndexChange?: (index: number) => void;
  zoomStates?: Record<ZoomKey, ZoomState>;
  onZoomStatesChange?: (states: Record<ZoomKey, ZoomState>) => void;
}

export default function DataRoomPreview({ 
  onOpenFull,
  activeChartIndex: externalChartIndex,
  onChartIndexChange,
  zoomStates: externalZoomStates,
  onZoomStatesChange,
}: DataRoomPreviewProps) {
  const [internalChartIndex, setInternalChartIndex] = useState(0);
  const [dataRoomData, setDataRoomData] = useState<DataRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [internalZoomStates, setInternalZoomStates] = useState<Record<ZoomKey, ZoomState>>(zoomDefaults);

  const activeChartIndex = externalChartIndex !== undefined ? externalChartIndex : internalChartIndex;
  const zoomStates = externalZoomStates || internalZoomStates;

  const setActiveChartIndex = (index: number) => {
    if (onChartIndexChange) {
      onChartIndexChange(index);
    } else {
      setInternalChartIndex(index);
    }
  };

  const setZoomStates = (updater: (prev: Record<ZoomKey, ZoomState>) => Record<ZoomKey, ZoomState>) => {
    const newStates = updater(zoomStates);
    if (onZoomStatesChange) {
      onZoomStatesChange(newStates);
    } else {
      setInternalZoomStates(newStates);
    }
  };

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

  const resetZoom = (key: ZoomKey) => {
    setZoomStates((prev) => ({ ...prev, [key]: zoomDefaults[key] }));
  };

  const handlePrevChart = () => {
    const newIndex = activeChartIndex === 0 ? chartDefinitions.length - 1 : activeChartIndex - 1;
    setActiveChartIndex(newIndex);
  };

  const handleNextChart = () => {
    const newIndex = activeChartIndex === chartDefinitions.length - 1 ? 0 : activeChartIndex + 1;
    setActiveChartIndex(newIndex);
  };

  // Dummy handlers for preview (tooltips not shown in compact view)
  const handleShowTooltip = () => {};
  const handleHideTooltip = () => {};

  const renderCarouselContent = () => {
    if (loading) {
      return <div className="h-48 bg-[#13243A] rounded flex items-center justify-center text-sm text-[#C8D5EA]">Loading data...</div>;
    }
    return (
      <ChartRenderer
        dataRoomData={dataRoomData}
        activeChartId={activeChart.id}
        variant="compact"
        zoomStates={zoomStates}
        onResetZoom={resetZoom}
        onShowTooltip={handleShowTooltip}
        onHideTooltip={handleHideTooltip}
      />
    );
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
          onClick={onOpenFull}
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
    </div>
  );
}

