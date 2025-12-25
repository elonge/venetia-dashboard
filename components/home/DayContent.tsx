import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { TimelineDayDocument } from '@/types';
import { PEOPLE_IMAGES } from '@/constants';

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
  const excerpt = day?.excerpt;
  const quoteText = excerpt ||firstPmLetter?.summary || firstVenetiaLetter?.summary || '';
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
  const cabinet = day?.context?.secret_churchill || (day.prime_minister?.meeting_details 
    ? day.prime_minister.meeting_details
    : day.prime_minister?.meeting_with_venetia
    ? 'Meeting with Venetia recorded.'
    : 'No cabinet activity recorded.');

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
  const [othersExpanded, setOthersExpanded] = useState(true);
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
          console.log('prime_minister', data?.prime_minister);
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
        <div className="bg-card-bg rounded-lg p-4 text-center text-slate border border-border-beige shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !timelineDay) {
    return (
      <div className="space-y-4">
        <div className="bg-card-bg rounded-lg p-12 text-center border border-border-beige shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <Calendar className="w-16 h-16 text-slate mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-xl font-serif text-navy mb-2">
              No Historical Data Available
            </h3>
            <p className="text-sm text-slate mb-4">
              We don't have any records for <span className="font-semibold text-navy">{currentDate}</span> in our archive.
            </p>
            <p className="text-xs text-muted-gray">
              Try navigating to a different date using the Previous/Next buttons or the date picker above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Meeting Indicator */}
      {timelineDay?.prime_minister?.meeting_with_venetia && (
        <div className="bg-accent-green/10 border-2 border-accent-green/30 rounded-lg p-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-green">
              <circle cx="10" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
              <circle cx="10" cy="10" r="2" fill="currentColor"/>
              <path d="M8 14 Q10 15 12 14" stroke="currentColor" strokeWidth="1" fill="none"/>
              <circle cx="22" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
              <circle cx="22" cy="10" r="2" fill="currentColor"/>
              <path d="M20 14 Q22 15 24 14" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-accent-green mb-1">
              They Met Today
            </h3>
            {timelineDay.prime_minister.meeting_details && (
              <p className="text-sm text-accent-green/80 italic">
                {timelineDay.prime_minister.meeting_details}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quote Card */}
      {displayData.quote.text && (
        <div className="bg-card-bg rounded-lg p-4 border-l-4 border-accent-burgundy shadow-sm border-y border-r border-border-beige/50">
          <p className="font-serif text-lg text-navy italic mb-2">
            {displayData.quote.text}
          </p>
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
                <div key={idx} className="text-slate">
                  <span className="font-semibold text-navy">{loc.person}:</span> {loc.location}
                </div>
              ))
            ) : (
              <div className="text-muted-gray italic">No location data available</div>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="flex-1 space-y-3">
          {displayData.emotionalTone && (
            <div className="bg-card-bg rounded-lg p-4 border border-border-beige/50 shadow-sm">
              <h4 className="text-base font-semibold text-slate uppercase tracking-wider mb-2 text-[10px]">
                Emotional Tone of Letter
              </h4>
              <p className="text-sm text-navy leading-relaxed italic">
                {displayData.emotionalTone}
              </p>
            </div>
          )}

          <div className="bg-card-bg rounded-lg p-4 border border-border-beige/50 shadow-sm">
            <h4 className="text-base font-semibold text-slate uppercase tracking-wider mb-1 text-[10px]">
              Parliament Activity:
            </h4>
            <p className="text-sm text-navy">{displayData.parliament}</p>
          </div>

          <div className="bg-card-bg rounded-lg p-4 border border-border-beige/50 shadow-sm">
            <h4 className="text-base font-semibold text-slate uppercase tracking-wider mb-1 text-[10px]">
              Cabinet Activity:
            </h4>
            <p className="text-sm text-navy">{displayData.cabinet}</p>
          </div>
        </div>
      </div>

      {/* What Others Did */}
      <div className="bg-card-bg rounded-lg overflow-hidden border border-border-beige/50 shadow-sm">
        <button
          onClick={() => setOthersExpanded(!othersExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-page-bg transition-colors"
        >
          <h4 className="text-xs font-semibold text-slate uppercase tracking-wider">
            What Others Did
          </h4>
          {othersExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate" />
          )}
        </button>
        {othersExpanded && (
          <div className="px-4 pb-4 space-y-3">
            {displayData.otherPeople.length > 0 ? (
              displayData.otherPeople.map((person, idx) => {
                const personImage = PEOPLE_IMAGES[person.name as keyof typeof PEOPLE_IMAGES];
                return (
                  <div key={idx} className="flex gap-3 items-start p-2 rounded-sm hover:bg-page-bg/50 transition-colors">
                    {personImage ? (
                      <img
                        src={personImage}
                        alt={person.name}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-border-beige"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-section-bg flex items-center justify-center flex-shrink-0 border-2 border-border-beige">
                        <span className="text-slate text-xs font-semibold">
                          {person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-navy text-sm block mb-1">
                        {person.name}
                      </span>
                      <span className="text-sm text-slate leading-relaxed">
                        {person.action}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-gray italic">No additional information available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
