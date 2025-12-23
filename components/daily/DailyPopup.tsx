"use client";

import React, { useState, useEffect } from "react";
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
  FileX,
  Eye,
  ChevronDown,
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [datePickerError, setDatePickerError] = useState<string | null>(null);
  const controlButtonBase =
    "w-12 h-12 rounded-xl border border-[#D4CFC4] bg-white text-[#1A2A40] shadow-[0_12px_30px_rgba(26,42,64,0.12)] transition-all duration-200 flex items-center justify-center hover:-translate-y-[2px] hover:shadow-[0_16px_36px_rgba(26,42,64,0.16)] focus:outline-none focus:ring-2 focus:ring-[#6B2D3C] focus:ring-offset-2 focus:ring-offset-white";
  const disabledButtonClasses =
    "disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_12px_30px_rgba(26,42,64,0.12)]";

  // Get current date in YYYY-MM-DD format for date input
  const getCurrentDateInputValue = (): string => {
    return dateString;
  };

  const date = parseDate(currentDay.date);
  const formattedDate = date ? format(date, "MMMM d, yyyy") : currentDay.date;
  const dateString = formatDateString(currentDay.date);
  const hasMeeting = currentDay.met_venetia
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
        if (showDatePicker) {
          setShowDatePicker(false);
          setDateInput("");
          setDatePickerError(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, showDatePicker]);

  // Handle date change from calendar picker
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      setDatePickerError("Please select a date");
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
        setDateInput("");
        setDatePickerError(null);
      } else {
        setDatePickerError("No data available for this date");
      }
    } else {
      setDatePickerError("Day data not loaded");
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
    ? "fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4 py-6"
    : "w-full flex justify-center";
  const cardClassName = isModal
    ? "relative w-full max-w-[95vw] max-h-[90vh] bg-[#F5F0E8] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    : "relative w-full max-w-5xl bg-[#F5F0E8] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#D4CFC4]";

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
<div className="flex items-center justify-between p-6 border-b-2 border-[#D4CFC4] bg-white/80 backdrop-blur-md sticky top-0 z-50">
  <div className="flex items-center gap-6">
    <div className="min-w-[220px]">
      <h2 className="font-serif text-2xl font-bold text-[#1A2A40] tracking-tight">
        {formattedDate}
      </h2>
      {currentDay.weather && (
        <div className="flex items-center gap-2 text-[11px] text-[#5A6472] font-black uppercase tracking-[0.15em] mt-1">
          <Cloud className="w-3.5 h-3.5 text-[#8B4513]" />
          <span>{currentDay.weather}</span>
        </div>
      )}
    </div>
    
    {/* Status Badge: Only visible if a meeting occurred */}
    {hasMeeting && (
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#4A7C59]/10 rounded-sm border border-[#4A7C59]/30">
        <div className="w-1.5 h-1.5 bg-[#4A7C59] rounded-full animate-pulse"></div>
        <span className="text-[10px] text-[#4A7C59] font-black uppercase tracking-widest">
          In-Person Meeting Recorded
        </span>
      </div>
    )}
  </div>

  {/* Control Group: Step Navigation & Archive Access */}
  <div className="flex items-center gap-2">
    <div className="flex items-center bg-[#F5F0E8] rounded-sm p-1 border border-[#D4CFC4]/60">
      <button
        onClick={handlePrevious}
        disabled={!hasPrevious || loading}
        className="p-2 hover:bg-white rounded-sm transition-all text-[#1A2A40] disabled:opacity-20 disabled:cursor-not-allowed"
        title="Previous Day"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <div className="w-[1px] h-5 bg-[#D4CFC4] mx-1"></div>
      <button
        onClick={handleNext}
        disabled={!hasNext || loading}
        className="p-2 hover:bg-white rounded-sm transition-all text-[#1A2A40] disabled:opacity-20 disabled:cursor-not-allowed"
        title="Next Day"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>

    {/* Calendar Toggle */}
    <button
      onClick={() => {
        setShowDatePicker(!showDatePicker);
        setDateInput(getCurrentDateInputValue());
        setDatePickerError(null);
      }}
      className={`p-2.5 rounded-sm border transition-all ${
        showDatePicker 
          ? "bg-[#1A2A40] border-[#1A2A40] text-white shadow-inner" 
          : "bg-white border-[#D4CFC4] text-[#1A2A40] hover:bg-[#F5F0E8]"
      }`}
      aria-label="Jump to date"
      title="Open Archive Search"
    >
      <Calendar className="w-5.5 h-5.5" />
    </button>
  </div>
</div>

{/* Calendar Selector Drawer: Archival Search Style */}
{showDatePicker && (
  <div className="bg-[#E8E4DC] border-b border-[#D4CFC4] p-8 animate-in slide-in-from-top duration-300">
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-[#8B4513] uppercase tracking-[0.2em]">Archive Navigation</span>
          <span className="text-[11px] text-[#5A6472] font-serif italic mt-0.5">Jump to a specific point in the correspondence...</span>
        </div>
        {allDays.length > 0 && (
          <div className="text-[12px] font-bold text-[#5A6472] bg-white/40 px-2 py-1 rounded-sm border border-[#D4CFC4]/50">
            Valid Range: 1912 — 1916
          </div>
        )}
      </div>

      <div className="relative group shadow-sm">
        <input
          type="date"
          value={dateInput || getCurrentDateInputValue()}
          onChange={handleDateChange}
          min={dateRange.min}
          max={dateRange.max}
          className="w-full bg-white border-2 border-[#D4CFC4] rounded-sm px-5 py-4 text-lg font-mono text-[#1A2A40] focus:outline-none focus:border-[#8B4513] transition-colors cursor-pointer"
        />
        <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#D4CFC4] pointer-events-none group-hover:text-[#8B4513] transition-colors" />
      </div>

      {datePickerError && (
        <div className="text-center text-sm text-red-600 font-medium animate-pulse">
          {datePickerError}
        </div>
      )}
    </div>
  </div>
)}
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="text-center py-8 text-[#2D3648]">Loading...</div>
          )}

{/* Meeting Reference: The Archive Cross-Reference */}
{hasMeeting && currentDay.meeting_reference && (
  <div className="bg-[#F1F5F2] border-l-4 border-[#4A7C59] rounded-sm p-5 shadow-sm mb-8 relative overflow-hidden group">

    <div className="flex items-start gap-4">
      {/* Icon: A more formal "Official Note" look */}
      <div className="w-10 h-10 rounded-full bg-[#4A7C59]/10 flex items-center justify-center flex-shrink-0 border border-[#4A7C59]/20">
        <MessageSquare className="w-5 h-5 text-[#4A7C59]" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-black text-[#4A7C59] uppercase tracking-[0.2em]">
            The PM and Venetia met that day
          </h3>
          <span className="h-[1px] w-8 bg-[#4A7C59]/20"></span>
        </div>
        
        <p className="text-[15px] text-[#1A2A40] font-serif italic leading-relaxed">
          "{currentDay.meeting_reference}"
        </p>
      </div>
    </div>
  </div>
)}          {/* Letters */}
          {hasLetters ? (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#1A2A40] uppercase tracking-[0.2em] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B4513]" />
                Correspondence ({letters.length})
              </h3>
              {letters.map((letter, idx) => (
                <div
                  key={idx}
                  className="bg-[#FBF8F1] rounded-sm p-6 border-l-[6px] border-[#6B2D3C] shadow-md mb-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: The Primary Source (2/3) */}
                    <div className="lg:col-span-2 flex flex-col justify-between border-r border-[#D4CFC4]/50 pr-8">
                      <div className="space-y-4">
                        {/* Header Info */}
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#8B4513]">
                          <span>Letter #{letter.letter_number}</span>
                          <span>{letter.time_of_day || "Unknown time"}</span>
                        </div>

                        {/* THE QUOTE: Large and Impactful */}
                        {letter.excerpt && (
                          <div className="relative pt-2">
                            <span className="absolute -top-4 -left-2 text-6xl font-serif text-[#6B2D3C]/10 select-none">
                              “
                            </span>
                            <p className="font-serif text-2xl md:text-3xl text-[#1A2A40] italic leading-tight relative z-10">
                              {letter.excerpt}
                            </p>
                          </div>
                        )}

                        {/* SUMMARY: Detailed Context */}
                        {letter.summary && (
                          <p className="text-sm text-[#4A4A4A] leading-relaxed border-t border-[#D4CFC4] pt-4 italic">
                            {letter.summary}
                          </p>
                        )}
                      </div>

                      {/* MENTIONED PEOPLE: Move to bottom of main column */}
                      {letter.people_mentioned &&
                        letter.people_mentioned.length > 0 && (
                          <div className="mt-8 pt-4 border-t border-[#D4CFC4]/30 flex items-start gap-3 text-[9px] uppercase tracking-[0.15em] text-[#5A6472] font-bold">
                            <Users className="w-3.5 h-3.5 mt-[-1px] opacity-60" />
                            <div className="leading-relaxed">
                              <span className="text-[#8B4513] mr-2">
                                Mentioned:
                              </span>
                              <span className="opacity-80">
                                {letter.people_mentioned.join("  •  ")}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Intelligence Analysis (1/3) */}
                    <div className="lg:col-span-1 space-y-6 bg-[#F5F0E8]/40 p-4 rounded-sm">
                      {/* METRICS: Redesigned for full readability */}
                      <div>
                        <h3 className="text-[10px] font-black text-[#8B4513] uppercase tracking-[0.2em] mb-4">
                          Metric Analysis
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              label: "Romantic Adoration",
                              score: letter.scores?.romantic_adoration,
                              color: "#6B2D3C",
                            },
                            {
                              label: "Political Unburdening",
                              score: letter.scores?.political_unburdening,
                              color: "#4A7C59",
                            },
                            {
                              label: "Emotional Desolation",
                              score: letter.scores?.emotional_desolation,
                              color: "#8B6F47",
                            },
                          ].map(
                            (metric, mIdx) =>
                              metric.score !== undefined && (
                                <div key={mIdx} className="space-y-1.5">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#1A2A40]">
                                    <span>{metric.label}</span>
                                    <span>{metric.score}/10</span>
                                  </div>
                                  <div className="w-full bg-[#E8E4DC] h-1.5 rounded-full overflow-hidden">
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
                        <div className="pt-4 border-t border-[#D4CFC4]">
                          <h3 className="text-[10px] font-black text-[#8B4513] uppercase tracking-[0.2em] mb-3">
                            Thematic Tags
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {letter.topics.map((topic, topicIdx) => (
                              <span
                                key={topicIdx}
                                className="px-2 py-1 bg-[#1A2A40] text-[#F5F0E8] text-[9px] font-bold uppercase tracking-wider rounded-sm shadow-sm"
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
            <div className="relative py-10 px-6 bg-[#F5F0E8]/40 rounded-sm border border-[#D4CFC4] overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Visual Indicator of Silence */}
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#6B2D3C]/20 flex items-center justify-center bg-white/50 shrink-0">
                  <Mail className="w-5 h-5 text-[#6B2D3C]/30" />
                </div>

                <div className="flex-1 text-center md:text-left space-y-1">
                  <h3 className="text-[10px] font-black text-[#1A2A40] uppercase tracking-[0.3em]">
                    Daily Correspondence: Silent
                  </h3>
                  <p className="text-sm font-serif italic text-[#1A2A40] leading-relaxed">
                    The Prime Minister did not write to Venetia on this day. The
                    following records reconstruct the atmosphere in Downing
                    Street and the unfolding political situation.
                  </p>
                </div>

                {/* Background Status Tag */}
                <div className="shrink-0 px-3 py-1 bg-[#E8E4DC] border border-[#D4CFC4] rounded-sm shadow-sm">
                  <span className="text-[9px] font-bold text-[#5A6472] uppercase tracking-tighter">
                    Gap in Correspondence
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Activities & Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PRIME MINISTER: Active Intelligence Record */}
            {/* PRIME MINISTER: Conditional State */}
            {!currentDay.pm_location && !currentDay.pm_activities ? (
              /* PM Insufficient Data State */
              <div className="bg-[#E8E4DC]/20 rounded-sm p-6 border border-dashed border-[#D4CFC4] flex flex-col items-center justify-center text-center">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full border border-[#4A7C59]/20 flex items-center justify-center mx-auto">
                    <div className="w-1 h-1 bg-[#4A7C59]/40 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#1A2A40]/60 uppercase tracking-[0.2em] mb-1">
                      Prime Minister
                    </h4>
                    <p className="text-[10px] text-[#4A7C59] uppercase tracking-widest font-bold">
                      Insufficient Data
                    </p>
                    <p className="text-xs text-[#5A6472] font-serif italic max-w-[220px] mx-auto mt-2 leading-relaxed">
                      No surviving record of official activities or specific
                      location for this date.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* PM Standard Active Record (If data exists) */
              <div className="bg-white rounded-sm p-5 border border-[#D4CFC4] shadow-sm relative overflow-hidden">
                <h4 className="text-xs font-black text-[#1A2A40] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4A7C59]"></span>{" "}
                  Prime Minister
                </h4>

                <div className="space-y-4">
                  {currentDay.pm_location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#8B4513] mt-0.5" />
                      <div className="text-sm">
                        <span className="block text-[10px] font-bold text-[#8B4513] uppercase tracking-wider">
                          Current Location
                        </span>
                        <span className="text-[#1A2A40] font-serif">
                          {currentDay.pm_location}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentDay.pm_activities && (
                    <div className="flex items-start gap-3">
                      <Activity className="w-4 h-4 text-[#8B4513] mt-0.5" />
                      <div className="text-sm">
                        <span className="block text-[10px] font-bold text-[#8B4513] uppercase tracking-wider">
                          The PM's Record
                        </span>
                        <p className="text-[#1A2A40] leading-snug">
                          {currentDay.pm_activities}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentDay.pm_mood_witness && (
                    <div className="mt-4 pt-4 border-t border-[#D4CFC4] bg-[#F5F0E8]/40 rounded-sm p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-3 h-3 text-[#6B2D3C]" />
                        <span className="text-[10px] font-bold text-[#6B2D3C] uppercase tracking-widest">
                          Witness Observation
                        </span>
                      </div>
                      <p className="text-sm text-[#2D3648] italic font-serif leading-relaxed">
                        "{currentDay.pm_mood_witness}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* VENETIA: The Missing Record / Redacted State */}
            {!currentDay.venetia_location && !currentDay.venetia_activities ? (
              <div className="bg-[#E8E4DC]/20 rounded-sm p-6 border border-dashed border-[#D4CFC4] flex flex-col items-center justify-center text-center">
                <div className="space-y-3">
                  {/* Minimalist "Missing" Icon */}
                  <div className="w-10 h-10 rounded-full border border-[#6B2D3C]/20 flex items-center justify-center mx-auto">
                    <div className="w-1 h-1 bg-[#6B2D3C]/40 rounded-full"></div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-[#1A2A40]/60 uppercase tracking-[0.2em] mb-1">
                      Venetia Stanley
                    </h4>
                    <p className="text-[10px] text-[#8B4513] uppercase tracking-widest font-bold">
                      Insufficient Data
                    </p>
                    <p className="text-xs text-[#5A6472] font-serif italic max-w-[220px] mx-auto mt-2 leading-relaxed">
                      No surviving record of her specific location or activities
                      for this date.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard State (If data exists) */
              <div className="bg-white rounded-sm p-5 border border-[#D4CFC4] shadow-sm relative">
                <h4 className="text-xs font-black text-[#1A2A40] uppercase tracking-[0.2em] mb-4">
                  Venetia Stanley
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#6B2D3C] mt-0.5" />
                    <div className="text-sm">
                      <span className="block text-[10px] font-bold text-[#6B2D3C] uppercase tracking-wider">
                        Location
                      </span>
                      <span className="text-[#1A2A40] font-serif">
                        {currentDay.venetia_location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="w-4 h-4 text-[#6B2D3C] mt-0.5" />
                    <div className="text-sm">
                      <span className="block text-[10px] font-bold text-[#6B2D3C] uppercase tracking-wider">
                        Activities
                      </span>
                      <p className="text-[#1A2A40] leading-snug">
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
            <div className="bg-white rounded-sm p-6 shadow-sm border border-[#D4CFC4] relative">
              {/* Decorative Date Stamp */}
              <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-[#1A2A40]/30 uppercase tracking-tighter">
                Entry: {currentDay.date?.toUpperCase() || "MAY-17-1915"}
              </div>

              <h4 className="text-xs font-black text-[#1A2A40] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8B4513]" />
                The Political Record
              </h4>

              <div className="space-y-8">
                {currentDay.politics.parliament && (
                  <div className="relative pl-6 border-l border-[#8B4513]/30">
                    <span className="absolute -left-[3px] top-0 w-[5px] h-[5px] rounded-full bg-[#8B4513]"></span>
                    <div className="flex flex-col mb-1">
                      <span className="text-[10px] font-bold text-[#8B4513] uppercase tracking-widest">
                        Parliament
                      </span>
                    </div>
                    <div className="text-sm text-[#1A2A40] font-serif leading-relaxed">
                      {/* Logic: Remove "Parliament — Yes — Topics: " if it exists in string */}
                      {currentDay.politics.parliament.replace(
                        /^(Parliament\s*—\s*Yes\s*—\s*Topics:\s*)/i,
                        ""
                      )}
                    </div>
                  </div>
                )}

                {currentDay.politics.cabinet && (
                  <div className="relative pl-6 border-l border-[#8B4513]/30">
                    <span className="absolute -left-[3px] top-0 w-[5px] h-[5px] rounded-full bg-[#8B4513]"></span>
                    <div className="flex flex-col mb-1">
                      <span className="text-[10px] font-bold text-[#8B4513] uppercase tracking-widest">
                        Cabinet
                      </span>
                    </div>
                    <div className="text-sm text-[#5A6472] font-serif leading-relaxed italic">
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
                <h3 className="text-xs font-black text-[#1A2A40] uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-[#8B4513]"></span>
                  Witness Observations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentDay.diaries_summary.map((diary, idx) => {
                    const personImage =
                      PEOPLE_IMAGES[diary.writer as keyof typeof PEOPLE_IMAGES];
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-sm p-6 border border-[#D4CFC4] shadow-sm relative transition-all hover:shadow-md"
                      >
                        <div className="flex items-start gap-5">
                          {/* Portrait: Larger and Sharper */}
                          {personImage ? (
                            <div className="relative flex-shrink-0">
                              <img
                                src={personImage}
                                alt={diary.writer}
                                /* Increased to w-14 h-14 and removed heavy grayscale for better clarity */
                                className="w-14 h-14 rounded-full object-cover border border-[#D4CFC4] shadow-sm"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-[#F5F0E8] flex items-center justify-center flex-shrink-0 border border-[#D4CFC4] text-[#8B4513] text-xs font-bold">
                              {diary.writer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="flex-1 min-w-0 pt-1">
                            {/* Clean Writer Title */}
                            <div className="font-serif text-base font-bold text-[#1A2A40] mb-2">
                              {diary.writer}
                            </div>

                            {/* The Excerpt: Focus on Readability */}
                            <p className="text-[15px] text-[#2D3648] leading-relaxed italic font-serif border-l-2 border-[#F5F0E8] pl-4">
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
