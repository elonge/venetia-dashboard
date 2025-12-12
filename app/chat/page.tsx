'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';

function ChatInterfaceWrapper() {
  return <ChatInterface />;
}

export default function ChatPage() {
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
      <div className="h-[calc(100vh-73px)]">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-[#6B7280]">Loading chat...</p>
            </div>
          </div>
        }>
          <ChatInterfaceWrapper />
        </Suspense>
      </div>
    </div>
  );
}

