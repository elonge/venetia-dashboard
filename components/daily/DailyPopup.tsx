"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Mail,
  Users,
  Cloud,
  BookOpen,
  MessageSquare,
  Activity,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import type { DayData } from "./types";
import { PEOPLE_IMAGES } from "@/constants";
import { getDayByDate } from "./dayUtils";

interface DailyPopupProps {
  day: DayData;
  onClose: () => void;
  mode?: "modal" | "page";
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
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DailyPopup({
  day,
  onClose,
  mode = "modal",
  onNavigateToDay,
  getNextDay,
  getPreviousDay,
  allDays = [],
}: DailyPopupProps) {
  const [currentDay, setCurrentDay] = useState<DayData>(day);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [datePickerError, setDatePickerError] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Get current date in YYYY-MM-DD format for date input
  const getCurrentDateInputValue = (): string => {
    return dateString;
  };

  const date = parseDate(currentDay.date);
  const formattedDate = date ? format(date, "MMMM d, yyyy") : currentDay.date;
  const dateString = formatDateString(currentDay.date);
  const hasMeeting = currentDay.met_venetia;
  const letters = currentDay.letters ?? [];
  const hasLetters = letters.length > 0;

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
      console.error("Error navigating to next day:", error);
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
      console.error("Error navigating to previous day:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Handle date change from calendar picker
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDateInput(selectedDate);
    setDatePickerError(null);
    if (!selectedDate) {
      return;
    }

    setLoading(true);
    try {
      if (allDays.length > 0) {
        const foundDay = getDayByDate(allDays, selectedDate);
        if (!foundDay) {
          setDatePickerError("No data available for this date");
          return;
        }

        setCurrentDay(foundDay);
        onNavigateToDay?.(foundDay.date);
        setDateInput("");
        setDatePickerError(null);
        return;
      }

      const response = await fetch(`/api/daily_records/${encodeURIComponent(selectedDate)}`);
      if (!response.ok) {
        setDatePickerError("No data available for this date");
        return;
      }

      const fetchedDay = (await response.json()) as DayData;
      setCurrentDay(fetchedDay);
      onNavigateToDay?.(fetchedDay.date);
      setDateInput("");
      setDatePickerError(null);
    } catch (error) {
      console.error("Error fetching day:", error);
      setDatePickerError("Error fetching date");
    } finally {
      setLoading(false);
    }
  };

  // Get min and max dates from allDays
  const getDateRange = () => {
    if (allDays.length === 0) return { min: "1910-01-01", max: "1920-12-31" };

    const sortedDays = [...allDays].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });

    const firstDate = parseDate(sortedDays[0].date);
    const lastDate = parseDate(sortedDays[sortedDays.length - 1].date);

