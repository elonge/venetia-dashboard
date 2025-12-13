'use client';

import React from 'react';
import SourceCitation, { SourceCitationProps } from './SourceCitation';
import { QuestionAnswer } from '@/lib/questions';
import { ExternalLink } from 'lucide-react';
import { getRealSourceName } from '@/constants';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<SourceCitationProps>;
  answers?: QuestionAnswer[];
  isStreaming?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const displayContent = message.isStreaming && !message.content
    ? 'Thinking...'
    : message.content;
  
  // Check if we have structured answers to display
  const hasStructuredAnswers = message.answers && message.answers.length > 0 && !message.isStreaming;
  
  // Extract unique sources from answer links
  const sourcesFromAnswers = hasStructuredAnswers
    ? Array.from(new Set(message.answers!.map(a => a.link).filter(Boolean)))
    : [];
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {hasStructuredAnswers ? (
        // Render structured QuestionAnswer format exactly like QA page
        <div className="max-w-[80%] w-full">
          <section className="bg-[#F5F0E8] rounded-lg p-6 mb-6 border-l-4 border-[#6B2D3C]">
            <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
              Answer
            </h2>
            <div className="space-y-4">
              {message.answers!.map((answer, idx) => (
                <div key={idx} className="text-[#1A2A40] leading-relaxed">
                  <p className="text-lg mb-1">{answer.text}</p>
                  {answer.link && (
                    <p className="text-sm text-[#6B7280] italic">Source: {getRealSourceName(answer.link)}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Sources section - exactly like QA page */}
          {sourcesFromAnswers.length > 0 && (
            <section className="bg-[#F5F0E8] rounded-lg p-5 mb-6">
              <div className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 text-[#6B7280] mt-1" />
                <div className="flex-1">
                  <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                    Sources
                  </h2>
                  <ul className="space-y-2">
                    {sourcesFromAnswers.map((source, idx) => (
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
        </div>
      ) : (
        // Fall back to plain text rendering for non-structured messages
        <div
          className={`max-w-[80%] rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-[#1A2A40] text-white'
              : 'bg-[#F5F0E8] border border-[#D4CFC4] text-[#1A2A40]'
          }`}
        >
          <div className="prose prose-sm max-w-none font-serif">
            <p className="whitespace-pre-wrap leading-relaxed font-serif">{displayContent}</p>
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
            )}
          </div>
          
          {/* Sources section for plain text messages */}
          {!message.isStreaming && message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#D4CFC4]">
              <div className="text-xs text-[#2D3648] mb-2 font-medium">Sources:</div>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, index) => (
                  <SourceCitation key={index} {...source} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
