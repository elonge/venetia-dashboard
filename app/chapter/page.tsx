'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Play, Headphones, ExternalLink, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Dynamically import SicilyMap with SSR disabled to prevent window is not defined error
const SicilyMap = dynamic(() => import('@/components/chapter/SicilyMap'), {
  ssr: false,
});

// Mock data for a chapter
const chapterData = {
  title: 'The Sicily Trip',
  year: '1912',
  when: 'January - February 1912',
  story: 'In early 1912, Prime Minister Asquith embarked on a Mediterranean cruise to Sicily with his daughter Violet and her friend Venetia Stanley. What began as a family holiday became a turning point in the PM\'s relationship with Venetia. The journey offered Asquith an escape from the intense political pressures of London, but it also marked the beginning of his deep emotional attachment to Venetia. During long days at sea and explorations of ancient ruins, conversations between the Prime Minister and the young woman grew increasingly intimate.',
  perspectives: [
    {
      character: 'The PM (Asquith)',
      description: 'Viewed the trip as a desperate escape from the "squalor" of politics. He wrote of being "bewitched" by the peace and the company, specifically finding intellectual and emotional solace in Venetia\'s presence.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
    },
    {
      character: 'Venetia',
      description: 'Saw this as a glamorous adventure. She was beginning to realize the power she held over the most powerful man in the Empire, transitioning from "Violet\'s friend" to the PM\'s confidante.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'
    },
    {
      character: 'Violet (The Observer)',
      description: 'She initially enjoyed the shared holiday but likely began to sense the shifting dynamic—watching her father turn increasingly to her friend for comfort rather than to her.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80'
    }
  ],
  podcast: {
    title: 'Episode 3: The Sicilian Connection',
    duration: '28:45',
    description: 'Explore how a Mediterranean holiday changed the course of British political history.'
  },
  video: {
    title: 'The Sicily Journey: A Visual Reconstruction',
    duration: '12:30',
    thumbnail: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?w=600&q=80'
  },
  sources: [
    'Asquith\'s Letters to Venetia Stanley (1912-1915)',
    'Violet Asquith\'s Diaries',
    'Contemporary newspaper accounts'
  ]
};

export default function Chapter() {
  const [chatQuery, setChatQuery] = useState('');

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
          <h1 className="text-[#1A2A40] font-serif text-lg font-medium">The Venetia Project</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-8">
        {/* Chapter Header */}
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-4xl font-serif font-bold text-[#1A2A40]">
              {chapterData.title}
            </h1>
            <span className="text-2xl text-[#6B7280] font-serif">
              {chapterData.year}
            </span>
          </div>
          <p className="text-[#6B7280] text-sm font-medium">
            {chapterData.when}
          </p>
        </div>

        {/* The Story */}
        <section className="bg-[#F5F0E8] rounded-lg p-6 mb-6 border-l-4 border-[#6B2D3C]">
          <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
            The Story
          </h2>
          <p className="text-[#1A2A40] leading-relaxed">
            {chapterData.story}
          </p>
        </section>

        {/* Sicily Map */}
        <section className="mb-6">
          <SicilyMap />
        </section>

        {/* Chat with the Archive */}
        <section className="bg-[#F5F0E8] rounded-lg p-5 mb-6">
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
        </section>

        {/* Character Perspectives */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
            Character Perspectives
            <span className="text-[#9CA3AF] font-normal ml-2">(How each character saw that)</span>
          </h2>
          <div className="space-y-4">
            {chapterData.perspectives.map((perspective, idx) => (
              <div 
                key={idx}
                className="bg-[#F5F0E8] rounded-lg p-5 flex gap-4"
              >
                <img 
                  src={perspective.image}
                  alt={perspective.character}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D4CFC4] flex-shrink-0"
                />
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

        {/* Fun Fact */}
        <section className="bg-gradient-to-br from-[#6B2D3C] to-[#8B3A3A] rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xs font-semibold uppercase tracking-wider">
              Fun Fact
            </h2>
          </div>
          <p className="text-lg font-serif leading-relaxed">
            During the Sicily trip, Asquith and Venetia explored the ancient Greek theater at Taormina. 
            The PM wrote that standing there with Venetia made him feel "transported to another age" - 
            ironically, while the Great War was just two years away.
          </p>
        </section>

        {/* Media Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Podcast */}
          <div className="bg-[#F5F0E8] rounded-lg overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Headphones className="w-5 h-5 text-[#6B2D3C]" />
                <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Podcast
                </h2>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1A2A40] mb-1">
                {chapterData.podcast.title}
              </h3>
              <p className="text-sm text-[#6B7280] mb-3">
                {chapterData.podcast.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9CA3AF]">
                  Duration: {chapterData.podcast.duration}
                </span>
                <Button 
                  size="sm"
                  className="bg-[#1A2A40] hover:bg-[#2A3A50] text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="bg-[#F5F0E8] rounded-lg overflow-hidden">
            <div className="relative h-32 bg-[#1A2A40] group cursor-pointer">
              <img 
                src={chapterData.video.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-[#1A2A40] ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {chapterData.video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-[#1A2A40] text-sm">
                {chapterData.video.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Sources */}
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
      </main>
    </div>
  );
}