'use client';

import React from 'react';
import { Calendar, MapPin, Mail, Users } from 'lucide-react';
import { format } from 'date-fns';

export interface DayData {
  date: string; // Format: "1913-01-15" or datetime(1913, 1, 15) string
  letters?: Array<{
    summary: string;
    excerpt?: string;
    topics?: string[];
    letter_number?: number;
    time_of_day?: string;
    people_mentioned?: string[];
    scores?: {
      romantic_adoration?: number;
      political_unburdening?: number;
      emotional_desolation?: number;
    };
  }>;
  pm_activities?: string;
  pm_location?: string;
  venetia_activities?: string;
  venetia_location?: string;
  meeting_reference?: string;
  politics?: {
    parliament?: string;
    cabinet?: string;
  };
  pm_mood_witness?: string;
  diaries_summary?: Array<{
    writer: string;
    excerpt: string;
  }>;
  weather?: string;
}

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

export default function DailyWidget({ day, onClick }: DailyWidgetProps) {
  const date = parseDate(day.date);
  const formattedDate = date ? format(date, 'MMM d, yyyy') : day.date;
  
  const firstLetter = day.letters?.[0];
  const hasMeeting = day.meeting_reference && 
    (day.meeting_reference.toLowerCase().includes('yes') || 
     day.meeting_reference.toLowerCase().includes('met'));
  
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#F5F0E8] rounded-lg p-4 border-2 border-[#D4CFC4] hover:border-[#6B2D3C] hover:shadow-md transition-all text-left group"
    >
      {/* Date Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6B2D3C]" />
          <span className="font-serif text-lg font-semibold text-[#1A2A40]">
            {formattedDate}
          </span>
        </div>
        {hasMeeting && (
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded-full">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-xs text-emerald-800 font-medium">Met</span>
          </div>
        )}
      </div>

      {/* Preview Content */}
      <div className="space-y-2">
        {/* Letter Excerpt */}
        {firstLetter?.excerpt && (
          <div className="bg-white/50 rounded p-3 border-l-4 border-[#6B2D3C]">
            <p className="font-serif text-sm text-[#1A2A40] italic line-clamp-2">
              "{firstLetter.excerpt}"
            </p>
          </div>
        )}

        {/* Locations */}
        <div className="flex items-start gap-4 text-xs text-[#2D3648]">
          {day.pm_location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="font-semibold">PM:</span>
              <span>{day.pm_location}</span>
            </div>
          )}
          {day.venetia_location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="font-semibold">Venetia:</span>
              <span>{day.venetia_location}</span>
            </div>
          )}
        </div>

        {/* Letter Count & Topics */}
        <div className="flex items-center gap-4 text-xs">
          {day.letters && day.letters.length > 0 && (
            <div className="flex items-center gap-1 text-[#2D3648]">
              <Mail className="w-3 h-3" />
              <span>{day.letters.length} letter{day.letters.length > 1 ? 's' : ''}</span>
            </div>
          )}
          {firstLetter?.topics && firstLetter.topics.length > 0 && (
            <div className="flex items-center gap-1 text-[#2D3648]">
              <Users className="w-3 h-3" />
              <span>{firstLetter.topics.slice(0, 2).join(', ')}</span>
              {firstLetter.topics.length > 2 && <span>...</span>}
            </div>
          )}
        </div>

        {/* Weather */}
        {day.weather && (
          <div className="text-xs text-[#3E4A60] italic">
            Weather: {day.weather}
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <div className="mt-3 pt-3 border-t border-[#D4CFC4] text-xs text-[#3E4A60] group-hover:text-[#6B2D3C] transition-colors">
        Click to view full details →
      </div>
    </button>
  );
}

