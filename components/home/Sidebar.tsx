'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ArrowRight, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
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

interface MeetingDatesData {
  dates: string[];
  total: number;
  dateRange: { start: string; end: string };
  timeline: Array<{ x: number; date: string }>;
}

interface DataRoomData {
  sentiment: SentimentData;
  topics: TopicData[];
  dailyLetterCount: DailyLetterCountData;
  people: PeopleData[];
  meetingDates: MeetingDatesData;
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
  
  // Zoom state for each widget
  const [sentimentZoom, setSentimentZoom] = useState({ minX: 0, maxX: 200 });
  const [letterCountZoom, setLetterCountZoom] = useState({ minX: 0, maxX: 200 });
  const [meetingDatesZoom, setMeetingDatesZoom] = useState({ minX: 0, maxX: 200 });
  
  // Brush selection state
  const [brushDragging, setBrushDragging] = useState<string | null>(null);
  const [brushStart, setBrushStart] = useState<number | null>(null);
  const brushRefs = {
    sentiment: useRef<SVGSVGElement>(null),
    letterCount: useRef<SVGSVGElement>(null),
    meetingDates: useRef<SVGSVGElement>(null),
  };
  
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

  // Global mouse event handlers for brush selection
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!brushDragging || brushStart === null) return;
      
      const widgetId = brushDragging;
      const svg = brushRefs[widgetId as keyof typeof brushRefs].current;
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 200;
      const clampedX = Math.max(0, Math.min(200, x));
      
      const minX = Math.min(brushStart, clampedX);
      const maxX = Math.max(brushStart, clampedX);
      
      // Ensure minimum zoom width
      if (maxX - minX < 10) return;
      
      // Update zoom state
      if (widgetId === 'sentiment') {
        setSentimentZoom({ minX, maxX });
      } else if (widgetId === 'letterCount') {
        setLetterCountZoom({ minX, maxX });
      } else if (widgetId === 'meetingDates') {
        setMeetingDatesZoom({ minX, maxX });
      }
    };

    const handleGlobalMouseUp = () => {
      setBrushDragging(null);
      setBrushStart(null);
    };

    if (brushDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [brushDragging, brushStart]);

  const handlePreviousFunFact = () => {
    if (funFacts.length === 0) return;
    setCurrentFunFactIndex((prev) => (prev === 0 ? funFacts.length - 1 : prev - 1));
  };

  const handleNextFunFact = () => {
    if (funFacts.length === 0) return;
    setCurrentFunFactIndex((prev) => (prev === funFacts.length - 1 ? 0 : prev + 1));
  };

  // Helper function to transform points based on zoom level
  const transformPoints = (points: Array<{ x: number; y: number }>, zoom: { minX: number; maxX: number }): Array<{ x: number; y: number }> => {
    if (zoom.minX === 0 && zoom.maxX === 200) {
      return points; // No zoom, return original points
    }
    
    const zoomWidth = zoom.maxX - zoom.minX;
    return points
      .filter(p => p.x >= zoom.minX && p.x <= zoom.maxX)
      .map(p => ({
        x: ((p.x - zoom.minX) / zoomWidth) * 200,
        y: p.y
      }));
  };

  // Helper function to calculate date from x coordinate
  const getDateFromX = (x: number, dateRange: { start: string; end: string }): string => {
    // Convert x (0-200) to approximate date
    const ratio = x / 200;
    const startYear = parseInt(dateRange.start) || 1910;
    const endYear = parseInt(dateRange.end) || 1915;
    const year = Math.round(startYear + (endYear - startYear) * ratio);
    return year.toString();
  };

  // Helper function to get y-axis value from y coordinate (for sentiment: scores 0-10, inverted)
  const getYValueFromY = (y: number, minValue: number = 0, maxValue: number = 10, yTop: number = 10, yBottom: number = 70): number => {
    // Inverted: higher y coordinate = lower value
    const normalized = (yBottom - y) / (yBottom - yTop);
    return minValue + (maxValue - minValue) * normalized;
  };

  // Helper function to generate horizontal ticks (x-axis)
  const generateHorizontalTicks = (minX: number, maxX: number, dateRange: { start: string; end: string }, numTicks: number = 5): Array<{ x: number; label: string }> => {
    const ticks: Array<{ x: number; label: string }> = [];
    const zoomWidth = maxX - minX;
    const tickSpacing = zoomWidth / (numTicks - 1);
    
    for (let i = 0; i < numTicks; i++) {
      const x = minX + (i * tickSpacing);
      const transformedX = ((x - minX) / zoomWidth) * 200;
      const label = getDateFromX(x, dateRange);
      ticks.push({ x: transformedX, label });
    }
    
    return ticks;
  };

  // Helper function to generate vertical ticks (y-axis) for sentiment (scores 0-10)
  const generateVerticalTicksSentiment = (numTicks: number = 5): Array<{ y: number; value: number }> => {
    const ticks: Array<{ y: number; value: number }> = [];
    const yTop = 10;
    const yBottom = 70;
    const minValue = 0;
    const maxValue = 10;
    
    for (let i = 0; i < numTicks; i++) {
      const value = minValue + (maxValue - minValue) * (i / (numTicks - 1));
      const y = yBottom - ((value - minValue) / (maxValue - minValue)) * (yBottom - yTop);
      ticks.push({ y, value });
    }
    
    return ticks;
  };

  // Helper function to generate vertical ticks (y-axis) for letter count
  const generateVerticalTicksLetterCount = (points: Array<{ x: number; y: number }>, maxCount: number, numTicks: number = 5): Array<{ y: number; value: number }> => {
    if (points.length === 0 || maxCount === 0) return [];
    
    const yTop = 10;
    const yBottom = 70;
    const minValue = 0;
    const maxValue = maxCount;
    
    const ticks: Array<{ y: number; value: number }> = [];
    
    for (let i = 0; i < numTicks; i++) {
      const value = minValue + (maxValue - minValue) * (i / (numTicks - 1));
      const y = yBottom - ((value - minValue) / (maxValue - minValue)) * (yBottom - yTop);
      ticks.push({ y, value: Math.round(value) });
    }
    
    return ticks;
  };

  // Brush selection handlers
  const handleBrushMouseDown = (widgetId: string, e: React.MouseEvent<SVGSVGElement>) => {
    const svg = brushRefs[widgetId as keyof typeof brushRefs].current;
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    const clampedX = Math.max(0, Math.min(200, x));
    
    setBrushDragging(widgetId);
    setBrushStart(clampedX);
    e.preventDefault();
  };

  const handleBrushMouseMove = (widgetId: string, e: React.MouseEvent<SVGSVGElement>) => {
    if (!brushDragging || brushDragging !== widgetId || brushStart === null) return;
    
    const svg = brushRefs[widgetId as keyof typeof brushRefs].current;
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    const clampedX = Math.max(0, Math.min(200, x));
    
    const minX = Math.min(brushStart, clampedX);
    const maxX = Math.max(brushStart, clampedX);
    
    // Ensure minimum zoom width
    if (maxX - minX < 10) return;
    
    // Update zoom state
    if (widgetId === 'sentiment') {
      setSentimentZoom({ minX, maxX });
    } else if (widgetId === 'letterCount') {
      setLetterCountZoom({ minX, maxX });
    } else if (widgetId === 'meetingDates') {
      setMeetingDatesZoom({ minX, maxX });
    }
  };

  const handleBrushMouseUp = () => {
    setBrushDragging(null);
    setBrushStart(null);
  };

  // Reset zoom handlers
  const resetZoom = (widgetId: string) => {
    if (widgetId === 'sentiment') {
      setSentimentZoom({ minX: 0, maxX: 200 });
    } else if (widgetId === 'letterCount') {
      setLetterCountZoom({ minX: 0, maxX: 200 });
    } else if (widgetId === 'meetingDates') {
      setMeetingDatesZoom({ minX: 0, maxX: 200 });
    }
  };

  // Helper function to convert data points to SVG path
  const pointsToPath = (points: Array<{ x: number; y: number }>, smooth: boolean = false, label: string = ''): string => {
    if (points.length === 0) {
      return '';
    }
    if (points.length === 1) {
      return `M${points[0].x},${points[0].y}`;
    }
    
    // Sort points by x coordinate to ensure proper path generation
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    
    if (smooth && sortedPoints.length >= 3) {
      // Use simple polyline for accurate representation
      // Smooth curves can overshoot and create visual artifacts
      // A clean polyline will accurately show the data
      return sortedPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
    } else {
      // Simple line path
      return sortedPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
    }
  };

  const tabs = [
    { id: 'sentiment', label: 'Sentiment Over Time' },
    { id: 'topics', label: 'Topic Frequency' },
    { id: 'weekly-letter-count', label: 'Weekly Letter Count' },
    { id: 'people', label: 'People Mentioned' },
    { id: 'meeting-dates', label: 'Meeting Dates' }
  ];

  return (
    <aside className="w-full bg-[#1A2A40] text-white p-4 min-h-screen">
      {/* Chapters */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E5E8F0] mb-3">
          Chapters
        </h3>
        <ChapterCarousel chapters={chapters} loading={chaptersLoading} />
      </div>

      {/* Popular Questions */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E5E8F0] mb-3">
          Popular Questions
        </h3>
        <div className="space-y-2">
          {loading ? (
            <div className="text-sm text-[#E5E8F0] p-3">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-sm text-[#E5E8F0] p-3">No questions available</div>
          ) : (
            <>
              {displayedQuestions.map((q) => (
                <Link
                  key={q._id}
                  href={`/qa?id=${encodeURIComponent(q._id)}`}
                  className="bg-[#F5F0E8] text-[#1A2A40] rounded p-3 flex items-center justify-between cursor-pointer hover:bg-[#E8E4DC] transition-colors"
                >
                  <span className="text-sm">{q.Question}</span>
                  <ChevronRight className="w-4 h-4 text-[#3E4A60]" />
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
      <div className="bg-[#0D1B2A] border border-[#23354D] rounded-lg p-5 mb-4 text-[#EAF2FF]">
        <div className="mb-3">
          <h3 className="text-base font-semibold uppercase tracking-wide text-white mb-1">
            The Data Room
          </h3>
          <p className="text-sm text-[#C8D5EA]">
            A living analytical view of the Asquith–Venetia archive.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#4A7C59] text-white shadow-sm'
                  : 'bg-[#15263E] text-[#EAF2FF] border border-[#1F3350] hover:bg-[#1F3350]'
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
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">Emotional tone across timeline</h4>
                {(sentimentZoom.minX !== 0 || sentimentZoom.maxX !== 200) && (
                  <button
                    onClick={() => resetZoom('sentiment')}
                    className="text-xs text-[#C8D5EA] hover:text-white flex items-center gap-1 transition-colors"
                    title="Reset zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
              {dataRoomLoading ? (
                <div className="h-32 bg-[#13243A] rounded flex items-center justify-center">
                  <span className="text-sm text-[#C8D5EA]">Loading sentiment data...</span>
                </div>
              ) : !dataRoomData ? (
                <div className="h-32 bg-[#13243A] rounded flex items-center justify-center">
                  <span className="text-sm text-[#C8D5EA]">No sentiment data available</span>
                </div>
              ) : (
                <>
                  <div className="h-32 bg-[#13243A] rounded relative p-3">
                    <svg 
                      viewBox="0 0 200 80" 
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      {/* Grid lines and ticks */}
                      {(() => {
                        const horizontalTicks = generateHorizontalTicks(sentimentZoom.minX, sentimentZoom.maxX, dataRoomData.sentiment.dateRange, 5);
                        const verticalTicks = generateVerticalTicksSentiment(5);
                        
                        return (
                          <>
                            {/* Vertical grid lines and ticks */}
                            {verticalTicks.map((tick, idx) => (
                              <g key={`v-${idx}`}>
                                <line 
                                  x1="0" 
                                  y1={tick.y} 
                                  x2="200" 
                                  y2={tick.y} 
                                  stroke="#4A7C59" 
                                  strokeWidth="0.5" 
                                  opacity="0.2"
                                  strokeDasharray="2,2"
                                />
                                <line 
                                  x1="0" 
                                  y1={tick.y} 
                                  x2="5" 
                                  y2={tick.y} 
                                  stroke="#C8D5EA" 
                                  strokeWidth="1"
                                />
                                <text 
                                  x="8" 
                                  y={tick.y} 
                                  textAnchor="start" 
                                  dominantBaseline="middle"
                                  className="text-[8px] fill-[#C8D5EA]"
                                >
                                  {tick.value.toFixed(1)}
                                </text>
                              </g>
                            ))}
                            
                            {/* Horizontal grid lines and ticks */}
                            {horizontalTicks.map((tick, idx) => (
                              <g key={`h-${idx}`}>
                                <line 
                                  x1={tick.x} 
                                  y1="0" 
                                  x2={tick.x} 
                                  y2="80" 
                                  stroke="#4A7C59" 
                                  strokeWidth="0.5" 
                                  opacity="0.2"
                                  strokeDasharray="2,2"
                                />
                                <line 
                                  x1={tick.x} 
                                  y1="70" 
                                  x2={tick.x} 
                                  y2="80" 
                                  stroke="#C8D5EA" 
                                  strokeWidth="1"
                                />
                                <text 
                                  x={tick.x} 
                                  y="75" 
                                  textAnchor="middle" 
                                  dominantBaseline="middle"
                                  className="text-[8px] fill-[#C8D5EA]"
                                >
                                  {tick.label}
                                </text>
                              </g>
                            ))}
                          </>
                        );
                      })()}
                      
                      {/* Transform points based on zoom */}
                      {(() => {
                        const transformedAnxiety = transformPoints(dataRoomData.sentiment.anxiety, sentimentZoom);
                        const transformedWarmth = transformPoints(dataRoomData.sentiment.warmth, sentimentZoom);
                        const transformedTension = transformPoints(dataRoomData.sentiment.tension, sentimentZoom);
                        
                        return (
                          <>
                            {/* Emotional Desolation line - drawn first so it appears behind */}
                            <path 
                              d={pointsToPath(transformedAnxiety, true, 'Emotional Desolation')} 
                              fill="none" 
                              stroke="#F59E0B" 
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* Romantic Adoration line */}
                            <path 
                              d={pointsToPath(transformedWarmth, true, 'Romantic Adoration')} 
                              fill="none" 
                              stroke="#4A7C59" 
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* Political Unburdening line - drawn last so it appears on top */}
                            <path 
                              d={pointsToPath(transformedTension, true, 'Political Unburdening')} 
                              fill="none" 
                              stroke="#DC2626" 
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  
                  {/* Overview chart with brush selection */}
                  <div className="h-6 bg-[#13243A] rounded mt-2 relative overflow-hidden">
                    <svg 
                      ref={brushRefs.sentiment}
                      viewBox="0 0 200 20" 
                      className="w-full h-full cursor-crosshair"
                      onMouseDown={(e) => handleBrushMouseDown('sentiment', e)}
                      onMouseMove={(e) => handleBrushMouseMove('sentiment', e)}
                      onMouseUp={handleBrushMouseUp}
                      onMouseLeave={handleBrushMouseUp}
                    >
                      {/* Full timeline background */}
                      <line x1="0" y1="10" x2="200" y2="10" stroke="#4A7C59" strokeWidth="1" opacity="0.3" />
                      
                      {/* Highlighted zoom range */}
                      <rect 
                        x={sentimentZoom.minX} 
                        y="0" 
                        width={sentimentZoom.maxX - sentimentZoom.minX} 
                        height="20" 
                        fill="#4A7C59" 
                        opacity="0.3"
                      />
                      
                    </svg>
                  </div>
                  
                  <div className="flex gap-3 mt-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                      <span className="text-[#EAF2FF]">Political Unburdening</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4A7C59]" />
                      <span className="text-[#EAF2FF]">Romantic Adoration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      <span className="text-[#EAF2FF]">Emotional Desolation</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'topics' && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Dominant themes in correspondence</h4>
              {dataRoomLoading ? (
                <div className="text-sm text-[#C8D5EA] p-3">Loading topics data...</div>
              ) : !dataRoomData || !dataRoomData.topics || dataRoomData.topics.length === 0 ? (
                <div className="text-sm text-[#C8D5EA] p-3">No topics data available</div>
              ) : (
                <div className="space-y-3">
                  {dataRoomData.topics.map((item) => (
                    <div key={item.topic}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white font-medium">{item.topic}</span>
                        <span className="text-[#C8D5EA] font-semibold">{item.value}%</span>
                      </div>
                      <div className="h-2.5 bg-[#15263E] rounded-full overflow-hidden">
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
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">Number of letters per week over time</h4>
                {(letterCountZoom.minX !== 0 || letterCountZoom.maxX !== 200) && (
                  <button
                    onClick={() => resetZoom('letterCount')}
                    className="text-xs text-[#C8D5EA] hover:text-white flex items-center gap-1 transition-colors"
                    title="Reset zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
              {dataRoomLoading ? (
                <div className="h-28 bg-[#13243A] rounded flex items-center justify-center">
                  <span className="text-sm text-[#C8D5EA]">Loading letter count data...</span>
                </div>
              ) : !dataRoomData || !dataRoomData.dailyLetterCount ? (
                <div className="h-28 bg-[#13243A] rounded flex items-center justify-center">
                  <span className="text-sm text-[#C8D5EA]">No letter count data available</span>
                </div>
              ) : (
                <>
                  <div className="h-28 bg-[#13243A] rounded relative p-3">
                    <svg 
                      viewBox="0 0 200 80" 
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      {(() => {
                        const transformedData = transformPoints(dataRoomData.dailyLetterCount.data, letterCountZoom);
                        const peakPoint = dataRoomData.dailyLetterCount.data.reduce((min, p) => 
                          p.y < min.y ? p : min
                        );
                        const isPeakVisible = peakPoint.x >= letterCountZoom.minX && peakPoint.x <= letterCountZoom.maxX;
                        const transformedPeak = isPeakVisible ? {
                          x: ((peakPoint.x - letterCountZoom.minX) / (letterCountZoom.maxX - letterCountZoom.minX)) * 200,
                          y: peakPoint.y
                        } : null;
                        
                        const horizontalTicks = generateHorizontalTicks(letterCountZoom.minX, letterCountZoom.maxX, dataRoomData.dailyLetterCount.dateRange, 5);
                        const verticalTicks = generateVerticalTicksLetterCount(transformedData, dataRoomData.dailyLetterCount.peak.count, 5);
                        
                        return (
                          <>
                            {/* Vertical grid lines and ticks */}
                            {verticalTicks.map((tick, idx) => (
                              <g key={`v-${idx}`}>
                                <line 
                                  x1="0" 
                                  y1={tick.y} 
                                  x2="200" 
                                  y2={tick.y} 
                                  stroke="#4A7C59" 
                                  strokeWidth="0.5" 
                                  opacity="0.2"
                                  strokeDasharray="2,2"
                                />
                                <line 
                                  x1="0" 
                                  y1={tick.y} 
                                  x2="5" 
                                  y2={tick.y} 
                                  stroke="#C8D5EA" 
                                  strokeWidth="1"
                                />
                                <text 
                                  x="8" 
                                  y={tick.y} 
                                  textAnchor="start" 
                                  dominantBaseline="middle"
                                  className="text-[8px] fill-[#C8D5EA]"
                                >
                                  {tick.value}
                                </text>
                              </g>
                            ))}
                            
                            {/* Horizontal grid lines and ticks */}
                            {horizontalTicks.map((tick, idx) => (
                              <g key={`h-${idx}`}>
                                <line 
                                  x1={tick.x} 
                                  y1="0" 
                                  x2={tick.x} 
                                  y2="80" 
                                  stroke="#4A7C59" 
                                  strokeWidth="0.5" 
                                  opacity="0.2"
                                  strokeDasharray="2,2"
                                />
                                <line 
                                  x1={tick.x} 
                                  y1="60" 
                                  x2={tick.x} 
                                  y2="80" 
                                  stroke="#C8D5EA" 
                                  strokeWidth="1"
                                />
                                <text 
                                  x={tick.x} 
                                  y="75" 
                                  textAnchor="middle" 
                                  dominantBaseline="middle"
                                  className="text-[8px] fill-[#C8D5EA]"
                                >
                                  {tick.label}
                                </text>
                              </g>
                            ))}
                            
                            <path 
                              d={pointsToPath(transformedData, false)} 
                              fill="none" 
                              stroke="#4A7C59" 
                              strokeWidth="2"
                            />
                            {transformedPeak && (
                              <circle cx={transformedPeak.x} cy={transformedPeak.y} r="3" fill="#DC2626" />
                            )}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  
                  {/* Overview chart with brush selection */}
                  <div className="h-6 bg-[#13243A] rounded mt-2 relative overflow-hidden">
                    <svg 
                      ref={brushRefs.letterCount}
                      viewBox="0 0 200 20" 
                      className="w-full h-full cursor-crosshair"
                      onMouseDown={(e) => handleBrushMouseDown('letterCount', e)}
                      onMouseMove={(e) => handleBrushMouseMove('letterCount', e)}
                      onMouseUp={handleBrushMouseUp}
                      onMouseLeave={handleBrushMouseUp}
                    >
                      {/* Full timeline background */}
                      <line x1="0" y1="10" x2="200" y2="10" stroke="#4A7C59" strokeWidth="1" opacity="0.3" />
                      
                      {/* Highlighted zoom range */}
                      <rect 
                        x={letterCountZoom.minX} 
                        y="0" 
                        width={letterCountZoom.maxX - letterCountZoom.minX} 
                        height="20" 
                        fill="#4A7C59" 
                        opacity="0.3"
                      />
                    </svg>
                  </div>
                  
                  <p className="text-sm text-[#C8D5EA] mt-3">
                    Peak correspondence: {dataRoomData.dailyLetterCount.peak.date} ({dataRoomData.dailyLetterCount.peak.count} letters/week)
                  </p>
                </>
              )}
            </div>
          )}

          {activeTab === 'people' && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Most mentioned individuals</h4>
              {dataRoomLoading ? (
                <div className="text-sm text-[#C8D5EA] p-3">Loading people data...</div>
              ) : !dataRoomData || !dataRoomData.people || dataRoomData.people.length === 0 ? (
                <div className="text-sm text-[#C8D5EA] p-3">No people data available</div>
              ) : (
                <div className="space-y-3">
                  {dataRoomData.people.map((person, idx) => (
                    <div key={person.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[#EAF2FF] w-5 font-medium">{idx + 1}.</span>
                        <span className="text-white font-semibold">{person.name}</span>
                      </div>
                      <span className="text-[#9EE6B3] font-bold">{person.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'meeting-dates' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">Dates when they met</h4>
                {(meetingDatesZoom.minX !== 0 || meetingDatesZoom.maxX !== 200) && (
                  <button
                    onClick={() => resetZoom('meetingDates')}
                    className="text-xs text-[#C8D5EA] hover:text-white flex items-center gap-1 transition-colors"
                    title="Reset zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
              {dataRoomLoading ? (
                <div className="text-sm text-[#C8D5EA] p-3">Loading meeting dates data...</div>
              ) : !dataRoomData || !dataRoomData.meetingDates || dataRoomData.meetingDates.dates.length === 0 ? (
                <div className="text-sm text-[#C8D5EA] p-3">No meeting dates data available</div>
              ) : (
                <div>
                  <div className="mb-3 text-sm text-[#C8D5EA]">
                    <span className="text-white font-semibold">{dataRoomData.meetingDates.total}</span> meeting{dataRoomData.meetingDates.total !== 1 ? 's' : ''} recorded
                    {dataRoomData.meetingDates.dateRange.start && dataRoomData.meetingDates.dateRange.end && (
                      <span className="block mt-1 text-xs">
                        {dataRoomData.meetingDates.dateRange.start} - {dataRoomData.meetingDates.dateRange.end}
                      </span>
                    )}
                  </div>
                  
                  {/* Timeline Visualization */}
                  <div className="h-32 bg-[#13243A] rounded relative p-3 mb-3">
                    <svg 
                      viewBox="0 0 200 80" 
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      {(() => {
                        const horizontalTicks = generateHorizontalTicks(meetingDatesZoom.minX, meetingDatesZoom.maxX, dataRoomData.meetingDates.dateRange, 5);
                        
                        return (
                          <>
                            {/* Horizontal grid lines and ticks */}
                            {horizontalTicks.map((tick, idx) => (
                              <g key={`h-${idx}`}>
                                <line 
                                  x1={tick.x} 
                                  y1="0" 
                                  x2={tick.x} 
                                  y2="80" 
                                  stroke="#4A7C59" 
                                  strokeWidth="0.5" 
                                  opacity="0.2"
                                  strokeDasharray="2,2"
                                />
                                <line 
                                  x1={tick.x} 
                                  y1="40" 
                                  x2={tick.x} 
                                  y2="50" 
                                  stroke="#C8D5EA" 
                                  strokeWidth="1"
                                />
                                <text 
                                  x={tick.x} 
                                  y="45" 
                                  textAnchor="middle" 
                                  dominantBaseline="middle"
                                  className="text-[8px] fill-[#C8D5EA]"
                                >
                                  {tick.label}
                                </text>
                              </g>
                            ))}
                          </>
                        );
                      })()}
                      
                      {/* Timeline line */}
                      <line 
                        x1="0" 
                        y1="40" 
                        x2="200" 
                        y2="40" 
                        stroke="#4A7C59" 
                        strokeWidth="2"
                      />
                      
                      {/* Meeting markers - filter and transform based on zoom */}
                      {dataRoomData.meetingDates.timeline
                        .filter(point => point.x >= meetingDatesZoom.minX && point.x <= meetingDatesZoom.maxX)
                        .map((point, idx) => {
                          const transformedX = ((point.x - meetingDatesZoom.minX) / (meetingDatesZoom.maxX - meetingDatesZoom.minX)) * 200;
                          return (
                            <g key={idx}>
                              {/* Vertical line from timeline */}
                              <line 
                                x1={transformedX} 
                                y1="35" 
                                x2={transformedX} 
                                y2="45" 
                                stroke="#4A7C59" 
                                strokeWidth="1.5"
                              />
                              {/* Cameo icon marker - two heads side-by-side */}
                              <g transform={`translate(${transformedX - 6}, 20)`}>
                                {/* Left head */}
                                <circle cx="4" cy="6" r="4" stroke="#4A7C59" strokeWidth="1.5" fill="#13243A"/>
                                <circle cx="4" cy="5" r="1.5" fill="#4A7C59"/>
                                {/* Right head */}
                                <circle cx="8" cy="6" r="4" stroke="#4A7C59" strokeWidth="1.5" fill="#13243A"/>
                                <circle cx="8" cy="5" r="1.5" fill="#4A7C59"/>
                              </g>
                            </g>
                          );
                        })}
                    </svg>
                  </div>
                  
                  {/* Overview chart with brush selection */}
                  <div className="h-6 bg-[#13243A] rounded mb-3 relative overflow-hidden">
                    <svg 
                      ref={brushRefs.meetingDates}
                      viewBox="0 0 200 20" 
                      className="w-full h-full cursor-crosshair"
                      onMouseDown={(e) => handleBrushMouseDown('meetingDates', e)}
                      onMouseMove={(e) => handleBrushMouseMove('meetingDates', e)}
                      onMouseUp={handleBrushMouseUp}
                      onMouseLeave={handleBrushMouseUp}
                    >
                      {/* Full timeline background */}
                      <line x1="0" y1="10" x2="200" y2="10" stroke="#4A7C59" strokeWidth="1" opacity="0.3" />
                      
                      {/* Meeting markers on overview */}
                      {dataRoomData.meetingDates.timeline.map((point, idx) => (
                        <circle key={idx} cx={point.x} cy="10" r="1.5" fill="#4A7C59" opacity="0.6" />
                      ))}
                      
                      {/* Highlighted zoom range */}
                      <rect 
                        x={meetingDatesZoom.minX} 
                        y="0" 
                        width={meetingDatesZoom.maxX - meetingDatesZoom.minX} 
                        height="20" 
                        fill="#4A7C59" 
                        opacity="0.3"
                      />
                    </svg>
                  </div>
                  
                  {/* Meeting frequency info */}
                  <div className="text-xs text-[#C8D5EA] space-y-1">
                    {dataRoomData.meetingDates.dates.length > 0 && (() => {
                      // Calculate average days between meetings
                      const dates = dataRoomData.meetingDates.dates.map(d => {
                        const [y, m, day] = d.split('-').map(Number);
                        return new Date(y, m - 1, day);
                      });
                      
                      const intervals: number[] = [];
                      for (let i = 1; i < dates.length; i++) {
                        const diff = Math.floor((dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
                        intervals.push(diff);
                      }
                      
                      const avgInterval = intervals.length > 0 
                        ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
                        : 0;
                      
                      return (
                        <div>
                          {avgInterval > 0 && (
                            <span>Average: {avgInterval} days between meetings</span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View Full Link */}
        {/* <div className="mt-4 pt-3 border-t border-[#1A2A40]">
          <a 
            href="#" 
            className="text-[10px] text-[#4A7C59] hover:text-[#5A8C69] flex items-center gap-1 transition-colors"
          >
            <span>View Full Data Room</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div> */}
      </div>

      {/* Fun Facts */}
      <div className="bg-[#F5F0E8] text-[#1A2A40] rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider">Fun Facts</h4>
          {funFacts.length > 0 && (
            <span className="text-xs text-[#2D3648]">
              {currentFunFactIndex + 1} / {funFacts.length}
            </span>
          )}
        </div>
        {funFactsLoading ? (
          <div className="text-xs text-[#3E4A60] text-center py-2 h-24 flex items-center justify-center">Loading fun facts...</div>
        ) : funFacts.length === 0 ? (
          <div className="text-xs text-[#3E4A60] text-center py-2 h-24 flex items-center justify-center">No fun facts available</div>
        ) : (
          <div className="h-24 flex flex-col">
            <div className="flex items-start gap-2 flex-1 min-h-0">
              <button
                onClick={handlePreviousFunFact}
                className="w-4 h-4 text-[#3E4A60] hover:text-[#1A2A40] transition-colors flex-shrink-0 mt-1"
                aria-label="Previous fun fact"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex-1 overflow-y-auto min-h-0">
                  <p className="text-sm text-center px-2">
                    {funFacts[currentFunFactIndex]?.fact || 'No fun fact available'}
                  </p>
                </div>
                {funFacts[currentFunFactIndex]?.tags && funFacts[currentFunFactIndex].tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mt-1.5 flex-shrink-0">
                    {funFacts[currentFunFactIndex].tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 bg-[#1A2A40]/10 text-[#2D3648] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleNextFunFact}
                className="w-4 h-4 text-[#3E4A60] hover:text-[#1A2A40] transition-colors flex-shrink-0 mt-1"
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
