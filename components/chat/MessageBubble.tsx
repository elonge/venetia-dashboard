'use client';

import React from 'react';
import SourceCitation, { SourceCitationProps } from './SourceCitation';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<SourceCitationProps>;
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
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
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
        
        {message.sources && message.sources.length > 0 && !message.isStreaming && (
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
    </div>
  );
}
