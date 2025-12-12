import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DayNavigationProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

export default function DayNavigation({ currentDate, setCurrentDate }: DayNavigationProps) {
  return (
    <div className="bg-[#F5F0E8] rounded-lg p-3 mb-4 flex items-center justify-between">
      <Button
        variant="ghost"
        className="text-[#1A2A40] hover:bg-[#E8E4DC] text-sm font-medium">

        <ChevronLeft className="w-4 h-4 mr-1" />
        PREVIOUS DAY
      </Button>

      <div className="flex items-center gap-4">
        <h2 className="text-[#1A2A40] text-xl font-serif tracking-wide">
          A DAY IN HISTORY: <span className="font-bold">{currentDate}</span>
        </h2>
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <span>JUMP TO DATE:</span>
          <div className="relative">
            <Input
              placeholder="MM/DD/YYYY"
              className="w-28 h-8 text-xs bg-white border-[#D4CFC4] pr-8" />

            <Calendar className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        className="text-[#1A2A40] hover:bg-[#E8E4DC] text-sm font-medium">

        NEXT DAY
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>);

}