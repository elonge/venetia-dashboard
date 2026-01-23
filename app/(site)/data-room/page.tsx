'use client';

import { WithContext, Dataset } from 'schema-dts'; 
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
    <div className="bg-page-bg md:h-full">
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
const jsonLd: WithContext<Dataset> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'The Venetia Stanley Correspondence Dataset',
    description: 'A structured archive of 500+ letters between H.H. Asquith and Venetia Stanley (1912-1915), including sentiment analysis and geo-temporal metadata.',
    url: 'https://www.thevenetiaproject.com/data-room',
    creator: {
      '@type': 'Organization',
      name: 'The Venetia Project',
    },
    isAccessibleForFree: true,
    temporalCoverage: '1912-01-01/1915-05-31', // The exact date range of your history
  };  
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-page-bg flex items-center justify-center">
          <div className="text-navy">Loading...</div>
        </div>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DataRoomContent />
    </Suspense>
  );
}