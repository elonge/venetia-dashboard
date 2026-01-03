import React from "react";
import { Newspaper, Briefcase, Landmark } from "lucide-react";

interface PoliticsProps {
  politics: {
    parliament?: string;
    cabinet?: string;
  };
  majorEvent?: string;
  dateString?: string;
}

export default function Politics({
  politics,
  majorEvent,
  dateString,
}: PoliticsProps) {
  return (
    <div className="mt-8 border-t-2 border-navy/10 pt-6">
      {/* 1. HEADER: Official Metadata */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-navy"></span>
          Official Register
        </h3>
        <span className="text-[10px] font-mono text-muted-gray uppercase tracking-widest">
          {dateString ? dateString.toUpperCase() : "DATE UNKNOWN"}
        </span>
      </div>

      {/* 2. DATA GRID: "Ledger" Style Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-border-beige bg-page-bg rounded-sm overflow-hidden">
        {/* COLUMN 1: PARLIAMENT */}
        <div className="relative p-6 border-b md:border-b-0 md:border-r border-border-beige group min-h-[160px]">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-serif font-bold text-navy/70 uppercase tracking-widest flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-navy/40" strokeWidth={1.5} />
              Top News
            </h4>

            <div className="border border-navy/20 px-2 py-0.5 text-[8px] font-bold text-navy/40 uppercase tracking-tighter">
              Daily Edition
            </div>
          </div>

          {/* News Content */}
          <div className="relative">
            {majorEvent ? (
              <div className="space-y-3">
                <div className="h-0.5 w-full bg-navy/10 mb-3"></div>
                <p className="font-sans text-[13px] text-navy/90 leading-relaxed text-justify hyphens-auto selection:bg-accent-amber/30">
                  {majorEvent}
                </p>
                <div className="h-px w-12 bg-navy/20 ml-auto"></div>
              </div>
            ) : (
              /* Empty State Overlay */
              <div className="flex items-center justify-center mt-6 opacity-10 select-none pointer-events-none">
                <span className="text-2xl font-black text-navy uppercase tracking-[0.2em] rotate-[3deg]">
                  No Headline
                </span>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: CABINET */}
        <div className="relative p-6 border-b md:border-b-0 md:border-r border-border-beige group min-h-[160px]">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-serif font-bold text-navy/70 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-navy/40" strokeWidth={1.5} />
              Cabinet Council
            </h4>

            {/* Status Stamp */}
            <div
              className={`
              border-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest transform rotate-1 opacity-80 select-none
              ${
                politics?.cabinet &&
                !politics.cabinet.toLowerCase().includes("no")
                  ? "border-navy/30 text-navy/60" // Meeting Color
                  : "border-muted-gray/30 text-muted-gray/50"
              } // None Color
          `}
            >
              {politics?.cabinet &&
              !politics.cabinet.toLowerCase().includes("no")
                ? "MEETING"
                : "NO SESSION"}
            </div>
          </div>

          {/* Content Area */}
          <div className="relative">
            {politics?.cabinet &&
            !politics.cabinet.toLowerCase().includes("no") ? (
              <div className="font-mono text-xs text-navy/80 leading-loose">
                <span className="text-accent-brown font-bold mr-2 select-none">
                  &gt;&gt;
                </span>
                {/* Optional 'Ref' tag for flavor */}
                <span className="italic bg-accent-amber/10 px-1 text-navy/50 mr-2 select-none">
                  Ref: War Council
                </span>
                <span className="block mt-2">
                  {politics.cabinet
                    .replace(/^(Cabinet\s*—\s*)/i, "")
                    .replace(/^(Yes\s*—\s*)/i, "")}
                </span>
              </div>
            ) : (
              /* Empty State Overlay */
              <div className="flex items-center justify-center mt-6 opacity-10 select-none pointer-events-none">
                <span className="text-2xl font-black text-navy uppercase tracking-[0.2em] rotate-[-5deg]">
                  No Minutes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: DAILY NEWS */}
        <div className="relative p-6 group min-h-[160px] bg-white/40">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-serif font-bold text-navy/70 uppercase tracking-widest flex items-center gap-2">
              <Landmark className="w-4 h-4 text-navy/40" strokeWidth={1.5} />
              Parliament
            </h4>

            {/* Status Stamp */}
            <div
              className={`
              border-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest transform -rotate-2 opacity-80 select-none
              ${
                politics?.parliament &&
                !politics.parliament.toLowerCase().includes("no")
                  ? "border-accent-green/30 text-accent-green/60" // Active Session Color
                  : "border-accent-red/30 text-accent-red/50"
              }    // Recess Color
          `}
            >
              {politics?.parliament &&
              !politics.parliament.toLowerCase().includes("no")
                ? "IN SESSION"
                : "RECESS"}
            </div>
          </div>

          {/* Content Area */}
          <div className="relative">
            {politics?.parliament &&
            !politics.parliament.toLowerCase().includes("no") ? (
              <p className="font-mono text-xs text-navy/80 leading-loose">
                <span className="text-accent-brown font-bold mr-2 select-none">
                  &gt;&gt;
                </span>
                {politics.parliament
                  .replace(/^(Parliament\s*—\s*)/i, "")
                  .replace(/^(Yes\s*—\s*)/i, "")}
              </p>
            ) : (
              /* Empty State Overlay */
              <div className="flex items-center justify-center mt-6 opacity-10 select-none pointer-events-none">
                <span className="text-3xl font-black text-navy uppercase tracking-[0.2em] rotate-[-5deg]">
                  Adjourned
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
