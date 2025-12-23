'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Cog, Shuffle } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import { useChatVisibility } from '@/components/chat/useChatVisibility';
import { DailyWidget, DayData, getDayByDate, normalizeDayDate } from '@/components/daily';
import DataRoom from '@/components/data-room/DataRoom';
import ChaptersGrid from '@/components/home/ChaptersGrid';

export default function Home() {
  const router = useRouter();

  // Daily widget state
  const [todayIn1914, setTodayIn1914] = useState<DayData | null>(null);
  const [loadingDays, setLoadingDays] = useState(true);

  const [funFacts, setFunFacts] = useState<Array<{ _id: string; fact: string }> | null>(null);
  const [funFactIndex, setFunFactIndex] = useState(0);
  const [loadingFunFacts, setLoadingFunFacts] = useState(true);

  useChatVisibility(true);

  // Calculate today's date in 1914 and load days
  useEffect(() => {
    async function loadDays() {
      try {
        const response = await fetch('/api/mock_days');
        if (!response.ok) {
          throw new Error('Failed to load mock days');
        }
        const data = await response.json();
        
        // Get today's date in 1914
        const month = 5 // today.getMonth() + 1; // 1-12
        const day = 17 // today.getDate();
        const year = 1915;
        
        // Format as YYYY-MM-DD
        const todayDateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const todayDay = getDayByDate(data, todayDateString);
        
        setTodayIn1914(todayDay);
      } catch (error) {
        console.error('Error loading days:', error);
      } finally {
        setLoadingDays(false);
      }
    }
    
    loadDays();
  }, []);

  useEffect(() => {
    async function loadFunFacts() {
      try {
        const response = await fetch('/api/fun_facts');
        if (!response.ok) {
          throw new Error('Failed to load fun facts');
        }
        const data = (await response.json()) as Array<{ _id: string; fact: string }>;
        setFunFacts(data);
        setFunFactIndex(0);
      } catch (error) {
        console.error('Error loading fun facts:', error);
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
    <div className="min-h-screen bg-[#E8E4DC]">
      {/* Header */}
      <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
        <h1 className="text-[#1A2A40] font-serif text-2xl font-medium">The Venetia Project</h1>
        <div className="flex items-center gap-6">
          <span className="text-[#6B7280] text-base">When AI Meets Primary Sources</span>
          <Link 
            href="/about" 
            className="text-[#1A2A40] hover:text-[#4A7C59] transition-colors text-base font-medium"
          >
            What is the Venetia Project?
          </Link>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <HeroSection />

        <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Daily view (2/3) */}
          <section className="min-w-0">
            {loadingDays ? (
              <div className="bg-[#F5F0E8] rounded-2xl p-6 text-center text-[#2D3648] border border-[#D4CFC4] min-h-[250px] flex items-center justify-center shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
                Loading today’s date in 1914...
              </div>
            ) : todayIn1914 ? (
              <DailyWidget
                day={todayIn1914}
                onClick={() => router.push(`/daily/${normalizeDayDate(todayIn1914.date)}`)}
              />
            ) : (
              <div className="bg-[#F5F0E8] rounded-2xl p-6 text-center text-[#2D3648] border border-[#D4CFC4] min-h-[250px] flex items-center justify-center shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
                No data available for today’s date in 1914.
              </div>
            )}
          </section>

          {/* Data Room + Simulation Lab (1/3) */}
          <section className="space-y-6">
            <DataRoom previewVariant="compact" />

            <Link
              href="/chat"
              className="block min-h-[170px] rounded-2xl border border-[#1F3350] bg-[#18324E] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.10)] hover:-translate-y-[1px] hover:shadow-[0_18px_44px_rgba(0,0,0,0.14)] transition-all relative overflow-hidden group"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(1200px 500px at -10% -10%, rgba(255,255,255,0.10), transparent 55%)',
                backgroundSize: '22px 22px, 22px 22px, auto',
              }}
            >
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full border border-white/10 bg-white/5 blur-[0.2px] pointer-events-none" />
              <div className="absolute right-4 bottom-4 text-white/25 pointer-events-none">
                <Cog className="h-10 w-10" />
              </div>

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/80">
                      Simulation Lab
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/35 group-hover:text-white/60 transition-colors" />
                  </div>

                  <p className="mt-3 text-sm text-white/80 max-w-[34ch]">
                    Test alternative historical outcomes.
                  </p>
                </div>

                <div className="mt-5 text-sm font-semibold text-white/90">
                  Open →
                </div>
              </div>
            </Link>
          </section>

          {/* Who is Venetia? (2/3) */}
          <section className="min-w-0">
            <Link
              href="/chapter?chapter_id=sicily"
              className="block min-h-62.5 rounded-2xl overflow-hidden border border-black/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)] hover:-translate-y-px hover:shadow-[0_24px_60px_rgba(0,0,0,0.20)] transition-all relative group"
              style={{
                backgroundImage: "url('/asquith_venetia_split_screen2.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />

              <div className="relative h-full p-6 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase text-white/90 border border-white/20">
                    Start Here
                  </span>
                  <h3 className="mt-4 font-serif text-4xl leading-tight font-semibold text-white">
                    Who is Venetia?
                  </h3>
                </div>

                <div className="inline-flex items-center gap-2 text-white/90 font-medium">
                  <span>Read Story</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-[2px] transition-transform" />
                </div>
              </div>
            </Link>
          </section>

          {/* Fun Facts (1/3) */}
          <section>
            <div className="relative rounded-2xl border border-amber-200 bg-[#F6E39A] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.10)] rotate-[0.6deg] overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-45"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 14px 14px, rgba(120, 53, 15, 0.10) 1px, transparent 1px)',
                  backgroundSize: '26px 26px',
                }}
              />

              {/* Pin */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-amber-800 shadow-[0_10px_20px_rgba(120,53,15,0.35)] border border-amber-950/30" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-amber-950/70">
                      Fun Facts
                    </div>
                    <div className="mt-2 text-lg font-bold text-amber-950">
                      Did you know?
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleShuffleFunFact}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white/60 text-amber-900 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loadingFunFacts || !funFacts || funFacts.length === 0}
                    aria-label="Shuffle fun fact"
                    title="Shuffle"
                  >
                    <Shuffle className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4">
                  {loadingFunFacts ? (
                    <div className="text-sm text-amber-900/70">
                      Loading fun facts...
                    </div>
                  ) : funFacts && funFacts.length > 0 ? (
                    <p className="text-[15px] leading-relaxed text-amber-950">
                      {funFacts[funFactIndex]?.fact}
                    </p>
                  ) : (
                    <p className="text-[15px] leading-relaxed text-amber-950">
                      In 1914, the UK’s Parliament was debating crises at home and abroad—while private letters carried entirely different stakes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Chapters (full width) */}
          <section className="min-w-0 lg:col-span-2">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[#1A2A40] font-serif text-2xl font-semibold">
                Chapters
              </h2>
            </div>
            <div className="mt-4">
              <ChaptersGrid />
            </div>
          </section>
        </main>
      </div>

    </div>
  );
}
