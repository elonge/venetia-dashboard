'use client';

import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/chat/ChatInterface';

interface QuestionAnswer {
  text: string;
  link: string;
}

interface Question {
  _id: string;
  Question: string;
  Answer: QuestionAnswer[];
}

const CHAT_MIN_WIDTH = 300;
const CHAT_MAX_WIDTH = 600;
const CHAT_DEFAULT_WIDTH = 400;

function QAContent() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  // Load chat width from localStorage on mount
  useEffect(() => {
    const savedChatWidth = localStorage.getItem('chatWidth');
    if (savedChatWidth) {
      const width = parseInt(savedChatWidth, 10);
      if (width >= CHAT_MIN_WIDTH && width <= CHAT_MAX_WIDTH) {
        setChatWidth(width);
      }
    }
  }, []);

  // Save chat width to localStorage when it changes
  useEffect(() => {
    if (chatWidth !== CHAT_DEFAULT_WIDTH) {
      localStorage.setItem('chatWidth', chatWidth.toString());
    }
  }, [chatWidth]);

  const handleChatResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingChat(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingChat) {
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.max(
        CHAT_MIN_WIDTH,
        Math.min(CHAT_MAX_WIDTH, newWidth)
      );
      setChatWidth(clampedWidth);
    }
  }, [isResizingChat]);

  const handleMouseUp = useCallback(() => {
    setIsResizingChat(false);
  }, []);

  useEffect(() => {
    if (isResizingChat) {
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
  }, [isResizingChat, handleMouseMove, handleMouseUp]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const questionId = searchParams.get('id');
        
        // Fetch all questions for related questions section
        const allQuestionsResponse = await fetch('/api/questions');
        let allData: Question[] = [];
        if (allQuestionsResponse.ok) {
          allData = await allQuestionsResponse.json();
          setAllQuestions(allData);
        }
        
        // Fetch specific question if ID is provided
        if (questionId) {
          const questionResponse = await fetch(`/api/questions/${questionId}`);
          if (questionResponse.ok) {
            const questionData = await questionResponse.json();
            setQuestion(questionData);
          } else {
            // If question not found, use first question as fallback
            if (allData.length > 0) {
              setQuestion(allData[0]);
            }
          }
        } else {
          // If no ID provided, use first question
          if (allData.length > 0) {
            setQuestion(allData[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [searchParams]);
  
  // Get related questions (exclude current question)
  const relatedQuestions = allQuestions
    .filter(q => q._id !== question?._id)
    .slice(0, 4);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8E4DC] flex items-center justify-center">
        <div className="text-[#1A2A40]">Loading...</div>
      </div>
    );
  }
  
  if (!question) {
    return (
      <div className="min-h-screen bg-[#E8E4DC] flex items-center justify-center">
        <div className="text-[#1A2A40]">Question not found</div>
      </div>
    );
  }
  
  // Extract unique sources from answer links
  const sources = Array.from(new Set(question.Answer.map(a => a.link)));

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

      <div className="flex relative h-[calc(100vh-73px)]">
        {/* Left Column: QA Content */}
        <main 
          className="p-8 transition-all overflow-y-auto flex-shrink"
          style={{ 
            width: `calc(100% - ${chatWidth}px)`,
            minWidth: '300px'
          }}
        >
        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-[#6B2D3C]" />
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Question
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#1A2A40]">
            {question.Question}
          </h1>
        </div>

        {/* Answer */}
        <section className="bg-[#F5F0E8] rounded-lg p-6 mb-6 border-l-4 border-[#6B2D3C]">
          <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
            Answer
          </h2>
          <div className="space-y-4">
            {question.Answer.map((answer, idx) => (
              <div key={idx} className="text-[#1A2A40] leading-relaxed">
                <p className="text-lg mb-1">{answer.text}</p>
                {answer.link && (
                  <p className="text-sm text-[#6B7280] italic">Source: {answer.link}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        {sources.length > 0 && (
          <section className="bg-[#F5F0E8] rounded-lg p-5 mb-6">
            <div className="flex items-start gap-2">
              <ExternalLink className="w-4 h-4 text-[#6B7280] mt-1" />
              <div className="flex-1">
                <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                  Sources
                </h2>
                <ul className="space-y-2">
                  {sources.map((source, idx) => (
                    <li key={idx} className="text-sm text-[#4B5563] hover:text-[#1A2A40] cursor-pointer flex items-start gap-2">
                      <span className="text-[#6B2D3C] font-bold">•</span>
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Suggested Questions */}
        {relatedQuestions.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
              Related Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedQuestions.map((relatedQ) => (
                <Link
                  key={relatedQ._id}
                  href={`/qa?id=${encodeURIComponent(relatedQ._id)}`}
                  className="bg-[#F5F0E8] hover:bg-[#E8E4DC] rounded-lg p-4 transition-colors border border-transparent hover:border-[#D4CFC4] group"
                >
                  <p className="text-sm text-[#1A2A40] group-hover:text-[#6B2D3C] font-medium">
                    {relatedQ.Question}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
        </main>

        {/* Resize Handle */}
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

export default function QA() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#E8E4DC] flex items-center justify-center">
        <div className="text-[#1A2A40]">Loading...</div>
      </div>
    }>
      <QAContent />
    </Suspense>
  );
}