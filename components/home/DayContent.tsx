import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { TimelineDayDocument } from '@/types';

// Dynamically import LocationMap with SSR disabled to prevent window is not defined error
const LocationMap = dynamic(() => import('./LocationMap'), {
  ssr: false,
});

interface DayContentProps {
  currentDate: string; // Format: "MAY 12, 1915"
}

// Helper function to convert "MAY 12, 1915" to "1915-05-12"
function convertDateToDateString(dateStr: string): string {
  const months: { [key: string]: string } = {
    'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
    'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
  };
  
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const month = months[parts[0].toUpperCase()] || '01';
    const day = parts[1].replace(',', '').padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateStr; // Return as-is if format doesn't match
}

// Helper function to map database data to display format
function mapTimelineDayToDisplayData(day: TimelineDayDocument | null) {
  if (!day) {
    return {
      quote: { text: '', context: '' },
      emotionalTone: '',
      parliament: '',
      cabinet: '',
      newspaper: '',
      locations: [],
      otherPeople: []
    };
  }

  // Get the first letter from Venetia to Asquith (PM) or vice versa for quote
  const firstVenetiaLetter = day.venetia?.letters_to_edwin?.[0];
  const firstPmLetter = day.prime_minister?.letters?.[0];
  
  const quoteText = firstPmLetter?.summary || firstVenetiaLetter?.summary || '';
  const quoteContext = firstPmLetter 
    ? `ASQUITH${day.prime_minister?.location ? ` at ${day.prime_minister.location}` : ''}. VENETIA${day.venetia?.location ? ` in ${day.venetia.location}` : ''}.`
    : firstVenetiaLetter
    ? `VENETIA${day.venetia?.location ? ` in ${day.venetia.location}` : ''}. ASQUITH${day.prime_minister?.location ? ` at ${day.prime_minister.location}` : ''}.`
    : '';

  // Emotional tone from letter mood
  const emotionalTone = firstVenetiaLetter?.mood 
    ? `Venetia's letter reveals a ${firstVenetiaLetter.mood.toLowerCase()} mood. ${firstVenetiaLetter.summary}`
    : firstPmLetter?.summary || '';

  // Parliament activity from context
  const parliament = day.context?.public_hansard || 'No parliamentary activity recorded.';

  // Cabinet activity from meeting details
  const cabinet = day.prime_minister?.meeting_details 
    ? day.prime_minister.meeting_details
    : day.prime_minister?.meeting_with_venetia
    ? 'Meeting with Venetia recorded.'
    : 'No cabinet activity recorded.';

  // Newspaper - using context or default
  const newspaper = day.context?.secret_churchill || 'No newspaper headlines available.';

  // Locations
  const locations = [];
  if (day.venetia?.location) {
    locations.push({ person: 'Venetia', location: day.venetia.location });
  }
  if (day.prime_minister?.location) {
    locations.push({ person: 'Asquith', location: day.prime_minister.location });
  }

  // Other people from diaries
  const otherPeople = (day.diaries || []).map(diary => ({
    name: diary.author,
    action: diary.entry || diary.pm_mood_observation || diary.venetia_mention || 'No details available.'
  }));

  return {
    quote: { text: quoteText ? `"${quoteText}"` : '', context: quoteContext },
    emotionalTone,
    parliament,
    cabinet,
    newspaper,
    locations,
    otherPeople
  };
}

