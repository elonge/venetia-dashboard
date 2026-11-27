"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Info, List } from "lucide-react";
import BooksCard from "@/components/sisi/BooksCard";

type RelatedPageLinkProps = {
  href: string;
  linkTitle: string;
};

type QuestionHeadingProps = {
  children: React.ReactNode;
};

function RelatedPageLink({ href, linkTitle }: RelatedPageLinkProps) {
  return (
    <Link
      href={href}
      className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold leading-snug text-accent-brown transition-colors duration-200 hover:text-navy"
    >
      <ArrowRight size={15} className="shrink-0" />
      <span>{linkTitle}</span>
    </Link>
  );
}

function QuestionHeading({ children }: QuestionHeadingProps) {
  return (
    <h3 className="text-[1.75rem] md:text-[1.95rem] font-serif font-semibold leading-tight text-accent-brown mb-4">
      {children}
    </h3>
  );
}

const HistoricalDivider = ({ icon = "nib" }: { icon?: "nib" | "flourish" | "ink" }) => {
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
        {icon === "nib" && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C12 2 4.5 9 4.5 15C4.5 19.5 7.5 22 12 22C16.5 22 19.5 19.5 19.5 15C19.5 9 12 2 12 2Z" />
            <path d="M12 2V13" />
            <path d="M12 22C12 22 10 18 10 15" />
            <path d="M12 22C12 22 14 18 14 15" />
          </svg>
        )}
        {icon === "flourish" && (
          <svg
            width="42"
            height="14"
            viewBox="0 0 42 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M21 7C26 7 28 2 33 2C38 2 41 5 41 7C41 9 38 12 33 12C28 12 26 7 21 7Z" />
            <path d="M21 7C16 7 14 2 9 2C4 2 1 5 1 7C1 9 4 12 9 12C14 12 16 7 21 7Z" />
            <circle cx="21" cy="7" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        )}
        {icon === "ink" && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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

const SECTIONS = [
  { id: "true-story", title: "True Story?" },
  { id: "andrassy-affair", title: "Sisi & Andrássy" },
  { id: "marie-valerie-paternity", title: "Marie Valerie's Father" },
  { id: "franz-terese-twins", title: "Terese & the Twins" },
  { id: "corfu-retreat", title: "Escape to Corfu" },
  { id: "surviving-letters", title: "The Real Letters" },
  { id: "ida-ferenczy", title: "Ida Ferenczy" },
  { id: "locked-in-rooms", title: "Confined to Her Rooms" },
  { id: "hungary-1867", title: "The 1867 Coronation" },
  { id: "maximilian-adopted-son", title: "Maximilian's Adopted Son" },
  { id: "smissen-child-plan", title: "Charlotte & Smissen" },
  { id: "maximilian-mexico", title: "Maximilian in Mexico" },
];

export default function TheEmpressFactVsFictionPage() {
  const [activeId, setActiveId] = useState<string>("");

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

    SECTIONS.forEach((section) => {
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
        block: "start",
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
              {SECTIONS.map((section) => (
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
            <div className="pt-8 space-y-3 border-t border-stone-200">
              <Link
                href="/sisi/after-1867"
                className="group flex items-center gap-2 text-xs font-bold text-navy hover:text-accent-green transition-colors"
              >
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                What happened to Sisi after 1867?
              </Link>
              <Link
                href="/sisi/timeline"
                className="group flex items-center gap-2 text-xs font-bold text-navy hover:text-accent-green transition-colors"
              >
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                Timeline of Elisabeth&apos;s Life
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="max-w-3xl min-w-0 flex-1">
          <div className="prose prose-lg prose-p:text-navy prose-headings:text-navy prose-li:text-slate">
            <header className="mb-12">
              <div className="flex flex-col gap-7 md:flex-row md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4 text-accent-brown uppercase tracking-widest text-xs font-bold">
                    <BookOpen size={14} />
                    <span>Historical Guide • Archive Case Study</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">
                    Is Netflix&apos;s &apos;The Empress&apos; Season 3 a True Story? Fact vs. Fiction
                  </h1>
                  <p className="text-xl text-navy/80 font-serif italic">
                    A primary-source check of the final season&apos;s affairs, political crises, and Habsburg family drama.
                  </p>
                  <div className="mt-5 p-4 bg-stone-100/90 border-l-2 border-accent-brown text-sm text-navy/85 not-italic">
                    <span className="font-bold text-navy">Why is this on The Venetia Project?</span>{" "}
                    Like Venetia Stanley in 1914 Britain, Empress Elisabeth of Austria is a woman whose private life was turned into myth by later retellings—and whose own side of her correspondence largely disappeared. Just as we check Robert Harris&apos;s{" "}
                    <Link href="/precipice-fact-vs-fiction" className="underline hover:text-accent-brown">
                      Precipice
                    </Link>{" "}
                    against H.H. Asquith&apos;s letters, here we test Netflix&apos;s{" "}
                    <span className="italic">The Empress</span> against surviving Habsburg archives.
                  </div>
                </div>
                <figure className="not-prose w-full md:w-[150px] md:shrink-0 border-4 border-[#FDFBF7] shadow-md">
                  <Image
                    src="/sisi/elisabeth-1867.jpg"
                    alt="Empress Elisabeth of Austria around 1867"
                    width={1405}
                    height={1885}
                    sizes="(min-width: 768px) 150px, 100vw"
                    className="block w-full h-auto rounded-sm shadow-lg sepia-[0.25] contrast-105 grayscale-[0.15]"
                  />
                  <figcaption className="mt-2 text-sm italic text-stone-500">
                    Empress Elisabeth c. 1867.
                  </figcaption>
                </figure>
              </div>
            </header>

            <div className="space-y-12">
              <section id="true-story" className="scroll-mt-20">
                <h2 className="text-[1.75rem] md:text-[1.95rem] font-serif font-semibold leading-tight text-accent-brown mb-4">
                  Is Netflix&apos;s The Empress Season 3 based on a true story?
                </h2>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: The political milestones are real; the romantic triangles are largely invented.
                  </p>
                  <p className="m-0">
                    Season 3 compresses eight turbulent years (1859–1867) into six episodes—anchoring its plot in Austria&apos;s defeat at Solferino, Elisabeth&apos;s medical exile, the Hungarian Compromise of 1867, and Archduke Maximilian&apos;s execution in Mexico, while inventing physical affairs for both Franz Joseph and Elisabeth.
                  </p>
                </div>
                <p>
                  Below, we separate documented Habsburg history from the show&apos;s dramatic license.
                </p>
                <BooksCard placement="intro" variant="inline" context="fact-vs-fiction"/>
              </section>

              <HistoricalDivider icon="ink" />

              <section id="andrassy-affair" className="scroll-mt-20">
                <QuestionHeading>
                  Did Empress Elisabeth Have an Affair with Count Gyula Andrássy?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: No. Historians agree their relationship was political and platonic, not physical.
                  </p>
                  <p className="m-0">
                    In Season 3, Elisabeth meets the exiled Hungarian statesman Count Gyula Andrássy in Venice and later begins a physical affair with him in Buda. In reality, they first met in January 1866 when a Hungarian delegation visited Vienna, and surviving letters confirm an intense political alliance rather than a romance.
                  </p>
                </div>
                <p>
                  Viennese aristocrats who resented Elisabeth&apos;s pro-Hungarian lobbying did spread malicious rumors that she and Andrássy were lovers. Modern biographers—most notably Brigitte Hamann—note that Elisabeth was fiercely guarded about physical intimacy and channeled her devotion to Andrássy into securing constitutional autonomy for Hungary.
                </p>
              </section>

              <HistoricalDivider icon="nib" />

              <section id="marie-valerie-paternity" className="scroll-mt-20">
                <QuestionHeading>
                  Was Count Andrássy the Real Father of Archduchess Marie Valerie?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: No—that was contemporary court gossip, rejected by historians.
                  </p>
                  <p className="m-0">
                    The Season 3 finale closes with Elisabeth announcing a pregnancy right after her affair with Andrássy, strongly hinting at the historical rumor surrounding her youngest daughter, Archduchess Marie Valerie (born in Buda in April 1868).
                  </p>
                </div>
                <p>
                  Because Marie Valerie was conceived shortly after the 1867 Hungarian coronation and born in Hungary rather than Vienna, anti-Hungarian courtiers nicknamed her &quot;the Hungarian child&quot; and whispered that Andrássy was her father. In reality, Marie Valerie grew up bearing an unmistakable physical resemblance to Franz Joseph, and no credible historical evidence supports the rumor.
                </p>
                <RelatedPageLink
                  href="/sisi/after-1867"
                  linkTitle="Read what happened to Elisabeth and Marie Valerie after 1867"
                />
              </section>

              <HistoricalDivider icon="flourish" />

              <section id="franz-terese-twins" className="scroll-mt-20">
                <QuestionHeading>
                  Did Franz Joseph Have a Mistress Named Terese and Secret Twin Sons?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: No. Terese and the twin boys are fictional creations.
                  </p>
                  <p className="m-0">
                    In Season 3, a traumatized Franz Joseph returns from the 1859 war, begins an affair with a woman named Terese, and secretly supports her after she gives birth to twin sons. Neither Terese nor those twin sons existed in the historical record.
                  </p>
                </div>
                <p>
                  Franz Joseph was not entirely faithful over his 44-year marriage—historians document discreet liaisons later in life, including a long-running affair with Anna Nahowski in the 1870s and 1880s (whose daughter Helene Berg was widely rumored to be the Emperor&apos;s child)—but the post-Solferino twin storyline is pure television invention designed to mirror Elisabeth&apos;s loneliness.
                </p>
              </section>

              <HistoricalDivider icon="ink" />

              <section id="corfu-retreat" className="scroll-mt-20">
                <QuestionHeading>
                  Did Sisi Really Flee Vienna to Corfu Because of Franz&apos;s Infidelity?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: Her long island convalescence is real, though the destination and trigger were medical.
                  </p>
                  <p className="m-0">
                    In November 1860, Elisabeth actually sailed first to the Portuguese island of Madeira for six months—not Corfu—on the urgent advice of lung specialist Dr. Josef Skoda, before traveling to Corfu in May 1861.
                  </p>
                </div>
                <p>
                  While marital misery and suffocating pressure from Archduchess Sophie certainly fueled her breakdown, Elisabeth was suffering from severe physical exhaustion, chronic coughing, and what court physicians feared was tuberculosis. Her departure shocked Europe precisely because an Austrian Empress had never abandoned Vienna and her young children for months at a time.
                </p>
                <div className="flex items-start gap-4 p-4 bg-stone-100 rounded-sm mt-4">
                  <Info className="text-stone-400 shrink-0 mt-1" size={20} />
                  <p className="text-sm text-stone-600 m-0 italic">
                    Elisabeth fell so deeply in love with Corfu during her 1861 recovery that decades later she built her famous neoclassical palace, the Achilleion, on the island.
                  </p>
                </div>
              </section>

              <HistoricalDivider icon="nib" />

              <section id="surviving-letters" className="scroll-mt-20">
                <QuestionHeading>
                  What Do the Real Letters Between Franz Joseph and Sisi Say?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: We can read his devotion in full, because she destroyed almost all of her own letters.
                  </p>
                  <p className="m-0">
                    Just as Venetia Stanley&apos;s replies to H.H. Asquith are missing while his letters survive, hundreds of Franz Joseph&apos;s letters to Elisabeth survive in the Habsburg family archives—revealing a husband who remained anxiously in love with her until her assassination in 1898.
                  </p>
                </div>
                <p>
                  Elisabeth, by contrast, hated leaving paper trails in Vienna and had nearly all of her letters to Franz Joseph destroyed. To hear Sisi&apos;s unfiltered voice about her marriage, historians rely on her surviving letters to her confidante Ida Ferenczy and her daughter Marie Valerie—where she described royal marriage as &quot;an absurd institution&quot; in which &quot;one is sold as a fifteen-year-old child.&quot;
                </p>
              </section>

              <HistoricalDivider icon="flourish" />

              <section id="ida-ferenczy" className="scroll-mt-20">
                <QuestionHeading>
                  Was Ida Ferenczy a Real Person?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: Yes—and she was even more important to Sisi than the show has time to depict.
                  </p>
                  <p className="m-0">
                    Appointed as Elisabeth&apos;s Hungarian reader in 1864 (bypassing Archduchess Sophie&apos;s aristocratic gatekeepers), Ida Ferenczy became the Empress&apos;s lifelong confidante, private secretary, and political courier until Elisabeth&apos;s death in 1898.
                  </p>
                </div>
                <p>
                  Ferenczy secretly arranged Elisabeth&apos;s meetings and correspondence with Count Andrássy and Hungarian moderate leader Ferenc Deák, bypassing Vienna&apos;s conservative ministers entirely.
                </p>
              </section>

              <HistoricalDivider icon="ink" />

              <section id="locked-in-rooms" className="scroll-mt-20">
                <QuestionHeading>
                  Did Franz Joseph Really Confine Elisabeth to Her Rooms?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: No. That confrontation is fictional.
                  </p>
                  <p className="m-0">
                    In Episode 6, after Archduchess Sophie exposes Elisabeth&apos;s affair with Andrássy, Franz Joseph locks Elisabeth in her apartments and bars her from seeing her children unsupervised. Historically, no such arrest occurred.
                  </p>
                </div>
                <p>
                  In the early years of their marriage, Archduchess Sophie did control the nursery and restrict Elisabeth&apos;s access to her children—a conflict Elisabeth eventually won in the mid-1860s by threatening to leave Franz Joseph permanently unless she was given full authority over Crown Prince Rudolf&apos;s education.
                </p>
              </section>

              <HistoricalDivider icon="nib" />

              <section id="hungary-1867" className="scroll-mt-20">
                <QuestionHeading>
                  Did Elisabeth Really Make the 1867 Hungarian Coronation Happen?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: Yes. It was her greatest political triumph.
                  </p>
                  <p className="m-0">
                    Following Austria&apos;s catastrophic defeat by Prussia in 1866 (which the show condenses alongside the earlier 1859 Italian war), Elisabeth relentlessly pressured Franz Joseph to reconcile with Hungary rather than rule by martial law.
                  </p>
                </div>
                <p>
                  On June 8, 1867, Franz Joseph and Elisabeth were crowned King and Queen of Hungary in Buda, creating the Dual Monarchy of Austria-Hungary. Count Andrássy—who had been sentenced to death in absentia by Franz Joseph&apos;s government after the 1848 revolution—placed the Crown of Saint Stephen on the Emperor&apos;s head as Hungary&apos;s new Prime Minister.
                </p>
                <RelatedPageLink
                  href="/sisi/after-1867"
                  linkTitle="Continue reading: What happened to Sisi from the 1867 coronation to Geneva in 1898?"
                />
              </section>

              <HistoricalDivider icon="flourish" />

              <section id="maximilian-adopted-son" className="scroll-mt-20">
                <QuestionHeading>
                  Did Maximilian and Charlotte Really Adopt a Son in Mexico?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: Yes—but the series changes what happened afterward.
                  </p>
                  <p className="m-0">
                    On September 9, 1865, Maximilian and Charlotte adopted two descendants of Mexico&apos;s first emperor: Agustín de Iturbide y Green and his cousin Salvador de Iturbide y de Marzán. Agustín was about two years old and received the title Prince of Iturbide.
                  </p>
                </div>
                <p>
                  The adoption was Maximilian&apos;s decision, and Charlotte disapproved. Agustín was separated from his mother as the imperial couple tried to create a dynastic succession. The series instead has the child presented to Maximilian and then quickly returned, which is its own simplified resolution rather than the documented course of the adoption.
                </p>
              </section>

              <HistoricalDivider icon="ink" />

              <section id="smissen-child-plan" className="scroll-mt-20">
                <QuestionHeading>
                  Did Maximilian Arrange for Charlotte to Have a Child with Alfred van der Smissen?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: No evidence supports the arrangement shown in the series.
                  </p>
                  <p className="m-0">
                    The series has Maximilian propose that Charlotte conceive a child with Belgian officer Alfred van der Smissen, with Charlotte accepting and Maximilian&apos;s approval. Van der Smissen was a real Belgian officer who served in Mexico, but no known source establishes that Maximilian arranged such an encounter.
                  </p>
                </div>
                <p>
                  A much later rumor claimed that Charlotte secretly gave birth in January 1867 to Van der Smissen&apos;s child, sometimes identified as the future French general Maxime Weygand. That allegation remains an unproven paternity story, not established history, and it does not substantiate the series&apos; specific claim that Maximilian planned or approved the liaison.
                </p>
              </section>

              <HistoricalDivider icon="nib" />

              <section id="maximilian-mexico" className="scroll-mt-20">
                <QuestionHeading>
                  Was Archduke Maximilian Really Executed in Mexico?
                </QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">
                    The Short Answer: Yes—just eleven days after Franz Joseph&apos;s Hungarian coronation.
                  </p>
                  <p className="m-0">
                    Lured by Napoleon III with promises of a Mexican empire, Franz Joseph&apos;s younger brother Maximilian accepted the crown in 1864—only after Franz Joseph forced him to renounce all Habsburg succession rights in Austria.
                  </p>
                </div>
                <p>
                  When Napoleon III withdrew French troops under U.S. diplomatic pressure, Maximilian refused to abdicate, was captured by Benito Juárez&apos;s republican forces at Querétaro, and was executed by firing squad on June 19, 1867—casting a pall over the Budapest coronation celebrations.
                </p>
                <RelatedPageLink
                  href="/sisi/timeline"
                  linkTitle="Explore the timeline of Elisabeth's life"
                />
              </section>
            </div>

            <div className="mt-12 md:mt-16">
              <BooksCard placement="end" context="fact-vs-fiction" />
            </div>

            <footer className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-stone-200 text-center md:text-left">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">
                Continue Exploring the Sisi Case Study
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Link
                  href="/sisi/after-1867"
                  className="p-4 bg-stone-50 rounded-sm hover:bg-stone-100 transition-colors border border-stone-200 group flex flex-col items-center md:items-start gap-1"
                >
                  <span className="block font-bold text-navy group-hover:text-accent-green">
                    Sisi After 1867
                  </span>
                  <span className="text-xs text-stone-500 font-sans">
                    From the Hungarian coronation to Mayerling and Geneva (1868–1898).
                  </span>
                </Link>
                <Link
                  href="/sisi/timeline"
                  className="p-4 bg-stone-50 rounded-sm hover:bg-stone-100 transition-colors border border-stone-200 group flex flex-col items-center md:items-start gap-1"
                >
                  <span className="block font-bold text-navy group-hover:text-accent-green">
                    Timeline of Elisabeth&apos;s Life
                  </span>
                  <span className="text-xs text-stone-500 font-sans">
                    Key events in Elisabeth&apos;s life, alongside relevant historical context.
                  </span>
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
