'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import DataRoom from '@/components/data-room/DataRoom';
import ChapterCarousel from './ChapterCarousel';

interface Chapter {
  _id: string;
  chapter_id: string;
  chapter_title: string;
  main_story: string;
  perspectives: { [key: string]: string };
  fun_fact: string;
  locations: Array<{ name: string; lat: number; long: number }>;
  sources: string[];
}

interface Question {
  _id: string;
  Question: string;
  Answer: Array<{ text: string; link: string }>;
}

interface FunFact {
  _id: string;
  fact: string;
  tags?: string[];
  source?: string;
}

export default function Sidebar() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);
  const [currentFunFactIndex, setCurrentFunFactIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [funFactsLoading, setFunFactsLoading] = useState(true);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const MAX_QUESTIONS_DEFAULT = 4;
  const displayedQuestions = showAllQuestions ? questions : questions.slice(0, MAX_QUESTIONS_DEFAULT);
  const hasMoreQuestions = questions.length > MAX_QUESTIONS_DEFAULT;

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/questions');
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const response = await fetch('/api/chapters');
        if (response.ok) {
          const data = await response.json();
          setChapters(data);
        } else {
          console.error('Error fetching chapters: HTTP', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setChaptersLoading(false);
      }
    }
    fetchChapters();
  }, []);

  useEffect(() => {
    async function fetchFunFacts() {
      try {
        const response = await fetch('/api/fun_facts');
        if (response.ok) {
          const data = await response.json();
          setFunFacts(data);
        } else {
          console.error('Error fetching fun facts: HTTP', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error fetching fun facts:', error);
      } finally {
        setFunFactsLoading(false);
      }
    }
    fetchFunFacts();
  }, []);

  const handlePreviousFunFact = () => {
    if (funFacts.length === 0) return;
    setCurrentFunFactIndex((prev) => (prev === 0 ? funFacts.length - 1 : prev - 1));
  };

  const handleNextFunFact = () => {
    if (funFacts.length === 0) return;
    setCurrentFunFactIndex((prev) => (prev === funFacts.length - 1 ? 0 : prev + 1));
  };

  return (
    <aside className="w-full bg-[#1A2A40] text-white p-4 min-h-screen">
      {/* Chapters */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold uppercase tracking-wider text-[#E5E8F0] mb-3">
          Chapters
        </h3>
        <ChapterCarousel chapters={chapters} loading={chaptersLoading} />
      </div>

      {/* Popular Questions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold uppercase tracking-wider text-white mb-3">
          Popular Questions
        </h3>
        <div className="space-y-4">
          {loading ? (
            <div className="text-sm text-[#E5E8F0] p-3">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-sm text-[#E5E8F0] p-3">No questions available</div>
          ) : (
            <>
              {displayedQuestions.map((q, index) => (
                <Link
                  key={q._id}
                  href={`/qa?id=${encodeURIComponent(q._id)}`}
                  className={`rounded p-4 flex items-center justify-between cursor-pointer transition-colors text-[#1A2A40] ${
                    index % 2 === 0
                      ? 'bg-[#F5F0E8] hover:bg-[#E8E4DC]'
                      : 'bg-[#EEE6D8] hover:bg-[#E6DBC9]'
                  }`}
                >
                  <span className="text-lg text-[#1A2A40]">{q.Question}</span>
                  <ChevronRight className="w-4 h-4 text-[#3E4A60]" />
                </Link>
              ))}
              {hasMoreQuestions && (
                <button
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className="w-full bg-[#F5F0E8] text-white rounded p-2 flex items-center justify-center gap-2 hover:bg-[#E8E4DC] transition-colors text-sm font-medium"
                >
                  {showAllQuestions ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      View More ({questions.length - MAX_QUESTIONS_DEFAULT} more)
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <DataRoom />

      {/* Fun Facts */}
      <div className="bg-[#F5F0E8] text-[#1A2A40] rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider">Fun Facts</h4>
          {funFacts.length > 0 && (
            <span className="text-xs text-[#2D3648]">
              {currentFunFactIndex + 1} / {funFacts.length}
            </span>
          )}
        </div>
        {funFactsLoading ? (
          <div className="text-xs text-[#3E4A60] text-center py-2 h-24 flex items-center justify-center">Loading fun facts...</div>
        ) : funFacts.length === 0 ? (
          <div className="text-xs text-[#3E4A60] text-center py-2 h-24 flex items-center justify-center">No fun facts available</div>
        ) : (
          <div className="h-24 flex flex-col">
            <div className="flex items-start gap-2 flex-1 min-h-0">
              <button
                onClick={handlePreviousFunFact}
                className="w-4 h-4 text-[#3E4A60] hover:text-[#1A2A40] transition-colors flex-shrink-0 mt-1"
                aria-label="Previous fun fact"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex-1 overflow-y-auto min-h-0">
                  <p className="text-sm text-center px-2">
                    {funFacts[currentFunFactIndex]?.fact || 'No fun fact available'}
                  </p>
                </div>
                {funFacts[currentFunFactIndex]?.tags && funFacts[currentFunFactIndex].tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mt-1.5 flex-shrink-0">
                    {funFacts[currentFunFactIndex].tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 bg-[#1A2A40]/10 text-[#2D3648] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleNextFunFact}
                className="w-4 h-4 text-[#3E4A60] hover:text-[#1A2A40] transition-colors flex-shrink-0 mt-1"
                aria-label="Next fun fact"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
