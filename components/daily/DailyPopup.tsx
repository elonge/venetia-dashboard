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
  Briefcase,
  Landmark,
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
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
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
  const formattedDate = date
    ? format(date, "EEEE, MMMM d, yyyy")
    : currentDay.date;
  const dateString = formatDateString(currentDay.date);
  const hasMeeting = currentDay.met_venetia;
  const letters = currentDay.letters ?? [];

  const totalRecordedLetters = currentDay.total_number_letters || letters.length;
  const missingLettersCount = Math.max(0, totalRecordedLetters - letters.length);
  const showMissingCard = missingLettersCount > 0;
  
  // Total slides in the carousel: existing letters + 1 for missing card if needed
  const totalSlides = letters.length + (showMissingCard ? 1 : 0);
  const hasDisplayableContent = totalSlides > 0;

  const meetingNote = currentDay.meeting_reference  || "The Prime Minister and Venetia met in person";

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
        setCurrentLetterIndex(0);
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
        setCurrentLetterIndex(0);
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
        setCurrentLetterIndex(0);
        onNavigateToDay?.(foundDay.date);
        setDateInput("");
        setDatePickerError(null);
        return;
      }

      const response = await fetch(
        `/api/daily_records/${encodeURIComponent(selectedDate)}`
      );
      if (!response.ok) {
        setDatePickerError("No data available for this date");
        return;
      }

      const fetchedDay = (await response.json()) as DayData;
      setCurrentDay(fetchedDay);
      setCurrentLetterIndex(0);
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
    setCurrentLetterIndex(0);
  }, [day]);

  const isModal = mode === "modal";
  const containerClassName = isModal
    ? "fixed inset-0 z-[9999] bg-navy/70 flex items-center justify-center p-0 md:px-4 md:py-6"
    : "w-full flex justify-center";
  const cardClassName = isModal
    ? "relative w-full h-full md:h-auto md:max-w-[95vw] md:max-h-[90vh] md:rounded-2xl bg-card-bg shadow-2xl overflow-hidden flex flex-col"
    : "relative w-full max-w-5xl bg-card-bg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border-beige";

  console.log("Current Day:", currentDay);
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 border-b-2 border-border-beige bg-card-bg/80 backdrop-blur-md sticky top-0 z-50 gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0 md:mr-2">
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
                className="p-2.5 rounded-sm border transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center bg-card-bg border-border-beige text-navy hover:bg-card-bg hover:text-accent-brown hover:border-accent-brown"
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
                className="md:hidden p-2 rounded-sm border border-border-beige bg-card-bg text-navy hover:bg-card-bg cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                    &quot;{currentDay.meeting_reference}&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Letters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs md:text-sm font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-brown" />
                Correspondence{" "}
                {hasDisplayableContent
                  ? `(${currentLetterIndex + 1} of ${totalSlides})`
                  : "(0)"}
              </h3>

              {/* Navigation Buttons - Header Position */}
              {totalSlides > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentLetterIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentLetterIndex === 0}
                    className="p-1.5 rounded-sm bg-card-bg border border-border-beige text-navy hover:text-accent-brown disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Previous letter"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentLetterIndex((prev) =>
                        Math.min(totalSlides - 1, prev + 1)
                      )
                    }
                    disabled={currentLetterIndex === totalSlides - 1}
                    className="p-1.5 rounded-sm bg-card-bg border border-border-beige text-navy hover:text-accent-brown disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Next letter"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              {hasDisplayableContent ? (
                /* Letter Card Carousel */
                <div className="space-y-6">
                  <div className="relative">
                    {letters.map((letter, idx) => (
                      <div
                        key={idx}
                        className={`${
                          idx === currentLetterIndex
                            ? "block animate-in fade-in slide-in-from-right-4 duration-500"
                            : "hidden"
                        }`}
                      >
                        <div className="bg-card-bg rounded-sm p-4 md:p-6 border-l-[4px] md:border-l-[6px] border-accent-burgundy shadow-md">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                            {/* LEFT COLUMN: The Primary Source (2/3) */}
                            <div className="lg:col-span-2 flex flex-col justify-between lg:border-r lg:border-border-beige/50 lg:pr-8">
                              <div className="space-y-3 md:space-y-4">
                                {/* Header Info */}
                                <div className="flex items-center justify-between text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent-brown">
                                  <span>Letter #{letter.letter_number}</span>
                                  <span className="truncate ml-2">
                                    {letter.time_of_day || "Time not recorded"}
                                  </span>
                                </div>

                                {/* THE QUOTE: Large and Impactful */}
                                {letter.excerpt && (
                                  <div className="relative pt-2">
                                    <span className="absolute -top-2 md:-top-4 -left-1 md:-left-2 text-4xl md:text-6xl font-serif text-accent-burgundy/10">
                                      &quot;
                                    </span>
                                    <p className="font-serif text-xl md:text-xl lg:text-2xl text-navy italic leading-tight relative z-10">
                                      {letter.excerpt}
                                    </p>
                                  </div>
                                )}

                                {/* SUMMARY: Detailed Context */}
                                {letter.summary && (
                                  <p className="text-xs md:text-base text-slate leading-relaxed border-t border-border-beige pt-3 md:pt-4 italic">
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
                                      score:
                                        letter.scores?.political_unburdening,
                                      color: "var(--color-accent-green)",
                                    },
                                    {
                                      label: "Emotional Desolation",
                                      score:
                                        letter.scores?.emotional_desolation,
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
                                                width: `${
                                                  (metric.score / 10) * 100
                                                }%`,
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
                                        className="px-2 py-1 bg-navy text-card-bg text-[12px] font-bold uppercase tracking-wider rounded-sm shadow-sm transition-all duration-300 cursor-default"
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
                      </div>
                    ))}

                    {/* Render Missing Letters Card if needed */}
                    {showMissingCard && (
                      <div
                        className={`${
                          currentLetterIndex === letters.length
                            ? "block animate-in fade-in slide-in-from-right-4 duration-500"
                            : "hidden"
                        }`}
                      >
                         <div className="bg-card-bg rounded-sm p-6 md:p-8 border-l-[4px] md:border-l-[6px] border-muted-gray/30 shadow-md min-h-[200px] flex flex-col items-center justify-center text-center">
                            <div className="space-y-4 max-w-lg">
                              <div className="w-12 h-12 rounded-full bg-muted-gray/10 flex items-center justify-center mx-auto border border-muted-gray/20">
                                <BookOpen className="w-6 h-6 text-muted-gray/40" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.3em]">
                                  Additional Correspondence
                                </h3>
                                <p className="text-lg font-serif italic text-navy/60 leading-relaxed">
                                  According to the <span className="not-italic font-bold">Letters to Venetia Stanley</span> book, there {missingLettersCount === 1 ? 'is' : 'are'} {missingLettersCount} more letter{missingLettersCount === 1 ? '' : 's'} that day, but {missingLettersCount === 1 ? 'its content is' : 'their contents are'} not currently in the digital archive.
                                </p>
                              </div>
                              <div className="pt-2">
                                <span className="px-3 py-1 bg-section-bg border border-border-beige rounded-sm text-[10px] font-bold text-muted-gray uppercase tracking-widest">
                                  Archive Notice
                                </span>
                              </div>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Indicators */}
                  {totalSlides > 1 && (
                    <div className="flex justify-center gap-2">
                      {Array.from({ length: totalSlides }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentLetterIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            idx === currentLetterIndex
                              ? "bg-accent-burgundy w-4"
                              : "bg-border-beige"
                          }`}
                          aria-label={`Go to letter ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* No Letter Card: Maintained visual consistency */
                <div className="bg-card-bg rounded-sm p-6 md:p-8 border-l-[4px] md:border-l-[6px] border-muted-gray/30 shadow-md min-h-[200px] flex flex-col items-center justify-center text-center">
                  {hasMeeting ? (
                    <div className="space-y-4 max-w-lg">
                      <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto border border-accent-green/20">
                        <Users className="w-6 h-6 text-accent-green" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-[10px] font-black text-accent-green uppercase tracking-[0.3em]">
                          No known letters exchanged
                        </h3>
                        <p className="text-lg font-serif italic text-navy leading-relaxed">
                          {currentDay.meeting_reference ||
                            "The Prime Minister and Venetia met in person"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-lg">
                      <div className="w-12 h-12 rounded-full bg-muted-gray/10 flex items-center justify-center mx-auto border border-muted-gray/20">
                        <Mail className="w-6 h-6 text-muted-gray/40" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.3em]">
                          Gap in Correspondence
                        </h3>
                        <p className="text-lg font-serif italic text-navy/60 leading-relaxed">
                          No surviving record of correspondence for this date.
                          The Archive continues through witness accounts and
                          official records.
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="px-3 py-1 bg-section-bg border border-border-beige rounded-sm text-[10px] font-bold text-muted-gray uppercase tracking-widest">
                          Archive Silence
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

                    {/* Activities & Locations */}
                    <div className="relative pt-12">
                      {hasMeeting && (
                        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center">
                          <div className="px-6 py-2 bg-accent-green text-card-bg rounded-full shadow-lg border-2 border-card-bg">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                              <MessageSquare className="w-4 h-4" />
                              <span>{meetingNote}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* PRIME MINISTER: The Postcard/Correspondence Card */}
                      {!currentDay.pm_location && !currentDay.pm_activities ? (
                        /* PM Insufficient Data - "Missing File" Style */
                        <div className="bg-[#F9F7F1] rounded-sm p-6 border border-border-beige shadow-sm relative flex flex-col items-center justify-center text-center min-h-[220px]">
                          <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(-45deg,rgba(var(--color-section-bg-rgb),0.4),rgba(var(--color-section-bg-rgb),0.4)_1px,transparent_1px,transparent_10px)]"></div>
          
                          <div className="relative z-10 opacity-60">
                            <div className="w-16 h-20 bg-[#EFECE5] mx-auto mb-3 border-2 border-dashed border-[#D8D0C0] flex items-center justify-center">
                              <span className="text-2xl font-serif font-bold text-[#D8D0C0]">
                                ?
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-navy uppercase tracking-[0.2em] mb-1">
                              H.H. Asquith
                            </h4>
                            <p className="text-xs text-muted-gray font-serif italic">
                              No correspondence or official record found.
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* PM Active Record - Removed Title */
                        <div className="group bg-page-bg rounded-sm p-5 border border-border-beige shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5">
                          {/* Left: The Portrait */}
                          <div className="shrink-0 relative mx-auto sm:mx-0 self-start mt-1">
                            <div className="w-24 h-32 relative shadow-sm rotate-[-1deg] group-hover:rotate-0 transition-transform duration-500 bg-section-bg border-4 border-card-bg">
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Asquith_Q_42036_%28cropped%29%28b%29.jpg/250px-Asquith_Q_42036_%28cropped%29%28b%29.jpg"
                                alt="H.H. Asquith"
                                className="w-full h-full object-cover grayscale sepia-[0.3]"
                              />
                            </div>
                            {/* Decorative Clip */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-border-beige opacity-60 rotate-2"></div>
                          </div>
          
                          {/* Right: The Content */}
                          <div className="flex-1 relative pt-1">
                            {/* Location "Postmark" (Top Right Corner) */}
                            {currentDay.pm_location && (
                              <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-2 rotate-[3deg] opacity-80 z-10">
                                <div className="border border-accent-brown/40 rounded-sm px-2 py-0.5 text-[10px] font-bold text-accent-brown uppercase tracking-widest bg-card-bg/50 backdrop-blur-[1px]">
                                  {currentDay.pm_location}
                                </div>
                              </div>
                            )}
          
                            {/* Main Body Text */}
                            <div className="space-y-4 pr-8">
                              {/* Added pr-8 to prevent text from overlapping the postmark */}
          
                              {currentDay.pm_activities && (
                                <div className="text-sm font-serif text-navy/90 leading-relaxed">
                                  <span className="text-[10px] font-sans font-bold text-accent-brown uppercase tracking-wider block mb-1 opacity-70">
                                    Daily Record
                                  </span>
                                  {currentDay.pm_activities}
                                </div>
                              )}
          
                              {currentDay.pm_mood_witness && (
                                <div className="mt-2 bg-section-bg/50 p-2 rounded-sm border-l-2 border-accent-brown/30">
                                  <p className="text-xs text-slate italic font-serif leading-relaxed">
                                    &quot;{currentDay.pm_mood_witness}&quot;
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
          
                      {/* VENETIA: The Postcard/Correspondence Card */}
                      {!currentDay.venetia_location && !currentDay.venetia_activities ? (
                        /* Venetia Insufficient Data */
                        <div className="bg-[#F9F7F1] rounded-sm p-6 border border-border-beige shadow-sm relative flex flex-col items-center justify-center text-center min-h-[220px]">
                          <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(-45deg,rgba(var(--color-section-bg-rgb),0.4),rgba(var(--color-section-bg-rgb),0.4)_1px,transparent_1px,transparent_10px)]"></div>
          
                          <div className="relative z-10 opacity-60">
                            <div className="w-16 h-20 bg-[#EFECE5] mx-auto mb-3 border-2 border-dashed border-[#D8D0C0] flex items-center justify-center">
                              <span className="text-2xl font-serif font-bold text-[#D8D0C0]">
                                ?
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-navy uppercase tracking-[0.2em] mb-1">
                              Venetia Stanley
                            </h4>
                            <p className="text-xs text-muted-gray font-serif italic">
                              Location unknown.
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* Venetia Active Record - Removed Title */
                        <div className="group bg-page-bg rounded-sm p-5 border border-border-beige shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5">
                          {/* Left: Portrait */}
                          <div className="shrink-0 relative mx-auto sm:mx-0 self-start mt-1">
                            <div className="w-24 h-32 relative shadow-sm rotate-[1deg] group-hover:rotate-0 transition-transform duration-500 bg-section-bg border-4 border-card-bg">
                              <img
                                src="https://upload.wikimedia.org/wikipedia/en/1/1c/Venetia_Stanley.jpg"
                                alt="Venetia Stanley"
                                className="w-full h-full object-cover grayscale sepia-[0.3]"
                              />
                            </div>
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-border-beige opacity-60 rotate-[-2deg]"></div>
                          </div>
          
                          {/* Right: Content */}
                          <div className="flex-1 relative pt-1">
                            {/* Location Postmark */}
                            {currentDay.venetia_location && (
                              <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-2 rotate-[-2deg] opacity-80 z-10">
                                <div className="border border-accent-burgundy/40 rounded-sm px-2 py-0.5 text-[10px] font-bold text-accent-burgundy uppercase tracking-widest bg-card-bg/50 backdrop-blur-[1px]">
                                  {currentDay.venetia_location}
                                </div>
                              </div>
                            )}
          
                            <div className="space-y-4 pr-8">
                              {currentDay.venetia_activities && (
                                <div className="text-sm font-serif text-navy/90 leading-relaxed">
                                  <span className="text-[10px] font-sans font-bold text-accent-burgundy uppercase tracking-wider block mb-1 opacity-70">
                                    Activities
                                  </span>
                                  {currentDay.venetia_activities}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
                    </div>          {/* Politics: The Government Dispatch */}
          {currentDay.politics && (
            <div className="mt-8 border-t-2 border-navy/10 pt-6">
              {/* 1. HEADER: Official Metadata */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy"></span>
                  Official Register
                </h3>
                <span className="text-[10px] font-mono text-muted-gray uppercase tracking-widest">
                  {currentDay.date
                    ? currentDay.date.toUpperCase()
                    : "DATE UNKNOWN"}
                </span>
              </div>

              {/* 2. DATA GRID: "Ledger" Style Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border-beige bg-page-bg rounded-sm overflow-hidden">
                {/* COLUMN 1: PARLIAMENT */}
                <div className="relative p-6 border-b md:border-b-0 md:border-r border-border-beige group min-h-[160px]">
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xs font-serif font-bold text-navy/70 uppercase tracking-widest flex items-center gap-2">
                      <Landmark
                        className="w-4 h-4 text-navy/40"
                        strokeWidth={1.5}
                      />
                      Parliament
                    </h4>

                    {/* Status Stamp */}
                    <div
                      className={`
              border-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest transform -rotate-2 opacity-80 select-none
              ${
                currentDay.politics.parliament &&
                !currentDay.politics.parliament.toLowerCase().includes("no")
                  ? "border-accent-green/30 text-accent-green/60" // Active Session Color
                  : "border-accent-red/30 text-accent-red/50"
              }    // Recess Color
          `}
                    >
                      {currentDay.politics.parliament &&
                      !currentDay.politics.parliament
                        .toLowerCase()
                        .includes("no")
                        ? "IN SESSION"
                        : "RECESS"}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="relative">
                    {currentDay.politics.parliament &&
                    !currentDay.politics.parliament
                      .toLowerCase()
                      .includes("no") ? (
                      <p className="font-mono text-xs text-navy/80 leading-loose">
                        <span className="text-accent-brown font-bold mr-2 select-none">
                          &gt;&gt;
                        </span>
                        {currentDay.politics.parliament
                          .replace(/^(Parliament\s*—\s*)/i, "")
                          .replace(/^(Yes\s*—\s*)/i, "")}
                      </p>
                    ) : (
                      /* Empty State Overlay */
                      <div className="flex items-center justify-center mt-6 opacity-10 select-none pointer-events-none">
                        <span className="text-3xl font-black text-navy uppercase tracking-[0.2em] rotate-[-5deg]">
                          Adjourned
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUMN 2: CABINET */}
                <div className="relative p-6 group min-h-[160px]">
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xs font-serif font-bold text-navy/70 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase
                        className="w-4 h-4 text-navy/40"
                        strokeWidth={1.5}
                      />
                      Cabinet Council
                    </h4>

                    {/* Status Stamp */}
                    <div
                      className={`
              border-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest transform rotate-1 opacity-80 select-none
              ${
                currentDay.politics.cabinet &&
                !currentDay.politics.cabinet.toLowerCase().includes("no")
                  ? "border-navy/30 text-navy/60" // Meeting Color
                  : "border-muted-gray/30 text-muted-gray/50"
              } // None Color
          `}
                    >
                      {currentDay.politics.cabinet &&
                      !currentDay.politics.cabinet.toLowerCase().includes("no")
                        ? "MEETING"
                        : "NO SESSION"}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="relative">
                    {currentDay.politics.cabinet &&
                    !currentDay.politics.cabinet
                      .toLowerCase()
                      .includes("no") ? (
                      <div className="font-mono text-xs text-navy/80 leading-loose">
                        <span className="text-accent-brown font-bold mr-2 select-none">
                          &gt;&gt;
                        </span>
                        {/* Optional 'Ref' tag for flavor */}
                        <span className="italic bg-accent-amber/10 px-1 text-navy/50 mr-2 select-none">
                          Ref: War Council
                        </span>
                        <span className="block mt-2">
                          {currentDay.politics.cabinet
                            .replace(/^(Cabinet\s*—\s*)/i, "")
                            .replace(/^(Yes\s*—\s*)/i, "")}
                        </span>
                      </div>
                    ) : (
                      /* Empty State Overlay */
                      <div className="flex items-center justify-center mt-6 opacity-10 select-none pointer-events-none">
                        <span className="text-2xl font-black text-navy uppercase tracking-[0.2em] rotate-[-5deg]">
                          No Minutes
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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
                        className="bg-card-bg rounded-sm p-6 border border-border-beige shadow-sm relative transition-all hover:shadow-md"
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
                              &quot;{diary.excerpt}&quot;
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
