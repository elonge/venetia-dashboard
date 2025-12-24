'use client';

import React from 'react';
import SourceCitation, { SourceCitationProps } from './SourceCitation';
import { QuestionAnswer } from '@/lib/questions';
import { ExternalLink } from 'lucide-react';
import { getRealSourceName, sourceNameMapping } from '@/constants';

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

  const replaceSourceNames = (text: string): string => {
    const entries = Object.entries(sourceNameMapping).sort(
      ([a], [b]) => b.length - a.length
    );

    return entries.reduce((acc, [sourceName, displayName]) => {
      if (!sourceName) return acc;
      return acc.split(sourceName).join(displayName);
    }, text);
  };
  
  // 1. USER MESSAGE: Solid Navy, Modern, Direct
  if (isUser) {
    return (
      <div className="flex justify-end mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
        <div className="bg-[#1A2A40] text-[#F5F0E8] px-5 py-3.5 rounded-2xl rounded-br-sm max-w-[85%] shadow-md text-sm leading-relaxed font-medium tracking-wide">
          {replaceSourceNames(message.content)}
        </div>
      </div>
    );
  }

  // 2. AI MESSAGE: "Archival Briefing Note" Style
  const hasStructuredAnswers = message.answers && message.answers.length > 0 && !message.isStreaming;

  // Consolidate sources for display
  // If structured, get links. If unstructured, use message.sources.
  const structuredSources = hasStructuredAnswers
    ? Array.from(new Set(message.answers!.map(a => a.link).filter(Boolean)))
    : [];
    
  return (
    <div className="flex justify-start mb-8 w-full animate-in slide-in-from-bottom-2 fade-in duration-500">
      <div className="max-w-[95%] w-full">
        
        {/* A. The "Persona" Header */}
        <div className="flex items-center gap-2 mb-2 ml-1">
          <div className="w-4 h-4 bg-[#4A7C59] rounded-full flex items-center justify-center shadow-sm">
             <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4A7C59]">
            Archival Analysis
          </span>
        </div>

        {/* B. The "Document" Container */}
        <div className="bg-white border border-[#D4CFC4] p-6 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative">
          
          {/* C. Content Area */}
          <div className="font-serif text-[#1A2A40] leading-7 text-[15px]">
            {hasStructuredAnswers ? (
              // Structured Answers (Q&A Format)
              <div className="space-y-6">
                {message.answers!.map((answer, idx) => (
                  <div key={idx} className="relative">
                     <p>{replaceSourceNames(answer.text)}</p>
                  </div>
                ))}
              </div>
            ) : (
              // Plain Text / Streaming Content
              <div className="whitespace-pre-wrap">
                {replaceSourceNames(message.content || (message.isStreaming ? "Retrieving document data..." : ""))}
                {message.isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-[#4A7C59] animate-pulse align-middle" />
                )}
              </div>
            )}
          </div>

          {/* D. Footer: Sources & Citations */}
          {/* We render this if we have EITHER structured sources OR vector sources */}
          {((hasStructuredAnswers && structuredSources.length > 0) || (!hasStructuredAnswers && message.sources && message.sources.length > 0)) && (
            <div className="mt-6 pt-4 border-t border-dashed border-[#D4CFC4] flex flex-col gap-2">
              <span className="text-[9px] font-bold text-[#D4CFC4] uppercase tracking-widest mb-1">
                Verified Sources
              </span>
              
              <div className="flex flex-wrap gap-2">
                {hasStructuredAnswers ? (
                  // Structured Sources Links
                  structuredSources.map((link, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-1.5 text-[10px] text-[#8B4513] font-bold uppercase tracking-wider bg-[#F5F0E8] border border-[#D4CFC4] px-2.5 py-1.5 rounded-sm hover:bg-[#E8E4D9] transition-colors cursor-help"
                      title={link as string}
                    >
                      <ExternalLink size={10} className="text-[#4A7C59]" />
                      {getRealSourceName(link)}
                    </div>
                  ))
                ) : (
                  // RAG Sources Components
                  message.sources?.map((source, index) => (
                    // We wrap the SourceCitation to style it, or you can update SourceCitation to match the new tag style
                    <div key={index} className="scale-95 origin-left"> 
                       <SourceCitation {...source} /> 
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
