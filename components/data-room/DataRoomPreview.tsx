'use client';

import React from 'react';
import { ZoomKey, ZoomState, zoomDefaults } from './dataRoomTypes';

interface DataRoomPreviewProps {
  onOpenFull?: () => void;
  activeChartIndex?: number;
  onChartIndexChange?: (index: number) => void;
  zoomStates?: Record<ZoomKey, ZoomState>;
  onZoomStatesChange?: (states: Record<ZoomKey, ZoomState>) => void;
}

export default function DataRoomPreview({ 
  onOpenFull,
}: DataRoomPreviewProps) {
  return (
    <div className="relative mb-4 dataroom-preview">
      {/* Star icon in bottom right corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 text-white/30 dataroom-star z-10">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>

      {/* Main card */}
      <button
        onClick={onOpenFull}
        className="w-full bg-[#15263E] border border-[#1F3350] rounded-lg p-6 hover:bg-[#1A2F4A] hover:border-[#23354D] transition-all cursor-pointer text-left relative overflow-hidden group hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(74,124,89,0.2),0_0_40px_rgba(74,124,89,0.1)]"
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A7C59]/0 via-[#4A7C59]/0 to-[#4A7C59]/0 group-hover:from-[#4A7C59]/5 group-hover:via-[#4A7C59]/0 group-hover:to-[#4A7C59]/5 transition-all duration-500 pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          {/* Left section - Text */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#EAF2FF] transition-colors">
              The Data Room
            </h3>
            <p className="text-sm text-[#9AAFD0] mb-4 group-hover:text-[#C8D5EA] transition-colors">
              Explore correspondence patterns.
            </p>
            <div className="inline-flex items-center gap-1 text-[#4A7C59] font-semibold group-hover:text-[#5A8C69] transition-colors">
              <span>Open</span>
              <span className="text-lg dataroom-arrow">&gt;</span>
            </div>
          </div>

          {/* Right section - Wavy lines */}
          <div className="flex-shrink-0 ml-6 flex flex-col gap-3">
            {/* Red line */}
            <svg width="120" height="8" viewBox="0 0 120 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="dataroom-wave-1">
              <path
                d="M0 4C10 0 20 8 30 4C40 0 50 8 60 4C70 0 80 8 90 4C100 0 110 8 120 4"
                stroke="#EF4444"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                className="group-hover:stroke-[#F87171] transition-colors"
              />
            </svg>
            {/* Green line */}
            <svg width="120" height="8" viewBox="0 0 120 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="dataroom-wave-2">
              <path
                d="M0 4C10 8 20 0 30 4C40 8 50 0 60 4C70 8 80 0 90 4C100 8 110 0 120 4"
                stroke="#22C55E"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                className="group-hover:stroke-[#4ADE80] transition-colors"
              />
            </svg>
            {/* Yellow line */}
            <svg width="120" height="8" viewBox="0 0 120 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="dataroom-wave-3">
              <path
                d="M0 4C10 2 20 6 30 4C40 2 50 6 60 4C70 2 80 6 90 4C100 2 110 6 120 4"
                stroke="#EAB308"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                className="group-hover:stroke-[#FCD34D] transition-colors"
              />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

