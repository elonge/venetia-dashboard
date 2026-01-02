'use client';

import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { DayData } from './types';
import { PEOPLE_IMAGES } from '@/constants';

const ProximityMap = dynamic(() => import('@/components/data-room/ProximityMap'), {
  ssr: false,
});

interface DailyWidgetProps {
  day: DayData;
  onClick: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
  isPrevDisabled?: boolean;
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

export default function DailyWidget({ 
  day, 
  onClick, 
  onNext, 
  onPrev,
  isNextDisabled,
  isPrevDisabled
}: DailyWidgetProps) {
  const date = parseDate(day.date);
  const formattedDate = date ? format(date, 'MMMM d, yyyy') : day.date;
  const previewText = getPreviewText(day);
  const weatherEmoji = weatherToEmoji(day.weather);
  const firstLetter = day.letters?.[0];
  const firstDiary = !firstLetter && day.diaries_summary?.[0];
  
  let headline = firstLetter?.summary;
  if (!headline) {
    if (day.letters && day.letters.length > 0) {
      headline = 'A day in the correspondence';
    } else if (firstDiary) {
      headline = firstDiary.summary || 'A day in the diaries';
    } else if (day.pm_activities || day.venetia_activities) {
      headline = 'Daily Movements';
    } else {
      headline = 'Historical Context';
    }
  }

  const topics = firstLetter?.topics ?? [];
  const primaryScore = pickPrimaryScore(day);

  const hasMeeting = day.meeting_reference && 
    (day.meeting_reference.toLowerCase().includes('yes') || 
     day.meeting_reference.toLowerCase().includes('met'));
  
  const letterCount = day.letters?.length ?? 0;
  const primaryLocation = day.pm_location || day.venetia_location || null;

  const diaryWriterImage = firstDiary ? PEOPLE_IMAGES[firstDiary.writer] || PEOPLE_IMAGES[Object.keys(PEOPLE_IMAGES).find(k => k.includes(firstDiary.writer)) || ''] : null;

  const pmCoords = day.asquith_venetia_proximity?.geo_coords?.pm;
  const venetiaCoords = day.asquith_venetia_proximity?.geo_coords?.venetia;
  const hasMapCoords = 
    pmCoords?.lat != null && pmCoords?.lng != null && 
    venetiaCoords?.lat != null && venetiaCoords?.lng != null;

  return (
    <div
      onClick={onClick}
      className="w-full cursor-pointer rounded-md bg-card-bg p-4 md:p-6 border border-border-beige shadow-[0_18px_40px_rgba(0,0,0,0.12)] hover:-translate-y-[1px] hover:shadow-[0_26px_54px_rgba(0,0,0,0.14)] transition-all text-left group relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 md:gap-4">
        <div className="inline-flex items-center rounded-md bg-accent-brown px-2 py-1 text-[10px] md:text-[11px] font-semibold tracking-[0.14em] uppercase text-card-bg shadow-sm">
          Today in History
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {hasMeeting && (
            <span className="inline-flex items-center rounded-full border border-accent-green/20 bg-accent-green/10 px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-[11px] font-medium text-accent-green">
              Met
            </span>
          )}
          {weatherEmoji && (
            <span
              className="text-xl md:text-2xl leading-none"
              aria-label={day.weather ? `Weather: ${day.weather}` : 'Weather'}
              title={day.weather || 'Weather'}
            >
              {weatherEmoji}
            </span>
          )}
        </div>
      </div>

      {/* Date & Navigation */}
      <div className="mt-2 md:mt-3 flex items-center justify-between gap-4">
        <div className="font-serif text-2xl md:text-[34px] leading-[1.05] font-semibold tracking-tight text-navy">
          {formattedDate}
        </div>

        {/* Navigation Controls */}
        {(onPrev || onNext) && (
          <div className="flex items-center bg-page-bg/50 rounded-md border border-border-beige p-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev?.();
              }}
              disabled={isPrevDisabled}
              className="cursor-pointer p-1.5 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-navy"
              title="Previous Day"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="w-px h-5 bg-border-beige mx-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              disabled={isNextDisabled}
              className="cursor-pointer p-1.5 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-navy"
              title="Next Day"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      <div className="mt-2 md:mt-3 h-px w-full bg-border-beige opacity-50" />

      {/* Content */}
      <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-[1fr_280px] md:gap-8">
        {/* Left */}
        <div className="md:pr-2">
          <div className="font-serif text-lg md:text-xl font-semibold text-navy leading-snug">
            {headline}
          </div>
          {firstDiary && (
            <div className="flex items-center gap-2 my-2">
              {diaryWriterImage && (
                <img 
                  src={diaryWriterImage} 
                  alt={firstDiary.writer} 
                  className="w-6 h-6 rounded-full object-cover border border-border-beige"
                />
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-accent-brown">
                {firstDiary.writer}
              </span>
            </div>
          )}

          <p className="mt-2 md:mt-3 font-serif italic text-sm md:text-[15px] text-navy leading-relaxed line-clamp-3 md:line-clamp-4 max-w-full">
            {previewText ? `"${previewText}"` : 'Read the entry for this day.'}
          </p>

          <div className="mt-4 md:mt-5 flex flex-wrap items-center gap-1.5 md:gap-2">
            {topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-full border border-border-beige bg-page-bg/55 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs text-slate"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="mt-4 md:mt-6 md:mt-0 md:border-l md:border-border-beige/50 md:pl-6 flex flex-col justify-between">
          <div>
            {primaryScore && (
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-gray">
                    {primaryScore.label}
                  </div>
                  <div className="text-xs font-semibold tabular-nums text-navy">
                    {primaryScore.value}/10
                  </div>
                </div>
                <div className="mt-2 h-3 w-full rounded-full bg-section-bg">
                  <div
                    className="h-3 rounded-full bg-accent-brown"
                    style={{ width: `${Math.max(0, Math.min(100, (primaryScore.value / 10) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            {/* Proximity Map */}
            {hasMapCoords && pmCoords && venetiaCoords && (
              <div className="mt-4 md:mt-5 w-full h-40 rounded-sm overflow-hidden border border-border-beige shadow-sm">
                <ProximityMap 
                  pm={{ lat: pmCoords.lat!, lng: pmCoords.lng! }} 
                  venetia={{ lat: venetiaCoords.lat!, lng: venetiaCoords.lng! }} 
                />
              </div>
            )}

            <div className="mt-4 md:mt-5 space-y-2 md:space-y-3 text-xs md:text-sm text-navy">
              {day.pm_location && (
                <div className="flex items-start gap-1.5 md:gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-slate">PM:</span>{' '}
                    <span className="truncate">{day.pm_location}</span>
                  </div>
                </div>
              )}
              {day.venetia_location && (
                <div className="flex items-start gap-1.5 md:gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-slate">Venetia:</span>{' '}
                    <span className="truncate">{day.venetia_location}</span>
                  </div>
                </div>
              )}
              {!day.pm_location && !day.venetia_location && primaryLocation && (
                <div className="flex items-start gap-1.5 md:gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-slate">Location:</span>{' '}
                    <span className="truncate">{primaryLocation}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 md:mt-6 flex items-center justify-end">
            <div className="inline-flex items-center gap-2 rounded-md bg-navy/5 px-3 py-1.5 text-xs md:text-sm font-bold text-navy border border-navy/10 group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-all duration-300 shadow-sm whitespace-nowrap">
              <span>Read Full Analysis</span>
              <span className="text-lg leading-none">→</span>
            </div>
          </div>
        </div>
      </div>
        </div>
      );
    }
    