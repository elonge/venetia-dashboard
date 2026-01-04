import React, { useState, useEffect } from "react";
import { Mail, ChevronLeft, ChevronRight, Users, BookOpen } from "lucide-react";
import { DailyLetter } from "../types";

interface CorrespondenceProps {
  letters: DailyLetter[];
  totalLettersRecorded?: number;
  hasMeeting?: boolean;
  meetingReference?: string;
}

export default function Correspondence({
  letters,
  totalLettersRecorded,
  hasMeeting,
  meetingReference,
}: CorrespondenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when letters change (implying day change, though key approach is safer)
  // But key approach in parent is best.
  
  const totalRecordedLetters = totalLettersRecorded || letters.length;
  const missingLettersCount = Math.max(0, totalRecordedLetters - letters.length);
  const showMissingCard = missingLettersCount > 0;
  const totalSlides = letters.length + (showMissingCard ? 1 : 0);
  const hasDisplayableContent = totalSlides > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs md:text-sm font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
          <Mail className="w-4 h-4 text-accent-brown" />
          Correspondence{" "}
          {hasDisplayableContent
            ? `(${currentIndex + 1} of ${totalSlides})`
            : "(0)"}
        </h3>

        {/* Navigation Buttons - Header Position */}
        {totalSlides > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-sm bg-card-bg border border-border-beige text-navy hover:text-accent-brown disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous letter"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => Math.min(totalSlides - 1, prev + 1))
              }
              disabled={currentIndex === totalSlides - 1}
              className="p-1.5 rounded-sm bg-card-bg border border-border-beige text-navy hover:text-accent-brown disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next letter"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {hasDisplayableContent ? (
          /* Letter Card Carousel */
          <div className="space-y-6">
            <div className="relative">
              {letters.map((letter, idx) => (
                <div
                  key={idx}
                  className={`${
                    idx === currentIndex
                      ? "block animate-in fade-in slide-in-from-right-4 duration-500"
                      : "hidden"
                  }`}
                >
                  <div className="bg-card-bg rounded-sm p-4 md:p-6 border-l-[4px] md:border-l-[6px] border-accent-burgundy shadow-md">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                      {/* LEFT COLUMN: The Primary Source (2/3) */}
                      <div className="lg:col-span-2 flex flex-col justify-between lg:border-r lg:border-border-beige/50 lg:pr-8">
                        <div className="space-y-3 md:space-y-4">
                          {/* Header Info */}
                          <div className="flex items-center justify-between text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent-brown">
                            <span>Letter #{letter.letter_number}</span>
                            <span className="truncate ml-2">
                              {letter.time_of_day || "Time not recorded"}
                            </span>
                          </div>

                          {/* THE QUOTE: Large and Impactful */}
                          {letter.excerpt && (
                            <div className="relative pt-2">
                              <span className="absolute -top-2 md:-top-4 -left-1 md:-left-2 text-4xl md:text-6xl font-serif text-accent-burgundy/10">
                                &quot;
                              </span>
                              <p className="font-serif text-xl md:text-xl lg:text-2xl text-navy italic leading-tight relative z-10">
                                {letter.excerpt}
                              </p>
                            </div>
                          )}

                          {/* SUMMARY: Detailed Context */}
                          {letter.summary && (
                            <p className="text-xs md:text-base text-slate leading-relaxed border-t border-border-beige pt-3 md:pt-4 italic">
                              {letter.summary}
                            </p>
                          )}
                        </div>

                        {/* MENTIONED PEOPLE: Move to bottom of main column */}
                        {letter.people_mentioned &&
                          letter.people_mentioned.length > 0 && (
                            <div className="mt-8 pt-4 border-t border-border-beige/30 flex items-start gap-3 text-[9px] uppercase tracking-[0.15em] text-muted-gray font-bold">
                              <Users className="w-3.5 h-3.5 mt-[-1px] opacity-60" />
                              <div className="leading-relaxed">
                                <span className="text-accent-brown mr-2">
                                  Mentioned:
                                </span>
                                <span>
                                  {letter.people_mentioned.join("  •  ")}
                                </span>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* RIGHT COLUMN: Intelligence Analysis (1/3) */}
                      <div className="lg:col-span-1 space-y-4 md:space-y-6 bg-page-bg/40 p-3 md:p-4 rounded-sm mt-4 lg:mt-0">
                        {/* METRICS: Redesigned for full readability */}
                        <div>
                          <h3 className="text-[10px] font-black text-accent-brown uppercase tracking-[0.2em] mb-4">
                            Metric Analysis
                          </h3>
                          <div className="space-y-4">
                            {[
                              {
                                label: "Romantic Adoration",
                                score: letter.scores?.romantic_adoration,
                                color: "var(--color-accent-burgundy)",
                              },
                              {
                                label: "Political Unburdening",
                                score: letter.scores?.political_unburdening,
                                color: "var(--color-accent-green)",
                              },
                              {
                                label: "Emotional Desolation",
                                score: letter.scores?.emotional_desolation,
                                color: "var(--color-accent-brown)",
                              },
                            ].map(
                              (metric, mIdx) =>
                                metric.score !== undefined && (
                                  <div key={mIdx} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-navy">
                                      <span>{metric.label}</span>
                                      <span>{metric.score}/10</span>
                                    </div>
                                    <div className="w-full bg-section-bg h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className="h-full transition-all duration-1000"
                                        style={{
                                          width: `${
                                            (metric.score / 10) * 100
                                          }%`,
                                          backgroundColor: metric.color,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )
                            )}
                          </div>
                        </div>

                        {/* TOPICS: Styled as Archive Tags */}
                        {letter.topics && letter.topics.length > 0 && (
                          <div className="pt-4 border-t border-border-beige">
                            <h3 className="text-[10px] font-black text-accent-brown uppercase tracking-[0.2em] mb-3">
                              Thematic Tags
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                              {letter.topics.map((topic, topicIdx) => (
                                <span
                                  key={topicIdx}
                                  className="px-2 py-1 bg-navy text-card-bg text-[12px] font-bold uppercase tracking-wider rounded-sm shadow-sm transition-all duration-300 cursor-default"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Render Missing Letters Card if needed */}
              {showMissingCard && (
                <div
                  className={`${
                    currentIndex === letters.length
                      ? "block animate-in fade-in slide-in-from-right-4 duration-500"
                      : "hidden"
                  }`}
                >
                  <div className="bg-card-bg rounded-sm p-6 md:p-8 border-l-[4px] md:border-l-[6px] border-muted-gray/30 shadow-md min-h-[200px] flex flex-col items-center justify-center text-center">
                    <div className="space-y-4 max-w-lg">
                      <div className="w-12 h-12 rounded-full bg-muted-gray/10 flex items-center justify-center mx-auto border border-muted-gray/20">
                        <BookOpen className="w-6 h-6 text-muted-gray/40" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.3em]">
                          Additional Correspondence
                        </h3>
                        <p className="text-lg font-serif italic text-navy/60 leading-relaxed">
                          According to the{" "}
                          <span className="not-italic font-bold">
                            Letters to Venetia Stanley
                          </span>{" "}
                          book, there{" "}
                          {missingLettersCount === 1 ? "is" : "are"}{" "}
                          {missingLettersCount} more letter
                          {missingLettersCount === 1 ? "" : "s"} that day, but{" "}
                          {missingLettersCount === 1
                            ? "its content is"
                            : "their contents are"}{" "}
                          not currently in the digital archive.
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="px-3 py-1 bg-section-bg border border-border-beige rounded-sm text-[10px] font-bold text-muted-gray uppercase tracking-widest">
                          Archive Notice
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Indicators */}
            {totalSlides > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-accent-burgundy w-4"
                        : "bg-border-beige"
                    }`}
                    aria-label={`Go to letter ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* No Letter Card: Maintained visual consistency */
          <div className="bg-card-bg rounded-sm p-6 md:p-8 border-l-[4px] md:border-l-[6px] border-muted-gray/30 shadow-md min-h-[200px] flex flex-col items-center justify-center text-center">
            {hasMeeting ? (
              <div className="space-y-4 max-w-lg">
                <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto border border-accent-green/20">
                  <Users className="w-6 h-6 text-accent-green" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black text-accent-green uppercase tracking-[0.3em]">
                    No known letters exchanged
                  </h3>
                  <p className="text-lg font-serif italic text-navy leading-relaxed">
                    {meetingReference ||
                      "The Prime Minister and Venetia met in person"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-lg">
                <div className="w-12 h-12 rounded-full bg-muted-gray/10 flex items-center justify-center mx-auto border border-muted-gray/20">
                  <Mail className="w-6 h-6 text-muted-gray/40" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black text-navy uppercase tracking-[0.3em]">
                    Gap in Correspondence
                  </h3>
                  <p className="text-lg font-serif italic text-navy/60 leading-relaxed">
                    No surviving record of correspondence for this date. The
                    Archive continues through witness accounts and official
                    records.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="px-3 py-1 bg-section-bg border border-border-beige rounded-sm text-[10px] font-bold text-muted-gray uppercase tracking-widest">
                    Archive Silence
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
