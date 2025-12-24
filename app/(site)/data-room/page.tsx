'use client';

import React, { Suspense, useCallback, useMemo } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DataRoomFull from '@/components/data-room/DataRoomFull';
import { chartDefinitions } from '@/components/data-room/dataRoomTypes';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

function getChartIndexFromParams(params: ReadonlyURLSearchParams): number {
  const chartId = params.get('chart');
  if (chartId) {
    const index = chartDefinitions.findIndex((chart) => chart.id === chartId);
    if (index >= 0) return index;
  }

  const chartIndexParam = params.get('chartIndex');
  if (chartIndexParam) {
    const index = Number.parseInt(chartIndexParam, 10);
    if (Number.isFinite(index) && index >= 0 && index < chartDefinitions.length) {
      return index;
    }
  }

  return 0;
}

function DataRoomContent() {
  useChatVisibility(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialChartIndex = useMemo(
    () => getChartIndexFromParams(searchParams),
    [searchParams]
  );

  const handleChartIndexChange = useCallback(
    (index: number) => {
      const chartId = chartDefinitions[index]?.id;
      if (!chartId) return;

      const next = new URLSearchParams(searchParams.toString());
      next.set('chart', chartId);
      next.delete('chartIndex');
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="bg-[#E8E4DC] md:h-full">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 md:h-full">
        <DataRoomFull
          initialChartIndex={initialChartIndex}
          onChartIndexChange={handleChartIndexChange}
        />
      </main>
    </div>
  );
}

export default function DataRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E8E4DC] flex items-center justify-center">
          <div className="text-[#1A2A40]">Loading...</div>
        </div>
      }
    >
      <DataRoomContent />
    </Suspense>
  );
}
