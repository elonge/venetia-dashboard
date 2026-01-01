"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  Info,
  BookOpen,
} from "lucide-react";
import dynamic from "next/dynamic";
import { TIMELINE_DATA } from "@/diary_entris";
const DiaryMap = dynamic(() => import("@/components/venetia-1914/DiaryMap"), {
  ssr: false,
});


const VenetiaDiaryLayout = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [animating, setAnimating] = useState(false);

  const entry = TIMELINE_DATA[currentIndex];

  const months = useMemo(() => {
    const uniqueMonths: { name: string; index: number }[] = [];
    const seenMonths = new Set<string>();

    TIMELINE_DATA.forEach((item, index) => {
      const date = new Date(item.date);
      const monthName = date.toLocaleString("default", { month: "short" });

      if (!seenMonths.has(monthName)) {
        seenMonths.add(monthName);
        uniqueMonths.push({ name: monthName, index });
      }
    });
    return uniqueMonths;
  }, []);

  const currentMonth = new Date(entry.date).toLocaleString("default", {
    month: "short",
  });

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < TIMELINE_DATA.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="relative flex h-screen w-full bg-[#Fdfbf7] text-gray-800 font-sans overflow-hidden max-h-[85vh]">
      {/* --- FLOATING NAVIGATION --- */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-2xl border border-stone-200/50 backdrop-blur-md disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 hover:scale-110"
        aria-label="Previous Entry"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex === TIMELINE_DATA.length - 1}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-2xl border border-stone-200/50 backdrop-blur-md disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 hover:scale-110"
        aria-label="Next Entry"
      >
        <ChevronRight size={32} />
      </button>

      {/* LEFT PANE: Visuals & Map */}
      <div className="hidden md:flex w-1/2 bg-stone-900 relative items-center justify-center overflow-hidden group">
        {/* Background Image */}
        <div
          key={entry.id}
          className="absolute inset-0 opacity-90 animate-fade-in"
        >
          <div
            className={`w-full h-full bg-cover bg-center transition-transform duration-[20s] ease-linear transform scale-100 group-hover:scale-110 ${
              entry.theme === "war" ? "grayscale contrast-125" : "sepia-[.15]"
            }`}
            style={{ backgroundImage: `url('${entry.visualBackground}')` }}
          />
        </div>

        {/* Overlay Image */}
        {entry.visualOverlay && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none animate-slide-up">
            <img
              src={entry.visualOverlay}
              alt="Overlay context"
              className="max-w-[70%] max-h-[70%] object-contain drop-shadow-2xl opacity-90"
            />
          </div>
        )}

        {/* --- REAL LEAFLET MAP (Top Left) --- */}
        <DiaryMap
          center={entry.coords as [number, number]}
          destination={entry.destination as [number, number] | undefined}
          locationName={entry.location.split(",")[0]}
        />
      </div>

      {/* RIGHT PANE: Narrative */}
      <div className="w-full md:w-1/2 flex flex-col h-full relative z-30 bg-[#Fdfbf7] shadow-2xl">
        {/* Month Navigation */}
        <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-[#Fdfbf7]">
          <div className="flex space-x-6 text-xs uppercase tracking-widest text-stone-400">
            {months.map((m) => (
              <button
                key={m.name}
                onClick={() => setCurrentIndex(m.index)}
                className={
                  currentMonth === m.name
                    ? "text-red-800 font-bold underline decoration-2 underline-offset-4"
                    : "hover:text-stone-600 cursor-pointer transition-colors"
                }
              >
                {m.name}
              </button>
            ))}
          </div>
          <div className="text-stone-400 text-xs font-mono">1914.DIARY.V45</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-start pt-24 px-12 md:px-20 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div
            key={entry.id}
            className={`${animating ? "animate-slide-in-right" : ""}`}
          >
            <div className="mb-6">
              <div className="flex items-center text-red-800 mb-3 space-x-2">
                <MapPin size={16} />
                <span className="uppercase tracking-widest text-xs font-bold">
                  {entry.location}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif text-stone-900 leading-tight">
                {entry.displayDate}
              </h1>
            </div>

            <div className="relative mb-8 group">
              {/* <div className="absolute -left-10 top-0 text-6xl text-stone-200 font-serif select-none">“</div> */}
              <p className="text-xl md:text-2xl font-serif leading-relaxed text-stone-800 italic relative z-10 md:pr-4">
                {entry.diaryEntry}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {entry.theme === "war" && (
                  <span className="px-3 py-1 bg-stone-800 text-stone-100 text-[10px] uppercase tracking-wider">
                    War Declared
                  </span>
                )}
                {entry.location.includes("Alderley") && (
                  <span className="px-3 py-1 bg-[#e8e4da] text-stone-600 text-[10px] uppercase tracking-wider">
                    Social
                  </span>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="group flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-red-800 transition-colors"
              >
                <div
                  className={`p-1 rounded-full border border-stone-300 group-hover:border-red-800 transition-colors ${
                    showHistory ? "bg-stone-200" : ""
                  }`}
                >
                  {showHistory ? <X size={10} /> : <Info size={10} />}
                </div>
                <span>
                  {showHistory
                    ? "Hide Historical Facts"
                    : "View Historical Facts"}
                </span>
              </button>

              {showHistory && (
                <div className="mt-4 p-5 bg-[#f4f1ea] border-l-4 border-red-800 text-sm text-stone-700 animate-fade-in rounded-r-md">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center uppercase tracking-wider text-xs">
                    <BookOpen size={14} className="mr-2" /> Verified Sources
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 marker:text-red-800">
                    {entry.historicalFacts.map((fact, idx) => (
                      <li key={idx} className="leading-snug">
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 0.9;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VenetiaDiaryLayout;
