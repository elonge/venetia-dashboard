"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Cog, Shuffle } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import { useChatVisibility } from "@/components/chat/useChatVisibility";
import {
  DailyWidget,
  getDayByDate,
  isInterestingDay,
  normalizeDayDate,
} from "@/components/daily";
import type { DayData } from "@/components/daily";
import ChaptersGrid from "@/components/home/ChaptersGrid";
import DataRoomPreview from "@/components/data-room/DataRoomPreview";

export default function Home() {
  const router = useRouter();
  useChatVisibility(true);

  // Daily widget state
  const [todayInHistory, setTodayInHistory] = useState<DayData | null>(null);
  const [loadingDays, setLoadingDays] = useState(true);

  const [funFacts, setFunFacts] = useState<Array<{
    _id: string;
    fact: string;
  }> | null>(null);
  const [funFactIndex, setFunFactIndex] = useState(0);
  const [loadingFunFacts, setLoadingFunFacts] = useState(true);

  // Find an "interesting" day matching today's month/day in priority years.
  useEffect(() => {
    async function loadDays() {
      try {
        const today = new Date();
        const month = today.getMonth() + 1; // 1-12
        const day = today.getDate();
        const yearsByPriority = [1914, 1915, 1913, 1912] as const;

        const candidateDateStrings = yearsByPriority.map(
          (year) =>
            `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
              2,
              "0"
            )}`
        );

        for (const candidate of candidateDateStrings) {
          const directResponse = await fetch(
            `/api/daily_records/${encodeURIComponent(candidate)}`
          );
          if (!directResponse.ok) continue;

          const dayData = (await directResponse.json()) as DayData;
          if (isInterestingDay(dayData)) {
            setTodayInHistory(dayData);
            return;
          }
        }

        const listResponse = await fetch("/api/daily_records");
        if (listResponse.ok) {
          const list = (await listResponse.json()) as DayData[];
          for (const candidate of candidateDateStrings) {
            const dayData = getDayByDate(list, candidate);
            if (isInterestingDay(dayData)) {
              setTodayInHistory(dayData);
              return;
            }
          }
        }

        const fallbackResponse = await fetch("/api/mock_days");
        if (!fallbackResponse.ok)
          throw new Error("Failed to load daily records");
        const fallbackList = (await fallbackResponse.json()) as DayData[];
        for (const candidate of candidateDateStrings) {
          const dayData = getDayByDate(fallbackList, candidate);
          if (isInterestingDay(dayData)) {
            setTodayInHistory(dayData);
            return;
          }
        }
      } catch (error) {
        console.error("Error loading days:", error);
      } finally {
        setLoadingDays(false);
      }
    }

    loadDays();
  }, []);

  useEffect(() => {
    async function loadFunFacts() {
      try {
        const response = await fetch("/api/fun_facts");
        if (!response.ok) {
          throw new Error("Failed to load fun facts");
        }
        const data = (await response.json()) as Array<{
          _id: string;
          fact: string;
        }>;
        setFunFacts(data);
        setFunFactIndex(0);
      } catch (error) {
        console.error("Error loading fun facts:", error);
        setFunFacts(null);
      } finally {
        setLoadingFunFacts(false);
      }
    }

    loadFunFacts();
  }, []);

  const handleShuffleFunFact = useCallback(() => {
    if (!funFacts || funFacts.length === 0) return;
    if (funFacts.length === 1) {
      setFunFactIndex(0);
      return;
    }

    setFunFactIndex((prev) => {
      let next = prev;
      while (next === prev) {
        next = Math.floor(Math.random() * funFacts.length);
      }
      return next;
    });
  }, [funFacts]);

  return (
    <div className="h-full bg-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <HeroSection />

        <main className="grid grid-cols-1 items-start gap-4 md:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Daily view (2/3) */}
          <section className="min-w-0">
            {loadingDays ? (
              <div className="bg-[#F5F0E8] rounded-md p-4 md:p-6 text-center text-[#2D3648] border border-[#D4CFC4] min-h-[200px] md:min-h-[250px] flex items-center justify-center shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
                <span className="text-sm md:text-base">Loading today's date in 1912–1915...</span>
              </div>
            ) : todayInHistory ? (
              <DailyWidget
                day={todayInHistory}
                onClick={() =>
                  router.push(`/daily/${normalizeDayDate(todayInHistory.date)}`)
                }
              />
            ) : (
              <div className="bg-[#F5F0E8] rounded-2xl p-4 md:p-6 text-center text-[#2D3648] border border-[#D4CFC4] min-h-[200px] md:min-h-[250px] flex items-center justify-center shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
                <span className="text-sm md:text-base">No interesting day found for today's date in 1912–1915.</span>
              </div>
            )}
          </section>

          {/* Data Room + Simulation Lab (1/3) */}
          <section className="space-y-4 md:space-y-6">
            <DataRoomPreview />
            <Link
  href="/lab"
  className="relative block min-h-[160px] md:min-h-[180px] w-full overflow-hidden rounded-lg bg-[#0B0F19] p-6 group transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(124,58,237,0.4)] border border-white/5 hover:border-violet-500/40"
>
  {/* 1. THE "COSMIC" BACKGROUND */}
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
     
     {/* The Deep Void Gradient */}
     <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#1E1B4B]" />

     {/* The "Constellation" Nodes (Static for reliability, or subtle pulse) */}
     <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] group-hover:bg-violet-600/20 transition-all duration-1000" />
     <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all duration-1000" />
     
     {/* Subtle Star/Data Points Pattern */}
     <div className="absolute inset-0 opacity-30" 
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
     />
  </div>

  {/* 2. CONTENT LAYER */}
  <div className="relative z-10 flex flex-col h-full justify-between">
    
    <div>
      {/* The "Experimental" Tag - Looks like a museum label, not code */}
      <div className="flex items-center gap-2 mb-3">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
        </span>
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-violet-300/80">
          Experimental Feature
        </span>
      </div>

      {/* Title: Clean & Modern */}
      <h3 className="text-xl md:text-2xl font-sans font-bold text-white mb-2 tracking-tight group-hover:text-violet-200 transition-colors">
        Simulation Lab
      </h3>

      {/* Description: Human-readable, inviting */}
      <p className="text-sm text-gray-400 font-sans leading-relaxed max-w-[90%] group-hover:text-gray-300 transition-colors">
        What if history happened differently? Use AI to fill the gaps and reconstruct missing timelines.
      </p>
    </div>

    {/* 3. VISUAL HOOK: The "Sparkle" Icon */}
    <div className="flex justify-end mt-2">
      <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-violet-500/20 group-hover:border-violet-500/30 transition-all text-gray-400 group-hover:text-violet-200 shadow-sm">
        {/* Sparkles Icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
          <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
          <path d="M19 11h2m-1 -1v2" />
        </svg>
      </div>
    </div>

  </div>
</Link>
          </section>

          {/* Who is Venetia? (2/3) */}
          <section className="min-w-0">
            <Link
              href="/venetia"
              className="block min-h-[200px] md:min-h-62.5 rounded-md overflow-hidden border border-white/10 shadow-2xl hover:border-[#4A7C59]/50 hover:scale-102 transition-all relative group duration-700"
              style={{
                backgroundImage: "url('/asquith_venetia_split_screen2.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Darker gradient at bottom to make text readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/95 via-[#0D1B2A]/70 to-[#0D1B2A]/40" />

              <div className="relative h-full p-4 md:p-6 flex flex-col justify-between z-10">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      {/* Pulse Indicator: Sage Green is the "Active" signal */}
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_#4A7C59]" />
                      <div className="font-serif font-semibold uppercase tracking-[0.14em] text-white text-lg md:text-[22px]">
                        Venetia
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-[#C8D5EA]/30 group-hover:text-[#4A7C59] group-hover:translate-x-1 transition-all shrink-0" />
                  </div>

                  {/* Main Text: Switched to Off-White (#F5F0E8) for maximum readability */}
                  <p className="mt-3 md:mt-4 text-sm md:text-[16px] font-serif italic text-[#F5F0E8] leading-relaxed max-w-[28ch]">
                    Reconstructed from primary sources
                  </p>
                </div>

                {/* The Call to Action: Switched from low-opacity blue to bright Off-White/Sage */}
                <div className="mt-4 md:mt-6 inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8D5EA] group-hover:text-white transition-colors">
                  <span>Enter the archive</span>
                  <span className="text-[#4A7C59] font-black">→</span>
                </div>
              </div>
            </Link>
          </section>

	          {/* Fun Facts (1/3) */}
	          <section>
	            <div
	              className="relative cursor-pointer rounded-md border min-h-70 border-amber-200 bg-[#F6E39A] p-4 md:p-6 shadow-[0_14px_34px_rgba(0,0,0,0.10)] rotate-[0.6deg] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-900/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8E4DC]"
	              role="button"
	              tabIndex={0}
	              aria-label="Fun facts (click to shuffle)"
	              onClick={handleShuffleFunFact}
	              onKeyDown={(e) => {
	                if (e.key === "Enter" || e.key === " ") {
	                  e.preventDefault();
	                  handleShuffleFunFact();
	                }
	              }}
	            >
	              <div
	                className="absolute inset-0 pointer-events-none opacity-45"
	                style={{
	                  backgroundImage:
	                    "radial-gradient(circle at 14px 14px, rgba(120, 53, 15, 0.10) 1px, transparent 1px)",
                  backgroundSize: "26px 26px",
                }}
              />

              {/* Pin */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-amber-800 shadow-[0_10px_20px_rgba(120,53,15,0.35)] border border-amber-950/30" />

              <div className="relative">
                <div className="flex items-start justify-between gap-3 md:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] md:text-[11px] font-semibold tracking-[0.14em] uppercase text-amber-950/70">
                      Fun Facts
                    </div>
                    <div className="mt-1 md:mt-2 text-base md:text-lg font-bold text-amber-950">
                      Did you know?
                    </div>
                  </div>
	                  <button
	                    type="button"
	                    onClick={(e) => {
	                      e.stopPropagation();
	                      handleShuffleFunFact();
	                    }}
	                    className="inline-flex h-9 w-9 md:h-9 md:w-9 items-center justify-center rounded-md border border-amber-200 bg-white/60 text-amber-900 hover:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 min-w-[44px] min-h-[44px]"
	                    disabled={
	                      loadingFunFacts || !funFacts || funFacts.length === 0
	                    }
	                    aria-label="Shuffle fun fact"
	                    title="Shuffle"
                  >
                    <Shuffle className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 md:mt-4">
                  {loadingFunFacts ? (
                    <div className="text-xs md:text-sm text-amber-900/70">
                      Loading fun facts...
                    </div>
                  ) : funFacts && funFacts.length > 0 ? (
                    <p className="text-sm md:text-[15px] leading-relaxed text-amber-950">
                      {funFacts[funFactIndex]?.fact}
                    </p>
                  ) : (
                    <p className="text-sm md:text-[15px] leading-relaxed text-amber-950">
                      In 1914, the UK's Parliament was debating crises at home
                      and abroad—while private letters carried entirely
                      different stakes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Chapters (full width) */}
          <section className="min-w-0 lg:col-span-2">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[#1A2A40] font-serif text-xl md:text-2xl font-semibold">
                Chapters
              </h2>
            </div>
            <div className="mt-3 md:mt-4">
              <ChaptersGrid />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
