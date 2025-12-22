'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import DayNavigation from '@/components/home/DayNavigation';
import Sidebar from '@/components/home/Sidebar';
import { useChatVisibility } from '@/components/chat/useChatVisibility';
import { DailyWidget, DailyPopup, DayData, getDayByDate, getNextDay, getPreviousDay } from '@/components/daily';

const SIDEBAR_MIN_WIDTH = 250;
const SIDEBAR_MAX_WIDTH = 800;
const SIDEBAR_DEFAULT_WIDTH = 560; // w-96 equivalent

export default function Home() {
  const [currentDate, setCurrentDate] = useState('July 28, 1914');
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Daily widget and popup state
  const [allDays, setAllDays] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [todayIn1914, setTodayIn1914] = useState<DayData | null>(null);
  const [loadingDays, setLoadingDays] = useState(true);

  useChatVisibility(true);

  // Calculate today's date in 1914 and load days
  useEffect(() => {
    async function loadDays() {
      try {
        const response = await fetch('/api/mock_days');
        if (!response.ok) {
          throw new Error('Failed to load mock days');
        }
        const data = await response.json();
        setAllDays(data as DayData[]);
        
        // Get today's date in 1914
        const today = new Date();
        const month = 5 // today.getMonth() + 1; // 1-12
        const day = 17 // today.getDate();
        const year = 1915;
        
        // Format as YYYY-MM-DD
        const todayDateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const todayDay = getDayByDate(data, todayDateString);
        console.log('todayDay', todayDay);
        
        setTodayIn1914(todayDay);
      } catch (error) {
        console.error('Error loading days:', error);
      } finally {
        setLoadingDays(false);
      }
    }
    
    loadDays();
  }, []);

  // Load widths from localStorage on mount
  useEffect(() => {
    const savedSidebarWidth = localStorage.getItem('sidebarWidth');
    if (savedSidebarWidth) {
      const width = parseInt(savedSidebarWidth, 10);
      if (width >= SIDEBAR_MIN_WIDTH && width <= SIDEBAR_MAX_WIDTH) {
        setSidebarWidth(width);
      }
    }
  }, []);

  // Save widths to localStorage when they change
  useEffect(() => {
    if (sidebarWidth !== SIDEBAR_DEFAULT_WIDTH) {
      localStorage.setItem('sidebarWidth', sidebarWidth.toString());
    }
  }, [sidebarWidth]);

  const handleSidebarResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingSidebar) {
      const contentRect = contentRef.current?.getBoundingClientRect();
      if (!contentRect) return;

      const newWidth = contentRect.right - e.clientX;
      const clampedWidth = Math.max(
        SIDEBAR_MIN_WIDTH,
        Math.min(SIDEBAR_MAX_WIDTH, newWidth)
      );
      setSidebarWidth(clampedWidth);
    }
  }, [isResizingSidebar]);

  const handleMouseUp = useCallback(() => {
    setIsResizingSidebar(false);
  }, []);

  useEffect(() => {
    if (isResizingSidebar) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingSidebar, handleMouseMove, handleMouseUp]);

  return (
    <div className="min-h-screen bg-[#E8E4DC]">
      {/* Header */}
      <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
        <h1 className="text-[#1A2A40] font-serif text-2xl font-medium">The Venetia Project</h1>
        <div className="flex items-center gap-6">
          <span className="text-[#6B7280] text-base">When AI Meets Primary Sources</span>
          <Link 
            href="/about" 
            className="text-[#1A2A40] hover:text-[#4A7C59] transition-colors text-base font-medium"
          >
            What is the Venetia Project?
          </Link>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

      <div className="flex relative h-[calc(100vh-73px)]" ref={contentRef}>
        {/* Left Column: Hero + Day Content */}
        <main 
          className="p-4 transition-all overflow-y-auto flex-1 min-w-[300px]"
        >
          <HeroSection />
          <DayNavigation currentDate={currentDate} setCurrentDate={setCurrentDate} />
          
          {/* Daily Widget - Today in 1914 */}
          <div className="mt-4">
            {loadingDays ? (
              <div className="bg-[#F5F0E8] rounded-lg p-4 text-center text-[#2D3648]">
                Loading today's date in 1914...
              </div>
            ) : todayIn1914 ? (
              <DailyWidget 
                day={todayIn1914} 
                onClick={() => setSelectedDay(todayIn1914)} 
              />
            ) : (
              <div className="bg-[#F5F0E8] rounded-lg p-4 text-center text-[#2D3648]">
                No data available for today's date in 1914.
              </div>
            )}
          </div>
        </main>

        {/* Resize Handle between Left and Middle */}
        <div
          className={`absolute top-0 bottom-0 w-1 bg-[#D4CFC4] hover:bg-[#4A7C59] cursor-col-resize transition-colors z-10 ${
            isResizingSidebar ? 'bg-[#4A7C59]' : ''
          }`}
          style={{ 
            left: `calc(100% - ${sidebarWidth}px - 0.5px)`
          }}
          onMouseDown={handleSidebarResizeStart}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        {/* Middle Column: Sidebar */}
        <div
          ref={sidebarRef}
          className="flex-shrink-0 overflow-y-auto"
          style={{ width: `${sidebarWidth}px`, minWidth: `${SIDEBAR_MIN_WIDTH}px` }}
        >
          <Sidebar />
        </div>
      </div>

      {/* Daily Popup */}
      {selectedDay && (
        <DailyPopup
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          allDays={allDays}
          getNextDay={async (date) => {
            const next = getNextDay(allDays, date);
            return next ? Promise.resolve(next) : Promise.resolve(null);
          }}
          getPreviousDay={async (date) => {
            const prev = getPreviousDay(allDays, date);
            return prev ? Promise.resolve(prev) : Promise.resolve(null);
          }}
          onNavigateToDay={(date) => {
            const day = getDayByDate(allDays, date);
            if (day) {
              setSelectedDay(day);
            }
          }}
        />
      )}
    </div>
  );
}
