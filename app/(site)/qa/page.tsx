'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatVisibility } from '@/components/chat/useChatVisibility';
import { getRealSourceName } from '@/constants';

interface QuestionAnswer {
  text: string;
  link: string;
}

interface Question {
  _id: string;
  Question: string;
  Answer: QuestionAnswer[];
}

function QAContent() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  useChatVisibility(true);
  
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
          <h1 className="text-[#1A2A40] font-serif text-2xl font-medium">The Venetia Project</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

      <div className="flex relative h-[calc(100vh-73px)]">
        {/* Left Column: QA Content */}
        <main 
          className="p-8 transition-all overflow-y-auto flex-1 min-w-[300px]"
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
                  <p className="text-sm text-[#6B7280] italic">Source: {getRealSourceName(answer.link)}</p>
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
                      <span>{getRealSourceName(source)}</span>
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
