'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { DailyPopup, DayData, getDayByDate, getNextDay, getPreviousDay, normalizeDayDate } from '@/components/daily';
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
        const response = await fetch('/api/mock_days');
        if (!response.ok) throw new Error('Failed to load mock days');
        const data = (await response.json()) as DayData[];
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
    <div className="min-h-screen bg-[#E8E4DC]">
      <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#1A2A40] hover:text-[#4A7C59] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <h1 className="font-serif text-lg font-medium">The Venetia Project</h1>
          </Link>
        </div>
        <span className="text-[#6B7280] text-base">Daily View</span>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

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
