"use client";

import React from "react";

export default function HeroSection() {
  return (
    <div className="bg-[#F5F0E8] rounded-md overflow-hidden mb-4 md:mb-6 border border-black/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)]">
      <div className="relative w-full">
        <img
          src="/asquith_venetia_split_screen.jpg"
          alt="Historical portrait"
          className="w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] object-cover sepia"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A40]/90 via-[#1A2A40]/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-3 md:p-4 text-white pointer-events-none">
          <h2 className="font-serif text-lg md:text-xl lg:text-4xl leading-tight max-w-3xl">
            A Prime Minister&apos;s obsession, a nation at war, and the letters
            that tell the secret history.
          </h2>
          <p className="mt-2 text-white/90 text-xs md:text-base font-serif leading-relaxed max-w-2xl italic">
            Amidst the Great War, Prime Minister H.H. Asquith and Venetia Stanley shared a
            daily, mutual correspondence revealing a secret intellectual and
            romantic partnership.
          </p>
        </div>
      </div>
    </div>
  );
}
