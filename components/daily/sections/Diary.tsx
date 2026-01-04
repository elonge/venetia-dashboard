import React from "react";
import { PEOPLE_IMAGES } from "@/constants";
import { DiarySummary } from "../types";

interface DiaryProps {
  diaries: DiarySummary[];
}

export default function Diary({ diaries }: DiaryProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black text-navy uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="w-4 h-[1px] bg-accent-brown"></span>
        Witness Observations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diaries.map((diary, idx) => {
          const personImage =
            PEOPLE_IMAGES[diary.writer as keyof typeof PEOPLE_IMAGES];
          return (
            <div
              key={idx}
              className="bg-card-bg rounded-sm p-6 border border-border-beige shadow-sm relative transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-5">
                {personImage ? (
                  <div className="relative flex-shrink-0">
                    <img
                      src={personImage}
                      alt={diary.writer}
                      className="w-14 h-14 rounded-full object-cover border border-border-beige shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-page-bg flex items-center justify-center flex-shrink-0 border border-border-beige text-accent-brown text-xs font-bold">
                    {diary.writer
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0 pt-1">
                  <div className="font-serif text-base font-bold text-navy mb-2">
                    {diary.writer}
                  </div>

                  <p className="text-[15px] text-slate leading-relaxed italic font-serif border-l-2 border-page-bg pl-4">
                    &quot;{diary.excerpt}&quot;
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
