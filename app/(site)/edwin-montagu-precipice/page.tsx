"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChatVisibility } from "@/components/chat/useChatVisibility";
import { ArrowRight, BookOpen, ExternalLink, Info, List } from "lucide-react";

type QuestionHeadingProps = {
  children: React.ReactNode;
};

type InlineArchiveFigureProps = {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  imgClassName?: string;
};

type RelatedChapterLinkProps = {
  href: string;
  chapterTitle: string;
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
function InlineArchiveFigure({ src, alt, caption, className = "", imgClassName = "" }: InlineArchiveFigureProps) {
  return (
    <figure className={`not-prose my-8 md:my-10 w-full ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`block w-full h-auto rounded-sm shadow-lg object-cover sepia-[0.25] contrast-105 grayscale-[0.15] ${imgClassName}`}
      />
      <figcaption className="mt-2 text-sm italic text-stone-500">{caption}</figcaption>
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
          <svg width="42" height="14" viewBox="0 0 42 14" fill="none" stroke="currentColor" strokeWidth="1">
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

export default function EdwinMontaguPrecipicePage() {
  useChatVisibility(false);
  const [activeId, setActiveId] = useState<string>("");

  const sections = [
    { id: "real-person", title: "Real Person?" },
    { id: "appearance", title: "His Appearance" },
    { id: "love", title: "Did He Love Venetia?" },
    { id: "marriage", title: "Why She Married Him" },
    { id: "asquith-letters", title: "Asquith's Letters" },
    { id: "after-marriage", title: "After Marriage" },
    { id: "death", title: "How He Died" },
    { id: "accuracy", title: "How Accurate?" },
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
        block: "start",
      });
    }
  };

  return (
    <div className="h-full bg-page-bg relative">
      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
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
              <Link
                href="/"
                className="group flex items-center gap-2 text-xs font-bold text-navy hover:text-accent-green transition-colors"
              >
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                Start exploring the archive
              </Link>
            </div>
          </div>
        </aside>

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
                    Who Was Edwin Montagu? The Real Man Behind Precipice
                  </h1>
                  <p className="text-xl text-navy/80 font-serif italic">
                    A source-grounded FAQ on the politician, the marriage, and the controversy around his historical legacy.
                  </p>
                  <p className="mt-4 text-base italic text-navy/85">
                    This guide follows the questions readers actually ask after finishing Precipice: who Edwin Montagu was, what he believed, and where the novel stays close to history versus where it dramatizes.
                  </p>
                </div>
                <figure className="not-prose w-full md:w-35 md:shrink-0 border-4 border-[#FDFBF7] shadow-md">
                  <img
                    src="/venetia_marriage.png"
                    alt="Venetia Stanley and Edwin Montagu on their wedding day in 1915"
                    className="block w-full h-auto rounded-sm shadow-lg sepia-[0.25] contrast-105 grayscale-[0.15]"
                  />
                  <figcaption className="mt-2 text-sm italic text-stone-500">Venetia Stanley and Edwin Montagu, 1915.</figcaption>
                </figure>
              </div>
            </header>

            <div className="space-y-12">
              <section id="real-person" className="scroll-mt-20">
                <h2 className="text-[1.75rem] md:text-[1.95rem] font-serif font-semibold leading-tight text-accent-brown mb-4">
                  Was Edwin Montagu a real person?
                </h2>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Yes.</p>
                  <p className="m-0">
                    Edwin Samuel Montagu (1879-1924) was a real British Liberal politician, MP, and Secretary of State for India. He was also the man Venetia Stanley married in 1915.
                  </p>
                </div>
                <p>
                  In the Asquith-Venetia story, Montagu is not a side fiction character. He was a major political actor in his own right and part of the highest circles of wartime government.
                </p>
                <InlineArchiveFigure
                  src="/edwin-montagu/Edwin_Samuel_Montagu.jpg"
                  alt="Studio portrait of Edwin Samuel Montagu"
                  caption="A formal portrait of Edwin Samuel Montagu, whose political career and marriage to Venetia made him central to the wider story."
                  className="max-w-[20rem] mx-auto"
                />
              </section>

              <HistoricalDivider icon="ink" />

              <section id="appearance" className="scroll-mt-20">
                <QuestionHeading>What did Edwin Montagu look like?</QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Contemporary accounts often describe him as awkward and self-conscious.</p>
                  <p className="m-0">
                    Biographical portrayals repeatedly note his concern about his own appearance, including his teeth, alongside a sharp self-deprecating humor that appears in personal remarks and correspondence.
                  </p>
                </div>
                <p>
                  That insecurity mattered socially: in Edwardian elite culture, appearance and ease in drawing rooms were political assets, and Montagu was acutely aware of that disadvantage.
                </p>
                <InlineArchiveFigure
                  src="/edwin-montagu/edwin-montagu-teeth.jpg"
                  alt="Edwin Montagu — contemporaries frequently remarked on his teeth and appearance"
                  caption="A surviving photograph that helps explain why so many accounts mention Montagu's self-consciousness about his smile and appearance."
                  className="max-w-[28rem] mx-auto"
                />
              </section>

              <HistoricalDivider icon="nib" />

              <section id="love" className="scroll-mt-20">
                <QuestionHeading>Did Edwin Montagu really love Venetia Stanley?</QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Yes — painfully, persistently, and without much return.</p>
                  <p className="m-0">
                    Montagu’s love for Venetia Stanley was not a passing infatuation; the sources show years of devotion, longing, jealousy, and emotional dependence.
                  </p>
                </div>
                <p>
                  He pursued Venetia for years before she finally agreed to marry him in 1915, despite repeated rejections and her lack of physical attraction to him. Once married, the relationship remained deeply unequal: Venetia accepted the security, wealth, and freedom Montagu offered, but often stayed emotionally distant and later became openly involved with other men.
                </p>

                <p>
                  Yet Montagu’s letters continued to overflow with affection and anxiety about losing her. Whatever Venetia felt for him, Montagu’s love appears to have been real, intense, and painfully enduring.
                </p>
                <div className="mt-6 flex flex-col items-start gap-2">
                  <Link
                    href="/venetia"
                    className="mt-5 inline-flex items-center gap-2 rounded-sm border border-accent-brown/25 bg-accent-brown/80 px-6 py-3 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(122,58,20,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#63300F]"
                  >
                    Discover Who Venetia Really Was
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </section>

              <HistoricalDivider icon="flourish" />
              <section id="marriage" className="scroll-mt-20">
                <QuestionHeading>Why did Venetia Stanley marry Edwin Montagu?</QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: She married him for security, freedom, and escape — not romantic love.</p>
                  <p className="m-0">
                    Venetia Stanley’s marriage to Edwin Montagu seems to have been a pragmatic decision: he offered wealth, status, devotion, and a way out of an increasingly burdensome relationship with H.H. Asquith.
                  </p>
                </div>

                <p>
                  By 1915, Venetia was twenty-eight, unmarried, and living through a war that had narrowed the pool of eligible men in her social world. Montagu, by contrast, was rich, politically ambitious, deeply in love with her, and willing to accept her on highly unusual terms. He could give her the lifestyle she enjoyed — travel, society, comfort, and influence — without demanding the kind of conventional marriage she dreaded
                </p>

                <p>
                  Just as importantly, marrying Montagu gave Venetia a decisive way to break free from Asquith’s emotional dependence on her. In that sense, the marriage was less a romantic surrender than a calculated bargain: Venetia gained wealth, position, and personal liberty, while Montagu gained the woman he had loved for years.
                </p>
                <RelatedChapterLink href="/chapter/venetia-stanley-jewish-conversion" chapterTitle="Read more about Venetia's Engagement to Edwin Montagu" />
              </section>
              <HistoricalDivider icon="ink" />

              <section id="asquith-letters" className="scroll-mt-20">
                <QuestionHeading>Did Edwin Montagu know about Asquith's letters?</QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Yes — and the letters deeply alarmed him.</p>
                  <p className="m-0">
                    Montagu knew that Asquith was in love with Venetia, and by 1915 he had seen enough of the Prime Minister’s letters to understand how intense, consuming, and politically dangerous the attachment had become.
                  </p>
                </div>
                <p>
                  At first, Montagu seems not to have grasped the full nature of Asquith’s feelings, seeing him simply as an older friend who enjoyed Venetia’s company. But by late 1914 and early 1915, the situation was impossible to miss. Venetia showed Montagu some of Asquith’s letters, and what he read convinced him that the relationship had gone too far.
                </p>
                <p>
                  He was jealous, but also genuinely worried: Asquith was leading Britain during a world war, and Montagu feared that his obsession with Venetia might damage his focus and judgment. The letters therefore mattered twice over — personally, because they revealed the rival who dominated Venetia’s emotional life, and politically, because they exposed how vulnerable the Prime Minister had become.
                </p>
              <Link
                  href="/chapter/asquith-state-secrets-venetia-stanley"
                  className="mt-5 inline-flex items-center gap-2 rounded-sm border border-accent-brown/25 bg-accent-brown/80 px-6 py-3 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(122,58,20,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#63300F]"
                >
                  Learn more about Asquith's Letters to Venetia
                  <ArrowRight size={14} />
                </Link>

              </section>

              <HistoricalDivider icon="nib" />

              <section id="after-marriage" className="scroll-mt-20">
                <QuestionHeading>What happened to Edwin Montagu after Venetia married him?</QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Montagu continued his political career but faced personal challenges.</p>
                  <p className="m-0">
                    After marrying Venetia in 1915, Edwin Montagu reached the height of his public career as Secretary of State for India, but the marriage itself brought him little peace: Venetia remained distant, spent lavishly, and pursued other men while Montagu stayed painfully devoted to her.
                  </p>
                </div>
                <p>
                  Politically, Montagu achieved something historically significant. He helped shape the 1917 declaration that Britain’s goal in India was the gradual development of self-governing institutions, then drove the Montagu-Chelmsford Reforms that became part of the Government of India Act of 1919.
                </p>
                <p>
                  But the same years were marked by humiliation and exhaustion. Venetia’s affair with Lord Beaverbrook became openly known, Montagu suffered severe political attacks over India and Turkey, and his health deteriorated. In 1922 he was forced to resign from the Cabinet, then lost his parliamentary seat. Two years later, in 1924, he died at only forty-five — politically ruined in Britain, but mourned in India as one of its most important British advocates.
                </p>
                <InlineArchiveFigure
                  src="/edwin-montagu/EdwinMontagu_24544.webp"
                  alt="Collage representing political and personal worlds around Venetia and Montagu"
                  caption="Politics and private life stayed intertwined long after the wedding."
                />
                <p>
                  Privately, the marriage saw strain, and he died young in 1924, leaving Venetia a widow with their daughter Judith.
                </p>
              </section>

              <HistoricalDivider icon="ink" />

              <section id="death" className="scroll-mt-20">
                <QuestionHeading>How did Edwin Montagu die?</QuestionHeading>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-amber/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Edwin Montagu died of blood poisoning on November 15, 1924, at the age of 45.</p>
                  <p className="m-0">
                    His early death cut short what had already been a consequential political career and fixed his legacy within a turbulent wartime and postwar decade.
                  </p>
                </div>
              </section>

              <HistoricalDivider icon="flourish" />

              <section id="accuracy" className="scroll-mt-20">
                <QuestionHeading>How accurate is Harris's portrayal of Edwin Montagu?</QuestionHeading>
                <p className="mb-4 text-sm md:text-base text-stone-600">
                  For a broader breakdown of the novel's historical accuracy, see{" "}
                  <Link
                    href="/precipice-fact-vs-fiction"
                    className="font-semibold text-accent-brown underline decoration-accent-amber/60 underline-offset-4 hover:text-navy transition-colors"
                  >
                    Precipice: Fact vs. Fiction
                  </Link>
                  .
                </p>
                <div className="bg-white/50 p-6 rounded-sm border-l-4 border-accent-green/30 mb-4">
                  <p className="font-bold text-navy mb-2">The Short Answer: Substantively grounded, but still a novelist's portrait.</p>
                  <p className="m-0">
                    Harris tracks the broad historical reality well: real people, real tensions, and real political stakes. But dialogue, interior motives, and private scenes are shaped to serve narrative drama.
                  </p>
                </div>
                <p>
                  The most reliable approach is to read the novel as historical fiction and pair it with primary-source letters and modern scholarship.
                </p>
              </section>

              <section className="bg-navy text-white p-8 rounded-sm mt-16">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">
                  Want the Full Story Beyond Precipice?
                </h2>
                <p className="text-white/80 mb-6">
                  Explore the archive, sources, and context behind the Asquith, Venetia, and Montagu triangle, including timelines and annotated records.
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
                Continue Researching Edwin Montagu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Link
                  href="/archive_search"
                  className="p-4 bg-stone-50 rounded-sm hover:bg-stone-100 transition-colors border border-stone-200 group flex flex-col items-center md:items-start gap-1"
                >
                  <span className="block font-bold text-navy group-hover:text-accent-green">Search the Archive</span>
                  <span className="text-xs text-stone-500 font-sans">Inspect the letters and records directly.</span>
                </Link>
                <Link
                  href="/about"
                  className="p-4 bg-stone-50 rounded-sm hover:bg-stone-100 transition-colors border border-stone-200 group flex flex-col items-center md:items-start gap-1"
                >
                  <span className="block font-bold text-navy group-hover:text-accent-green">Our Methodology</span>
                  <span className="text-xs text-stone-500 font-sans">How this historical reconstruction is built.</span>
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
