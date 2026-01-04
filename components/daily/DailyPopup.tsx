import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Cloud,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import type { DayData } from "./types";
import { getDayByDate } from "./dayUtils";
import LocationReasonModal from "./LocationReasonModal";
import Correspondence from "./sections/Correspondence";
import Activities from "./sections/Activities";
import Politics from "./sections/Politics";
import Diary from "./sections/Diary";

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
  const [activeReason, setActiveReason] = useState<{ person: string; reason: any } | null>(null);
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
  const proximity = currentDay.asquith_venetia_proximity;
  const distance = proximity?.distance_km;
  const hasMeeting = !!currentDay.met_venetia && typeof distance === 'number' && distance < 60;
  const letters = currentDay.letters ?? [];

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

      const response = await fetch(
        `/api/daily_records/${encodeURIComponent(selectedDate)}`
      );
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

          {/* Letters Section */}
          <Correspondence 
            key={dateString} // Reset carousel when date changes
            letters={letters}
            totalLettersRecorded={currentDay.total_number_letters}
            hasMeeting={hasMeeting}
            meetingReference={currentDay.meeting_details}
          />

          {/* Activities & Locations */}
          <Activities 
            hasMeeting={hasMeeting}
            meetingReason={currentDay.meeting_reason}
            pm_location={currentDay.pm_location}
            pm_activities={currentDay.pm_activities}
            pm_mood_witness={currentDay.pm_mood_witness}
            venetia_location={currentDay.venetia_location}
            venetia_activities={currentDay.venetia_activities}
            pm_location_reason={currentDay.pm_location_reason}
            venetia_location_reason={currentDay.venetia_location_reason}
            onShowReason={(person, reason) => setActiveReason({ person, reason })}
            proximity={currentDay.asquith_venetia_proximity}
          />

          {/* Politics: The Government Dispatch */}
          {currentDay.politics && (
            <Politics 
              politics={currentDay.politics}
              majorEvent={currentDay.major_event}
              dateString={currentDay.date}
            />
          )}

          {/* Diaries */}
          {currentDay.diaries_summary && currentDay.diaries_summary.length > 0 && (
            <Diary diaries={currentDay.diaries_summary} />
          )}
        </div>
      </div>

      {/* Location Reason Overlay */}
      <LocationReasonModal 
        isOpen={!!activeReason}
        onClose={() => setActiveReason(null)}
        person={activeReason?.person || ''}
        reason={activeReason?.reason || ''}
      />
    </div>
  );
}