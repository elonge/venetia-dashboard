'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

export default function ChatPage() {
  useChatVisibility(true);

  return (
    <div className="min-h-screen bg-[#E8E4DC]">
      {/* Header */}
      <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[#1A2A40] hover:text-[#4A7C59] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <h1 className="font-serif text-lg font-medium">The Venetia Project</h1>
          </Link>
        </div>
        <span className="text-[#6B7280] text-sm">Chat with Historical Documents</span>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-73px)] flex items-center justify-center px-6">
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
