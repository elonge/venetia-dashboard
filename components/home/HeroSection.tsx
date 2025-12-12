'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, MoreHorizontal } from 'lucide-react';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-[#F5F0E8] rounded-lg overflow-hidden mb-4">
      <div className="flex">
        {/* Left - Big Story with Image */}
        <div className="relative w-[45%]">
          <img 
            src="/asquith_venetia_split_screen.jpg"
            alt="Historical portrait"
            className="w-full h-64 object-cover sepia"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A40]/90 via-[#1A2A40]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <span className="text-[#C4A574] text-xs font-semibold tracking-wider uppercase mb-1 block">
              The Big Story
            </span>
            <h2 className="font-serif text-xl leading-tight">
              A Prime Minister's obsession, a nation at war, and the letters that tell the secret history.
            </h2>
          </div>
        </div>

        {/* Right - Ask the Archive */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#6B7280]" />
              <span className="text-sm font-medium text-[#1A2A40]">Ask the Archive</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
          </div>
          
          <div className="bg-white border border-[#D4CFC4] rounded-lg h-32 mb-3 p-3">
            <p className="text-[#9CA3AF] text-sm italic">
              Ask questions about the historical archive...
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <Input 
              placeholder='e.g., "What did the PM write on D-Day?"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10 bg-white border-[#D4CFC4] text-sm placeholder:text-[#9CA3AF]"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1A2A40] rounded flex items-center justify-center hover:bg-[#2A3A50] transition-colors"
            >
              <Send className="w-3 h-3 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}