'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PODCASTS } from '@/constants';

interface Chapter {
  _id: string;
  chapter_id: string;
  chapter_title: string;
  main_story: string;
  perspectives: { [key: string]: string };
  fun_fact: string;
  locations: Array<{ name: string; lat: number; long: number }>;
  sources: string[];
}

interface ChapterCarouselProps {
  chapters: Chapter[];
  loading: boolean;
}

export default function ChapterCarousel({ chapters, loading }: ChapterCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Sort chapters chronologically based on PODCASTS order
  const sortedChapters = React.useMemo(() => {
    if (!chapters.length) return [];
    
    const chapterOrder = PODCASTS.map(p => p.chapter_id);
    const chapterMap = new Map(chapters.map(c => [c.chapter_id, c]));
    
    // First, add chapters in PODCASTS order
    const ordered: Chapter[] = [];
    chapterOrder.forEach(id => {
      const chapter = chapterMap.get(id);
      if (chapter) {
        ordered.push(chapter);
        chapterMap.delete(id);
      }
    });
    
    // Then add any remaining chapters not in PODCASTS
    chapterMap.forEach(chapter => ordered.push(chapter));
    
    return ordered;
  }, [chapters]);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkScrollButtons();
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkScrollButtons);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [sortedChapters]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = '';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = '';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="text-sm text-[#E5E8F0] p-3">Loading chapters...</div>
    );
  }

  if (sortedChapters.length === 0) {
    return (
      <div className="text-sm text-[#E5E8F0] p-3">No chapters available</div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A2A40] hover:bg-[#252F3F] text-white rounded-full p-1.5 shadow-lg transition-all opacity-90 hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A2A40] hover:bg-[#252F3F] text-white rounded-full p-1.5 shadow-lg transition-all opacity-90 hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 px-1 hide-scrollbar"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {sortedChapters.map((chapter) => (
          <Link
            key={chapter._id}
            href={`/chapter?chapter_id=${encodeURIComponent(chapter.chapter_id)}`}
            className="flex-shrink-0 w-64 bg-[#F5F0E8] text-[#1A2A40] rounded-lg p-4 cursor-pointer hover:bg-[#E8E4DC] transition-all hover:shadow-md group"
            onClick={(e) => {
              // Prevent navigation if user was dragging
              if (isDragging) {
                e.preventDefault();
              }
            }}
          >
            <h4 className="font-serif text-sm font-medium leading-tight mb-2 group-hover:text-[#4A7C59] transition-colors">
              {chapter.chapter_title}
            </h4>
            {chapter.main_story && (
              <p className="text-xs text-[#2D3648] line-clamp-3 leading-relaxed">
                {chapter.main_story.substring(0, 150)}
                {chapter.main_story.length > 150 ? '...' : ''}
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-[#D4CFC4]">
              <span className="text-[10px] text-[#3E4A60] uppercase tracking-wider">
                Read Chapter →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
