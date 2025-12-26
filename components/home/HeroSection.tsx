"use client";

import { ArrowRight, Headphones } from "lucide-react";

import Link from "next/link";

import React from "react";



export default function HeroSection() {

  return (

    <div className="bg-card-bg rounded-md overflow-hidden mb-4 md:mb-6 border border-black/10 shadow-[0_18px_44px_rgba(0,0,0,0.16)]">

      <div className="relative w-full">

        <img

          src="/asquith_venetia_split_screen.jpg"

          alt="Historical portrait"

          className="w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] object-cover sepia"

        />



        {/* THE "CURATOR'S TAG" - Top Right */}

        <div className="absolute top-6 right-6 z-30 hidden md:block">

          <Link href="/about">

            <div className="group flex items-center gap-3 bg-card-bg pl-5 pr-2 py-2.5 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-transform cursor-pointer border-l-[3px] border-accent-red">

              <div className="flex flex-col items-end text-right">

                {/* The "Hook" Label */}

                <span className="text-[8px] font-black text-accent-brown uppercase tracking-[0.25em] mb-1">

                  The Venetia Project

                </span>



                {/* The Inviting Title */}

                <span className="font-serif text-[15px] font-bold text-navy italic leading-none group-hover:text-accent-red transition-colors">

                  Applying AI to read primary sources

                </span>

              </div>



              {/* The Interaction Icon */}

              <div className="w-8 h-8 bg-navy text-card-bg flex items-center justify-center rounded-sm shadow-sm group-hover:bg-accent-red transition-colors duration-300">

                <ArrowRight

                  size={14}

                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"

                />

              </div>

            </div>

          </Link>

        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 p-3 md:p-4 text-white pointer-events-none">

          <h2 className="font-serif text-lg md:text-xl lg:text-4xl leading-tight max-w-3xl">

            A Prime Minister&apos;s obsession, a nation at war, and the letters

            that tell the secret history.

          </h2>

          <p className="mt-2 text-white/90 text-xs md:text-base font-serif leading-relaxed max-w-2xl italic">

            Amidst the Great War, Prime Minister H.H. Asquith and Venetia

            Stanley shared a daily, mutual correspondence revealing a secret

            intellectual and romantic partnership.

          </p>

          <div className="mt-4 flex flex-wrap gap-3">

            <Link

              href="/essentials"

              className="pointer-events-auto group inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-md text-white text-sm md:text-base font-serif transition-all duration-300 hover:shadow-lg"

            >

              <span>The Essentials</span>

              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />

            </Link>

            

            <a

              href="https://open.spotify.com/show/6sSEg9Sf5MHjcrqFVIb4SJ"

              target="_blank"

              rel="noopener noreferrer"

              className="pointer-events-auto group inline-flex items-center gap-2 px-4 py-2 bg-[#1DB954]/20 hover:bg-[#1DB954]/30 backdrop-blur-sm border border-[#1DB954]/30 hover:border-[#1DB954]/50 rounded-md text-white text-sm md:text-base font-serif transition-all duration-300 hover:shadow-lg"

            >

              <Headphones size={16} className="group-hover:scale-110 transition-transform" />

              <span>Listen on Spotify</span>

            </a>

          </div>

        </div>

      </div>

    </div>

  );

}