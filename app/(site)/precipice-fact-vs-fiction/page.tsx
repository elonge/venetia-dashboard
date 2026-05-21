"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useChatVisibility } from "@/components/chat/useChatVisibility";
import { ArrowRight, BookOpen, ExternalLink, Info, List } from "lucide-react";

type RelatedChapterLinkProps = {
  href: string;
  chapterTitle: string;
};

type InlineArchiveFigureProps = {
  src: string;
  alt: string;
  caption: string;
};

type QuestionHeadingProps = {
  children: React.ReactNode;
};

function RelatedChapterLink({ href, chapterTitle }: RelatedChapterLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold leading-snug text-accent-brown transition-colors duration-200 hover:text-navy"
    >
      <ArrowRight size={15} className="shrink-0" />
      <span>{chapterTitle}</span>
    </Link>
  );
}

function InlineArchiveFigure({ src, alt, caption }: InlineArchiveFigureProps) {
  return (
    <figure className="not-prose my-8 md:my-10 w-full">
      <img
        src={src}
        alt={alt}
        className="block w-full h-auto rounded-sm shadow-lg object-cover sepia-[0.25] contrast-105 grayscale-[0.15]"
      />
      <figcaption className="mt-2 text-sm italic text-stone-500">
        {caption}
      </figcaption>
    </figure>
  );
}

function QuestionHeading({ children }: QuestionHeadingProps) {
  return (
    <h3 className="text-[1.75rem] md:text-[1.95rem] font-serif font-semibold leading-tight text-accent-brown mb-4">
      {children}
    </h3>
  );
}

const HistoricalDivider = ({ icon = 'nib' }: { icon?: 'nib' | 'flourish' | 'ink' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (dividerRef.current) {
      observer.observe(dividerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={dividerRef}
      className={`flex items-center justify-center py-12 transition-all duration-1000 transform ${
        isVisible ? "opacity-40 translate-y-0" : "opacity-0 translate-y-4"
      } text-stone-900`}
    >
      <div className="h-px w-12 bg-current hidden md:block opacity-50 mr-4"></div>
      <div className="text-current">
        {icon === 'nib' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C12 2 4.5 9 4.5 15C4.5 19.5 7.5 22 12 22C16.5 22 19.5 19.5 19.5 15C19.5 9 12 2 12 2Z" />
            <path d="M12 2V13" />
            <path d="M12 22C12 22 10 18 10 15" />
            <path d="M12 22C12 22 14 18 14 15" />
          </svg>
        )}
        {icon === 'flourish' && (
           <svg width="42" height="14" viewBox="0 0 42 14" fill="none" stroke="currentColor" strokeWidth="1">
             <path d="M21 7C26 7 28 2 33 2C38 2 41 5 41 7C41 9 38 12 33 12C28 12 26 7 21 7Z" />
             <path d="M21 7C16 7 14 2 9 2C4 2 1 5 1 7C1 9 4 12 9 12C14 12 16 7 21 7Z" />
             <circle cx="21" cy="7" r="1.5" fill="currentColor" stroke="none"/>
           </svg>
        )}
        {icon === 'ink' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 20H19V14C19 14 19 10 16 8V5H8V8C5 10 5 14 5 14V20Z" />
            <path d="M12 15L15 3" /> 
            <path d="M8 20L5 22" />
            <path d="M16 20L19 22" />
          </svg>
        )}
      </div>
      <div className="h-px w-12 bg-current hidden md:block opacity-50 ml-4"></div>
    </div>
  );
};

