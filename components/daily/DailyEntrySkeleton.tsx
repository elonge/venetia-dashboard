'use client';

import React from 'react';

export default function DailyEntrySkeleton() {
  return (
    <div className="bg-[#F5F0E8] rounded-2xl border border-[#D4CFC4] min-h-[250px] shadow-[0_14px_34px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="p-6 border-b-2 border-[#D4CFC4] bg-white/80">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-[220px] space-y-2 animate-pulse">
            <div className="h-7 w-56 rounded bg-[#D8D1C6]/70" />
            <div className="h-3 w-36 rounded bg-[#D8D1C6]/50" />
          </div>
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-10 w-10 rounded-sm bg-[#D8D1C6]/60" />
            <div className="h-10 w-10 rounded-sm bg-[#D8D1C6]/60" />
            <div className="h-10 w-10 rounded-sm bg-[#D8D1C6]/60" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-11/12 rounded bg-[#D8D1C6]/50" />
          <div className="h-4 w-10/12 rounded bg-[#D8D1C6]/50" />
          <div className="h-4 w-9/12 rounded bg-[#D8D1C6]/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-3">
            <div className="h-5 w-48 rounded bg-[#D8D1C6]/60" />
            <div className="h-4 w-full rounded bg-[#D8D1C6]/45" />
            <div className="h-4 w-11/12 rounded bg-[#D8D1C6]/45" />
            <div className="h-4 w-10/12 rounded bg-[#D8D1C6]/45" />
            <div className="mt-4 flex gap-2">
              <div className="h-7 w-20 rounded-full bg-[#D8D1C6]/50" />
              <div className="h-7 w-24 rounded-full bg-[#D8D1C6]/50" />
              <div className="h-7 w-16 rounded-full bg-[#D8D1C6]/50" />
            </div>
          </div>

          <div className="space-y-4 md:border-l md:border-[#D8D1C6] md:pl-6">
            <div className="h-4 w-32 rounded bg-[#D8D1C6]/55" />
            <div className="h-3 w-full rounded bg-[#D8D1C6]/45" />
            <div className="h-3 w-10/12 rounded bg-[#D8D1C6]/45" />
            <div className="h-3 w-9/12 rounded bg-[#D8D1C6]/45" />
          </div>
        </div>
      </div>
    </div>
  );
}

