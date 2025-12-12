'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Calendar, Send, MessageSquare, MoreHorizontal } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import DayNavigation from '@/components/home/DayNavigation';
import DayContent from '@/components/home/DayContent';
import Sidebar from '@/components/home/Sidebar';

export default function Home() {
  const [currentDate, setCurrentDate] = useState('MAY 12, 1915');

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

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-4">
          <HeroSection />
          <DayNavigation currentDate={currentDate} setCurrentDate={setCurrentDate} />
          <DayContent />
        </main>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}