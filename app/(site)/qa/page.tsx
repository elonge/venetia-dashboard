'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, MessageSquare } from 'lucide-react';
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
        
        const allQuestionsResponse = await fetch('/api/questions');
        let allData: Question[] = [];
        if (allQuestionsResponse.ok) {
          allData = await allQuestionsResponse.json();
          setAllQuestions(allData);
        }
        
        if (questionId) {
          const questionResponse = await fetch(`/api/questions/${questionId}`);
          if (questionResponse.ok) {
            const questionData = await questionResponse.json();
            setQuestion(questionData);
          } else {
            if (allData.length > 0) {
              setQuestion(allData[0]);
            }
          }
        } else {
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
  
  const relatedQuestions = allQuestions
    .filter(q => q._id !== question?._id)
    .slice(0, 4);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-navy">Loading...</div>
      </div>
    );
  }
  
  if (!question) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-navy">Question not found</div>
      </div>
    );
  }
  
  const sources = Array.from(new Set(question.Answer.map(a => a.link)));

  return (
    <div className="h-full bg-page-bg">
      <div className="flex relative h-full">
        <main 
          className="p-8 transition-all overflow-y-auto flex-1 min-w-[300px]"
        >
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-accent-burgundy" />
            <span className="text-xs font-semibold text-muted-gray uppercase tracking-wider">
              Question
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-navy">
            {question.Question}
          </h1>
        </div>

        <section className="bg-card-bg rounded-lg p-6 mb-6 border-l-4 border-accent-burgundy shadow-sm">
          <h2 className="text-xs font-semibold text-muted-gray uppercase tracking-wider mb-4">
            Answer
          </h2>
          <div className="space-y-4">
            {question.Answer.map((answer, idx) => (
              <div key={idx} className="text-navy leading-relaxed">
                <p className="text-lg mb-1">{answer.text}</p>
                {answer.link && (
                  <p className="text-sm text-muted-gray italic">Source: {getRealSourceName(answer.link)}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {sources.length > 0 && (
          <section className="bg-card-bg rounded-lg p-5 mb-6 border border-border-beige/50">
            <div className="flex items-start gap-2">
              <ExternalLink className="w-4 h-4 text-muted-gray mt-1" />
              <div className="flex-1">
                <h2 className="text-xs font-semibold text-muted-gray uppercase tracking-wider mb-3">
                  Sources
                </h2>
                <ul className="space-y-2">
                  {sources.map((source, idx) => (
                    <li key={idx} className="text-sm text-slate hover:text-navy cursor-pointer flex items-start gap-2">
                      <span className="text-accent-burgundy font-bold">•</span>
                      <span>{getRealSourceName(source)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {relatedQuestions.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-muted-gray uppercase tracking-wider mb-4">
              Related Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedQuestions.map((relatedQ) => (
                <Link
                  key={relatedQ._id}
                  href={`/qa?id=${encodeURIComponent(relatedQ._id)}`}
                  className="bg-card-bg hover:bg-section-bg rounded-lg p-4 transition-colors border border-border-beige shadow-sm group"
                >
                  <p className="text-sm text-navy group-hover:text-accent-burgundy font-medium transition-colors">
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
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-navy">Loading...</div>
      </div>
    }>
      <QAContent />
    </Suspense>
  );
}