export default function DayContent({ currentDate }: DayContentProps) {
  const [othersExpanded, setOthersExpanded] = useState(false);
  const [timelineDay, setTimelineDay] = useState<TimelineDayDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimelineDay() {
      setLoading(true);
      setError(null);
      try {
        const dateString = convertDateToDateString(currentDate);
        const response = await fetch(`/api/timeline_days/${encodeURIComponent(dateString)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setTimelineDay(null);
            setError('No data available for this date.');
          } else {
            throw new Error('Failed to fetch timeline day');
          }
        } else {
          const data = await response.json();
          setTimelineDay(data);
        }
      } catch (err) {
        console.error('Error fetching timeline day:', err);
        setError('Failed to load data for this date.');
        setTimelineDay(null);
      } finally {
        setLoading(false);
      }
    }

    if (currentDate) {
      fetchTimelineDay();
    }
  }, [currentDate]);

  const displayData = mapTimelineDayToDisplayData(timelineDay);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-[#F5F0E8] rounded-lg p-4 text-center text-[#6B7280]">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !timelineDay) {
    return (
      <div className="space-y-4">
        <div className="bg-[#F5F0E8] rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <Calendar className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-serif text-[#1A2A40] mb-2">
              No Historical Data Available
            </h3>
            <p className="text-sm text-[#6B7280] mb-4">
              We don't have any records for <span className="font-semibold text-[#1A2A40]">{currentDate}</span> in our archive.
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Try navigating to a different date using the Previous/Next buttons or the date picker above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quote Card */}
      {displayData.quote.text && (
        <div className="bg-[#F5F0E8] rounded-lg p-4 border-l-4 border-[#6B2D3C]">
          <p className="font-serif text-lg text-[#1A2A40] italic mb-2">
            {displayData.quote.text}
          </p>
          {displayData.quote.context && (
            <p className="text-sm text-[#6B7280]">
              {displayData.quote.context}
            </p>
          )}
        </div>
      )}

      {/* Info Grid */}
      <div className="flex gap-4">
        {/* Locations Map */}
        <div className="w-80">
          <LocationMap />
          <div className="mt-2 space-y-1 text-xs">
            {displayData.locations.length > 0 ? (
              displayData.locations.map((loc, idx) => (
                <div key={idx} className="text-[#4B5563]">
                  <span className="font-semibold text-[#1A2A40]">{loc.person}:</span> {loc.location}
                </div>
              ))
            ) : (
              <div className="text-[#4B5563]">No location data available</div>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="flex-1 space-y-3">
          {displayData.emotionalTone && (
            <div className="bg-[#F5F0E8] rounded-lg p-4">
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                Emotional Tone of Letter
              </h4>
              <p className="text-sm text-[#1A2A40] leading-relaxed">
                {displayData.emotionalTone}
              </p>
            </div>
          )}

          <div className="bg-[#F5F0E8] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
              Parliament Activity:
            </h4>
            <p className="text-sm text-[#1A2A40]">{displayData.parliament}</p>
          </div>

          <div className="bg-[#F5F0E8] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
              Cabinet Activity:
            </h4>
            <p className="text-sm text-[#1A2A40]">{displayData.cabinet}</p>
          </div>
        </div>
      </div>

      {/* What Others Did */}
      <div className="bg-[#F5F0E8] rounded-lg overflow-hidden">
        <button
          onClick={() => setOthersExpanded(!othersExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#E8E4DC] transition-colors"
        >
          <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            What Others Did
          </h4>
          {othersExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#6B7280]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
          )}
        </button>
        {othersExpanded && (
          <div className="px-4 pb-4 space-y-3">
            {displayData.otherPeople.length > 0 ? (
              displayData.otherPeople.map((person, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="font-semibold text-[#1A2A40] text-sm min-w-[140px]">
                    {person.name}:
                  </span>
                  <span className="text-sm text-[#4B5563]">
                    {person.action}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-[#4B5563]">No additional information available</div>
            )}
          </div>
        )}
      </div>

      {/* Newspaper Banner */}
      {displayData.newspaper && (
        <div className="bg-[#8B3A3A] rounded-lg p-4 text-center">
          <h4 className="text-xs font-semibold text-[#F5E6C8] uppercase tracking-wider mb-2">
            Newspaper:
          </h4>
          <p className="text-white font-serif text-lg font-bold tracking-wide">
            {displayData.newspaper}
          </p>
        </div>
      )}
    </div>
  );
}