'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

interface DataRoomPreviewProps {
  href?: string;
}

export default function DataRoomPreview({
  href = '/data-room',
}: DataRoomPreviewProps) {
  return (
    <div className="relative h-full w-full cursor-pointer">
      <Link
        href={href}
        aria-label="Open Data Room"
        className="group relative block w-full overflow-hidden rounded-lg bg-[#F5F0E8] p-6 text-left transition-all duration-300 min-h-[160px] md:min-h-[180px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-lg border border-[#D4CFC4] hover:border-[#A67C52]"
      >
        
        {/* 1. BACKGROUND CHART VISUAL (The "Data" Texture) */}
        {/* A subtle financial/historical chart line at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 opacity-30 pointer-events-none group-hover:scale-105 transition-transform duration-700 origin-bottom">
           <svg viewBox="0 0 400 100" className="w-full h-full text-[#A67C52]" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M0 80 C40 80, 60 40, 100 50 C140 60, 160 90, 200 70 C240 50, 260 20, 300 30 C340 40, 360 10, 400 5" vectorEffect="non-scaling-stroke" />
             <path d="M0 90 C40 90, 60 70, 100 75 C140 80, 160 95, 200 85 C240 75, 260 60, 300 65 C340 70, 360 50, 400 45" strokeOpacity="0.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
           </svg>
        </div>

        {/* 2. CONTENT LAYER */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          
          <div>
            {/* Label: Replaces the colored waves with a strict "Analytics" tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1A2A40] group-hover:bg-[#C24E42] transition-colors"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B4513]">
                Analytics
              </span>
            </div>

            {/* Title: Navy Serif for Authority */}
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1A2A40] mb-2 group-hover:text-[#C24E42] transition-colors">
              THE DATA ROOM
            </h3>

            {/* Description: Archival Grey */}
            <p className="mt-2 max-w-[90%] text-[#5A6472] text-sm md:text-[15px] font-serif leading-relaxed">
              Explore correspondence patterns, sentiment analysis, and metadata.
            </p>
          </div>

          {/* 3. FOOTER ICON */}
          <div className="flex justify-end mt-2">
            <div className="p-2 rounded-full bg-[#1A2A40]/5 group-hover:bg-[#1A2A40] transition-all text-[#1A2A40] group-hover:text-[#F5F0E8]">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}