export default function PrecipiceFactVsFictionPage() {
  useChatVisibility(false);
  const [activeId, setActiveId] = useState<string>("");

  const sections = [
    { id: "true-story", title: "True Story?" },
    { id: "letters-real", title: "The Letters" },
    { id: "paul-deemer", title: "Paul Deemer" },
    { id: "conversion", title: "The Conversion" },
    { id: "shells-scandal", title: "The Shells Scandal" },
    { id: "affair-physical", title: "The Affair" },
    { id: "secret-codes", title: "Secret Codes" },
    { id: "car-window", title: "Car Window Secrets" },
    { id: "cabinet-meetings", title: "Cabinet Meetings" },
    { id: "reply-advice", title: "Her Advice" },
    { id: "after-the-book", title: "What Happened After" },
    { id: "nurse-painting", title: "The Nurse Painting" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <div className="h-full bg-page-bg relative">
      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
        
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-12 space-y-8">
            <div className="flex items-center gap-2 text-stone-400 uppercase tracking-widest text-[10px] font-bold border-b border-stone-200 pb-4">
              <List size={14} />
              <span>Frequently Asked Questions</span>
            </div>
            <nav className="flex flex-col gap-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`text-left text-sm transition-all duration-300 hover:text-accent-green cursor-pointer ${
                    activeId === section.id 
                      ? "text-accent-green font-bold translate-x-1" 
                      : "text-stone-500 font-medium"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
            <div className="pt-8">
               <Link href="/" className="group flex items-center gap-2 text-xs font-bold text-navy hover:text-accent-green transition-colors">
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 Start exploring the archive
               </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="max-w-3xl flex-1">
          <div className="prose prose-lg prose-p:text-navy prose-headings:text-navy prose-li:text-slate">
            
            <header className="mb-12">
              <div className="flex flex-col gap-7 md:flex-row md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4 text-accent-brown uppercase tracking-widest text-xs font-bold">
                    <BookOpen size={14} />
                    <span>Historical Guide</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">
                    Is 'Precipice' a True Story? The Robert Harris Novel, Fact-Checked
                  </h1>
                  <p className="text-xl text-navy/80 font-serif italic">
                    A guide to the historical reality behind the characters and events in Robert Harris&apos;s 2024 novel.
                  </p>
                  <p className="mt-4 text-base italic text-navy/85">
                    The Venetia Project is a digital archive and audio series dedicated to the real letters between H.H. Asquith and Venetia Stanley. Below, we fact-check Robert Harris&apos;s novel against the primary sources.
                  </p>
                </div>
                <figure className="not-prose w-full md:w-[140px] md:shrink-0 border-4 border-[#FDFBF7] shadow-md">
                  <img
                    src="/venetia-without-clementine.png"
                    alt="Portrait of Venetia Stanley"
                    className="block w-full h-auto rounded-sm shadow-lg sepia-[0.25] contrast-105 grayscale-[0.15]"
                  />
                  <figcaption className="mt-2 text-sm italic text-stone-500">
                    Venetia Stanley c. 1912.
                  </figcaption>
                </figure>
              </div>
            </header>

            <div className="space-y-12">
              <section id="true-story" className="scroll-mt-20">
                <h2 className="text-[1.75rem] md:text-[1.95rem] font-serif font-semibold leading-tight text-accent-brown mb-4">
                  Is Precipice by Robert Harris based on a true story?
                </h2>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Yes, but it is historical fiction.</p>
                  <p className="m-0">
                    Robert Harris built <span className="italic">Precipice</span> around real people and documented events, especially the letters between Prime Minister H.H. Asquith and Venetia Stanley.
                  </p>
                </div>
                <p>
                  This page separates what is historically verified from what is dramatized for the novel.
                </p>
              </section>

              <HistoricalDivider icon="ink" />

              <section id="letters-real" className="scroll-mt-20">
                <QuestionHeading>
                  Are the Asquith-Venetia Stanley Letters Real?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Yes, and they are even more extraordinary than the novel suggests.</p>
                  <p className="m-0">
                    H.H. Asquith wrote to Venetia Stanley up to three times a day, often while sitting at the Cabinet table. Over 500 of these letters survive.
                  </p>
                </div>
                <p>
                  What makes <span className="italic">Precipice</span> so compelling is that Harris uses many of Asquith&apos;s actual words. The Prime Minister really did share top-secret telegrams, discussed the movements of the fleet, and revealed the inner workings of his Cabinet to a woman half his age. 
                </p>
                <Link
                  href="/venetia"
                  className="mt-5 inline-flex items-center gap-2 rounded-sm border border-accent-green/35 bg-accent-green px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_10px_24px_rgba(61,102,73,0.26)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2f523a]"
                >
                  Learn more about Venetia
                  <ArrowRight size={14} />
                </Link>
              </section>

              <HistoricalDivider icon="nib" />

              <section id="paul-deemer" className="scroll-mt-20">
                <QuestionHeading>
                  Was Paul Deemer a Real Person?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: No.</p>
                  <p className="m-0">
                    Paul Deemer, the young intelligence officer who intercepts the letters in <span className="italic">Precipice</span>, is a fictional creation. While the surveillance of mail was a reality during WWI, Deemer himself and his specific role in the story are invented by Harris to provide a narrative lens through which we view the affair.
                  </p>
                  <p>
                    However, Harris bases the <em>practice</em> of letter interception on historical reality. The Home Office and military intelligence did monitor communications, especially as the &quot;Shells Scandal&quot; and political leaks became a matter of national security.
                  </p>
                </div>
                <RelatedChapterLink href="/chapter/secrets" chapterTitle="Explore the secrets that PM Asquith shared with Venetia Stanley" />
              </section>

              <HistoricalDivider icon="flourish" />

              <section id="conversion" className="scroll-mt-20">
                <QuestionHeading>
                  Why did Venetia Stanley Convert to Judaism?
                </QuestionHeading>
                <p>
                  In 1915, Venetia Stanley shocked Asquith and her social circle by announcing her engagement to Edwin Montagu, a Jewish Cabinet minister and one of Asquith&apos;s protégés. 
                </p>
                <p>
                  The conversion was a legal and family requirement. Edwin&apos;s father, Lord Swaythling, had left a will that disinherited any of his children who married outside the Jewish faith or failed to remain &quot;professing Jews.&quot; To marry Edwin and preserve his inheritance (and social standing), Venetia underwent a formal conversion.
                </p>
                <InlineArchiveFigure
                  src="/venetia_marriage.png"
                  alt="Venetia Stanley and Edwin Montagu on their wedding day in 1915"
                  caption="Venetia Stanley and Edwin Montagu on their wedding day in 1915."
                />
                <div className="flex items-start gap-4 p-4 bg-stone-100 rounded-sm">
                  <Info className="text-stone-400 shrink-0 mt-1" size={20} />
                  <p className="text-sm text-stone-600 m-0 italic">
                    Historians often debate whether Venetia married Edwin out of love, or as a desperate &quot;escape hatch&quot; from the overwhelming intensity of Asquith&apos;s obsession.
                  </p>
                </div>
                <RelatedChapterLink href="/chapter/jewish-conversion" chapterTitle="Read more about Venetia's Engagement to Edwin Montagu" />
              </section>

            <div className="my-16 md:my-20 bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30">
              <h3 className="text-[16px] font-semibold uppercase tracking-[0.32em] text-slate">
                COMPANION AUDIO SERIES
              </h3>
              <p className="mt-2 mb-3 text-base italic leading-relaxed text-slate/90">
                Press play to hear the true story about the letters, the affair, and the historical context that inspired Robert Harris&apos;s novel.
              </p>
              <div className="overflow-hidden border border-border-beige/70 bg-card-bg rounded-2xl shadow-md">
                <iframe
                  src="https://open.spotify.com/embed/playlist/1VQRZpMOAQKyG2UHA1l4oP?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  allowFullScreen={false}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
              </div>
              <HistoricalDivider icon="ink" />

              <section id="shells-scandal" className="scroll-mt-10">
                <QuestionHeading>
                  The Shells Scandal and the 1915 Government Collapse
                </QuestionHeading>
                <p>
                  The &quot;Shells Scandal&quot; depicted in the book—where the <span className="italic">Daily Mail</span> exposed a desperate shortage of munitions on the Front—is entirely historical. 
                </p>
                <p>
                  The crisis, combined with the resignation of Admiral Lord Fisher over the Dardanelles (Gallipoli) campaign, forced Asquith to dissolve his Liberal government and form a Coalition. This moment marked the beginning of the end for the traditional Liberal Party and is a central pivot point in <span className="italic">Precipice</span>.
                </p>
                <RelatedChapterLink href="/chapter/shells-scandal" chapterTitle="Read more about the Shells Scandal" />
              </section>

              <HistoricalDivider icon="flourish" />

              <section id="affair-physical" className="scroll-mt-20">
                <QuestionHeading>
                  Was the affair physical?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: We don't know for sure.</p>
                  <p className="m-0">
                    Most historians believe the relationship was deeply emotional but likely not physical in the modern sense. Asquith was known for &quot;hand-holding&quot; and being physically affectionate in a way that would be seen as inappropriate today, but the letters suggest a man who was &quot;in love&quot; with an idea and a confidante rather than a physical mistress.
                  </p>
                </div>
                <InlineArchiveFigure
                  src="/napier.webp"
                  alt="A Napier car from the early 20th century"
                  caption="A Napier 1908 car like this one was the setting for some of the most intimate moments in the letters."
                />
                <p>
                  Harris&apos;s novel explores the tension and the potential for a more scandalous connection, but stays largely within the bounds of the historical ambiguity that exists in the letters.
                </p>
                <RelatedChapterLink href="/chapter/friday-drives" chapterTitle="Read more about PM Asquith and Venetia Stanley's Friday drives" />
              </section>

              <HistoricalDivider icon="nib" />

              <section id="secret-codes" className="scroll-mt-20">
                <QuestionHeading>
                  Did Asquith share secret codes?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Yes.</p>
                  <p className="m-0">
                    Asquith enclosed &quot;flimsies&quot; (carbon copies of secret telegrams) and reported the contents of &quot;The Box&quot; (Cabinet papers) to Venetia.
                  </p>
                <p>
                  In one instance, he even asked her for advice on whether to go ahead with the Dardanelles expedition. His obsession with her was so great that he prioritized his correspondence with her over his duty to keep state secrets.
                </p>
                </div>
                <RelatedChapterLink href="/chapter/secrets" chapterTitle="Read more about the secrets that PM Asquith shared with Venetia Stanley" />
              </section>

              <HistoricalDivider icon="flourish" />

              <section id="car-window" className="scroll-mt-20">
                <QuestionHeading>
                  Did Asquith really throw secrets out of a car window?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Yes.</p>
                  <p className="m-0">
                    Prime Minister H.H. Asquith did throw secret documents out of a car window, an incident he admitted to in a private letter to Venetia Stanley.                    
                  </p>
                </div>
                <blockquote className="bg-[#E3E8ED] shadow-sm border-l-4 border-stone-400 rounded-sm p-4 text-navy/90 italic shadow-sm">
                  <p className="m-0 text-2xl">
                    Do you remember remembering with me for throwing out of the window that little rolled up ball of 'flimsy' as we drove thro' Roehampton lane on Sat?
                  </p>
                  <footer className="mt-3 text-xs font-semibold uppercase tracking-widest text-stone-500 not-italic">
                    Aug. 18, 1914 — Asquith to Venetia
                  </footer>
                </blockquote>
              </section>

              <HistoricalDivider icon="ink" />

              <section id="cabinet-meetings" className="scroll-mt-20">
                <QuestionHeading>
                  Did he write during Cabinet meetings?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Yes.</p>
                  <p className="m-0">
                    H.H. Asquith frequently wrote personal letters, particularly to Venetia Stanley, during official government meetings. Biographers and historians analyzing his correspondence have identified that out of a collection of 425 letters, at least 15 were written in part while Asquith was "on duty": 4 during Cabinet discussions, 3 during committee meetings, 1 during a Committee of Imperial Defence meeting, 1 during a War Council session, and 6 from the Treasury Bench in the House of Commons
                  </p>
                </div>
                <RelatedChapterLink href="/chapter/the-letters" chapterTitle="Read more about the Asquith-Stanley Letters" />
              </section>

              <HistoricalDivider icon="nib" />

              <section id="reply-advice" className="scroll-mt-20">
                <QuestionHeading>
                  Did she really reply with advice?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Most likely, but we don&apos;t have her letters.</p>
                  <p className="m-0">
                    Venetia&apos;s replies from these years are largely missing, so we don&apos;t have her words directly.
                  </p>
                </div>
                <InlineArchiveFigure
                  src="/manual_Jan._13_1915.png"
                  alt="An excerpt from one of Asquith's letters to Venetia, dated Jan. 13, 1915"
                  caption="An excerpt from one of Asquith's letters to Venetia, dated Jan. 13, 1915."
                />
                <p>
                  Asquith&apos;s letters frequently reference her opinions and occasionally ask for guidance, which suggests she did offer advice—even if we only see it reflected in his responses.
                </p>
                <Link
                  href="/lab"
                  className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold leading-snug text-accent-brown transition-colors duration-200 hover:text-navy"
                >
                  Check out how we reconstruct three of Venetia Stanley's lost letters to H.H. Asquith by analyzing his responses.
                </Link>
              </section>

              <HistoricalDivider icon="ink" />

              <section id="after-the-book" className="scroll-mt-20">
                <QuestionHeading>
                  What happened to Venetia Stanley after the book?
                </QuestionHeading>
                <p>
                  Following her marriage to Edwin Montagu in 1915, Venetia moved away from the center of Asquith&apos;s world. She and Edwin had one daughter, Judith, though rumors persisted that Judith&apos;s biological father might have been someone else (possibly William Humble Ward, 2nd Earl of Dudley).
                </p>
                <InlineArchiveFigure
                  src="/venetia_and_her_daughter.jpg"
                  alt="Venetia Stanley with her daughter Judith"
                  caption="Venetia Stanley with her daughter Judith."
                />
                <p>
                  After Edwin&apos;s early death in 1924, Venetia lived a colorful, independent life, traveling widely and remaining a fixture in British social circles until her death in 1948.
                </p>
                <RelatedChapterLink href="/chapter/after-breakup" chapterTitle="Read more about Venetia Stanley's life after announcing her engagement to Edwin Montagu" />
              </section>

              <HistoricalDivider icon="flourish" />

              <section id="nurse-painting" className="scroll-mt-20">
                <QuestionHeading>
                  Is the painting of Venetia Stanley as a nurse real?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: The attribution is uncertain.</p>
                  <p className="m-0">
                    It&apos;s often linked to Venetia, but the identification isn&apos;t consistently sourced.
                  </p>
                  <p>
                    The painting is frequently associated with Venetia in modern reproductions, but the attribution is not uniformly sourced across references.
                  </p>
                  <p>
                    The safest framing is that it captures the wartime mood around her, while remaining an uncertain identification rather than a confirmed portrait.
                  </p>
                </div>
                <InlineArchiveFigure
                  src="/venetia_nurse.jpeg"
                  alt="Painting often associated with Venetia Stanley's when she was in nursing school."
                  caption="Painting often associated with Venetia Stanley's when she was in nursing school."
                />
                <RelatedChapterLink href="/chapter/venetia-nurse" chapterTitle="Read more about Venetia Stanley's time as a nurse" />
              </section>

              <section className="bg-navy text-white p-8 rounded-sm mt-16">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">
                  Beyond the Novel: Six Untold Stories from the Archive
                </h2>
                <p className="text-white/80 mb-6">
                  If you finished Robert Harris&apos;s <span className="italic">Precipice</span> and want to know what the history books (and novels) left out, join us at{" "}
                </p>
                <a 
                  href={process.env.NEXT_PUBLIC_SUBSTACK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent-amber text-navy px-6 py-3 rounded-sm font-bold hover:bg-white transition-colors"
                >
                  Read on Substack <ExternalLink size={18} />
                </a>
              </section>

            </div>

            <footer className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-stone-200 text-center md:text-left">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">
                Researching &quot;Precipice&quot; and Asquith
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Link href="/archive_search" className="p-4 bg-stone-50 rounded-sm hover:bg-stone-100 transition-colors border border-stone-200 group flex flex-col items-center md:items-start gap-1">
                  <span className="block font-bold text-navy group-hover:text-accent-green">Search the Archive</span>
                  <span className="text-xs text-stone-500 font-sans">Verify the historical letters yourself.</span>
                </Link>
                <Link href="/about" className="p-4 bg-stone-50 rounded-sm hover:bg-stone-100 transition-colors border border-stone-200 group flex flex-col items-center md:items-start gap-1">
                  <span className="block font-bold text-navy group-hover:text-accent-green">Our Methodology</span>
                  <span className="text-xs text-stone-500 font-sans">How we used AI to reconstruct this history.</span>
                </Link>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}
