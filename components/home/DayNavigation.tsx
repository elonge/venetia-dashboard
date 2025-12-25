import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DayNavigationProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
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
  return dateStr;
}

// Helper function to convert "1915-05-12" to "MAY 12, 1915"
function convertDateStringToDate(dateString: string): string {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (month >= 0 && month < 12) {
      return `${months[month]} ${day}, ${year}`;
    }
  }
  return dateString;
}

export default function DayNavigation({ currentDate, setCurrentDate }: DayNavigationProps) {
  const [dateInput, setDateInput] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Convert current date to YYYY-MM-DD format for the date input
  const getCurrentDateInputValue = () => {
    const dateString = convertDateToDateString(currentDate);
    return dateString;
  };

  // Update date input when currentDate changes (but not when user is actively selecting)
  useEffect(() => {
    if (!dateInput) {
      // Only update if user hasn't started selecting a date
      const dateString = convertDateToDateString(currentDate);
      setDateInput(dateString);
    }
  }, [currentDate]);

  const handlePreviousDay = async () => {
    setIsNavigating(true);
    try {
      const dateString = convertDateToDateString(currentDate);
      const response = await fetch(`/api/timeline_days/previous?date=${encodeURIComponent(dateString)}`);
      
      if (response.ok) {
        const data = await response.json();
        const newDate = convertDateStringToDate(data.date_string);
        setCurrentDate(newDate);
      }
    } catch (error) {
      console.error('Error fetching previous day:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleNextDay = async () => {
    setIsNavigating(true);
    try {
      const dateString = convertDateToDateString(currentDate);
      const response = await fetch(`/api/timeline_days/next?date=${encodeURIComponent(dateString)}`);
      
      if (response.ok) {
        const data = await response.json();
        const newDate = convertDateStringToDate(data.date_string);
        setCurrentDate(newDate);
      }
    } catch (error) {
      console.error('Error fetching next day:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDateInput(selectedDate);
    setDateError(null);

    if (!selectedDate) return;

    // Verify the date exists in the database
    try {
      const response = await fetch(`/api/timeline_days/${encodeURIComponent(selectedDate)}`);
      if (response.ok) {
        const data = await response.json();
        const newDate = convertDateStringToDate(data.date_string);
        setCurrentDate(newDate);
        setDateInput('');
      } else {
        setDateError('No data available for this date');
        // Reset the input to current date
        setTimeout(() => {
          setDateInput('');
          setDateError(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error fetching date:', error);
      setDateError('Error fetching date');
      setTimeout(() => {
        setDateInput('');
        setDateError(null);
      }, 3000);
    }
  };

  return (
    <div className="bg-card-bg rounded-lg p-3 mb-4 flex items-center justify-between border border-border-beige shadow-sm">
      <Button
        variant="ghost"
        onClick={handlePreviousDay}
        disabled={isNavigating}
        className="text-navy hover:bg-page-bg text-sm font-medium disabled:opacity-50">
        <ChevronLeft className="w-4 h-4 mr-1" />
        PREVIOUS DAY
      </Button>

      <div className="flex items-center gap-4">
        <h2 className="text-navy text-lg font-serif tracking-wide">
          A DAY IN HISTORY: <span className="font-bold">{currentDate}</span>
        </h2>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-sm text-slate">
            <span>JUMP TO DATE:</span>
            <div className="relative">
              <input
                type="date"
                value={dateInput || getCurrentDateInputValue()}
                onChange={handleDateChange}
                min="1900-01-01"
                max="2000-12-31"
                className="w-36 h-8 text-xs bg-card-bg border border-border-beige rounded px-2 pr-8 text-navy focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent cursor-pointer"
              />
              <Calendar className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
            </div>
          </div>
          {dateError && (
            <span className="text-xs text-accent-red">{dateError}</span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={handleNextDay}
        disabled={isNavigating}
        className="text-navy hover:bg-page-bg text-sm font-medium disabled:opacity-50">
        NEXT DAY
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
