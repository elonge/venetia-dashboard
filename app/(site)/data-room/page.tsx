'use client';

import React, { Suspense, useCallback, useMemo } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const handleClose = useCallback(() => {
    const from = searchParams.get('from');
    if (from && from.startsWith('/')) {
      router.push(from);
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  }, [router, searchParams]);

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
    <div className="min-h-screen bg-[#E8E4DC]">
      <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[#1A2A40]"
            onClick={handleClose}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Timeline
          </Button>
          <div className="h-6 w-px bg-[#D4CFC4]" />
          <h1 className="text-[#1A2A40] font-serif text-2xl font-medium">
            The Venetia Project
          </h1>
        </div>
        <span className="text-[#6B7280] text-base">Data Room</span>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

      <main className="h-[calc(100vh-73px)] max-w-7xl mx-auto px-6 py-6">
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
