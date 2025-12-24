'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { getRealSourceName } from '@/constants';

export interface SourceCitationProps {
  source: string;
  documentTitle?: string;
  chunkIndex: number;
  score?: number;
}

export default function SourceCitation({
  source,
  documentTitle,
  chunkIndex,
  score,
}: SourceCitationProps) {
  const displayName = getRealSourceName(documentTitle || source);
  
  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-[#F5F0E8] border border-[#D4CFC4] text-[10px] font-bold uppercase tracking-wider text-[#8B4513] hover:bg-[#E8E4D9] transition-colors cursor-help select-none shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      title={`Confidence Score: ${score ? Math.round(score * 100) : 0}%`}
    >
      {/* Icon: Sage Green to verify authenticity */}
      <FileText className="w-3 h-3 text-[#4A7C59]" />
      
      <span>{displayName}</span>
      
      {/* Score: Separated by a small vertical line for cleanliness */}
      {score !== undefined && score > 0 && (
        <span className="text-[#8B4513]/60 ml-0.5 border-l border-[#D4CFC4] pl-1.5">
          {Math.round(score * 100)}%
        </span>
      )}
    </div>
  );
}