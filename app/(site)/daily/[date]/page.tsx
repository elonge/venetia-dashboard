'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DailyPopup, getDayByDate, getNextDay, getPreviousDay, normalizeDayDate } from '@/components/daily';
import type { DayData } from '@/components/daily';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

export default function DailyPage() {
  useChatVisibility(false);

  const params = useParams<{ date?: string | string[] }>();
  const router = useRouter();
  const [allDays, setAllDays] = useState<DayData[]>([]);
  const [loadingDays, setLoadingDays] = useState(true);
  const rawDate = params?.date ? (Array.isArray(params.date) ? params.date[0] : params.date) : '';
  const normalizedDate = normalizeDayDate(rawDate);

  useEffect(() => {
    let cancelled = false;

    async function loadDays() {
      try {
        const response = await fetch('/api/daily_records');
        const fallbackResponse = response.ok ? null : await fetch('/api/mock_days');

        const okResponse = response.ok ? response : fallbackResponse;
        if (!okResponse || !okResponse.ok) throw new Error('Failed to load daily records');

        const data = (await okResponse.json()) as DayData[];
        if (!cancelled) setAllDays(data);
      } catch (error) {
        console.error('Error loading days:', error);
        if (!cancelled) setAllDays([]);
      } finally {
        if (!cancelled) setLoadingDays(false);
      }
    }

    loadDays();
    return () => {
      cancelled = true;
    };
  }, []);

  const day = useMemo(() => {
    if (allDays.length === 0) return null;
    return getDayByDate(allDays, normalizedDate);
  }, [allDays, normalizedDate]);

  return (
    <div className="h-full bg-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loadingDays ? (
          <div className="bg-[#F5F0E8] rounded-2xl p-6 text-center text-[#2D3648] border border-[#D4CFC4] min-h-[250px] flex items-center justify-center shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
            Loading daily entry...
          </div>
        ) : day ? (
          <DailyPopup
            mode="page"
            day={day}
            allDays={allDays}
            onClose={() => router.push('/')}
            getNextDay={async (date) => {
              const next = getNextDay(allDays, date);
              return next ? Promise.resolve(next) : Promise.resolve(null);
            }}
            getPreviousDay={async (date) => {
              const prev = getPreviousDay(allDays, date);
              return prev ? Promise.resolve(prev) : Promise.resolve(null);
            }}
            onNavigateToDay={(date) => {
              router.replace(`/daily/${normalizeDayDate(date)}`);
            }}
          />
        ) : (
          <div className="bg-[#F5F0E8] rounded-2xl p-6 text-center text-[#2D3648] border border-[#D4CFC4] min-h-[250px] flex items-center justify-center shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
            No data available for {normalizedDate}.
          </div>
        )}
      </div>
    </div>
  );
}
