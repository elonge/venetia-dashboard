"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, MessageSquare, Sparkles, BarChart2, ArrowRight } from "lucide-react";
import { PEOPLE_IMAGES } from "@/constants";

export default function EssentialsPage() {
  return (
    <div className="min-h-screen bg-[#E8E4DC]">
      <div className="mx-auto max-w-7xl">
        {/* 1. Hero Section */}
        <section className="w-full bg-[#1A2A40] py-16 md:py-24 relative overflow-hidden text-[#F5F0E8] rounded-none md:rounded-sm shadow-2xl mx-auto md:max-w-[calc(100%-3rem)] md:mb-12">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C24E42] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="inline-block border-b border-[#C24E42] pb-1 mb-6">
                <span className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-[#C24E42]">
                    The Essential Guide
                </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
              The Asquith-Stanley-Montagu Affair
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-serif italic text-[#D4CFC4] max-w-2xl mx-auto leading-relaxed">
              A guide to the most significant romantic triangle in British political history.
            </p>
          </div>
        </section>

        {/* 2. The Protagonists */}
        <section className="px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-[#1A2A40] mb-8 text-center flex items-center justify-center gap-4">
              <span className="h-[1px] w-12 bg-[#1A2A40]/20"></span>
              The Protagonists
              <span className="h-[1px] w-12 bg-[#1A2A40]/20"></span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Asquith */}
              <div className="bg-[#F5F0E8] border border-[#D4CFC4] rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-sm bg-[#1A2A40]">
                  <img 
                    src={PEOPLE_IMAGES["H.H. Asquith"]} 
                    alt="H.H. Asquith"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1A2A40] mb-1">H.H. Asquith</h3>
                <p className="text-xs font-bold text-[#8B4513] uppercase tracking-wider mb-4">&quot;The Prime&quot;</p>
                <div className="space-y-4 text-sm text-[#3A4A5A] leading-relaxed">
                    <p>
                        <strong>Role:</strong> Prime Minister of the UK (1908–1916).
                    </p>
                    <p>
                        <strong>The Obsession:</strong> By 1912, he had fallen obsessively in love with Venetia Stanley, describing her as his &quot;pole-star&quot; and &quot;life-buoy.&quot;
                    </p>
                    <p className="font-serif italic border-l-2 border-[#8B4513]/30 pl-3 text-[#5A6472]">
                        &quot;The scales dropped from my eyes...&quot;
                    </p>
                </div>
              </div>

              {/* Venetia */}
              <div className="bg-[#F5F0E8] border border-[#D4CFC4] rounded-sm p-6 shadow-xl transition-all scale-105 z-10 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C24E42] text-white text-[10px] font-bold uppercase px-3 py-1 tracking-widest rounded-full shadow-sm">
                    The Center
                </div>
                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-sm bg-[#1A2A40]">
                  <img 
                    src={PEOPLE_IMAGES["Venetia Stanley"]} 
                    alt="Venetia Stanley"
                    className="w-full h-full object-cover sepia-[0.2]"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1A2A40] mb-1">Venetia Stanley</h3>
                <p className="text-xs font-bold text-[#8B4513] uppercase tracking-wider mb-4">The Muse</p>
                <div className="space-y-4 text-sm text-[#3A4A5A] leading-relaxed">
                    <p>
                        <strong>Character:</strong> Noted for her &quot;masculine intellect,&quot; &quot;aquiline good looks,&quot; and an &quot;unsurprised&quot; quality that allowed her to absorb shocks without flinching.
                    </p>
                    <p className="font-serif italic border-l-2 border-[#8B4513]/30 pl-3 text-[#5A6472]">
                        &quot;Getting the maximum fun out of life.&quot;
                    </p>
                </div>
                <div className="mt-6">
                    <Link href="/venetia" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C24E42] hover:text-[#A0352A] transition-colors group/link">
                        <span>Read more about Venetia</span>
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
              </div>

              {/* Montagu */}
              <div className="bg-[#F5F0E8] border border-[#D4CFC4] rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[3/4] mb-6 overflow-hidden rounded-sm bg-[#1A2A40]">
                  <img 
                    src={PEOPLE_IMAGES["Edwin Montagu"]} 
                    alt="Edwin Montagu"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1A2A40] mb-1">Edwin Montagu</h3>
                <p className="text-xs font-bold text-[#8B4513] uppercase tracking-wider mb-4">&quot;The Assyrian&quot;</p>
                <div className="space-y-4 text-sm text-[#3A4A5A] leading-relaxed">
                    <p>
                        <strong>Role:</strong> Financial Secretary to the Treasury; Asquith&apos;s former private secretary.
                    </p>
                    <p>
                        <strong>The Conflict:</strong> Desperately in love with Venetia, yet tortured by her lack of physical attraction to him. He successfully pressured her to convert to Judaism.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The Letters */}
        <section className="bg-[#F5F0E8] border-y border-[#D4CFC4] py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 bg-[#1A2A40] text-white rounded-full">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-[#1A2A40]">The Letters (1912–1915)</h2>
                        <p className="text-[#5A6472] italic font-serif mt-1">The documentation of a national security nightmare.</p>
                        <div className="mt-3">
                            <Link href="/chapter?chapter_id=the_letters" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B4513] hover:text-[#1A2A40] transition-colors group/link">
                                <span>Read Full Chapter</span>
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-[#1A2A40] mb-2">The Volume</h3>
                            <p className="text-[#3A4A5A] leading-relaxed">
                                Between 1912 and 1915, Asquith wrote Venetia hundreds of letters. In a single eight-month period in 1914, he calculated he had written no less than <strong>170 letters</strong>. By early 1915, he was writing up to three times a day.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#1A2A40] mb-2">State Secrets</h3>
                            <p className="text-[#3A4A5A] leading-relaxed">
                                Asquith shared the most sensitive military information, including the shortage of shells, the Dardanelles strategy, and Cabinet infighting—often while sitting at the Cabinet table.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#E8E4DC] p-6 rounded-sm border border-[#D4CFC4] relative">
                         <div className="absolute -top-3 -right-3 text-6xl text-[#1A2A40]/10 font-serif font-bold pointer-events-none">&quot;</div>
                        <h3 className="text-sm font-bold text-[#8B4513] uppercase tracking-wider mb-4 border-b border-[#8B4513]/20 pb-2">
                            A Note from the Cabinet
                        </h3>
                        <div className="space-y-4">
                            <p className="text-[#1A2A40] font-serif italic text-base leading-relaxed">
                                &quot;I am writing this at the Cabinet &amp; have to be careful... I was more than disappointed to find no letter! It came, at last – after I got back from the meeting – and was all that I could have wished for... Lucky or not, I should certainly have put my fortune to the test... had I not been absorbed in this hellish business.&quot;
                            </p>
                            <p className="text-xs text-[#8B4513] font-bold uppercase tracking-widest text-right">
                                — September 4, 1914
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 4. The Crisis */}
        <section className="py-16 md:py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2 relative">
                         <div className="aspect-video bg-[#1A2A40] flex items-center justify-center p-8 rounded-sm shadow-xl text-center">
                            <div>
                                <div className="text-[#C24E42] font-black text-6xl md:text-7xl font-serif mb-2">May 12</div>
                                <div className="text-[#F5F0E8] text-2xl font-serif tracking-widest uppercase">1915</div>
                            </div>
                         </div>
                    </div>
                    <div className="md:w-1/2 space-y-6">
                         <h2 className="text-3xl font-serif font-bold text-[#1A2A40]">The Crisis</h2>
                         <p className="text-[#5A6472] italic font-serif text-lg border-l-4 border-[#C24E42] pl-4">
                            How a broken heart may have toppled a government.
                         </p>
                         
                         <div className="space-y-4 text-[#3A4A5A] leading-relaxed">
                            <p>
                                <strong>The Betrayal:</strong> Amidst the &quot;Shells Crisis&quot; and the failure of the Dardanelles, Venetia wrote to Asquith announcing her engagement to Edwin Montagu.
                            </p>
                            <p>
                                <strong>The Consequences:</strong> Asquith was &quot;absolutely broken-hearted.&quot; Within a week, he formed a Coalition government, ending the last Liberal administration.
                            </p>
                         </div>
                         <div className="pt-2">
                            <Link href="/chapter?chapter_id=venetia_engagement" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C24E42] hover:text-[#A0352A] transition-colors group/link">
                                <span>Read Full Chapter</span>
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                         </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 5. The Aftermath */}
        <section className="bg-[#F5F0E8] border-t border-[#D4CFC4] py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 justify-center mb-10">
                    <BookOpen className="text-[#8B4513]" />
                    <h2 className="text-2xl font-serif font-bold text-[#1A2A40]">The Aftermath</h2>
                </div>
                
                <p className="text-[#1A2A40] font-serif text-lg leading-relaxed text-center mb-12 max-w-2xl mx-auto">
                    The marriage of Venetia and Edwin in July 1915 did not end the drama; it merely shifted the stage. The years following the &quot;Crisis of May&quot; were marked by political treachery and the slow decline of power.
                </p>

                <div className="space-y-10">
                    {/* The Political Rift */}
                    <div>
                        <h3 className="text-xl font-bold text-[#1A2A40] mb-4 border-l-4 border-[#C24E42] pl-4">
                            The Political Rift (1916–1917)
                        </h3>
                        <div className="space-y-4 text-[#3A4A5A] leading-relaxed">
                            <p>
                                <strong>The Fall of Asquith:</strong> In December 1916, Asquith was forced out of the premiership by Lloyd George. Edwin Montagu, caught in the middle, tried desperately to mediate to keep Asquith in a coalition.
                            </p>
                            <p>
                                <strong>Margot’s Fury:</strong> Margot Asquith wrote that for a man to desert his fallen chief was an act of &quot;political suicide.&quot; She refused to see the Montagus for years.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <Link href="/chapter?chapter_id=after_breakup" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B4513] hover:text-[#1A2A40] transition-colors group/link">
                            <span>Read Full Chapter</span>
                            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* 6. The Private World */}
        <section className="py-16 px-6 bg-[#1A2A40] text-[#F5F0E8] relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

             <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="text-[#F6E39A]" />
                    <h2 className="text-2xl font-serif font-bold text-[#F5F0E8]">The Private World: Obsession & Escape</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                            <h4 className="font-bold text-[#F6E39A] mb-2">The Stolen Photographs</h4>
                            <p className="text-sm text-gray-300">
                                In September 1914, Asquith let himself into Venetia&apos;s parents&apos; house at 18 Mansfield Street solely to &quot;steal&quot; two photographs of her from the table.
                            </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                            <h4 className="font-bold text-[#F6E39A] mb-2">The &quot;Annus Mirabilis&quot;</h4>
                            <p className="text-sm text-gray-300">
                                While the world saw 1914 as a catastrophe, Asquith called it a &quot;miraculous year,&quot; noting he had hardly gone a day without seeing or writing to Venetia.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6">
                         <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                            <h4 className="font-bold text-[#F6E39A] mb-2">The &quot;Pole-Star&quot;</h4>
                            <p className="text-sm text-gray-300">
                                Venetia displaced Asquith&apos;s &quot;little harem&quot; of younger favorites to become the person to whom he could write most freely about the most important things.
                            </p>
                        </div>
                         <div className="bg-white/5 p-4 rounded-sm border border-white/10">
                            <h4 className="font-bold text-[#F6E39A] mb-2">The Gift of &quot;Unsurprise&quot;</h4>
                            <p className="text-sm text-gray-300">
                                Asquith most valued Venetia&apos;s calm—a gift of &quot;unsurprise&quot; that allowed her to take any news, no matter how shocking, in her stride.
                            </p>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* Footer Link */}
        <div className="bg-[#E8E4DC] py-12 text-center">
            <Link 
                href="/data-room" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A2A40] text-white rounded-sm hover:bg-[#2D3648] transition-colors shadow-lg font-serif group"
            >
                <BarChart2 size={18} className="group-hover:scale-110 transition-transform" />
                <span>Explore the Data Room</span>
            </Link>
        </div>
      </div>
    </div>
  );
}