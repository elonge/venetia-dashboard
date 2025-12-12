'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Calendar, Send, MessageSquare, MoreHorizontal } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import DayNavigation from '@/components/home/DayNavigation';
import DayContent from '@/components/home/DayContent';
import Sidebar from '@/components/home/Sidebar';

const SIDEBAR_MIN_WIDTH = 250;
const SIDEBAR_MAX_WIDTH = 800;
const SIDEBAR_DEFAULT_WIDTH = 384; // w-96 equivalent

export default function Home() {
  const [currentDate, setCurrentDate] = useState('MAY 12, 1915');
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Load sidebar width from localStorage on mount
  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= SIDEBAR_MIN_WIDTH && width <= SIDEBAR_MAX_WIDTH) {
        setSidebarWidth(width);
      }
    }
  }, []);

  // Save sidebar width to localStorage when it changes
  useEffect(() => {
    if (sidebarWidth !== SIDEBAR_DEFAULT_WIDTH) {
      localStorage.setItem('sidebarWidth', sidebarWidth.toString());
    }
  }, [sidebarWidth]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = window.innerWidth - e.clientX;
    const clampedWidth = Math.max(
      SIDEBAR_MIN_WIDTH,
      Math.min(SIDEBAR_MAX_WIDTH, newWidth)
    );
    setSidebarWidth(clampedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
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
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="min-h-screen bg-[#E8E4DC]">
      {/* Header */}
      <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
        <h1 className="text-[#1A2A40] font-serif text-lg font-medium">The Venetia Project</h1>
        <span className="text-[#6B7280] text-sm">When AI Meets Primary Sources</span>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

      <div className="flex relative">
        {/* Main Content */}
        <main 
          className="p-4 transition-all"
          style={{ 
            width: `calc(100% - ${sidebarWidth}px)`,
            minWidth: '300px'
          }}
        >
          <HeroSection />
          <DayNavigation currentDate={currentDate} setCurrentDate={setCurrentDate} />
          <DayContent currentDate={currentDate} />
        </main>

        {/* Resize Handle */}
        <div
          className={`absolute top-0 bottom-0 w-1 bg-[#D4CFC4] hover:bg-[#4A7C59] cursor-col-resize transition-colors z-10 ${
            isResizing ? 'bg-[#4A7C59]' : ''
          }`}
          style={{ 
            left: `calc(100% - ${sidebarWidth}px - 0.5px)`
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="flex-shrink-0"
          style={{ width: `${sidebarWidth}px`, minWidth: `${SIDEBAR_MIN_WIDTH}px` }}
        >
          <Sidebar />
        </div>
      </div>
    </div>
  );
}