    const formatForInput = (date: Date | null): string => {
      if (!date) return "1910-01-01";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      min: formatForInput(firstDate),
      max: formatForInput(lastDate),
    };
  };

  const dateRange = getDateRange();

  // Update current day when prop changes
  useEffect(() => {
    setCurrentDay(day);
  }, [day]);

  const isModal = mode === "modal";
  const containerClassName = isModal
    ? "fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-0 md:px-4 md:py-6"
    : "w-full flex justify-center";
  const cardClassName = isModal
    ? "relative w-full h-full md:h-auto md:max-w-[95vw] md:max-h-[90vh] md:rounded-2xl bg-card-bg shadow-2xl overflow-hidden flex flex-col"
    : "relative w-full max-w-5xl bg-card-bg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border-beige";

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
{/* Header: Integrated Navigation */}
<div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 border-b-2 border-border-beige bg-white/80 backdrop-blur-md sticky top-0 z-50 gap-4 md:gap-0">
  <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
    <div className="min-w-0 flex-1">
      <h2 className="font-serif text-xl md:text-2xl font-bold text-navy tracking-tight">
        {formattedDate}
      </h2>
      {currentDay.weather && (
        <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-muted-gray font-black uppercase tracking-[0.15em] mt-1">
          <Cloud className="w-3 h-3 md:w-3.5 md:h-3.5 text-accent-brown" />
          <span className="truncate">{currentDay.weather}</span>
        </div>
      )}
    </div>
    
    {/* Status Badge: Only visible if a meeting occurred */}
    {hasMeeting && (
      <div className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1 bg-accent-green/10 rounded-sm border border-accent-green/30 shrink-0">
        <div className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse"></div>
        <span className="text-[9px] md:text-[10px] text-accent-green font-black uppercase tracking-widest whitespace-nowrap">
          In-Person Meeting Recorded
        </span>
      </div>
    )}
  </div>

  {/* Control Group: Step Navigation & Archive Access */}
  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
    <div className="flex items-center bg-card-bg rounded-sm p-1 border border-border-beige/60">
      <button
        onClick={handlePrevious}
        disabled={!hasPrevious || loading}
        className="p-2 hover:bg-page-bg hover:text-accent-brown rounded-sm transition-all text-navy disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
        title="Previous Day"
        aria-label="Previous Day"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <div className="w-[1px] h-5 bg-border-beige mx-1"></div>
      <button
        onClick={handleNext}
        disabled={!hasNext || loading}
        className="p-2 hover:bg-page-bg hover:text-accent-brown rounded-sm transition-all text-navy disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
        title="Next Day"
        aria-label="Next Day"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>

    {/* Calendar Selector (Hidden Input + Trigger Button) */}
    <div className="relative">
      <input
        ref={dateInputRef}
        type="date"
        value={dateInput || getCurrentDateInputValue()}
        onChange={handleDateChange}
        min={dateRange.min}
        max={dateRange.max}
        className="absolute inset-0 opacity-0 pointer-events-none"
        aria-hidden="true"
      />
      <button
        onClick={() => {
          setDatePickerError(null);
          dateInputRef.current?.showPicker();
        }}
        className="p-2.5 rounded-sm border transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center bg-white border-border-beige text-navy hover:bg-card-bg hover:text-accent-brown hover:border-accent-brown"
        aria-label="Jump to date"
        title="Open Archive Search"
      >
        <Calendar className="w-5 h-5 md:w-5.5 md:h-5.5" />
      </button>
    </div>
    
    {/* Close button for mobile */}
    {isModal && (
      <button
        onClick={onClose}
        className="md:hidden p-2 rounded-sm border border-border-beige bg-white text-navy hover:bg-card-bg cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
</div>

{/* Inline Error Display (if date selection fails) */}
{datePickerError && (
  <div className="bg-accent-red/10 border-b border-accent-red/20 py-2 px-4 text-center text-xs text-accent-red font-medium animate-in fade-in slide-in-from-top-1">
    {datePickerError}
  </div>
)}
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {loading && (
            <div className="text-center py-8 text-slate">Loading...</div>
          )}

{/* Meeting Reference: The Archive Cross-Reference */}
{hasMeeting && currentDay.meeting_reference && (
  <div className="bg-accent-green/5 border-l-4 border-accent-green rounded-sm p-5 shadow-sm mb-8 relative overflow-hidden group">

    <div className="flex items-start gap-4">
      {/* Icon: A more formal "Official Note" look */}
      <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center flex-shrink-0 border border-accent-green/20">
        <MessageSquare className="w-5 h-5 text-accent-green" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-black text-accent-green uppercase tracking-[0.2em]">
            The PM and Venetia met that day
          </h3>
          <span className="h-[1px] w-8 bg-accent-green/20"></span>
        </div>
        
        <p className="text-[15px] text-navy font-serif italic leading-relaxed">
          "{currentDay.meeting_reference}"
        </p>
      </div>
    </div>
  </div>
)}          {/* Letters */}
          {hasLetters ? (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-brown" />
                Correspondence ({letters.length})
              </h3>
              {letters.map((letter, idx) => (
                <div
                  key={idx}
                  className="bg-card-bg rounded-sm p-4 md:p-6 border-l-[4px] md:border-l-[6px] border-accent-burgundy shadow-md mb-6 md:mb-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                    {/* LEFT COLUMN: The Primary Source (2/3) */}
                    <div className="lg:col-span-2 flex flex-col justify-between lg:border-r lg:border-border-beige/50 lg:pr-8">
                      <div className="space-y-3 md:space-y-4">
                        {/* Header Info */}
                        <div className="flex items-center justify-between text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent-brown">
                          <span>Letter #{letter.letter_number}</span>
                          <span className="truncate ml-2">{letter.time_of_day || "Time not recorded"}</span>
                        </div>

                        {/* THE QUOTE: Large and Impactful */}
                        {letter.excerpt && (
                          <div className="relative pt-2">
                            <span className="absolute -top-2 md:-top-4 -left-1 md:-left-2 text-4xl md:text-6xl font-serif text-accent-burgundy/10">
                              "
                            </span>
                            <p className="font-serif text-xl md:text-2xl lg:text-3xl text-navy italic leading-tight relative z-10">
                              {letter.excerpt}
                            </p>
                          </div>
                        )}

                        {/* SUMMARY: Detailed Context */}
                        {letter.summary && (
                          <p className="text-xs md:text-sm text-slate leading-relaxed border-t border-border-beige pt-3 md:pt-4 italic">
                            {letter.summary}
                          </p>
                        )}
                      </div>

                      {/* MENTIONED PEOPLE: Move to bottom of main column */}
                      {letter.people_mentioned &&
                        letter.people_mentioned.length > 0 && (
                          <div className="mt-8 pt-4 border-t border-border-beige/30 flex items-start gap-3 text-[9px] uppercase tracking-[0.15em] text-muted-gray font-bold">
                            <Users className="w-3.5 h-3.5 mt-[-1px] opacity-60" />
                            <div className="leading-relaxed">
                              <span className="text-accent-brown mr-2">
                                Mentioned:
                              </span>
                              <span>
                                {letter.people_mentioned.join("  •  ")}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Intelligence Analysis (1/3) */}
                    <div className="lg:col-span-1 space-y-4 md:space-y-6 bg-page-bg/40 p-3 md:p-4 rounded-sm mt-4 lg:mt-0">
                      {/* METRICS: Redesigned for full readability */}
                      <div>
                        <h3 className="text-[10px] font-black text-accent-brown uppercase tracking-[0.2em] mb-4">
                          Metric Analysis
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              label: "Romantic Adoration",
                              score: letter.scores?.romantic_adoration,
                              color: "var(--color-accent-burgundy)",
                            },
                            {
                              label: "Political Unburdening",
                              score: letter.scores?.political_unburdening,
                              color: "var(--color-accent-green)",
                            },
                            {
                              label: "Emotional Desolation",
                              score: letter.scores?.emotional_desolation,
                              color: "var(--color-accent-brown)",
                            },
                          ].map(
                            (metric, mIdx) =>
                              metric.score !== undefined && (
                                <div key={mIdx} className="space-y-1.5">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-navy">
                                    <span>{metric.label}</span>
                                    <span>{metric.score}/10</span>
                                  </div>
                                  <div className="w-full bg-section-bg h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="h-full transition-all duration-1000"
                                      style={{
                                        width: `${(metric.score / 10) * 100}%`,
                                        backgroundColor: metric.color,
                                      }}
                                    />
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>

                      {/* TOPICS: Styled as Archive Tags */}
                      {letter.topics && letter.topics.length > 0 && (
                        <div className="pt-4 border-t border-border-beige">
                          <h3 className="text-[10px] font-black text-accent-brown uppercase tracking-[0.2em] mb-3">
                            Thematic Tags
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {letter.topics.map((topic, topicIdx) => (
                              <span
                                key={topicIdx}
                                className="px-2 py-1 bg-navy text-card-bg text-[11px] font-bold uppercase tracking-wider rounded-sm shadow-sm transition-all duration-300 hover:bg-accent-brown hover:scale-105 cursor-default"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No Letter State: The "Empty Archive" Look */
            <div className="relative py-10 px-6 bg-page-bg/40 rounded-sm border border-border-beige overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Visual Indicator of Silence */}
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-accent-burgundy/20 flex items-center justify-center bg-white/50 shrink-0">
                  <Mail className="w-5 h-5 text-accent-burgundy/30" />
                </div>

                <div className="flex-1 text-center md:text-left space-y-1">
                  <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.3em]">
                    Daily Correspondence: Silent
                  </h3>
                  <p className="text-sm font-serif italic text-navy leading-relaxed">
                    The Prime Minister did not write to Venetia on this day. The
                    following records reconstruct the atmosphere in Downing
                    Street and the unfolding political situation.
                  </p>
                </div>

                {/* Background Status Tag */}
                <div className="shrink-0 px-3 py-1 bg-section-bg border border-border-beige rounded-sm shadow-sm">
                  <span className="text-[11px] font-bold text-muted-gray uppercase tracking-tighter">
                    Gap in Correspondence
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Activities & Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PRIME MINISTER: Active Intelligence Record */}
            {!currentDay.pm_location && !currentDay.pm_activities ? (
              /* PM Insufficient Data State */
              <div className="bg-section-bg/20 rounded-sm p-6 border border-dashed border-border-beige flex flex-col items-center justify-center text-center">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full border border-accent-green/20 flex items-center justify-center mx-auto">
                    <div className="w-1 h-1 bg-accent-green/40 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-navy/60 uppercase tracking-[0.2em] mb-1">
                      Prime Minister
                    </h4>
                    <p className="text-[10px] text-accent-green uppercase tracking-widest font-bold">
                      Insufficient Data
                    </p>
                    <p className="text-xs text-muted-gray font-serif italic max-w-[220px] mx-auto mt-2 leading-relaxed">
                      No surviving record of official activities or specific
                      location for this date.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* PM Standard Active Record (If data exists) */
              <div className="bg-white rounded-sm p-5 border border-border-beige shadow-sm relative overflow-hidden">
                <h4 className="text-xs font-black text-navy uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-green"></span>{" "}
                  Prime Minister
                </h4>

                <div className="space-y-4">
                  {currentDay.pm_location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-accent-brown mt-0.5" />
                      <div className="text-sm">
                        <span className="block text-[10px] font-bold text-accent-brown uppercase tracking-wider">
                          Current Location
                        </span>
                        <span className="text-navy font-serif">
                          {currentDay.pm_location}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentDay.pm_activities && (
                    <div className="flex items-start gap-3">
                      <Activity className="w-4 h-4 text-accent-brown mt-0.5" />
                      <div className="text-sm">
                        <span className="block text-[10px] font-bold text-accent-brown uppercase tracking-wider">
                          The PM's Record
                        </span>
                        <p className="text-navy leading-snug">
                          {currentDay.pm_activities}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentDay.pm_mood_witness && (
                    <div className="mt-4 pt-4 border-t border-border-beige bg-page-bg/40 rounded-sm p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-3 h-3 text-accent-burgundy" />
                        <span className="text-[10px] font-bold text-accent-burgundy uppercase tracking-widest">
                          Witness Observation
                        </span>
                      </div>
                      <p className="text-sm text-slate italic font-serif leading-relaxed">
                        "{currentDay.pm_mood_witness}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* VENETIA: The Missing Record / Redacted State */}
            {!currentDay.venetia_location && !currentDay.venetia_activities ? (
              <div className="bg-section-bg/20 rounded-sm p-6 border border-dashed border-border-beige flex flex-col items-center justify-center text-center">
                <div className="space-y-3">
                  {/* Minimalist "Missing" Icon */}
                  <div className="w-10 h-10 rounded-full border border-accent-burgundy/20 flex items-center justify-center mx-auto">
                    <div className="w-1 h-1 bg-accent-burgundy/40 rounded-full"></div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-navy/60 uppercase tracking-[0.2em] mb-1">
                      Venetia Stanley
                    </h4>
                    <p className="text-[10px] text-accent-brown uppercase tracking-widest font-bold">
                      Insufficient Data
                    </p>
                    <p className="text-xs text-muted-gray font-serif italic max-w-[220px] mx-auto mt-2 leading-relaxed">
                      No surviving record of her specific location or activities
                      for this date.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard State (If data exists) */
              <div className="bg-white rounded-sm p-5 border border-border-beige shadow-sm relative">
                <h4 className="text-xs font-black text-navy uppercase tracking-[0.2em] mb-4">
                  Venetia Stanley
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent-burgundy mt-0.5" />
                    <div className="text-sm">
                      <span className="block text-[10px] font-bold text-accent-burgundy uppercase tracking-wider">
                        Location
                      </span>
                      <span className="text-navy font-serif">
                        {currentDay.venetia_location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="w-4 h-4 text-accent-burgundy mt-0.5" />
                    <div className="text-sm">
                      <span className="block text-[10px] font-bold text-accent-burgundy uppercase tracking-wider">
                        Activities
                      </span>
                      <p className="text-navy leading-snug">
                        {currentDay.venetia_activities}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Politics: The Government Dispatch */}
          {currentDay.politics && (
            <div className="bg-white rounded-sm p-6 shadow-sm border border-border-beige relative">
              <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-navy/30 uppercase tracking-tighter">
                Entry: {currentDay.date?.toUpperCase() || "MAY-17-1915"}
              </div>

              <h4 className="text-xs font-black text-navy uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent-brown" />
                The Political Record
              </h4>

              <div className="space-y-8">
                {currentDay.politics.parliament && (
                  <div className="relative pl-6 border-l border-accent-brown/30">
                    <span className="absolute -left-[3px] top-0 w-[5px] h-[5px] rounded-full bg-accent-brown"></span>
                    <div className="flex flex-col mb-1">
                      <span className="text-[10px] font-bold text-accent-brown uppercase tracking-widest">
                        Parliament
                      </span>
                    </div>
                    <div className="text-sm text-navy font-serif leading-relaxed">
                      {currentDay.politics.parliament.replace(
                        /^(Parliament\s*—\s*Yes\s*—\s*Topics:\s*)/i,
                        ""
                      )}
                    </div>
                  </div>
                )}

                {currentDay.politics.cabinet && (
                  <div className="relative pl-6 border-l border-accent-brown/30">
                    <span className="absolute -left-[3px] top-0 w-[5px] h-[5px] rounded-full bg-accent-brown"></span>
                    <div className="flex flex-col mb-1">
                      <span className="text-[10px] font-bold text-accent-brown uppercase tracking-widest">
                        Cabinet
                      </span>
                    </div>
                    <div className="text-sm text-muted-gray font-serif leading-relaxed italic">
                      {currentDay.politics.cabinet.toLowerCase().includes("no") 
                        ? "No Cabinet session recorded for this date." 
                        : currentDay.politics.cabinet.replace(/^(Cabinet\s*—\s*Yes\s*—\s*Topics:\s*)/i, "")
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Diaries */}
          {currentDay.diaries_summary &&
            currentDay.diaries_summary.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xs font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-accent-brown"></span>
                  Witness Observations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentDay.diaries_summary.map((diary, idx) => {
                    const personImage =
                      PEOPLE_IMAGES[diary.writer as keyof typeof PEOPLE_IMAGES];
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-sm p-6 border border-border-beige shadow-sm relative transition-all hover:shadow-md"
                      >
                        <div className="flex items-start gap-5">
                          {personImage ? (
                            <div className="relative flex-shrink-0">
                              <img
                                src={personImage}
                                alt={diary.writer}
                                className="w-14 h-14 rounded-full object-cover border border-border-beige shadow-sm"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-page-bg flex items-center justify-center flex-shrink-0 border border-border-beige text-accent-brown text-xs font-bold">
                              {diary.writer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="flex-1 min-w-0 pt-1">
                            <div className="font-serif text-base font-bold text-navy mb-2">
                              {diary.writer}
                            </div>

                            <p className="text-[15px] text-slate leading-relaxed italic font-serif border-l-2 border-page-bg pl-4">
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