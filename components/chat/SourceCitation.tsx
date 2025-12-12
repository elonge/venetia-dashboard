'use client';

import React from 'react';
import { FileText } from 'lucide-react';

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
  const displayName = documentTitle || source;
  
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#F5F0E8] border border-[#D4CFC4] text-xs text-[#6B7280]">
      <FileText className="w-3 h-3" />
      <span className="font-medium">{displayName}</span>
      {score !== undefined && score > 0 && (
        <span className="text-[#9CA3AF]">({Math.round(score * 100)}%)</span>
      )}
    </div>
  );
}

