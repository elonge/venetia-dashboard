'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface TimelineEvent {
  date: string;
  event: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  title?: string;
  description?: string;
}

export default function Timeline({ 
  events = [], 
  title = 'Chapter Timeline',
  description = 'Key events in chronological order'
}: TimelineProps) {
  return (
    <div className="bg-[#F5F0E8] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#D4CFC4]">
        <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
          {title}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {description}
        </p>
      </div>
      <div className="p-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#D4CFC4]" />
          
          {/* Timeline events */}
          <div className="space-y-6">
            {events.map((item, index) => (
              <div key={index} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#6B2D3C] border-4 border-[#F5F0E8] flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Event content */}
                <div className={`flex-1 pt-1 ${index < events.length - 1 ? 'pb-6' : ''}`}>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-[#D4CFC4] hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-[#6B2D3C] uppercase tracking-wide mb-2">
                          {item.date}
                        </div>
                        <p className="text-[#1A2A40] leading-relaxed font-serif">
                          {item.event}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

