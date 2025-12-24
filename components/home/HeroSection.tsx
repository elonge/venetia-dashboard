'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <div className="bg-[#F5F0E8] rounded-2xl overflow-hidden mb-4 md:mb-6 border border-black/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)]">
      <div className="relative w-full">
        <img 
          src="/asquith_venetia_split_screen.jpg"
          alt="Historical portrait"
          className="w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] object-cover sepia"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A40]/90 via-[#1A2A40]/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-3 md:p-4 text-white pointer-events-none">
          <span className="text-[#C4A574] text-[10px] md:text-xs font-semibold tracking-wider uppercase mb-1 block">
            The Big Story
          </span>
          <h2 className="font-serif text-lg md:text-xl lg:text-2xl leading-tight max-w-3xl">
            A Prime Minister&apos;s obsession, a nation at war, and the letters that tell the secret history.
          </h2>
        </div>
      </div>
    </div>
  );
}
