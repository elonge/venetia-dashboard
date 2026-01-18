"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Podcast, PODCASTS } from "@/constants";
import { Play, Headphones, ArrowRight } from "lucide-react";
import { STATIC_CHAPTERS } from "@/lib/static-chapters";
import { Chapter as BaseChapter } from "@/lib/chapters";

interface Chapter extends BaseChapter {
  podcast_info?: Podcast;
  date_range?: string;
  thematic_subtitle?: string;
}

type CoverUrlState = string | null | undefined;

const coverUrlCache = new Map<string, string | null>();

function buildCoverCandidates(chapterId: string): string[] {
  const base = `cover-${chapterId}`;
  return [
    `/covers/${base}.png`,
    `/covers/${base}.jpg`,
    `/covers/${base}.jpeg`,
    `/${base}.png`,
    `/${base}.jpg`,
    `/${base}.jpeg`,
  ];
}

function useChapterCoverUrl(chapterId: string): CoverUrlState {
  const [coverUrl, setCoverUrl] = useState<CoverUrlState>(() => {
    if (coverUrlCache.has(chapterId)) return coverUrlCache.get(chapterId);
    return undefined;
  });

  useEffect(() => {
    if (coverUrl !== undefined) return;

    let cancelled = false;
    const candidates = buildCoverCandidates(chapterId);

    const checkExists = (url: string) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });

    (async () => {
      for (const url of candidates) {
        const exists = await checkExists(url);
        if (cancelled) return;
        if (exists) {
          coverUrlCache.set(chapterId, url);
          setCoverUrl(url);
          return;
        }
      }

      coverUrlCache.set(chapterId, null);
      setCoverUrl(null);
    })();

    return () => {
      cancelled = true;
    };
  }, [chapterId, coverUrl]);

  return coverUrl;
}

function sortChapters(chapters: Chapter[]): Chapter[] {
  return chapters.sort((a, b) => {
    const indexA = a.podcast_info?.orderIndex || 9999;
    const indexB = b.podcast_info?.orderIndex || 9999;
    return indexA - indexB;
  });
}

