'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PODCASTS } from '@/constants';

interface Chapter {
  _id: string;
  chapter_id: string;
  chapter_title: string;
  main_story: string;
  image?: string;
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
  if (chapters.length === 0) return chapters;

  const chapterOrder = PODCASTS.map((p) => p.chapter_id);
  const chapterMap = new Map(chapters.map((c) => [c.chapter_id, c]));

  const ordered: Chapter[] = [];
  chapterOrder.forEach((id) => {
    const chapter = chapterMap.get(id);
    if (chapter) {
      ordered.push(chapter);
      chapterMap.delete(id);
    }
  });

  chapterMap.forEach((chapter) => ordered.push(chapter));
  return ordered;
}

export default function ChaptersGrid() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const response = await fetch('/api/chapters');
        if (!response.ok) {
          console.error('Error fetching chapters: HTTP', response.status, await response.text());
          return;
        }
        const data = (await response.json()) as Chapter[];
        setChapters(data);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChapters();
  }, []);

  const sortedChapters = useMemo(() => sortChapters(chapters), [chapters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['a', 'b', 'c', 'd', 'e', 'f'].map((key) => (
          <div
            key={key}
            className="rounded-2xl border border-[#D4CFC4] bg-[#F5F0E8] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
          >
            <div className="h-4 w-24 rounded bg-black/10" />
            <div className="mt-3 h-5 w-3/4 rounded bg-black/10" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full rounded bg-black/10" />
              <div className="h-3 w-11/12 rounded bg-black/10" />
              <div className="h-3 w-10/12 rounded bg-black/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sortedChapters.length === 0) {
    return (
      <div className="rounded-2xl border border-[#D4CFC4] bg-[#F5F0E8] p-6 text-center text-[#2D3648]">
        No chapters available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedChapters.map((chapter, index) => (
        <ChapterCard2 key={chapter._id} chapter={chapter} index={index} />
      ))}
    </div>
  );
}

function ChapterCard({ chapter }: { chapter: Chapter }) {
  const coverUrl = useChapterCoverUrl(chapter.chapter_id);
  const hasCover = typeof coverUrl === 'string' && coverUrl.length > 0;
  const title = chapter.chapter_title || chapter.chapter_id;

  return (
    <Link
      href={`/chapter?chapter_id=${encodeURIComponent(chapter.chapter_id)}`}
      aria-label={title}
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-[1px] hover:shadow-[0_16px_38px_rgba(0,0,0,0.10)] transition-all group ${
        hasCover ? 'border-black/10 bg-[#0B1626]' : 'border-[#D4CFC4] bg-[#F5F0E8]'
      }`}
    >
      {hasCover ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${coverUrl}')` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" aria-hidden="true" />
        </>
      ) : null}

      <div className="relative z-10">
        {hasCover ? (
          <>
            <span className="sr-only">{title}</span>
            <div className="absolute bottom-4 left-4 inline-flex items-center rounded-full bg-black/45 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 ring-1 ring-white/15 backdrop-blur-sm">
              Open →
            </div>
          </>
        ) : (
          <>
            <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B2D3C]">
              Chapter
            </div>
            <h3 className="mt-2 font-serif text-lg leading-snug font-semibold text-[#1A2A40] group-hover:text-[#4A7C59] transition-colors">
              {title}
            </h3>
            {chapter.main_story ? (
              <p className="mt-2 text-sm text-[#2D3648] leading-relaxed line-clamp-3">
                {chapter.main_story}
              </p>
            ) : null}
            <div className="mt-4 pt-4 border-t border-[#D4CFC4] text-xs text-[#3E4A60] uppercase tracking-wider">
              Listen &amp; Read More →
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

function ChapterCard2({ chapter, index }: { chapter: Chapter, index: number }) {
  const coverUrl = useChapterCoverUrl(chapter.chapter_id);
  const hasCover = typeof coverUrl === 'string' && coverUrl.length > 0;
  const title = chapter.chapter_title || chapter.chapter_id;
  chapter.image = typeof coverUrl === 'string' && coverUrl.length > 0 ? coverUrl : undefined;

  return (
    // Theoretical Component Structure
<div className="group relative overflow-hidden rounded-xl aspect-video cursor-pointer shadow-md">
  
  {/* 1. BACKGROUND IMAGE */}
  <img 
    src={chapter.image} 
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  />
  
  {/* 2. GRADIENT OVERLAY (For text readability) */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

  {/* 3. CONTENT LAYER */}
  <div className="absolute inset-0 p-6 flex flex-col justify-end">
    
    {/* Top Badge: Chapter ID or Number */}
    <div className="absolute top-4 left-4">
      <span className="px-2 py-1 text-[10px] font-bold tracking-widest text-white/80 bg-black/30 backdrop-blur-sm rounded border border-white/10 uppercase">
        Chapter {index + 1}
      </span>
      
    </div>

    {/* Title */}
    <h3 className="text-xl md:text-2xl font-serif text-white mb-2 leading-tight">
      {chapter.chapter_title}
    </h3>

    {/* Description (Hidden by default, slides in, or just visible but small) */}
    <p className="text-sm text-gray-300 line-clamp-2 max-w-[90%] opacity-80 group-hover:opacity-100 transition-opacity">
      {chapter.main_story}
    </p>

  </div>
</div>  
  );
}
