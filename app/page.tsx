'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import DayNavigation from '@/components/home/DayNavigation';
import DayContent from '@/components/home/DayContent';
import Sidebar from '@/components/home/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';

const SIDEBAR_MIN_WIDTH = 250;
const SIDEBAR_MAX_WIDTH = 800;
const SIDEBAR_DEFAULT_WIDTH = 384; // w-96 equivalent

const CHAT_MIN_WIDTH = 300;
const CHAT_MAX_WIDTH = 600;
const CHAT_DEFAULT_WIDTH = 400;

export default function Home() {
  const [currentDate, setCurrentDate] = useState('July 28, 1914');
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Load widths from localStorage on mount
  useEffect(() => {
    const savedSidebarWidth = localStorage.getItem('sidebarWidth');
    if (savedSidebarWidth) {
      const width = parseInt(savedSidebarWidth, 10);
      if (width >= SIDEBAR_MIN_WIDTH && width <= SIDEBAR_MAX_WIDTH) {
        setSidebarWidth(width);
      }
    }
    const savedChatWidth = localStorage.getItem('chatWidth');
    if (savedChatWidth) {
      const width = parseInt(savedChatWidth, 10);
      if (width >= CHAT_MIN_WIDTH && width <= CHAT_MAX_WIDTH) {
        setChatWidth(width);
      }
    }
  }, []);

  // Save widths to localStorage when they change
  useEffect(() => {
    if (sidebarWidth !== SIDEBAR_DEFAULT_WIDTH) {
      localStorage.setItem('sidebarWidth', sidebarWidth.toString());
    }
  }, [sidebarWidth]);

  useEffect(() => {
    if (chatWidth !== CHAT_DEFAULT_WIDTH) {
      localStorage.setItem('chatWidth', chatWidth.toString());
    }
  }, [chatWidth]);

  const handleSidebarResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
  }, []);

  const handleChatResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingChat(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingSidebar) {
      const newWidth = window.innerWidth - e.clientX - chatWidth;
      const clampedWidth = Math.max(
        SIDEBAR_MIN_WIDTH,
        Math.min(SIDEBAR_MAX_WIDTH, newWidth)
      );
      setSidebarWidth(clampedWidth);
    } else if (isResizingChat) {
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.max(
        CHAT_MIN_WIDTH,
        Math.min(CHAT_MAX_WIDTH, newWidth)
      );
      setChatWidth(clampedWidth);
    }
  }, [isResizingSidebar, isResizingChat, chatWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizingSidebar(false);
    setIsResizingChat(false);
  }, []);

  useEffect(() => {
    if (isResizingSidebar || isResizingChat) {
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
  }, [isResizingSidebar, isResizingChat, handleMouseMove, handleMouseUp]);

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

      <div className="flex relative h-[calc(100vh-73px)]">
        {/* Left Column: Hero + Day Content */}
        <main 
          className="p-4 transition-all overflow-y-auto flex-shrink"
          style={{ 
            width: `calc(100% - ${sidebarWidth}px - ${chatWidth}px)`,
            minWidth: '300px'
          }}
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
            left: `calc(100% - ${sidebarWidth}px - ${chatWidth}px - 0.5px)`
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

        {/* Resize Handle between Middle and Right */}
        <div
          className={`absolute top-0 bottom-0 w-1 bg-[#D4CFC4] hover:bg-[#4A7C59] cursor-col-resize transition-colors z-10 ${
            isResizingChat ? 'bg-[#4A7C59]' : ''
          }`}
          style={{ 
            left: `calc(100% - ${chatWidth}px - 0.5px)`
          }}
          onMouseDown={handleChatResizeStart}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        {/* Right Column: Chat */}
        <div
          ref={chatRef}
          className="flex-shrink-0 bg-[#E8E4DC] h-full"
          style={{ width: `${chatWidth}px`, minWidth: `${CHAT_MIN_WIDTH}px` }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[#6B7280]">Loading chat...</p>
              </div>
            </div>
          }>
            <ChatInterface />
          </Suspense>
        </div>
      </div>
    </div>
  );
}