'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DailyPopup, normalizeDayDate } from '@/components/daily';
import type { DayData } from '@/components/daily';
import { useChatVisibility } from '@/components/chat/useChatVisibility';
import DailyEntrySkeleton from '@/components/daily/DailyEntrySkeleton';

export default function DailyPage() {
  useChatVisibility(false);

  const params = useParams<{ date?: string | string[] }>();
  const router = useRouter();
  const [day, setDay] = useState<DayData | null>(null);
  const [loadingDay, setLoadingDay] = useState(true);
  const rawDate = params?.date ? (Array.isArray(params.date) ? params.date[0] : params.date) : '';
  const normalizedDate = normalizeDayDate(rawDate);

  useEffect(() => {
    let cancelled = false;

    async function loadDay() {
      try {
        setLoadingDay(true);
        const response = await fetch(`/api/daily_records/${encodeURIComponent(normalizedDate)}`);
        if (!response.ok) throw new Error(`Failed to load daily record for ${normalizedDate}`);
        const data = (await response.json()) as DayData;
        if (!cancelled) setDay(data);
      } catch (error) {
        console.error('Error loading day:', error);
        if (!cancelled) setDay(null);
      } finally {
        if (!cancelled) setLoadingDay(false);
      }
    }

    if (normalizedDate) loadDay();
    return () => {
      cancelled = true;
    };
  }, [normalizedDate]);

  return (
    <div className="h-full bg-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loadingDay ? (
          <DailyEntrySkeleton />
        ) : day ? (
          <DailyPopup
            mode="page"
            day={day}
            onClose={() => router.push('/')}
            getNextDay={async (date) => {
              const response = await fetch(
                `/api/daily_records/next?date=${encodeURIComponent(normalizeDayDate(date))}`
              );
              if (!response.ok) return null;
              return (await response.json()) as DayData;
            }}
            getPreviousDay={async (date) => {
              const response = await fetch(
                `/api/daily_records/previous?date=${encodeURIComponent(normalizeDayDate(date))}`
              );
              if (!response.ok) return null;
              return (await response.json()) as DayData;
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
