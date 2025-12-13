'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import DayNavigation from '@/components/home/DayNavigation';
import DayContent from '@/components/home/DayContent';
import Sidebar from '@/components/home/Sidebar';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

const SIDEBAR_MIN_WIDTH = 250;
const SIDEBAR_MAX_WIDTH = 800;
const SIDEBAR_DEFAULT_WIDTH = 640; // w-96 equivalent

export default function Home() {
  const [currentDate, setCurrentDate] = useState('July 28, 1914');
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useChatVisibility(true);

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
          <DayContent currentDate={currentDate} />
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
    </div>
  );
}
