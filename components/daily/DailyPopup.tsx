'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Mail, Users, Cloud, BookOpen, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import type { DayData } from './types';
import { PEOPLE_IMAGES } from '@/constants';
import { getDayByDate } from './dayUtils';

interface DailyPopupProps {
  day: DayData;
  onClose: () => void;
  mode?: 'modal' | 'page';
  onNavigateToDay?: (date: string) => void;
  getNextDay?: (currentDate: string) => Promise<DayData | null>;
  getPreviousDay?: (currentDate: string) => Promise<DayData | null>;
  allDays?: DayData[]; // All available days for date picker
}

// Helper to parse date from various formats
function parseDate(dateStr: string): Date | null {
  const datetimeMatch = dateStr.match(/datetime\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (datetimeMatch) {
    const [, year, month, day] = datetimeMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Helper to format date as YYYY-MM-DD
function formatDateString(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date) return dateStr;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DailyPopup({ 
  day, 
  onClose, 
  mode = 'modal',
  onNavigateToDay,
  getNextDay,
  getPreviousDay,
  allDays = []
}: DailyPopupProps) {
  const [currentDay, setCurrentDay] = useState<DayData>(day);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [datePickerError, setDatePickerError] = useState<string | null>(null);
  const controlButtonBase =
    'w-12 h-12 rounded-xl border border-[#D4CFC4] bg-white text-[#1A2A40] shadow-[0_12px_30px_rgba(26,42,64,0.12)] transition-all duration-200 flex items-center justify-center hover:-translate-y-[2px] hover:shadow-[0_16px_36px_rgba(26,42,64,0.16)] focus:outline-none focus:ring-2 focus:ring-[#6B2D3C] focus:ring-offset-2 focus:ring-offset-white';
  const disabledButtonClasses =
    'disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_12px_30px_rgba(26,42,64,0.12)]';

  // Get current date in YYYY-MM-DD format for date input
  const getCurrentDateInputValue = (): string => {
    return dateString;
  };

  const date = parseDate(currentDay.date);
  const formattedDate = date ? format(date, 'MMMM d, yyyy') : currentDay.date;
  const dateString = formatDateString(currentDay.date);
  const hasMeeting = currentDay.meeting_reference && 
    (currentDay.meeting_reference.toLowerCase().includes('yes') || 
     currentDay.meeting_reference.toLowerCase().includes('met'));

  // Check for next/previous days
  useEffect(() => {
    async function checkNavigation() {
      if (getNextDay) {
        const next = await getNextDay(dateString);
        setHasNext(!!next);
      }
      if (getPreviousDay) {
        const prev = await getPreviousDay(dateString);
        setHasPrevious(!!prev);
      }
    }
    checkNavigation();
  }, [dateString, getNextDay, getPreviousDay]);

  const handleNext = async () => {
    if (!getNextDay) return;
    setLoading(true);
    try {
      const nextDay = await getNextDay(dateString);
      if (nextDay) {
        setCurrentDay(nextDay);
        if (onNavigateToDay) {
          onNavigateToDay(nextDay.date);
        }
      }
    } catch (error) {
      console.error('Error navigating to next day:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    if (!getPreviousDay) return;
    setLoading(true);
    try {
      const prevDay = await getPreviousDay(dateString);
      if (prevDay) {
        setCurrentDay(prevDay);
        if (onNavigateToDay) {
          onNavigateToDay(prevDay.date);
        }
      }
    } catch (error) {
      console.error('Error navigating to previous day:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDatePicker) {
          setShowDatePicker(false);
          setDateInput('');
          setDatePickerError(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, showDatePicker]);

  // Handle date change from calendar picker
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      setDatePickerError('Please select a date');
      return;
    }

    if (allDays.length > 0) {
      const foundDay = getDayByDate(allDays, selectedDate);
      if (foundDay) {
        setCurrentDay(foundDay);
        if (onNavigateToDay) {
          onNavigateToDay(foundDay.date);
        }
        setShowDatePicker(false);
        setDateInput('');
        setDatePickerError(null);
      } else {
        setDatePickerError('No data available for this date');
      }
    } else {
      setDatePickerError('Day data not loaded');
    }
  };

  // Get min and max dates from allDays
  const getDateRange = () => {
    if (allDays.length === 0) return { min: '1910-01-01', max: '1920-12-31' };
    
    const sortedDays = [...allDays].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });
    
    const firstDate = parseDate(sortedDays[0].date);
    const lastDate = parseDate(sortedDays[sortedDays.length - 1].date);
    
    const formatForInput = (date: Date | null): string => {
      if (!date) return '1910-01-01';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      min: formatForInput(firstDate),
      max: formatForInput(lastDate)
    };
  };

  const dateRange = getDateRange();

  // Update current day when prop changes
  useEffect(() => {
    setCurrentDay(day);
  }, [day]);

  const isModal = mode === 'modal';
  const containerClassName = isModal
    ? 'fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4 py-6'
    : 'w-full flex justify-center';
  const cardClassName = isModal
    ? 'relative w-full max-w-[95vw] max-h-[90vh] bg-[#F5F0E8] rounded-2xl shadow-2xl overflow-hidden flex flex-col'
    : 'relative w-full max-w-5xl bg-[#F5F0E8] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#D4CFC4]';

  return (
    <div 
      className={containerClassName}
      onClick={
        isModal
          ? (e) => {
              if (e.target === e.currentTarget) {
                onClose();
              }
            }
          : undefined
      }
    >

      <div 
        className={cardClassName}
        onClick={isModal ? (e) => e.stopPropagation() : undefined}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#D4CFC4] bg-white/50">
          <div className="flex items-center gap-4 flex-1">
            <Calendar className="w-6 h-6 text-[#6B2D3C]" />
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#1A2A40]">
                {formattedDate}
              </h2>
              {currentDay.weather && (
                <div className="flex items-center gap-1 text-sm text-[#444] font-medium mt-1">
                  <Cloud className="w-4 h-4" />
                  <span>{currentDay.weather}</span>
                </div>
              )}
            </div>
            {hasMeeting && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full border border-emerald-300">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span className="text-sm text-emerald-800 font-medium">They Met Today</span>
              </div>
            )}
          </div>
          
          {/* Window Controls - Calendar and Close */}
          <div className="flex items-center gap-3">
            {/* Navigation Arrows - Left Side (Outside Modal) */}
            <button
                onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
                }}
                disabled={!hasPrevious || loading}
                className={`z-[10000] ${controlButtonBase} ${disabledButtonClasses} hover:bg-[#E9F2EC] hover:text-[#1A2A40]`}
                aria-label="Previous day"
                title="Previous day"
            >
                <ChevronLeft className="w-7 h-7" />
            </button>

      {/* Navigation Arrows - Right Side (Outside Modal) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        disabled={!hasNext || loading}
        className={`${controlButtonBase} ${disabledButtonClasses} hover:bg-[#E9F2EC] hover:text-[#1A2A40]`}
        aria-label="Next day"
        title="Next day"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

            <button
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setDateInput(getCurrentDateInputValue());
                setDatePickerError(null);
              }}
              className={`${controlButtonBase} ${
                showDatePicker
                  ? 'bg-[#6B2D3C] hover:bg-[#7B3D4C]'
                  : 'hover:bg-[#F7F1E8]'
              }`}
              aria-label="Jump to date"
              title="Jump to specific date"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className={`${controlButtonBase}  hover:bg-[#243651`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Date Picker Dropdown */}
        {showDatePicker && (
          <div className="px-6 py-4 bg-[#E8E4DC] border-b border-[#D4CFC4]">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-[#6B2D3C] flex-shrink-0" />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#1A2A40] mb-2">
                  Select a date:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateInput || getCurrentDateInputValue()}
                    onChange={handleDateChange}
                    min={dateRange.min}
                    max={dateRange.max}
                    className="w-full px-4 py-2 rounded-lg border-2 border-[#D4CFC4] bg-white text-[#1A2A40] focus:outline-none focus:ring-2 focus:ring-[#6B2D3C] focus:border-transparent cursor-pointer text-base"
                  />
                </div>
                {datePickerError && (
                  <div className="mt-2 text-sm text-red-600">
                    {datePickerError}
                  </div>
                )}
                {allDays.length > 0 && (() => {
                  // Sort days by date to get correct range
                  const sortedDays = [...allDays].sort((a, b) => {
                    const dateA = parseDate(a.date);
                    const dateB = parseDate(b.date);
                    if (!dateA || !dateB) return 0;
                    return dateA.getTime() - dateB.getTime();
                  });
                  const firstDate = parseDate(sortedDays[0].date);
                  const lastDate = parseDate(sortedDays[sortedDays.length - 1].date);
                  return (
                    <div className="mt-2 text-xs text-[#444] font-medium">
                      Available dates: {firstDate ? format(firstDate, 'MMM d, yyyy') : 'N/A'} - {lastDate ? format(lastDate, 'MMM d, yyyy') : 'N/A'} ({sortedDays.length} days)
                    </div>
                  );
                })()}
              </div>
              <button
                onClick={() => {
                  setShowDatePicker(false);
                  setDateInput('');
                  setDatePickerError(null);
                }}
                className="px-4 py-2 text-[#2D3648] hover:text-[#1A2A40] hover:bg-white/50 rounded-lg transition-colors"
                aria-label="Close date picker"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="text-center py-8 text-[#2D3648]">
              Loading...
            </div>
          )}

          {/* Meeting Reference - Only show if there's an actual meeting */}
          {hasMeeting && currentDay.meeting_reference && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-lg p-4">
              <h3 className="text-base font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Meeting Reference
              </h3>
              <p className="text-sm text-emerald-700">{currentDay.meeting_reference}</p>
            </div>
          )}

          {/* Letters */}
          {currentDay.letters && currentDay.letters.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A2A40] uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Letters ({currentDay.letters.length})
              </h3>
              {currentDay.letters.map((letter, idx) => (
                <div key={idx} className="bg-white rounded-lg p-5 border-l-4 border-[#6B2D3C] shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Quote and Summary - Left Column */}
                    <div className="lg:col-span-2 space-y-3">
                      {letter.letter_number && (
                        <div className="text-sm text-[#444] font-medium">
                          Letter #{letter.letter_number} • {letter.time_of_day || 'Unknown time'}
                        </div>
                      )}
                      {letter.excerpt && (
                        <p className="font-serif text-lg text-[#1A2A40] italic">
                          "{letter.excerpt}"
                        </p>
                      )}
                      {letter.summary && (
                        <p className="text-sm text-[#2D3648] leading-relaxed">
                          {letter.summary}
                        </p>
                      )}
                    </div>

                    {/* Analysis Column - Right Side */}
                    <div className="lg:col-span-1 space-y-3">
                      {/* Topics */}
                      {letter.topics && letter.topics.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-[#444] mb-2 uppercase tracking-wide">Topics</div>
                          <div className="flex flex-wrap gap-2">
                            {letter.topics.map((topic, topicIdx) => (
                              <span
                                key={topicIdx}
                                className="px-2 py-1 bg-[#E8E4DC] text-[#1A2A40] rounded text-xs font-medium"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Scores with Progress Bars */}
                      {letter.scores && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-[#444] mb-2 uppercase tracking-wide">Metrics</div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {letter.scores.romantic_adoration !== undefined && (
                              <div className="min-w-0 rounded-lg border border-[#D4CFC4] bg-[#F5F0E8]/60 p-2">
                                <div className="flex justify-between items-center mb-1 gap-2">
                                  <span className="text-[11px] leading-tight text-[#444] font-medium truncate">
                                    Romantic Adoration
                                  </span>
                                  <span className="text-[11px] text-[#1A2A40] font-semibold tabular-nums flex-shrink-0">
                                    {letter.scores.romantic_adoration}/10
                                  </span>
                                </div>
                                <div className="w-full bg-[#E8E4DC] rounded-full h-2">
                                  <div
                                    className="bg-[#6B2D3C] h-2 rounded-full transition-all"
                                    style={{ width: `${(letter.scores.romantic_adoration / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {letter.scores.political_unburdening !== undefined && (
                              <div className="min-w-0 rounded-lg border border-[#D4CFC4] bg-[#F5F0E8]/60 p-2">
                                <div className="flex justify-between items-center mb-1 gap-2">
                                  <span className="text-[11px] leading-tight text-[#444] font-medium truncate">
                                    Political Unburdening
                                  </span>
                                  <span className="text-[11px] text-[#1A2A40] font-semibold tabular-nums flex-shrink-0">
                                    {letter.scores.political_unburdening}/10
                                  </span>
                                </div>
                                <div className="w-full bg-[#E8E4DC] rounded-full h-2">
                                  <div
                                    className="bg-[#4A7C59] h-2 rounded-full transition-all"
                                    style={{ width: `${(letter.scores.political_unburdening / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {letter.scores.emotional_desolation !== undefined && (
                              <div className="min-w-0 rounded-lg border border-[#D4CFC4] bg-[#F5F0E8]/60 p-2">
                                <div className="flex justify-between items-center mb-1 gap-2">
                                  <span className="text-[11px] leading-tight text-[#444] font-medium truncate">
                                    Emotional Desolation
                                  </span>
                                  <span className="text-[11px] text-[#1A2A40] font-semibold tabular-nums flex-shrink-0">
                                    {letter.scores.emotional_desolation}/10
                                  </span>
                                </div>
                                <div className="w-full bg-[#E8E4DC] rounded-full h-2">
                                  <div
                                    className="bg-[#8B6F47] h-2 rounded-full transition-all"
                                    style={{ width: `${(letter.scores.emotional_desolation / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* People Mentioned */}
                      {letter.people_mentioned && letter.people_mentioned.length > 0 && (
                        <div className="pt-2 border-t border-[#D4CFC4]">
                          <div className="flex items-start gap-2 text-xs text-[#444] font-medium">
                            <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold mb-1">Mentioned:</div>
                              <div>{letter.people_mentioned.join(', ')}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activities & Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prime Minister */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="text-base font-semibold text-[#1A2A40] mb-3 uppercase tracking-wider">
                Prime Minister
              </h4>
              {currentDay.pm_location && (
                <div className="flex items-start gap-2 mb-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#6B2D3C] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[#2D3648]">Location: </span>
                    <span className="text-[#1A2A40]">{currentDay.pm_location}</span>
                  </div>
                </div>
              )}
              {currentDay.pm_activities && (
                <div className="text-sm text-[#2D3648]">
                  <span className="font-semibold">Activities: </span>
                  <span>{currentDay.pm_activities}</span>
                </div>
              )}
              {currentDay.pm_mood_witness && (
                <div className="mt-3 pt-3 border-t border-[#D4CFC4] bg-[#F5F0E8]/50 rounded p-3">
                  <div className="text-xs font-semibold text-[#444] mb-1 uppercase tracking-wide">Margot's Observation</div>
                  <p className="text-sm text-[#2D3648] italic">{currentDay.pm_mood_witness}</p>
                </div>
              )}
            </div>

            {/* Venetia */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="text-base font-semibold text-[#1A2A40] mb-3 uppercase tracking-wider">
                Venetia
              </h4>
              {currentDay.venetia_location && (
                <div className="flex items-start gap-2 mb-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#6B2D3C] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[#2D3648]">Location: </span>
                    <span className="text-[#1A2A40]">{currentDay.venetia_location}</span>
                  </div>
                </div>
              )}
              {currentDay.venetia_activities && (
                <div className="text-sm text-[#2D3648]">
                  <span className="font-semibold">Activities: </span>
                  <span>{currentDay.venetia_activities}</span>
                </div>
              )}
            </div>
          </div>

          {/* Politics */}
          {currentDay.politics && (
            <div className="bg-white rounded-lg p-4 shadow-sm max-w-4xl">
              <h4 className="text-base font-semibold text-[#1A2A40] mb-3 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Politics
              </h4>
              <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
                {currentDay.politics.parliament && (
                  <>
                    <div className="font-semibold text-[#2D3648]">Parliament:</div>
                    <div className="text-[#1A2A40]">{currentDay.politics.parliament}</div>
                  </>
                )}
                {currentDay.politics.cabinet && (
                  <>
                    <div className="font-semibold text-[#2D3648]">Cabinet:</div>
                    <div className="text-[#1A2A40]">{currentDay.politics.cabinet}</div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Diaries */}
          {currentDay.diaries_summary && currentDay.diaries_summary.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A2A40] uppercase tracking-wider">
                Diaries & Observations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentDay.diaries_summary.map((diary, idx) => {
                  const personImage = PEOPLE_IMAGES[diary.writer as keyof typeof PEOPLE_IMAGES];
                  return (
                    <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        {personImage ? (
                          <img
                            src={personImage}
                            alt={diary.writer}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-[#D4CFC4]"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#E8E4DC] flex items-center justify-center flex-shrink-0 border-2 border-[#D4CFC4]">
                            <span className="text-[#2D3648] text-xs font-semibold">
                              {diary.writer.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#1A2A40] text-sm mb-1">
                            {diary.writer}
                          </div>
                          <p className="text-sm text-[#2D3648] leading-relaxed italic">
                            "{diary.excerpt}"
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
