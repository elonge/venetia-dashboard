'use client';

import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Play, Headphones, ExternalLink, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PEOPLE_IMAGES, PODCASTS } from '@/constants';
import ChatInterface from '@/components/chat/ChatInterface';

// Dynamically import SicilyMap with SSR disabled to prevent window is not defined error
const SicilyMap = dynamic(() => import('@/components/chapter/SicilyMap'), {
  ssr: false,
});

// Import Timeline component
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
  };
  video?: {
    title: string;
    duration: string;
    thumbnail: string;
  };
}

const CHAT_MIN_WIDTH = 300;
const CHAT_MAX_WIDTH = 600;
const CHAT_DEFAULT_WIDTH = 400;

function ChapterContent() {
  const searchParams = useSearchParams();
  const chapterId = searchParams.get('chapter_id');
  const [chatQuery, setChatQuery] = useState('');
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Load chat width from localStorage on mount
  useEffect(() => {
    const savedChatWidth = localStorage.getItem('chatWidth');
    if (savedChatWidth) {
      const width = parseInt(savedChatWidth, 10);
      if (width >= CHAT_MIN_WIDTH && width <= CHAT_MAX_WIDTH) {
        setChatWidth(width);
      }
    }
  }, []);

  // Save chat width to localStorage when it changes
  useEffect(() => {
    if (chatWidth !== CHAT_DEFAULT_WIDTH) {
      localStorage.setItem('chatWidth', chatWidth.toString());
    }
  }, [chatWidth]);

  const handleChatResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingChat(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingChat) {
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.max(
        CHAT_MIN_WIDTH,
        Math.min(CHAT_MAX_WIDTH, newWidth)
      );
      setChatWidth(clampedWidth);
    }
  }, [isResizingChat]);

  const handleMouseUp = useCallback(() => {
    setIsResizingChat(false);
  }, []);

  useEffect(() => {
    if (isResizingChat) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingChat, handleMouseMove, handleMouseUp]);

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
      <div className="min-h-screen bg-[#E8E4DC] flex items-center justify-center">
        <div className="text-[#1A2A40]">Loading chapter...</div>
      </div>
    );
  }

  if (error || !chapterData) {
    return (
      <div className="min-h-screen bg-[#E8E4DC]">
        <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-[#1A2A40]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Timeline
              </Button>
            </Link>
            <div className="h-6 w-px bg-[#D4CFC4]" />
            <h1 className="text-[#1A2A40] font-serif text-2xl font-medium">The Venetia Project</h1>
          </div>
        </header>
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

  // Convert perspectives object to array for rendering
  const perspectivesArray = Object.entries(chapterData.perspectives).map(([character, description]) => ({
    character,
    description,
    image: PEOPLE_IMAGES[character as keyof typeof PEOPLE_IMAGES] || null
  }));

  // Check if there's a podcast for this chapter
  const podcastData = PODCASTS.find(p => p.chapter_id === chapterData.chapter_id);
  
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#E8E4DC]">
      {/* Header */}
      <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-[#1A2A40]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Timeline
            </Button>
          </Link>
          <div className="h-6 w-px bg-[#D4CFC4]" />
          <h1 className="text-[#1A2A40] font-serif text-2xl font-medium">The Venetia Project</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

      <div className="flex relative h-[calc(100vh-73px)]">
        {/* Left Column: Chapter Content */}
        <main 
          className="p-8 transition-all overflow-y-auto flex-shrink"
          style={{ 
            width: `calc(100% - ${chatWidth}px)`,
            minWidth: '300px'
          }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Chapter Header */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <h1 className="text-4xl font-serif font-bold text-[#1A2A40]">
                  {chapterData.chapter_title}
                </h1>
              </div>
            </div>

            {/* The Story */}
            <section className="bg-[#F5F0E8] rounded-lg p-6 mb-6 border-l-4 border-[#6B2D3C]">
              <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                The Story
              </h2>
              <p className="text-[#1A2A40] leading-relaxed">
                {chapterData.main_story}
              </p>
            </section>

            {/* Map or Timeline */}
            {chapterData.locations && chapterData.locations.length > 0 ? (
              <section className="mb-6">
                <SicilyMap 
                  locations={chapterData.locations}
                  title="Chapter Locations"
                  description="Locations mentioned in this chapter"
                />
              </section>
            ) : chapterData.timeline && chapterData.timeline.length > 0 ? (
              <section className="mb-6">
                <Timeline 
                  events={chapterData.timeline}
                  title="Chapter Timeline"
                  description="Key events in chronological order"
                />
              </section>
            ) : null}

            {/* Chat with the Archive */}
            {/* <section className="bg-[#F5F0E8] rounded-lg p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-4 h-4 text-[#6B2D3C]" />
                <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Ask About This Chapter
                </h2>
              </div>
              <div className="relative">
                <Input 
                  placeholder='e.g., "What did Asquith write about Sicily?"'
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  className="pr-10 bg-white border-[#D4CFC4] text-sm placeholder:text-[#9CA3AF]"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1A2A40] rounded flex items-center justify-center hover:bg-[#2A3A50] transition-colors">
                  <Send className="w-3 h-3 text-white" />
                </button>
              </div>
            </section> */}

            {/* Character Perspectives */}
            {perspectivesArray.length > 0 && (
              <section className="mb-6">
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
                          onError={(e) => {
                            // Hide image if it fails to load
                            e.currentTarget.style.display = 'none';
                          }}
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

            {/* Fun Fact */}
            {chapterData.fun_fact && (
              <section className="bg-gradient-to-br from-[#6B2D3C] to-[#8B3A3A] rounded-lg p-6 mb-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider">
                    Fun Fact
                  </h2>
                </div>
                <p className="text-lg font-serif leading-relaxed">
                  {chapterData.fun_fact}
                </p>
              </section>
            )}

            {/* Media Section */}
            {(podcastData || chapterData.podcast || chapterData.video) && (
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Podcast */}
                {(podcastData || chapterData.podcast) && (
                  <div className="bg-[#F5F0E8] rounded-lg overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Headphones className="w-5 h-5 text-[#6B2D3C]" />
                        <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Podcast
                        </h2>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-[#1A2A40] mb-1">
                        {podcastData?.title || chapterData.podcast?.title}
                      </h3>
                      <p className="text-sm text-[#6B7280] mb-3">
                        {podcastData?.description || chapterData.podcast?.description}
                      </p>
                      {/* Show audio player if podcast exists (either from PODCASTS or chapterData.podcast) */}
                      {(podcastData || chapterData.podcast) && (
                        <div className="mb-3">
                          <audio 
                            controls 
                            className="w-full"
                            src={`/audio/${chapterData.chapter_id}.mp3`}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#9CA3AF]">
                          Duration: {podcastData 
                            ? formatDuration(podcastData.duration) 
                            : chapterData.podcast?.duration || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video */}
                {podcastData?.video_exists && (
                  <div className="bg-[#F5F0E8] rounded-lg overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Play className="w-5 h-5 text-[#6B2D3C]" />
                        <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Video
                        </h2>
                      </div>
                      <div className="rounded-lg overflow-hidden bg-[#1A2A40] mb-3">
                        <video 
                          controls
                          className="w-full"
                          src={`/video/${chapterData.chapter_id}.mp4`}
                        >
                          Your browser does not support the video element.
                        </video>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-[#1A2A40] mb-1">
                        {`${podcastData?.title || chapterData.video?.title}: A Visual Reconstruction`}
                      </h3>
                      {podcastData?.description && (
                        <p className="text-sm text-[#6B7280]">
                          {podcastData.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sources */}
            {chapterData.sources && chapterData.sources.length > 0 && (
              <section className="bg-[#F5F0E8] rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-[#6B7280] mt-0.5" />
                  <div>
                    <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                      Sources
                    </h2>
                    <ul className="space-y-1">
                      {chapterData.sources.map((source, idx) => (
                        <li key={idx} className="text-sm text-[#4B5563]">
                          • {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Resize Handle */}
        <div
          className={`absolute top-0 bottom-0 w-1 bg-[#D4CFC4] hover:bg-[#4A7C59] cursor-col-resize transition-colors z-10 ${
            isResizingChat ? 'bg-[#4A7C59]' : ''
          }`}
          style={{ 
            left: `calc(100% - ${chatWidth}px - 0.5px)`
          }}
          onMouseDown={handleChatResizeStart}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        {/* Right Column: Chat */}
        <div
          ref={chatRef}
          className="flex-shrink-0 bg-[#E8E4DC] h-full"
          style={{ width: `${chatWidth}px`, minWidth: `${CHAT_MIN_WIDTH}px` }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[#6B7280]">Loading chat...</p>
              </div>
            </div>
          }>
            <ChatInterface />
          </Suspense>
        </div>
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
