'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DailyPopup, normalizeDayDate } from '@/components/daily';
import type { DayData } from '@/components/daily';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

interface DailyPageClientProps {
  day: DayData | null;
  date: string;
  nextDate?: string | null;
  prevDate?: string | null;
}

export default function DailyPageClient({ day, date, nextDate, prevDate }: DailyPageClientProps) {
  useChatVisibility(false);
  const router = useRouter();

  if (!day) {
    return (
      <div className="h-full bg-page-bg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-card-bg rounded-2xl p-6 text-center text-slate border border-border-beige min-h-[250px] flex items-center justify-center shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
            No data available for {date}.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-page-bg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <DailyPopup
          mode="page"
          day={day}
          onClose={() => router.push('/')}
          nextDate={nextDate}
          prevDate={prevDate}
          onNavigateToDay={(d) => {
            router.push(`/daily/${normalizeDayDate(d)}`);
          }}
        />
      </div>
    </div>
  );
}
