'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

const chapters = [
  { title: 'The Sicily Trip', year: '(1912)', description: '' },
  { title: 'The Engagement Crisis', year: '(1915)', description: 'A war rises in basic, tension grows' },
  { title: 'The Engagement Crisis', year: '(1915)', description: 'A crisis on the national history' },
  { title: 'The Engagement Crisis', year: '(1913)', description: 'A Prime Minister\'s uncertainty' },
  { title: 'The Cholargo', year: '(1912)', description: '' },
  { title: 'The Sicily Trip', year: '(1912)', description: 'The country\'s tea chief, necessity curse the...' },
];

const questions = [
  'How many letters a day?',
  'Was nant turns and letters?',
  'Was Venetia a spy?',
  'Was Venetia a spy?',
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('daily-letter-count');

  const tabs = [
    { id: 'sentiment', label: 'Sentiment Over Time' },
    { id: 'topics', label: 'Topic Frequency' },
    { id: 'daily-letter-count', label: 'Daily Letter Count' },
    { id: 'people', label: 'People Mentioned' }
  ];

  return (
    <aside className="w-96 bg-[#1A2A40] text-white p-4 min-h-screen">
      {/* Chapters */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
          Chapters
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {chapters.map((chapter, idx) => (
            <Link 
              key={idx}
              href="/chapter"
              className="bg-[#F5F0E8] text-[#1A2A40] rounded p-2 cursor-pointer hover:bg-[#E8E4DC] transition-colors block"
            >
              <h4 className="font-serif text-sm font-medium leading-tight">
                {chapter.title}
              </h4>
              <span className="text-xs text-[#6B7280]">{chapter.year}</span>
              {chapter.description && (
                <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2">
                  {chapter.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Predefined Q&A */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
          Predefined Q&A
        </h3>
        <div className="space-y-2">
          {questions.map((q, idx) => (
            <Link
              key={idx}
              href="/qa"
              className="bg-[#F5F0E8] text-[#1A2A40] rounded p-3 flex items-center justify-between cursor-pointer hover:bg-[#E8E4DC] transition-colors"
            >
              <span className="text-sm">{q}</span>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </Link>
          ))}
        </div>
      </div>

      {/* The Data Room */}
      <div className="bg-[#0F1A28] rounded-lg p-4 mb-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-1">
            The Data Room
          </h3>
          <p className="text-[10px] text-[#9CA3AF]">
            A living analytical view of the Asquith–Venetia archive.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[10px] px-2 py-1 rounded transition-all ${
                activeTab === tab.id
                  ? 'bg-[#4A7C59] text-white'
                  : 'bg-[#1A2A40] text-[#9CA3AF] hover:bg-[#252F3F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          key={activeTab}
          className="min-h-[180px]"
        >
          {activeTab === 'sentiment' && (
            <div>
              <h4 className="text-xs text-[#9CA3AF] mb-2">Emotional tone across timeline</h4>
              <div className="h-32 bg-[#1A2A40] rounded relative overflow-hidden p-2">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  {/* Tension line */}
                  <path 
                    d="M0,80 Q30,75 50,60 T100,40 T150,35 T200,50" 
                    fill="none" 
                    stroke="#DC2626" 
                    strokeWidth="1.5"
                  />
                  {/* Warmth line */}
                  <path 
                    d="M0,60 Q30,50 50,45 T100,50 T150,70 T200,65" 
                    fill="none" 
                    stroke="#4A7C59" 
                    strokeWidth="1.5"
                  />
                  {/* Anxiety line */}
                  <path 
                    d="M0,70 Q30,65 50,50 T100,30 T150,25 T200,35" 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="absolute bottom-2 left-2 text-[9px] text-[#6B7280]">1910</div>
                <div className="absolute bottom-2 right-2 text-[9px] text-[#6B7280]">1915</div>
              </div>
              <div className="flex gap-3 mt-2 text-[9px]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
                  <span className="text-[#9CA3AF]">Tension</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#4A7C59]" />
                  <span className="text-[#9CA3AF]">Warmth</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span className="text-[#9CA3AF]">Anxiety</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div>
              <h4 className="text-xs text-[#9CA3AF] mb-3">Dominant themes in correspondence</h4>
              <div className="space-y-2">
                {[
                  { topic: 'Politics', value: 85, color: '#DC2626' },
                  { topic: 'War', value: 72, color: '#F59E0B' },
                  { topic: 'Personal', value: 68, color: '#4A7C59' },
                  { topic: 'Cabinet', value: 54, color: '#6366F1' },
                  { topic: 'Gossip', value: 42, color: '#EC4899' }
                ].map((item) => (
                  <div key={item.topic}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-white">{item.topic}</span>
                      <span className="text-[#9CA3AF]">{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1A2A40] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'daily-letter-count' && (
            <div>
              <h4 className="text-xs text-[#9CA3AF] mb-2">Number of daily letters over time</h4>
              <div className="h-28 bg-[#1A2A40] rounded relative overflow-hidden">
                <svg viewBox="0 0 200 80" className="w-full h-full">
                  <path 
                    d="M0,60 L10,58 L20,55 L30,52 L40,48 L50,45 L60,42 L70,38 L80,35 L90,30 L100,25 L110,22 L120,20 L130,18 L140,20 L150,25 L160,30 L170,35 L180,38 L190,40 L200,42" 
                    fill="none" 
                    stroke="#4A7C59" 
                    strokeWidth="2"
                  />
                  <circle cx="120" cy="20" r="3" fill="#DC2626" />
                </svg>
                <div className="absolute bottom-2 left-2 text-[9px] text-[#6B7280]">1910</div>
                <div className="absolute bottom-2 right-2 text-[9px] text-[#6B7280]">1915</div>
              </div>
              <p className="text-[10px] text-[#9CA3AF] mt-2">
                Peak correspondence: May 1915 (3 letters/day)
              </p>
            </div>
          )}

          {activeTab === 'people' && (
            <div>
              <h4 className="text-xs text-[#9CA3AF] mb-3">Most mentioned individuals</h4>
              <div className="space-y-2">
                {[
                  { name: 'Lloyd George', count: 287 },
                  { name: 'Churchill', count: 214 },
                  { name: 'Violet Asquith', count: 189 },
                  { name: 'Margot Asquith', count: 156 },
                  { name: 'Edwin Montagu', count: 142 }
                ].map((person, idx) => (
                  <div key={person.name} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#6B7280] w-4">{idx + 1}.</span>
                      <span className="text-white">{person.name}</span>
                    </div>
                    <span className="text-[#4A7C59] font-semibold">{person.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Full Link */}
        <div className="mt-4 pt-3 border-t border-[#1A2A40]">
          <a 
            href="#" 
            className="text-[10px] text-[#4A7C59] hover:text-[#5A8C69] flex items-center gap-1 transition-colors"
          >
            <span>View Full Data Room</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Fun Facts & About */}
      <div className="flex gap-2">
        <div className="flex-1 bg-[#F5F0E8] text-[#1A2A40] rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider">Fun Facts</h4>
            <span className="text-xs text-[#6B7280]">Retador</span>
          </div>
          <div className="flex items-center justify-between">
            <ChevronLeft className="w-4 h-4 text-[#9CA3AF]" />
            <p className="text-xs text-center px-2">
              Did you know? Venetia bought a pet fox.
            </p>
            <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
          </div>
        </div>

        <div className="w-32 bg-[#F5F0E8] text-[#1A2A40] rounded p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-1">About This Project</h4>
          <p className="text-[10px] text-[#6B7280] line-clamp-2">
            Emma Abraham's observatory Venetia in Project
          </p>
          <p className="text-[8px] text-[#9CA3AF] mt-1">© Copyright — The Venetia Project</p>
        </div>
      </div>
    </aside>
  );
}