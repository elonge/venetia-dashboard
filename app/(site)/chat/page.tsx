'use client';

import React from 'react';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

export default function ChatPage() {
  useChatVisibility(true);

  return (
    <div className="h-full bg-[#E8E4DC]">
      <div className="h-full flex items-center justify-center px-6">
        <div className="max-w-3xl text-center bg-[#F5F0E8] border border-[#D4CFC4] rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-serif text-[#1A2A40] mb-3">Use the chat panel on the right</h2>
          <p className="text-[#4B5563] mb-4">
            The chat stays open while you browse. Ask anything about the archive and keep your history as you move between chapters and questions.
          </p>
          <p className="text-[#6B7280] text-sm">
            Need a starting point? Try asking about a specific date, a letter between Venetia and Asquith, or what Parliament debated that day.
          </p>
        </div>
      </div>
    </div>
  );
}
