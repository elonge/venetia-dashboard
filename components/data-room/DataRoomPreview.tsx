'use client';

import React from 'react';
import Link from 'next/link';
import type { ZoomKey, ZoomState } from './dataRoomTypes';

interface DataRoomPreviewProps {
  href?: string;
  activeChartIndex?: number;
  onChartIndexChange?: (index: number) => void;
  zoomStates?: Record<ZoomKey, ZoomState>;
  onZoomStatesChange?: (states: Record<ZoomKey, ZoomState>) => void;
  variant?: 'default' | 'compact';
}

function DecorativeWaves({ compact }: { compact: boolean }) {
  const width = compact ? 78 : 120;
  const height = compact ? 30 : 40;
  const strokeWidth = compact ? 2.2 : 2.6;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-85 transition-opacity duration-300 group-hover:opacity-100"
      aria-hidden="true"
    >
      <path
        d="M4 11C16 6 26 16 38 11C50 6 60 16 72 11C84 6 94 16 116 11"
        stroke="#F87171"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M4 20C16 25 26 15 38 20C50 25 60 15 72 20C84 25 94 15 116 20"
        stroke="#34D399"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M4 29C16 27 26 31 38 29C50 27 60 31 72 29C84 27 94 31 116 29"
        stroke="#FBBF24"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DataRoomPreview({
  href = '/data-room',
  variant = 'default',
}: DataRoomPreviewProps) {
  const isCompact = variant === 'compact';

  return (
    <div className="relative h-full w-full cursor-pointer">
      <Link
        href={href}
        aria-label="Open Data Room"
        className={`group relative block w-full overflow-hidden rounded-2xl border border-[#1F3350] text-left transition-all ${
          isCompact ? 'min-h-[140px] md:min-h-27.5 p-3 md:p-4' : 'min-h-[200px] md:min-h-62.5 p-4 md:p-6'
        } hover:-translate-y-px hover:border-[#2A3D5D] shadow-[0_14px_34px_rgba(0,0,0,0.10)] hover:shadow-[0_18px_44px_rgba(0,0,0,0.14)]`}
      >
        <div className="absolute inset-0 bg-linear-to-br from-[#1C3555] via-[#12243A] to-[#0B1626]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_-10%_-30%,rgba(255,255,255,0.18),transparent_58%)] opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

        <div className="relative z-10 flex w-full items-start justify-between gap-3 md:gap-4">
          <div className="min-w-0 flex-1">
            <h3
              className={`font-serif font-semibold uppercase tracking-[0.14em] text-white/95 ${
                isCompact ? 'text-base md:text-[18px]' : 'text-lg md:text-[22px] leading-none'
              }`}
            >
              THE DATA ROOM
            </h3>
            <p
              className={`mt-4 md:mt-8 max-w-[36ch] text-white/95 transition-colors group-hover:text-[#D6E2F5] ${
                isCompact ? 'text-sm md:text-[16px] leading-snug' : 'text-xs md:text-sm'
              }`}
            >
              Explore correspondence patterns &amp; sentiment.
            </p>
          </div>

          <div className={`shrink-0 ${isCompact ? 'pt-1' : 'pt-2'} flex items-start`}>
            <DecorativeWaves compact={isCompact} />
          </div>
        </div>

        {!isCompact ? (
          <div className="relative z-10 mt-4 md:mt-8 inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
            <span>Open</span>
            <span aria-hidden="true">→</span>
          </div>
        ) : null}

        <div className="absolute bottom-3 right-3 text-white/20">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
