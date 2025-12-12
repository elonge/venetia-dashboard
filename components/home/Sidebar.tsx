'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import ChapterCarousel from './ChapterCarousel';

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

interface Question {
  _id: string;
  Question: string;
  Answer: Array<{ text: string; link: string }>;
}

interface FunFact {
  _id: string;
  fact: string;
  tags?: string[];
  source?: string;
}

interface SentimentData {
  tension: Array<{ x: number; y: number }>;
  warmth: Array<{ x: number; y: number }>;
  anxiety: Array<{ x: number; y: number }>;
  dateRange: { start: string; end: string };
}

interface TopicData {
  topic: string;
  value: number;
  color: string;
}

interface DailyLetterCountData {
  data: Array<{ x: number; y: number }>;
  peak: { date: string; count: number };
  dateRange: { start: string; end: string };
}

interface PeopleData {
  name: string;
  count: number;
}

interface DataRoomData {
  sentiment: SentimentData;
  topics: TopicData[];
  dailyLetterCount: DailyLetterCountData;
  people: PeopleData[];
}

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('weekly-letter-count');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);
  const [currentFunFactIndex, setCurrentFunFactIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const [funFactsLoading, setFunFactsLoading] = useState(true);
  const [dataRoomLoading, setDataRoomLoading] = useState(true);
  const [dataRoomData, setDataRoomData] = useState<DataRoomData | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  
  const MAX_QUESTIONS_DEFAULT = 5;
  const displayedQuestions = showAllQuestions ? questions : questions.slice(0, MAX_QUESTIONS_DEFAULT);
  const hasMoreQuestions = questions.length > MAX_QUESTIONS_DEFAULT;

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/questions');
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const response = await fetch('/api/chapters');
        if (response.ok) {
          const data = await response.json();
          setChapters(data);
        } else {
          console.error('Error fetching chapters: HTTP', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setChaptersLoading(false);
      }
    }
    fetchChapters();
  }, []);

  useEffect(() => {
    async function fetchFunFacts() {
      try {
        const response = await fetch('/api/fun_facts');
        if (response.ok) {
          const data = await response.json();
          setFunFacts(data);
        } else {
          console.error('Error fetching fun facts: HTTP', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error fetching fun facts:', error);
      } finally {
        setFunFactsLoading(false);
      }
    }
    fetchFunFacts();
  }, []);

  useEffect(() => {
    async function fetchDataRoom() {
      try {
        const response = await fetch('/api/data-room');
        if (response.ok) {
          const data = await response.json();
          console.log('[BROWSER DEBUG] Data room data received:', {
            sentiment: {
              tensionCount: data.sentiment?.tension?.length || 0,
              warmthCount: data.sentiment?.warmth?.length || 0,
              anxietyCount: data.sentiment?.anxiety?.length || 0,
              dateRange: data.sentiment?.dateRange
            }
          });
          
          // Log sample points from each sentiment
          if (data.sentiment?.tension?.length > 0) {
            console.log('[BROWSER DEBUG] Sample tension points (first 5):', data.sentiment.tension.slice(0, 5));
            const nonZeroTension = data.sentiment.tension.filter((p: { x: number; y: number }) => p.y < 70).slice(0, 5);
            if (nonZeroTension.length > 0) {
              console.log('[BROWSER DEBUG] Sample tension points with non-zero scores:', nonZeroTension);
            }
          }
          if (data.sentiment?.warmth?.length > 0) {
            console.log('[BROWSER DEBUG] Sample warmth points (first 5):', data.sentiment.warmth.slice(0, 5));
            const nonZeroWarmth = data.sentiment.warmth.filter((p: { x: number; y: number }) => p.y < 70).slice(0, 5);
            if (nonZeroWarmth.length > 0) {
              console.log('[BROWSER DEBUG] Sample warmth points with non-zero scores:', nonZeroWarmth);
            }
          }
          if (data.sentiment?.anxiety?.length > 0) {
            console.log('[BROWSER DEBUG] Sample anxiety points (first 5):', data.sentiment.anxiety.slice(0, 5));
            const nonZeroAnxiety = data.sentiment.anxiety.filter((p: { x: number; y: number }) => p.y < 70).slice(0, 5);
            if (nonZeroAnxiety.length > 0) {
              console.log('[BROWSER DEBUG] Sample anxiety points with non-zero scores:', nonZeroAnxiety);
            }
          }
          
          setDataRoomData(data);
        } else {
          console.error('Error fetching data room: HTTP', response.status, await response.text());
        }
      } catch (error) {
        console.error('Error fetching data room:', error);
      } finally {
        setDataRoomLoading(false);
      }
    }
    fetchDataRoom();
  }, []);

  const handlePreviousFunFact = () => {
    if (funFacts.length === 0) return;
    setCurrentFunFactIndex((prev) => (prev === 0 ? funFacts.length - 1 : prev - 1));
  };

  const handleNextFunFact = () => {
    if (funFacts.length === 0) return;
    setCurrentFunFactIndex((prev) => (prev === funFacts.length - 1 ? 0 : prev + 1));
  };

  // Helper function to convert data points to SVG path
  const pointsToPath = (points: Array<{ x: number; y: number }>, smooth: boolean = false, label: string = ''): string => {
    if (points.length === 0) {
      console.log(`[BROWSER DEBUG] ${label} - No points provided`);
      return '';
    }
    if (points.length === 1) {
      console.log(`[BROWSER DEBUG] ${label} - Single point:`, points[0]);
      return `M${points[0].x},${points[0].y}`;
    }
    
    // Sort points by x coordinate to ensure proper path generation
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    
    console.log(`[BROWSER DEBUG] ${label} - Generating path from ${sortedPoints.length} points`);
    console.log(`[BROWSER DEBUG] ${label} - First point:`, { x: sortedPoints[0]?.x.toFixed(2), y: sortedPoints[0]?.y.toFixed(2) });
    console.log(`[BROWSER DEBUG] ${label} - Last point:`, { x: sortedPoints[sortedPoints.length - 1]?.x.toFixed(2), y: sortedPoints[sortedPoints.length - 1]?.y.toFixed(2) });
    console.log(`[BROWSER DEBUG] ${label} - First 5 sorted points:`, sortedPoints.slice(0, 5).map(p => ({ x: p.x.toFixed(2), y: p.y.toFixed(2) })));
    console.log(`[BROWSER DEBUG] ${label} - Last 5 sorted points:`, sortedPoints.slice(-5).map(p => ({ x: p.x.toFixed(2), y: p.y.toFixed(2) })));
    
    // Find points at different x positions to see distribution
    const quarterPoints = [
      sortedPoints[Math.floor(sortedPoints.length * 0.25)],
      sortedPoints[Math.floor(sortedPoints.length * 0.5)],
      sortedPoints[Math.floor(sortedPoints.length * 0.75)],
    ];
    console.log(`[BROWSER DEBUG] ${label} - Points at 25%, 50%, 75% of timeline:`, quarterPoints.map(p => ({ x: p.x.toFixed(2), y: p.y.toFixed(2) })));
    
    // Check for y-value range
    const yValues = sortedPoints.map(p => p.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const xValues = sortedPoints.map(p => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    console.log(`[BROWSER DEBUG] ${label} - X value range: min=${minX.toFixed(2)}, max=${maxX.toFixed(2)}`);
    console.log(`[BROWSER DEBUG] ${label} - Y value range: min=${minY.toFixed(2)}, max=${maxY.toFixed(2)}`);
    
    // Count points at different y levels
    const pointsAtBottom = sortedPoints.filter(p => p.y >= 69.5).length;
    const pointsAtTop = sortedPoints.filter(p => p.y <= 10.5).length;
    const pointsInMiddle = sortedPoints.length - pointsAtBottom - pointsAtTop;
    console.log(`[BROWSER DEBUG] ${label} - Points distribution: bottom (y>=69.5)=${pointsAtBottom}, middle=${pointsInMiddle}, top (y<=10.5)=${pointsAtTop}`);
    
    // Find some example points with different y values
    const samplePoints = [
      sortedPoints.find(p => p.y < 69.5),
      sortedPoints.find(p => p.y < 60 && p.y > 50),
      sortedPoints.find(p => p.y < 40 && p.y > 30),
      sortedPoints.find(p => p.y < 20 && p.y > 10),
    ].filter((p): p is { x: number; y: number } => p !== undefined).slice(0, 3);
    if (samplePoints.length > 0) {
      console.log(`[BROWSER DEBUG] ${label} - Sample points with varying y values:`, samplePoints.map(p => ({ x: p.x.toFixed(2), y: p.y.toFixed(2) })));
    }
    
    if (smooth && sortedPoints.length >= 3) {
      // Use simple polyline for accurate representation
      // Smooth curves can overshoot and create visual artifacts
      // A clean polyline will accurately show the data
      return sortedPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
    } else {
      // Simple line path
      const path = sortedPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
      console.log(`[BROWSER DEBUG] ${label} - Generated line path (first 200 chars):`, path.substring(0, 200));
      return path;
    }
  };

  const tabs = [
    { id: 'sentiment', label: 'Sentiment Over Time' },
    { id: 'topics', label: 'Topic Frequency' },
    { id: 'weekly-letter-count', label: 'Weekly Letter Count' },
    { id: 'people', label: 'People Mentioned' }
  ];

  return (
    <aside className="w-full bg-[#1A2A40] text-white p-4 min-h-screen">
      {/* Chapters */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
          Chapters
        </h3>
        <ChapterCarousel chapters={chapters} loading={chaptersLoading} />
      </div>

      {/* Popular Questions */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
          Popular Questions
        </h3>
        <div className="space-y-2">
          {loading ? (
            <div className="text-sm text-[#9CA3AF] p-3">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-sm text-[#9CA3AF] p-3">No questions available</div>
          ) : (
            <>
              {displayedQuestions.map((q) => (
                <Link
                  key={q._id}
                  href={`/qa?id=${encodeURIComponent(q._id)}`}
                  className="bg-[#F5F0E8] text-[#1A2A40] rounded p-3 flex items-center justify-between cursor-pointer hover:bg-[#E8E4DC] transition-colors"
                >
                  <span className="text-sm">{q.Question}</span>
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                </Link>
              ))}
              {hasMoreQuestions && (
                <button
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className="w-full bg-[#F5F0E8] text-[#1A2A40] rounded p-2 flex items-center justify-center gap-2 hover:bg-[#E8E4DC] transition-colors text-sm font-medium"
                >
                  {showAllQuestions ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      View More ({questions.length - MAX_QUESTIONS_DEFAULT} more)
                    </>
                  )}
                </button>
              )}
            </>
          )}
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
              {dataRoomLoading ? (
                <div className="h-32 bg-[#1A2A40] rounded flex items-center justify-center">
                  <span className="text-xs text-[#9CA3AF]">Loading sentiment data...</span>
                </div>
              ) : !dataRoomData ? (
                <div className="h-32 bg-[#1A2A40] rounded flex items-center justify-center">
                  <span className="text-xs text-[#9CA3AF]">No sentiment data available</span>
                </div>
              ) : (
                <>
                  {console.log('[BROWSER DEBUG] Rendering sentiment visualization with', {
                    tensionPoints: dataRoomData.sentiment.tension.length,
                    warmthPoints: dataRoomData.sentiment.warmth.length,
                    anxietyPoints: dataRoomData.sentiment.anxiety.length
                  })}
                  <div className="h-32 bg-[#1A2A40] rounded relative overflow-hidden p-2">
                    <svg viewBox="0 0 200 80" className="w-full h-full">
                      {/* Draw in reverse order so emotional_desolation (orange) is drawn first and appears behind others */}
                      {/* Emotional Desolation line - drawn first so it appears behind */}
                      <path 
                        d={pointsToPath(dataRoomData.sentiment.anxiety, true, 'Emotional Desolation')} 
                        fill="none" 
                        stroke="#F59E0B" 
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Romantic Adoration line */}
                      <path 
                        d={pointsToPath(dataRoomData.sentiment.warmth, true, 'Romantic Adoration')} 
                        fill="none" 
                        stroke="#4A7C59" 
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Political Unburdening line - drawn last so it appears on top */}
                      <path 
                        d={pointsToPath(dataRoomData.sentiment.tension, true, 'Political Unburdening')} 
                        fill="none" 
                        stroke="#DC2626" 
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="absolute bottom-2 left-2 text-[9px] text-[#6B7280]">
                      {dataRoomData.sentiment.dateRange.start}
                    </div>
                    <div className="absolute bottom-2 right-2 text-[9px] text-[#6B7280]">
                      {dataRoomData.sentiment.dateRange.end}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-[9px]">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      <span className="text-[#9CA3AF]">Political Unburdening</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#4A7C59]" />
                      <span className="text-[#9CA3AF]">Romantic Adoration</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span className="text-[#9CA3AF]">Emotional Desolation</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'topics' && (
            <div>
              <h4 className="text-xs text-[#9CA3AF] mb-3">Dominant themes in correspondence</h4>
              {dataRoomLoading ? (
                <div className="text-xs text-[#9CA3AF] p-3">Loading topics data...</div>
              ) : !dataRoomData || !dataRoomData.topics || dataRoomData.topics.length === 0 ? (
                <div className="text-xs text-[#9CA3AF] p-3">No topics data available</div>
              ) : (
                <div className="space-y-2">
                  {dataRoomData.topics.map((item) => (
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
              )}
            </div>
          )}

          {activeTab === 'weekly-letter-count' && (
            <div>
              <h4 className="text-xs text-[#9CA3AF] mb-2">Number of letters per week over time</h4>
              {dataRoomLoading ? (
                <div className="h-28 bg-[#1A2A40] rounded flex items-center justify-center">
                  <span className="text-xs text-[#9CA3AF]">Loading letter count data...</span>
                </div>
              ) : !dataRoomData || !dataRoomData.dailyLetterCount ? (
                <div className="h-28 bg-[#1A2A40] rounded flex items-center justify-center">
                  <span className="text-xs text-[#9CA3AF]">No letter count data available</span>
                </div>
              ) : (
                <>
                  <div className="h-28 bg-[#1A2A40] rounded relative overflow-hidden">
                    <svg viewBox="0 0 200 80" className="w-full h-full">
                      <path 
                        d={pointsToPath(dataRoomData.dailyLetterCount.data, false)} 
                        fill="none" 
                        stroke="#4A7C59" 
                        strokeWidth="2"
                      />
                      {/* Highlight peak point - find the point with minimum y (highest on chart, most letters) */}
                      {dataRoomData.dailyLetterCount.data.length > 0 && (() => {
                        const peakPoint = dataRoomData.dailyLetterCount.data.reduce((min, p) => 
                          p.y < min.y ? p : min
                        );
                        return <circle cx={peakPoint.x} cy={peakPoint.y} r="3" fill="#DC2626" />;
                      })()}
                    </svg>
                    <div className="absolute bottom-2 left-2 text-[9px] text-[#6B7280]">
                      {dataRoomData.dailyLetterCount.dateRange.start}
                    </div>
                    <div className="absolute bottom-2 right-2 text-[9px] text-[#6B7280]">
                      {dataRoomData.dailyLetterCount.dateRange.end}
                    </div>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-2">
                    Peak correspondence: {dataRoomData.dailyLetterCount.peak.date} ({dataRoomData.dailyLetterCount.peak.count} letters/week)
                  </p>
                </>
              )}
            </div>
          )}

          {activeTab === 'people' && (
            <div>
              <h4 className="text-xs text-[#9CA3AF] mb-3">Most mentioned individuals</h4>
              {dataRoomLoading ? (
                <div className="text-xs text-[#9CA3AF] p-3">Loading people data...</div>
              ) : !dataRoomData || !dataRoomData.people || dataRoomData.people.length === 0 ? (
                <div className="text-xs text-[#9CA3AF] p-3">No people data available</div>
              ) : (
                <div className="space-y-2">
                  {dataRoomData.people.map((person, idx) => (
                    <div key={person.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#6B7280] w-4">{idx + 1}.</span>
                        <span className="text-white">{person.name}</span>
                      </div>
                      <span className="text-[#4A7C59] font-semibold">{person.count}</span>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Fun Facts */}
      <div className="bg-[#F5F0E8] text-[#1A2A40] rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider">Fun Facts</h4>
          {funFacts.length > 0 && (
            <span className="text-xs text-[#6B7280]">
              {currentFunFactIndex + 1} / {funFacts.length}
            </span>
          )}
        </div>
        {funFactsLoading ? (
          <div className="text-xs text-[#9CA3AF] text-center py-2 h-24 flex items-center justify-center">Loading fun facts...</div>
        ) : funFacts.length === 0 ? (
          <div className="text-xs text-[#9CA3AF] text-center py-2 h-24 flex items-center justify-center">No fun facts available</div>
        ) : (
          <div className="h-24 flex flex-col">
            <div className="flex items-start gap-2 flex-1 min-h-0">
              <button
                onClick={handlePreviousFunFact}
                className="w-4 h-4 text-[#9CA3AF] hover:text-[#1A2A40] transition-colors flex-shrink-0 mt-1"
                aria-label="Previous fun fact"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex-1 overflow-y-auto min-h-0">
                  <p className="text-xs text-center px-2">
                    {funFacts[currentFunFactIndex]?.fact || 'No fun fact available'}
                  </p>
                </div>
                {funFacts[currentFunFactIndex]?.tags && funFacts[currentFunFactIndex].tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mt-1.5 flex-shrink-0">
                    {funFacts[currentFunFactIndex].tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 bg-[#1A2A40]/10 text-[#6B7280] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleNextFunFact}
                className="w-4 h-4 text-[#9CA3AF] hover:text-[#1A2A40] transition-colors flex-shrink-0 mt-1"
                aria-label="Next fun fact"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}