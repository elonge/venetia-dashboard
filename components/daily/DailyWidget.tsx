'use client';

import React from 'react';
import { format } from 'date-fns';
import type { DayData } from './types';

interface DailyWidgetProps {
  day: DayData;
  onClick: () => void;
}

// Helper to parse date from various formats
function parseDate(dateStr: string): Date | null {
  // Handle datetime(1913, 1, 15) format
  const datetimeMatch = dateStr.match(/datetime\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (datetimeMatch) {
    const [, year, month, day] = datetimeMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  // Handle YYYY-MM-DD format
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  // Try standard Date parsing
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function weatherToEmoji(weather?: string): string | null {
  if (!weather) return null;
  const w = weather.toLowerCase();
  if (w.includes('snow') || w.includes('sleet')) return '❄️';
  if (w.includes('thunder') || w.includes('storm')) return '⛈️';
  if (w.includes('rain') || w.includes('shower') || w.includes('drizzle')) return '🌧️';
  if (w.includes('fog') || w.includes('mist')) return '🌫️';
  if (w.includes('cloud') || w.includes('overcast')) return '☁️';
  if (w.includes('sun') || w.includes('clear') || w.includes('fine')) return '☀️';
  if (w.includes('wind')) return '💨';
  return '🌤️';
}

function getPreviewText(day: DayData): string | null {
  const firstLetter = day.letters?.[0];
  if (firstLetter?.excerpt) return firstLetter.excerpt;
  const firstDiary = day.diaries_summary?.[0]?.excerpt;
  if (firstDiary) return firstDiary;
  if (day.pm_activities) return day.pm_activities;
  if (day.venetia_activities) return day.venetia_activities;
  return null;
}

function pickPrimaryScore(day: DayData): { label: string; value: number } | null {
  const scores = day.letters?.[0]?.scores;
  if (!scores) return null;

  const candidates: Array<{ label: string; value?: number }> = [
    { label: 'Emotional Desolation', value: scores.emotional_desolation },
    { label: 'Romantic Adoration', value: scores.romantic_adoration },
    { label: 'Political Unburdening', value: scores.political_unburdening },
  ];

  const valid = candidates.filter((c) => typeof c.value === 'number') as Array<{
    label: string;
    value: number;
  }>;
  if (valid.length === 0) return null;

  valid.sort((a, b) => b.value - a.value);
  return valid[0];
}

export default function DailyWidget({ day, onClick }: DailyWidgetProps) {
  const date = parseDate(day.date);
  const formattedDate = date ? format(date, 'MMMM d, yyyy') : day.date;
  const previewText = getPreviewText(day);
  const weatherEmoji = weatherToEmoji(day.weather);
  const firstLetter = day.letters?.[0];
  const headline = firstLetter?.summary || 'A day in the correspondence';
  const topics = firstLetter?.topics ?? [];
  const primaryScore = pickPrimaryScore(day);

  const hasMeeting = day.meeting_reference && 
    (day.meeting_reference.toLowerCase().includes('yes') || 
     day.meeting_reference.toLowerCase().includes('met'));
  
  const letterCount = day.letters?.length ?? 0;
  const primaryLocation = day.pm_location || day.venetia_location || null;

  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full rounded-2xl bg-[#F5F0E8] p-6! border border-[#E2D8C8] shadow-[0_18px_40px_rgba(0,0,0,0.12)] hover:-translate-y-[1px] hover:shadow-[0_26px_54px_rgba(0,0,0,0.14)] transition-all text-left group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex items-center rounded-md bg-[#B58A2A] px-2 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#FDFBF7] shadow-sm">
          Today in History
        </div>
        <div className="flex items-center gap-2">
          {hasMeeting && (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800">
              Met
            </span>
          )}
          {weatherEmoji && (
            <span
              className="text-2xl leading-none"
              aria-label={day.weather ? `Weather: ${day.weather}` : 'Weather'}
              title={day.weather || 'Weather'}
            >
              {weatherEmoji}
            </span>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="mt-3">
        <div className="font-serif text-[34px] leading-[1.05] font-semibold tracking-tight text-[#1A2A40]">
          {formattedDate}
        </div>
        <div className="mt-3 h-px w-full bg-[#D8D1C6]" />
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_280px] md:gap-8">
        {/* Left */}
        <div className="md:pr-2">
          <div className="font-serif text-xl font-semibold text-[#1A2A40] leading-snug">
            {headline}
          </div>

          <p className="mt-3 font-serif italic text-[15px] text-[#1A2A40] leading-relaxed line-clamp-4 max-w-full">
            {previewText ? `"${previewText}"` : 'Read the entry for this day.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-full border border-[#D8D1C6] bg-white/55 px-3 py-1 text-xs text-[#2D3648]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="mt-6 md:mt-0 md:border-l md:border-[#D8D1C6] md:pl-6 flex flex-col justify-between">
          <div>
            {primaryScore ? (
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-xs font-semibold tracking-[0.12em] uppercase text-[#3E4A60]">
                    {primaryScore.label}
                  </div>
                  <div className="text-xs font-semibold tabular-nums text-[#1A2A40]">
                    {primaryScore.value}/10
                  </div>
                </div>
                <div className="mt-2 h-3 w-full rounded-full bg-[#E6DED2]">
                  <div
                    className="h-3 rounded-full bg-[#6B4A2B]"
                    style={{ width: `${Math.max(0, Math.min(100, (primaryScore.value / 10) * 100))}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs font-medium text-[#3E4A60]">No score available</div>
            )}

            <div className="mt-5 space-y-3 text-sm text-[#1A2A40]">
              {day.pm_location && (
                <div className="flex items-start gap-2">
                  <span className="mt-0.5" aria-hidden="true">
                    🏛️
                  </span>
                  <div className="min-w-0">
                    <span className="font-medium text-[#2D3648]">PM:</span>{' '}
                    <span className="truncate">{day.pm_location}</span>
                  </div>
                </div>
              )}
              {day.venetia_location && (
                <div className="flex items-start gap-2">
                  <span className="mt-0.5" aria-hidden="true">
                    👩
                  </span>
                  <div className="min-w-0">
                    <span className="font-medium text-[#2D3648]">Venetia:</span>{' '}
                    <span className="truncate">{day.venetia_location}</span>
                  </div>
                </div>
              )}
              {!day.pm_location && !day.venetia_location && primaryLocation && (
                <div className="flex items-start gap-2">
                  <span className="mt-0.5" aria-hidden="true">
                    📍
                  </span>
                  <div className="min-w-0">
                    <span className="font-medium text-[#2D3648]">Location:</span>{' '}
                    <span className="truncate">{primaryLocation}</span>
                  </div>
                </div>
              )}

              {letterCount > 0 && (
                <div className="flex items-start gap-2">
                  <span className="mt-0.5" aria-hidden="true">
                    ✉️
                  </span>
                  <div className="min-w-0">
                    <span className="font-medium text-[#2D3648]">Letters:</span>{' '}
                    <span className="tabular-nums">{letterCount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <div className="text-sm font-semibold text-[#1A2A40] group-hover:text-[#6B2D3C] transition-colors whitespace-nowrap">
              Read Full Analysis →
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
