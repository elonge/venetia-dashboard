'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <div className="bg-[#F5F0E8] rounded-lg overflow-hidden mb-4">
      <div className="relative w-full">
        <img 
          src="/asquith_venetia_split_screen.jpg"
          alt="Historical portrait"
          className="w-full h-auto object-contain sepia"
          style={{ maxHeight: '400px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A40]/90 via-[#1A2A40]/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-4 text-white pointer-events-none">
          <span className="text-[#C4A574] text-xs font-semibold tracking-wider uppercase mb-1 block">
            The Big Story
          </span>
          <h2 className="font-serif text-xl leading-tight">
            A Prime Minister's obsession, a nation at war, and the letters that tell the secret history.
          </h2>
        </div>
      </div>
    </div>
  );
}