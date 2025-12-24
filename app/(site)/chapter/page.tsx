'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Play, Headphones, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PEOPLE_IMAGES, PODCASTS, getRealSourceName } from '@/constants';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

// Dynamically import SicilyMap with SSR disabled
const SicilyMap = dynamic(() => import('@/components/chapter/SicilyMap'), {
  ssr: false,
});

import Timeline from '@/components/chapter/Timeline';

interface Chapter {
  _id: string;
  chapter_id: string;
  chapter_title: string;
  main_story: string;
  perspectives: { [key: string]: string };
  fun_fact: string;
  locations: Array<{ name: string; lat: number; long: number }>;
  timeline?: Array<{ date: string; event: string }>;
  sources: string[];
  podcast?: {
    title: string;
    duration: string;
    description: string;
    spotify_url?: string; // NEW FIELD
  };
  video?: {
    title: string;
    duration: string;
    thumbnail: string;
  };
}

function ChapterContent() {
  const searchParams = useSearchParams();
  const chapterId = searchParams.get('chapter_id');
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useChatVisibility(false);

  useEffect(() => {
    async function fetchChapter() {
      if (!chapterId) {
        setError('No chapter ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/chapters/${chapterId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chapter');
        }
        const data = await response.json();
        setChapterData(data);
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError('Failed to load chapter');
      } finally {
        setLoading(false);
      }
    }

    fetchChapter();
  }, [chapterId]);

  if (loading) {
    return (
      <div className="h-full bg-[#E8E4DC] flex items-center justify-center">
        <div className="text-[#1A2A40]">Loading chapter...</div>
      </div>
    );
  }

  if (error || !chapterData) {
    return (
      <div className="h-full bg-[#E8E4DC]">
        <main className="max-w-5xl mx-auto p-8">
          <div className="text-[#1A2A40] text-center">
            <p className="text-lg mb-4">{error || 'Chapter not found'}</p>
            <Link href="/">
              <Button className="bg-[#1A2A40] hover:bg-[#2A3A50] text-white">
                Return to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // --- DATA PREPARATION ---
  const perspectivesArray = Object.entries(chapterData.perspectives).map(([character, description]) => ({
    character,
    description,
    image: PEOPLE_IMAGES[character as keyof typeof PEOPLE_IMAGES] || null
  }));

  const podcastData = PODCASTS.find(p => p.chapter_id === chapterData.chapter_id);
  const hasPodcast = !!(podcastData || chapterData.podcast);
  // Merge podcast data to check for spotify_url in either source
  const activePodcast = podcastData || chapterData.podcast;
  const spotifyUrl = activePodcast?.spotify_url || (podcastData as any)?.spotify_url;

  const formatDuration = (val: string | number): string => {
    if (typeof val === 'string') return val;
    const mins = Math.floor(val / 60);
    const secs = val % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const podcastDuration = activePodcast?.duration 
    ? typeof activePodcast.duration === 'number' 
      ? formatDuration(activePodcast.duration)
      : activePodcast.duration
    : 'N/A';

  return (
    <div className="h-full bg-[#E8E4DC]">
      <div className="flex relative h-full">
        <main className="p-8 transition-all overflow-y-auto flex-1 min-w-[300px]">
          <div className="max-w-5xl mx-auto">
            
            {/* 1. MAIN TITLE */}
            <div className="mb-8">
              <h1 className="text-4xl font-serif font-bold text-[#1A2A40] leading-tight">
                {chapterData.chapter_title}
              </h1>
            </div>

            {/* 2. DUAL INTRO SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12 items-start">
              
              {/* LEFT: STORY */}
              <div className={`${hasPodcast ? 'md:col-span-7' : 'md:col-span-12'} bg-[#F5F0E8] border border-[#D4CFC4] p-8 rounded-sm shadow-sm relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C24E42]/80" />
                <span className="text-[9px] font-black text-[#8B4513] uppercase tracking-[0.25em] mb-4 block">
                  The Context
                </span>
                <p className="font-serif text-[15px] leading-relaxed text-[#1A2A40]">
                  {chapterData.main_story}
                </p>
              </div>

              {/* RIGHT: PODCAST CARD */}
              {hasPodcast && activePodcast && (
                <div className="md:col-span-5 h-full">
                  <div className="bg-[#EBE5DA] border border-[#D4CFC4] p-6 rounded-sm shadow-md h-full flex flex-col relative group">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black text-[#1A2A40] uppercase tracking-[0.25em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4A7C59] animate-pulse"></span>
                        Audio Guide
                      </span>
                      <span className="text-[10px] font-mono text-[#5A6472]">{podcastDuration}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg text-[#1A2A40] leading-tight mb-2">
                      {activePodcast.title}
                    </h3>
                    
                    {activePodcast.description && (
                      <p className="text-xs text-[#5A6472] mb-4 line-clamp-2">
                        {activePodcast.description}
                      </p>
                    )}

                    {/* CUSTOM PLAYER (The Archive Look) */}
                    <div className="mb-4">
                      <audio 
                        controls 
                        className="w-full h-8"
                        src={`/audio/${chapterData.chapter_id}.mp3`}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>

                    {/* SPOTIFY BUTTON (The Alternative) */}
                    {spotifyUrl && (
                      <div className="mt-auto border-t border-[#D4CFC4]/50 pt-3">
                        <a 
                          href={spotifyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#15883e] hover:text-[#117a37] text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.299z"/>
                          </svg>
                          Listen on Spotify
                        </a>
                      </div>
                    )}

                    {/* Paper Clip Visual */}
                    <div className="absolute -top-3 right-8 w-4 h-8 border-2 border-[#D4CFC4] border-b-0 rounded-t-full z-0 opacity-50 hidden md:block" />
                  </div>
                </div>
              )}
            </div>

            {/* 3. TIMELINE / MAP */}
            {chapterData.locations && chapterData.locations.length > 0 ? (
              <section className="mb-6 border-t border-dashed border-[#D4CFC4] pt-8">
                <SicilyMap 
                  locations={chapterData.locations}
                  title="Chapter Locations"
                  description="Locations mentioned in this chapter"
                />
              </section>
            ) : chapterData.timeline && chapterData.timeline.length > 0 ? (
              <section className="mb-6 border-t border-dashed border-[#D4CFC4] pt-8">
                <Timeline 
                  events={chapterData.timeline}
                  title="Chapter Timeline"
                  description="Key events in chronological order"
                />
              </section>
            ) : null}

            {/* 4. PERSPECTIVES */}
            {perspectivesArray.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
                  Character Perspectives
                  <span className="text-[#9CA3AF] font-normal ml-2">(How each character saw that)</span>
                </h2>
                <div className="space-y-4">
                  {perspectivesArray.map((perspective, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#F5F0E8] rounded-lg p-5 flex gap-4"
                    >
                      {perspective.image && (
                        <img 
                          src={perspective.image}
                          alt={perspective.character}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#D4CFC4] flex-shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-[#1A2A40] mb-2">
                          {perspective.character}
                        </h3>
                        <p className="text-[#4B5563] leading-relaxed">
                          {perspective.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. FUN FACT */}
            {chapterData.fun_fact && (
              // Changed to solid light parchment color with a border, dark text
              <section className="bg-[#EBE5DA] border-2 border-[#A67C52]/50 rounded-lg p-6 mb-8 shadow-md relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-[#A67C52]" />
                  {/* Darker brown text for title */}
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8B4513]">
                    Fun Fact
                  </h2>
                </div>
                {/* Dark navy text for body */}
                <p className="text-lg font-serif leading-relaxed text-[#1A2A40]">
                  {chapterData.fun_fact}
                </p>
                {/* Optional: Corner tape visual */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#D4CFC4]/80 rotate-45 shadow-sm"></div>
              </section>
            )}

            {/* 6. VIDEO */}
            {podcastData?.video_exists && (
              <section className="mb-8 bg-[#F5F0E8] rounded-lg overflow-hidden border border-[#D4CFC4]">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Play className="w-5 h-5 text-[#6B2D3C]" />
                    <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Visual Reconstruction
                    </h2>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden bg-[#1A2A40] mb-4 shadow-lg">
                    <video 
                      controls
                      className="w-full aspect-video"
                      src={`/video/${chapterData.chapter_id}.mp4`}
                      poster={chapterData.video?.thumbnail}
                    >
                      Your browser does not support the video element.
                    </video>
                  </div>
                  
                  <h3 className="font-serif text-lg font-semibold text-[#1A2A40] mb-1">
                    {chapterData.video?.title || "Archival Footage"}
                  </h3>
                </div>
              </section>
            )}

            {/* 7. SOURCES */}
            {chapterData.sources && chapterData.sources.length > 0 && (
              <section className="bg-[#F5F0E8] rounded-lg p-4 mb-12">
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-[#6B7280] mt-0.5" />
                  <div>
                    <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                      Sources
                    </h2>
                    <ul className="space-y-1">
                      {chapterData.sources.map((source, idx) => (
                        <li key={idx} className="text-sm text-[#4B5563]">
                          • {getRealSourceName(source)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default function Chapter() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#E8E4DC] flex items-center justify-center">
        <div className="text-[#1A2A40]">Loading...</div>
      </div>
    }>
      <ChapterContent />
    </Suspense>
  );
}