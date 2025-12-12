'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, ExternalLink, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock Q&A data
const qaData = {
  question: 'How many letters a day?',
  answer: 'At the height of their correspondence in 1914-1915, Prime Minister Asquith wrote to Venetia Stanley as many as three times a day. The letters varied in length from brief notes dashed off between Cabinet meetings to lengthy epistles of several pages written late at night. On particularly intense days during the First World War, Asquith would write during Cabinet meetings themselves, documenting his own government\'s deliberations in real-time to his young confidante. Over the course of their correspondence, he wrote over 560 letters to her, an extraordinary volume for a sitting Prime Minister during wartime.',
  sources: [
    'H.H. Asquith: Letters to Venetia Stanley (Oxford University Press, 1982)',
    'The Asquith Papers, Bodleian Library, Oxford',
    'Contemporary diary entries from Venetia Stanley'
  ],
  suggestedQuestions: [
    'What did Asquith write about during Cabinet meetings?',
    'Was Venetia a spy?',
    'How did the letters affect British politics?',
    'When did the correspondence begin?'
  ]
};

export default function QA() {
  const [chatQuery, setChatQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#E8E4DC]">
      {/* Header */}
      <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-[#1A2A40]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="h-6 w-px bg-[#D4CFC4]" />
          <h1 className="text-[#1A2A40] font-serif text-lg font-medium">The Venetia Project</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-8">
        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-[#6B2D3C]" />
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Question
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#1A2A40]">
            {qaData.question}
          </h1>
        </div>

        {/* Answer */}
        <section className="bg-[#F5F0E8] rounded-lg p-6 mb-6 border-l-4 border-[#6B2D3C]">
          <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
            Answer
          </h2>
          <p className="text-[#1A2A40] leading-relaxed text-lg">
            {qaData.answer}
          </p>
        </section>

        {/* Sources */}
        <section className="bg-[#F5F0E8] rounded-lg p-5 mb-6">
          <div className="flex items-start gap-2">
            <ExternalLink className="w-4 h-4 text-[#6B7280] mt-1" />
            <div className="flex-1">
              <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                Sources
              </h2>
              <ul className="space-y-2">
                {qaData.sources.map((source, idx) => (
                  <li key={idx} className="text-sm text-[#4B5563] hover:text-[#1A2A40] cursor-pointer flex items-start gap-2">
                    <span className="text-[#6B2D3C] font-bold">•</span>
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Ask Your Own Question */}
        <section className="bg-[#F5F0E8] rounded-lg p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-4 h-4 text-[#6B2D3C]" />
            <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Ask Your Own Question
            </h2>
          </div>
          <div className="relative">
            <Input 
              placeholder="e.g., What was Venetia's response to the letters?"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              className="pr-10 bg-white border-[#D4CFC4] text-sm placeholder:text-[#9CA3AF]"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1A2A40] rounded flex items-center justify-center hover:bg-[#2A3A50] transition-colors">
              <Send className="w-3 h-3 text-white" />
            </button>
          </div>
        </section>

        {/* Suggested Questions */}
        <section>
          <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
            Related Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {qaData.suggestedQuestions.map((question, idx) => (
              <Link
                key={idx}
                href="/qa"
                className="bg-[#F5F0E8] hover:bg-[#E8E4DC] rounded-lg p-4 transition-colors border border-transparent hover:border-[#D4CFC4] group"
              >
                <p className="text-sm text-[#1A2A40] group-hover:text-[#6B2D3C] font-medium">
                  {question}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}