function romanize(num: number): string {
  if (isNaN(num)) return NaN.toString();
  const digits = String(+num).split("");
  const key = [
    "",
    "C",
    "CC",
    "CCC",
    "CD",
    "D",
    "DC",
    "DCC",
    "DCCC",
    "CM",
    "",
    "X",
    "XX",
    "XXX",
    "XL",
    "L",
    "LX",
    "LXX",
    "LXXX",
    "XC",
    "",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
  ];
  let roman = "";
  let i = 3;
  while (i--) roman = (key[+digits.pop()! + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

export default function ChaptersThread() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  // We can treat loading as false initially since we have static data,
  // or use an effect to simulate "mounting" if needed.
  // But for better UX, instant load is better.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const extendWithPodcastInfo = (chapters: BaseChapter[]): Chapter[] => {
      return chapters.map((chapter) => {
        const podcast = PODCASTS.find(
          (p) => p.chapter_id === chapter.chapter_id
        );
        return podcast ? { ...chapter, podcast_info: podcast } : chapter;
      });
    };

    // Load static chapters
    const data = extendWithPodcastInfo(STATIC_CHAPTERS);
    setChapters(data);
    setLoading(false);
  }, []);

  const sortedChapters = chapters?.length > 0 ? sortChapters(chapters) : [];

  if (loading) {
    return (
      <div className="space-y-12 pl-4 border-l border-accent-brown/20">
        {[1, 2, 3].map((key) => (
          <div key={key} className="relative pl-8">
            <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-accent-brown/20" />
            <div className="h-6 w-32 rounded bg-black/5 mb-4" />
            <div className="h-48 w-full rounded bg-black/5 mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-black/5" />
              <div className="h-4 w-3/4 rounded bg-black/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sortedChapters.length === 0) {
    return (
      <div className="rounded-md border border-border-beige bg-card-bg p-6 text-center text-slate">
        No chapters available.
      </div>
    );
  }

  return (
    <div className="relative pl-4 md:pl-0">
      {/* Vertical Line Container - hidden on mobile, centered on desktop */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-accent-brown/20 hidden md:block md:left-8" />

      <div className="space-y-12">
        {sortedChapters.map((chapter, index) => (
          <React.Fragment key={chapter._id}>
            <ChapterThreadItem chapter={chapter} index={index} />
            {index === 2 && <VenetiaPromoCard />}
            {index === 5 && <CoteriePromoCard />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ChapterThreadItem({
  chapter,
  index,
}: {
  chapter: Chapter;
  index: number;
}) {
  const coverUrl = useChapterCoverUrl(chapter.chapter_id);
  const title = chapter.chapter_title || chapter.chapter_id;
  // Use a local variable instead of modifying the prop
  const imageUrl =
    typeof coverUrl === "string" && coverUrl.length > 0 ? coverUrl : undefined;

  // Use deterministic letter count based on index for now, or real data if available
  const thematicSubtitle = chapter.thematic_subtitle || "";
  const displayDateRange = chapter.date_range || "1912 - 1915";
  const chapterUrl = `/chapter?chapter_id=${encodeURIComponent(
    chapter.chapter_id
  )}`;

  return (
    <div className="relative pl-8 md:pl-16 group">
      {/* Timeline Node */}
      <div className="absolute left-[11px] md:left-[27px] top-6 h-2.5 w-2.5 rounded-full bg-accent-brown border-2 border-page-bg z-10 group-hover:scale-125 transition-transform duration-300" />

      <div className="relative bg-white border border-border-beige rounded-sm p-1 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* The Stretched Link */}
        <Link href={chapterUrl} className="absolute inset-0 z-10">
          <span className="sr-only">Read {title}</span>
        </Link>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative z-20 pointer-events-none">
          {/* Left: Image (Thumbnail style) */}
          <div className="relative w-full md:w-48 aspect-[16/9] md:aspect-[4/3] shrink-0 overflow-hidden rounded-sm bg-accent-brown/5">
            {imageUrl ? (
              <img
                src={imageUrl}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-accent-brown/30 font-serif italic text-xs">
                  No Preview
                </span>
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center py-2 pr-4 pl-2 md:pl-0 w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent-brown uppercase">
                Chapter {romanize(index + 1)}
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold text-navy mb-2 group-hover:text-accent-brown transition-colors">
              {title}
            </h3>

            <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-gray uppercase tracking-wider font-mono mb-3">
              <span>{displayDateRange}</span>
              <span className="w-1 h-1 rounded-full bg-border-beige"></span>
              <span className="font-serif italic">{thematicSubtitle}</span>
            </div>

            <div className="flex items-center gap-3 mt-auto">
              <div className="inline-flex items-center gap-2 rounded-md bg-navy/5 px-3 py-1.5 text-xs md:text-sm font-bold text-navy border border-navy/10 group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-all duration-300 shadow-sm whitespace-nowrap">
                <span>Read</span>
                <span className="text-lg leading-none">→</span>
              </div>
              {chapter.podcast_info?.spotify_url && (
                <a
                  href={chapter.podcast_info.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-20 border p-2 pointer-events-auto group inline-flex items-center gap-1.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-gray hover:text-accent-brown transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Headphones
                    size={16}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span>Listen {chapter.podcast_info.duration}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VenetiaPromoCard() {
  return (
    <div className="relative pl-8 md:pl-16 group">
      
      {/* Timeline Node - Dark Stone to contrast with the page, or Amber to match card */}
      <div className="absolute left-[11px] md:left-[27px] top-6 h-2.5 w-2.5 rounded-full bg-stone-900 border-2 border-page-bg z-10 shadow-[0_0_0_4px_rgba(251,191,36,0.2)] group-hover:scale-125 transition-transform duration-300" />

      {/* Card Container - BRIGHT AMBER BACKGROUND */}
      <div className="relative bg-amber-400 border border-amber-500/50 rounded-sm p-1 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group/card hover:scale-[1.005]">
        
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-10 group-hover/card:opacity-20 transition-opacity duration-700 mix-blend-multiply"
          style={{
            backgroundImage: "url('/asquith_venetia_split_screen3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        />
        
        {/* Gradient: Fade from Amber-400 to transparent (no dark gradient) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-amber-400 via-amber-400/90 to-amber-400/60" />

        {/* The Stretched Link */}
        <Link href="/venetia" className="absolute inset-0 z-10">
          <span className="sr-only">Who is Venetia?</span>
        </Link>

        {/* Content Structure */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative z-20 pointer-events-none">
          
          {/* Left: Image (Sepia/Multiply effect) */}
          <div className="relative w-full md:w-48 aspect-[16/9] md:aspect-[4/3] shrink-0 overflow-hidden rounded-sm border border-stone-900/10 shadow-sm bg-amber-200">
            <img
              src="/asquith_venetia_split_screen3.jpg"
              className="w-full h-full object-cover opacity-100 grayscale mix-blend-multiply group-hover/card:scale-105 transition-all duration-700"
              alt="Venetia Stanley"
            />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center py-2 pr-4 pl-2 md:pl-0 w-full">
            
            {/* Label - Dark ink on Gold */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-stone-900 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse" />
                Special Interlude
              </span>
            </div>

            {/* Title - DARK STONE (Black) */}
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-1 drop-shadow-none group-hover/card:text-black transition-colors">
              Who was Venetia?
            </h3>

            {/* Subtitle - Dark Grey/Brown */}
            <div className="flex items-center gap-3 text-[10px] md:text-xs text-stone-800 uppercase tracking-wider font-bold mb-4 opacity-80">
              <span>What made her so extraordinary</span>
            </div>

            {/* CTA Button - BLACK Button on Gold Card */}
            <div className="mt-auto">
              <div className="font-sans inline-flex items-center justify-center px-5 py-2.5 bg-stone-900 text-amber-50 border border-transparent text-xs font-bold uppercase tracking-widest rounded-sm shadow-lg group-hover/card:bg-stone-800 group-hover/card:text-white transition-all">
                Enter Archive
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoteriePromoCard() {
  return (
    <div className="relative pl-8 md:pl-16 group">
      
      {/* Timeline Node - Dark Stone to contrast with the page, or Amber to match card */}
      <div className="absolute left-[11px] md:left-[27px] top-6 h-2.5 w-2.5 rounded-full bg-stone-900 border-2 border-page-bg z-10 shadow-[0_0_0_4px_rgba(251,191,36,0.2)] group-hover:scale-125 transition-transform duration-300" />

      {/* Card Container - BRIGHT AMBER BACKGROUND */}
      <div className="relative bg-amber-400 border border-amber-500/50 rounded-sm p-1 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group/card hover:scale-[1.005]">
        
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-10 group-hover/card:opacity-20 transition-opacity duration-700 mix-blend-multiply"
          style={{
            backgroundImage: "url('/covers/cover-corrupt_coterie.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        />
        
        {/* Gradient: Fade from Amber-400 to transparent (no dark gradient) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-amber-400 via-amber-400/90 to-amber-400/60" />

        {/* The Stretched Link */}
        <Link href="/chapter?chapter_id=corrupt_coterie" className="absolute inset-0 z-10">
          <span className="sr-only">Who is Venetia?</span>
        </Link>

        {/* Content Structure */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative z-20 pointer-events-none">
          
          {/* Left: Image (Sepia/Multiply effect) */}
          <div className="relative w-full md:w-48 aspect-[16/9] md:aspect-[4/3] shrink-0 overflow-hidden rounded-sm border border-stone-900/10 shadow-sm bg-amber-200">
            <img
              src="/covers/cover-corrupt_coterie.jpg"
              className="w-full h-full object-cover opacity-100 grayscale mix-blend-multiply group-hover/card:scale-105 transition-all duration-700"
              alt="Venetia Stanley"
            />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center py-2 pr-4 pl-2 md:pl-0 w-full">
            
            {/* Label - Dark ink on Gold */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-stone-900 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse" />
                Special Interlude
              </span>
            </div>

            {/* Title - DARK STONE (Black) */}
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-1 drop-shadow-none group-hover/card:text-black transition-colors">
              The Corrupt Coterie
            </h3>

            {/* Subtitle - Dark Grey/Brown */}
            <div className="flex items-center gap-3 text-[10px] md:text-xs text-stone-800 uppercase tracking-wider font-bold mb-4 opacity-80">
              <span>Brilliant, cynical, doomed youth (1910 - 1916)</span>
            </div>

            {/* CTA Button - BLACK Button on Gold Card */}
            <div className="mt-auto">
              <div className="font-sans inline-flex items-center justify-center px-5 py-2.5 bg-stone-900 text-amber-50 border border-transparent text-xs font-bold uppercase tracking-widest rounded-sm shadow-lg group-hover/card:bg-stone-800 group-hover/card:text-white transition-all">
                Explore the circle
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}