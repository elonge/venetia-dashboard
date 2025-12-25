"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, MessageSquare, Sparkles, BarChart2, ArrowRight } from "lucide-react";
import { PEOPLE_IMAGES } from "@/constants";

export default function EssentialsPage() {
  return (
    <div className="min-h-screen bg-page-bg">
      <div className="mx-auto max-w-7xl">
        {/* 1. Hero Section */}
        <section className="w-full bg-navy py-16 md:py-24 relative overflow-hidden text-page-bg rounded-none md:rounded-sm shadow-2xl mx-auto md:max-w-[calc(100%-3rem)] md:mb-12 group/hero">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-red opacity-10 blur-[100px] rounded-full pointer-events-none group-hover/hero:opacity-20 transition-opacity duration-1000"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="inline-block border-b border-accent-red pb-1 mb-6 transform group-hover/hero:scale-105 transition-transform duration-500">
                <span className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-accent-red">
                    The Essential Guide
                </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 leading-tight text-card-bg transform transition-all duration-700">
              The Asquith-Stanley-Montagu Affair
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-serif italic text-page-bg/80 max-w-2xl mx-auto leading-relaxed">
              A guide to the most significant romantic triangle in British political history.
            </p>
          </div>
        </section>

        {/* 2. The Protagonists */}
        <section className="px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-navy mb-12 text-center flex items-center justify-center gap-4">
              <span className="h-[1px] w-12 bg-navy/20"></span>
              The Protagonists
              <span className="h-[1px] w-12 bg-navy/20"></span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Asquith */}
              <div className="bg-card-bg border border-border-beige rounded-sm p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group/card">
                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-sm bg-navy relative">
                  <img 
                    src={PEOPLE_IMAGES["H.H. Asquith"]} 
                    alt="H.H. Asquith"
                    className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 group-hover/card:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-navy/10 group-hover/card:bg-transparent transition-colors duration-500"></div>
                </div>
                <h3 className="text-xl font-serif font-bold text-navy mb-1">H.H. Asquith</h3>
                <p className="text-xs font-bold text-accent-brown uppercase tracking-wider mb-4">&quot;The Prime&quot;</p>
                <div className="space-y-4 text-sm text-slate leading-relaxed">
                    <p>
                        <strong>Role:</strong> Prime Minister of the UK (1908–1916).
                    </p>
                    <p>
                        <strong>The Obsession:</strong> By 1912, he had fallen obsessively in love with Venetia Stanley, describing her as his &quot;pole-star.&quot;
                    </p>
                    <p className="font-serif italic border-l-2 border-accent-brown/30 pl-3 text-muted-gray">
                        &quot;The scales dropped from my eyes...&quot;
                    </p>
                </div>
              </div>

              {/* Venetia */}
              <Link href="/venetia" className="block bg-card-bg border border-border-beige rounded-sm p-6 shadow-xl hover:shadow-2xl transition-all duration-500 scale-105 hover:scale-108 z-10 relative cursor-pointer group/link-card">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-red text-card-bg text-[10px] font-bold uppercase px-3 py-1 tracking-widest rounded-full shadow-md group-hover/link-card:bg-accent-red/90 group-hover/link-card:shadow-accent-red/20 transition-all">
                    The Center
                </div>
                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-sm bg-navy relative">
                  <img 
                    src={PEOPLE_IMAGES["Venetia Stanley"]} 
                    alt="Venetia Stanley"
                    className="w-full h-full object-cover sepia-[0.2] group-hover/link-card:sepia-0 group-hover/link-card:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-serif font-bold text-navy group-hover/link-card:text-accent-red transition-colors">Venetia Stanley</h3>
                    <ArrowRight className="w-4 h-4 text-accent-red opacity-0 group-hover/link-card:opacity-100 group-hover/link-card:translate-x-1 transition-all" />
                </div>
                <p className="text-xs font-bold text-accent-brown uppercase tracking-wider mb-4">The Muse</p>
                <div className="space-y-4 text-sm text-slate leading-relaxed">
                    <p>
                        <strong>Character:</strong> Noted for her &quot;masculine intellect,&quot; and an &quot;unsurprised&quot; quality that allowed her to absorb shocks.
                    </p>
                    <p className="font-serif italic border-l-2 border-accent-brown/30 pl-3 text-muted-gray">
                        &quot;Getting the maximum fun out of life.&quot;
                    </p>
                </div>
                <div className="mt-6 border-t border-border-beige/50 pt-4 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-red group-hover/link-card:tracking-[0.2em] transition-all duration-500">
                        Read Her Story
                    </span>
                </div>
              </Link>

              {/* Montagu */}
              <div className="bg-card-bg border border-border-beige rounded-sm p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group/card-m">
                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-sm bg-navy relative">
                  <img 
                    src={PEOPLE_IMAGES["Edwin Montagu"]} 
                    alt="Edwin Montagu"
                    className="w-full h-full object-cover grayscale group-hover/card-m:grayscale-0 group-hover/card-m:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-navy/10 group-hover/card-m:bg-transparent transition-colors duration-500"></div>
                </div>
                <h3 className="text-xl font-serif font-bold text-navy mb-1">Edwin Montagu</h3>
                <p className="text-xs font-bold text-accent-brown uppercase tracking-wider mb-4">&quot;The Assyrian&quot;</p>
                <div className="space-y-4 text-sm text-slate leading-relaxed">
                    <p>
                        <strong>Role:</strong> Financial Secretary; Asquith&apos;s former private secretary.
                    </p>
                    <p>
                        <strong>The Conflict:</strong> Desperately in love with Venetia, yet tortured by her lack of physical attraction to him.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The Letters */}
        <section className="bg-section-bg border-y border-border-beige py-16 md:py-20 group/letters">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 bg-navy text-card-bg rounded-full group-hover/letters:rotate-12 transition-transform duration-500">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-navy group-hover/letters:text-accent-brown transition-colors duration-500">The Letters (1912–1915)</h2>
                        <p className="text-muted-gray italic font-serif mt-1">The documentation of a national security nightmare.</p>
                        <div className="mt-3">
                            <Link href="/chapter?chapter_id=the_letters" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-brown hover:text-navy transition-colors group/link">
                                <span>Read Full Chapter</span>
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-6">
                        <div className="hover:bg-card-bg/40 p-4 rounded-sm transition-colors duration-300">
                            <h3 className="text-lg font-bold text-navy mb-2">The Volume</h3>
                            <p className="text-slate leading-relaxed">
                                Between 1912 and 1915, Asquith wrote Venetia hundreds of letters. In a single eight-month period in 1914, he calculated he had written no less than <strong>170 letters</strong>.
                            </p>
                        </div>
                        <div className="hover:bg-card-bg/40 p-4 rounded-sm transition-colors duration-300">
                            <h3 className="text-lg font-bold text-navy mb-2">State Secrets</h3>
                            <p className="text-slate leading-relaxed">
                                Asquith shared military information, including the shortage of shells, the Dardanelles strategy, and Cabinet infighting—often while sitting at the Cabinet table.
                            </p>
                        </div>
                    </div>

                    <div className="bg-card-bg p-6 rounded-sm border border-border-beige relative shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1">
                         <div className="absolute -top-3 -right-3 text-6xl text-navy/10 font-serif font-bold pointer-events-none transition-all duration-500 group-hover/letters:text-accent-brown/10">&quot;</div>
                        <h3 className="text-sm font-bold text-accent-brown uppercase tracking-wider mb-4 border-b border-accent-brown/20 pb-2">
                            A Note from the Cabinet
                        </h3>
                        <div className="space-y-4">
                            <p className="text-navy font-serif italic text-base leading-relaxed">
                                &quot;I am writing this at the Cabinet &amp; have to be careful... I was more than disappointed to find no letter! It came, at last – after I got back from the meeting – and was all that I could have wished for...&quot;
                            </p>
                            <p className="text-xs text-accent-brown font-bold uppercase tracking-widest text-right">
                                — September 4, 1914
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 4. The Crisis */}
        <section className="py-16 md:py-20 px-6 group/crisis">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2 relative">
                         <div className="aspect-video bg-navy flex items-center justify-center p-8 rounded-sm shadow-xl text-center transform group-hover/crisis:-rotate-1 transition-transform duration-700">
                            <div className="group-hover/crisis:scale-110 transition-transform duration-700">
                                <div className="text-accent-red font-black text-6xl md:text-7xl font-serif mb-2">May 12</div>
                                <div className="text-page-bg text-2xl font-serif tracking-widest uppercase">1915</div>
                            </div>
                         </div>
                         <div className="absolute -inset-2 border-2 border-accent-red/20 rounded-sm -z-10 group-hover/crisis:inset-0 transition-all duration-700"></div>
                    </div>
                    <div className="md:w-1/2 space-y-6">
                         <h2 className="text-3xl font-serif font-bold text-navy group-hover/crisis:text-accent-red transition-colors duration-500">The Crisis</h2>
                         <p className="text-muted-gray italic font-serif text-lg border-l-4 border-accent-red pl-4 group-hover/crisis:pl-6 transition-all duration-500">
                            How a broken heart may have toppled a government.
                         </p>
                         
                         <div className="space-y-4 text-slate leading-relaxed">
                            <p>
                                <strong>The Betrayal:</strong> Amidst the &quot;Shells Crisis&quot; and the failure of the Dardanelles, Venetia wrote to Asquith announcing her engagement to Edwin Montagu.
                            </p>
                            <p>
                                <strong>The Consequences:</strong> Asquith was &quot;absolutely broken-hearted.&quot; Within a week, he formed a Coalition government, ending the last Liberal administration.
                            </p>
                         </div>
                         <div className="pt-2">
                            <Link href="/chapter?chapter_id=venetia_engagement" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-red hover:text-accent-red/80 transition-colors group/link">
                                <span>Read Full Chapter</span>
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                         </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 5. The Aftermath */}
        <section className="bg-section-bg border-t border-border-beige py-16 px-6 group/aftermath">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 justify-center mb-10">
                    <BookOpen className="text-accent-brown group-hover/aftermath:scale-110 transition-transform duration-500" />
                    <h2 className="text-2xl font-serif font-bold text-navy">The Aftermath</h2>
                </div>
                
                <p className="text-navy font-serif text-lg leading-relaxed text-center mb-12 max-w-2xl mx-auto opacity-90 group-hover/aftermath:opacity-100 transition-opacity">
                    The marriage of Venetia and Edwin in July 1915 did not end the drama; it merely shifted the stage. The years following the &quot;Crisis of May&quot; were marked by political treachery and the slow decline of power.
                </p>

                <div className="space-y-10">
                    {/* The Political Rift */}
                    <div className="bg-card-bg p-8 rounded-sm border border-border-beige shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-navy mb-4 border-l-4 border-accent-red pl-4 group-hover/aftermath:pl-6 transition-all duration-500">
                            The Political Rift (1916–1917)
                        </h3>
                        <div className="space-y-4 text-slate leading-relaxed">
                            <p>
                                <strong>The Fall of Asquith:</strong> In December 1916, Asquith was forced out of the premiership by Lloyd George. Edwin Montagu, caught in the middle, tried desperately to mediate.
                            </p>
                            <p>
                                <strong>Margot’s Fury:</strong> Margot Asquith wrote that for a man to desert his fallen chief was an act of &quot;political suicide.&quot; She refused to see the Montagus for years.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <Link href="/chapter?chapter_id=after_breakup" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-brown hover:text-navy transition-colors group/link">
                            <span>Read Full Chapter</span>
                            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* 6. The Private World */}
        <section className="py-16 px-6 bg-navy text-page-bg relative overflow-hidden group/private">
             <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

             <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="text-accent-amber animate-pulse" />
                    <h2 className="text-2xl font-serif font-bold text-card-bg">The Private World: Obsession & Escape</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-card-bg/5 p-4 rounded-sm border border-card-bg/10 hover:bg-card-bg/10 transition-colors duration-500 hover:border-card-bg/20 group/pcard1">
                            <h4 className="font-bold text-accent-amber mb-2 group-hover/pcard1:translate-x-1 transition-transform">The Stolen Photographs</h4>
                            <p className="text-sm text-page-bg/80">
                                In September 1914, Asquith let himself into Venetia&apos;s parents&apos; house solely to &quot;steal&quot; two photographs of her from the table.
                            </p>
                        </div>
                        <div className="bg-card-bg/5 p-4 rounded-sm border border-card-bg/10 hover:bg-card-bg/10 transition-colors duration-500 hover:border-card-bg/20 group/pcard2">
                            <h4 className="font-bold text-accent-amber mb-2 group-hover/pcard2:translate-x-1 transition-transform">The &quot;Annus Mirabilis&quot;</h4>
                            <p className="text-sm text-page-bg/80">
                                While the world saw 1914 as a catastrophe, Asquith called it a &quot;miraculous year,&quot; noting he had hardly gone a day without seeing or writing to Venetia.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6">
                         <div className="bg-card-bg/5 p-4 rounded-sm border border-card-bg/10 hover:bg-card-bg/10 transition-colors duration-500 hover:border-card-bg/20 group/pcard3">
                            <h4 className="font-bold text-accent-amber mb-2 group-hover/pcard3:translate-x-1 transition-transform">The &quot;Pole-Star&quot;</h4>
                            <p className="text-sm text-page-bg/80">
                                Venetia displaced Asquith&apos;s &quot;little harem&quot; of younger favorites to become the person to whom he could write most freely about the most important things.
                            </p>
                        </div>
                         <div className="bg-card-bg/5 p-4 rounded-sm border border-card-bg/10 hover:bg-card-bg/10 transition-colors duration-500 hover:border-card-bg/20 group/pcard4">
                            <h4 className="font-bold text-accent-amber mb-2 group-hover/pcard4:translate-x-1 transition-transform">The Gift of &quot;Unsurprise&quot;</h4>
                            <p className="text-sm text-page-bg/80">
                                Asquith most valued Venetia&apos;s calm—a gift of &quot;unsurprise&quot; that allowed her to take any news, no matter how shocking, in her stride.
                            </p>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* Footer Link */}
        <div className="bg-page-bg py-16 text-center">
            <Link 
                href="/data-room" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-navy text-card-bg rounded-sm hover:bg-accent-red transition-all duration-500 shadow-lg hover:shadow-accent-red/20 font-serif group/cta"
            >
                <BarChart2 size={20} className="group-hover/cta:scale-110 group-hover/cta:rotate-3 transition-transform duration-500" />
                <span className="group-hover/cta:tracking-wider transition-all duration-500">Explore the Data Room</span>
                <ArrowRight size={18} className="opacity-0 group-hover/cta:opacity-100 group-hover/cta:translate-x-1 transition-all duration-500" />
            </Link>
        </div>
      </div>
    </div>
  );
}