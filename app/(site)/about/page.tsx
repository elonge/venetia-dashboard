"use client";

import React from "react";
import { useChatVisibility } from "@/components/chat/useChatVisibility";
import PrimarySource from "@/components/about/PrimarySource";
import Link from "next/link";

const AMAZON_AFFILIATE_ID =
  process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID?.trim();

function withAmazonAffiliate(link: string) {
  if (!AMAZON_AFFILIATE_ID) {
    return link;
  }

  try {
    const url = new URL(link);
    if (!/(^|\.)amazon\./i.test(url.hostname)) {
      return link;
    }

    url.searchParams.set("tag", AMAZON_AFFILIATE_ID);
    return url.toString();
  } catch {
    return link;
  }
}

export default function AboutPage() {
  useChatVisibility(false);

const HistoricalDivider = ({ icon = 'nib' }) => {
  return (
    <div className="flex items-center justify-center py-16 opacity-40 text-stone-900">
      
      {/* Left Line */}
      <div className="h-px w-12 bg-current hidden md:block opacity-50 mr-4"></div>

      {/* The Icon */}
      <div className="text-current">
        
        {/* OPTION 1: THE FOUNTAIN PEN NIB (Writing/Letters) */}
        {icon === 'nib' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C12 2 4.5 9 4.5 15C4.5 19.5 7.5 22 12 22C16.5 22 19.5 19.5 19.5 15C19.5 9 12 2 12 2Z" />
            <path d="M12 2V13" />
            <path d="M12 22C12 22 10 18 10 15" />
            <path d="M12 22C12 22 14 18 14 15" />
          </svg>
        )}

        {/* OPTION 2: THE VICTORIAN FLOURISH (Editorial/Bookish) */}
        {icon === 'flourish' && (
           <svg width="42" height="14" viewBox="0 0 42 14" fill="none" stroke="currentColor" strokeWidth="1">
             <path d="M21 7C26 7 28 2 33 2C38 2 41 5 41 7C41 9 38 12 33 12C28 12 26 7 21 7Z" />
             <path d="M21 7C16 7 14 2 9 2C4 2 1 5 1 7C1 9 4 12 9 12C14 12 16 7 21 7Z" />
             <circle cx="21" cy="7" r="1.5" fill="currentColor" stroke="none"/>
           </svg>
        )}

        {/* OPTION 3: THE INK POT (Research/Work) */}
        {icon === 'ink' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 20H19V14C19 14 19 10 16 8V5H8V8C5 10 5 14 5 14V20Z" />
            <path d="M12 15L15 3" /> 
            <path d="M8 20L5 22" />
            <path d="M16 20L19 22" />
          </svg>
        )}
      </div>

      {/* Right Line */}
      <div className="h-px w-12 bg-current hidden md:block opacity-50 ml-4"></div>
      
    </div>
  );
};
  
  const SectionDivider = ({ variant = "stars" }) => {
    if (variant === "line") {
      return (
        <div className="flex items-center justify-center my-16 opacity-30">
          <div className="h-px w-24 bg-stone-900"></div>
        </div>
      );
    }

    if (variant === "fleuron") {
      return (
        <div className="flex items-center justify-center my-16 text-stone-900/40">
          {/* A simple elegant SVG flourish */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="w-8 h-8"
          >
            <path d="M12 4C14 8 18 10 22 12C18 14 14 16 12 20C10 16 6 14 2 12C6 10 10 8 12 4Z" />
          </svg>
        </div>
      );
    }

    // Default: The Classic "Dinkus" (Three Asterisks)
    return (
      <div className="text-center my-16">
        <span className="font-serif text-2xl tracking-[1em] text-stone-900/40 ml-[1em]">
          ***
        </span>
      </div>
    );
  };
  const socialLinks = [
    { label: "Podcast", href: process.env.NEXT_PUBLIC_PODCAST_URL },
    { label: "Substack", href: process.env.NEXT_PUBLIC_SUBSTACK_URL },
  ].filter(
    (link): link is { label: string; href: string } => Boolean(link.href)
  );
  return (
    <div className="h-full bg-page-bg">
      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg prose-p:text-navy prose-headings:text-navy prose-li:text-slate">
          <h1 className="text-4xl font-serif font-bold text-navy mb-8">
            About The Venetia Project
          </h1>
          <div className="space-y-6 text-navy leading-relaxed">
            <p>The Venetia Project began with a gap.</p>

            <p>
              H. H. Asquith wrote hundreds of letters to Venetia Stanley—letters
              that survive in remarkable detail. But{" "}
              <span className="my-highlight">
                Venetia&apos;s own voice during these years is largely missing
              </span>
              . We hear him constantly: his doubts, his political calculations,
              his emotional dependence. What we don&apos;t have is a clean,
              balanced record of what surrounded those letters day by day.
            </p>

            <p>
              At some point, that imbalance stopped feeling like a limitation
              and started feeling like a challenge.
            </p>

            <p>
              So instead of trying to &quot;complete&quot; Venetia&apos;s voice,
              I decided to do something else.
            </p>
            <HistoricalDivider icon="nib" />
            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              What I decided to do
            </h2>

            <p>
              I decided to approach the problem the way I usually do when
              something feels unresolved: by experimenting.
            </p>

            <p>
              I&apos;m a technologist, and I&apos;m deeply interested in what
              recent AI tools make newly possible—not in replacing human
              judgment, but in handling scale, complexity, and cross-reference
              in ways that were previously impractical. This felt like exactly
              the kind of historical problem those tools might help with.
            </p>

            <p>
              So instead of trying to reconstruct Venetia's missing voice
              directly,{" "}
              <span className="my-highlight">
                I decided to feed my AI everything else.
              </span>
            </p>

            <p>
              Every letter I could find.
              <br />
              Diaries of people around them.
              <br />
              Cabinet minutes. Parliamentary debates. Newspapers. Political
              crises. Travel records. Social events. Even the weather.
            </p>

            <p>
              Once the data was ingested,{" "}
              <span className="my-highlight">I started asking questions:</span>
            </p>

            <ul className="list-disc list-inside space-y-3 ml-4 mt-4 text-slate">
              <li>Where was Asquith on this day?</li>
              <li>
                What had just happened politically before he wrote this letter?
              </li>
              <li>
                Where was Venetia, and what was happening in her immediate
                world?
              </li>
              <li>
                What did contemporaries like Violet Asquith, Margot Asquith, and
                others record in their diaries?
              </li>
              <li>What was happening in Parliament or Cabinet?</li>
            </ul>

            <p>
              The experiment was simple in spirit but ambitious in scale: to see
              whether modern AI tools could help reconstruct the daily texture
              of a historical relationship without smoothing it into a story it
              never was.
            </p>
            <HistoricalDivider />
            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              What you&apos;ll find on the site
            </h2>

            <p>
              The Venetia Project is designed to be explored, not consumed
              linearly.
            </p>

            <p>It includes:</p>

            <ul className="list-disc list-inside space-y-3 ml-4 mt-4 text-slate">
              <li>
                <Link
                  href="/venetia"
                  className="font-bold text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  Venetia Stanley&apos;s story
                </Link>{" "}
                and the world she inhabited
              </li>
              <li>
                <Link
                  href="/daily/1914-07-22"
                  className="font-bold text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  A daily view
                </Link>{" "}
                reconstructing what was happening on specific dates
              </li>
              <li>
                <Link
                  href="/data-room"
                  className="font-bold text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  The Data Room:
                </Link>{" "}
                A statistical breakdown of the archive, visualizing
                correspondence patterns, sentiment analysis, and metadata
              </li>
              <li>
                <Link
                  href="/lab"
                  className="font-bold text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  The Speculative Studio:
                </Link>{" "}
                An experimental space attempting to{" "}
                <span className="my-highlight">
                  reconstruct Venetia&apos;s missing diary
                </span>{" "}
                and explore &quot;what if&quot; scenarios
              </li>
              <li>
                <Link
                  href="/chapter/asquith-letters-venetia-stanley"
                  className="font-bold text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  Thematic chapters
                </Link>{" "}
                on key episodes and pressures (e.g., the{" "}
                <Link
                  href="/chapter/asquith-venetia-sicily-1912"
                  className="text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  1912 Sicilian trip
                </Link>
                , the{" "}
                <Link
                  href="/chapter/venetia-stanley-engagement-1915"
                  className="text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  1915 engagement
                </Link>
                {" etc..."}
                )
              </li>
              <li>
                <Link
                  href="/archive_search"
                  className="font-bold text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  The underlying archive:
                </Link>{" "}
                A fully searchable database where you can{" "}
                <span className="my-highlight">
                  chat directly with the primary sources
                </span>
              </li>
              <li>
                <strong>
                  Fact vs. Fiction:
                </strong>{" "}
                A guide to the historical accuracy of{" "}
                <Link
                  href="/precipice-fact-vs-fiction"
                  className="text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  Robert Harris&apos;s &apos;Precipice&apos;
                </Link>
              </li>
            </ul>
            <p>Some days are dense. Some are empty. Both matter.</p>
            <HistoricalDivider />
            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              An open-ended project
            </h2>

            <p>
              This project isn&apos;t finished, and it isn&apos;t definitive.
            </p>

            <p>
              If you spot an error, disagree with an interpretation, have a
              question, or know of a source I should look at—I&apos;d genuinely
              like to hear from you.
            </p>

            <p>
              You can reach me at:{" "}
              <a
                href="mailto:elon@consi.io"
                className="text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
              >
                elon@consi.io
              </a>
            </p>
            {socialLinks.length > 0 && (
              <p>
                Elsewhere:{" "}
                {socialLinks.map((link, index) => (
                  <React.Fragment key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                    >
                      {link.label}
                    </a>
                    {index < socialLinks.length - 1 ? ", " : "."}
                  </React.Fragment>
                ))}
              </p>
            )}

            <p>
              History gets more interesting when it&apos;s examined closely, and
              more honest when its gaps are left visible.
            </p>
            <p className="p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300">
              <b>On a related note:</b> Building this archive has been a deep dive into using AI to extract, organize, and structure fragmented information. I am currently applying this same underlying technology to a different kind of cataloging challenge: personal libraries. If you are looking for a seamless way to digitize your collection without typing out hundreds of titles, I am building <Link target="_blank" href="https://velato.app" className="text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4">Velato</Link>. It uses continuous-frame video scanning to read book spines, turning a quick camera pan of your physical bookshelves into a fully structured digital catalog.
            </p>
            <HistoricalDivider icon="ink"/>
            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              AI Tools Used in the Project
            </h2>

            <p>
              This project was built through multiple AI tools working together,
              each chosen for its strengths.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Card 1: NotebookLM */}
              <div className="group flex flex-col p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-black">
                  NotebookLM
                </h3>
                <p className="font-sans text-sm leading-relaxed text-stone-600 group-hover:text-stone-900 transition-colors">
                  Served as the project&apos;s &quot;brain,&quot; ingesting
                  historical documents to reason across raw data without the
                  bias of hindsight.
                </p>
              </div>

              {/* Card 2: Gemini */}
              <div className="group flex flex-col p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-black">
                  Gemini
                </h3>
                <p className="font-sans text-sm leading-relaxed text-stone-600 group-hover:text-stone-900 transition-colors">
                  Functioned as the chief assistant for infrastructural work:
                  writing Python code to download, scrape, and reconcile data
                  from various sources.
                </p>
              </div>

              {/* Card 3: Gemini Gem */}
              <div className="group flex flex-col p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-black">
                  Gemini Gem
                </h3>
                <p className="font-sans text-sm leading-relaxed text-stone-600 group-hover:text-stone-900 transition-colors">
                  Configured as a history assistant to find additional primary
                  sources by answering targeted questions about dates, authors,
                  and corroborating materials.
                </p>
              </div>

              {/* Card 4: Claude */}
              <div className="group flex flex-col p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-black">
                  Claude
                </h3>
                <p className="font-sans text-sm leading-relaxed text-stone-600 group-hover:text-stone-900 transition-colors">
                  Acted as a &quot;thinking partner&quot; for reframing
                  questions and resolving narrative difficulties when data
                  models hit a wall.
                </p>
              </div>

              {/* Card 5: Codex */}
              <div className="group flex flex-col p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-black">
                  Codex
                </h3>
                <p className="font-sans text-sm leading-relaxed text-stone-600 group-hover:text-stone-900 transition-colors">
                  Collaborated with Cursor to stabilize the UI produced by
                  Base44, transitioning exploratory designs into a functional
                  platform.
                </p>
              </div>

              {/* Card 6: Cursor */}
              <div className="group flex flex-col p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-black">
                  Cursor
                </h3>
                <p className="font-sans text-sm leading-relaxed text-stone-600 group-hover:text-stone-900 transition-colors">
                  My main development environment—connecting AI-assisted
                  reasoning directly to the codebase while building the site.
                </p>
              </div>

              {/* Card 7: ElevenLabs */}
              <div className="group flex flex-col p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-black">
                  ElevenLabs
                </h3>
                <p className="font-sans text-sm leading-relaxed text-stone-600 group-hover:text-stone-900 transition-colors">
                  was used to generate the audio reconstructions of Asquith reading his letters. The voice was cloned from a surviving recording of a speech he delivered in 1909.
                </p>
              </div>

              {/* Card 8: MongoDB */}
              <div className="group flex flex-col p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-black">
                  MongoDB
                </h3>
                <p className="font-sans text-sm leading-relaxed text-stone-600 group-hover:text-stone-900 transition-colors">
                  Underpins the archive with Vector Search, storing embeddings
                  to facilitate live, conversational interaction across
                  thousands of documents.
                </p>
              </div>

              {/* Card 9: Base44 */}
              {/* Note: This item spans 2 cols on Tablet (md) to avoid being an orphan, but 1 col on Desktop (lg) */}
              <div className="group flex flex-col p-5 border border-stone-900/15 rounded-sm hover:border-stone-900/40 hover:bg-stone-900/5 transition-all duration-300 md:col-span-2 lg:col-span-1">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-black">
                  Base44
                </h3>
                <p className="font-sans text-sm leading-relaxed text-stone-600 group-hover:text-stone-900 transition-colors">
                  Used heavily for &quot;vibe-coding&quot;: enabling rapid
                  iteration on layout, structure, and UI to maintain flexibility
                  as ideas evolved.
                </p>
              </div>
            </div>
            <p className="mt-6">
              Together, these tools made it possible to build a research system
              that combines storytelling, data, and historical methodology.
            </p>
            <div>
              <HistoricalDivider icon="flourish" />
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-8">
                Sources & Perspective
              </h2>

              {/* Dense 3-column grid for bibliography style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
                {/* 1. Asquith Letters */}
                <PrimarySource
                  title="H.H. Asquith: Letters to Venetia Stanley"
                  credibility="High Credibility / Primary Source"
                  description="Contemporary letters written by the Prime Minister. They offer a unique, unfiltered view of the executive mindset, containing state secrets and private anxieties shared in real-time."
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/H-H-Asquith-Letters-Venetia-Stanley/dp/0192122002"
                  )}
                  author="Michael Brock"
                />

                {/* 2. Venetia & Edwin Correspondence */}
                <PrimarySource
                  title="The Venetia Stanley & Edwin Montagu Correspondence"
                  credibility="High Reliability / Personal Primary Source"
                  description="Raw transcripts of private letters. Highly credible evidence of the personal relationship and social maneuvering between Venetia and Edwin."
                />
                <PrimarySource
                  title="H.H. Asquith: Letters to Sylvia Henley (1915)"
                  credibility="High Reliability / Personal Primary Source"
                  description="Raw transcripts of private letters. Highly credible evidence of Asquith's emotions after Venetia's engagement."
                />

                {/* 3. Margot Asquith Diary */}
                <PrimarySource
                  title="Margot Asquith's Great War Diary 1914–1916"
                  credibility="Mixed Reliability / Subjective Primary Source"
                  description={'Valuable for access to the PM\'s inner circle, though editors warn Margot was "an opinionated egotist, often inaccurate... and occasionally prone to fantasy."'}
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Margot-Asquiths-Great-Diary-1914-1916-ebook/dp/B00KB1BROG"
                  )}
                  author="Michael Brock & Eleanor Brock"
                />

                {/* 4. Violet Bonham Carter */}
                <PrimarySource
                  title="Lantern Slides"
                  credibility="High Credibility / Edited Primary Source"
                  description="Edited selections of diaries and letters from Asquith's daughter, intensely loyal to the Asquithian liberal viewpoint."
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Lantern-Slides-Diaries-Letters-1904-1914/dp/0297816497"
                  )}
                  author="Violet Bonham Carter"
                />

                {/* 5. Lady Cynthia Asquith */}
                <PrimarySource
                  title="Lady Cynthia Asquith: Diaries 1915–1918"
                  credibility="High Credibility / Primary Source"
                  description='An "intimate, unselfconscious record." Highly reliable for social history and the mood of the aristocracy during the war.'
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Diaries-Lady-Cynthia-Asquith-1915-1918/dp/B004H5UMLQ"
                  )}
                  author="Lady Cynthia Asquith"
                />

                {/* 6. Lloyd George / Stevenson */}
                <PrimarySource
                  title="Lloyd George: A Diary by Frances Stevenson"
                  credibility="High Credibility / Partisan Primary Source"
                  description="Stevenson was both Lloyd George's secretary and mistress. The diary reflects his biases and justifications from the center of power."
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Lloyd-George-Diary-Frances-Stevenson/dp/0060141166"
                  )}
                  author="Frances Stevenson"
                />

                {/* 7. Lord Riddell */}
                <PrimarySource
                  title="Lord Riddell's War Diary 1914–1918"
                  credibility="High Credibility / Journalistic Primary Source"
                  description="Riddell was a press baron and intermediary. Highly reliable regarding the relationship between the media and the government."
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Lord-Riddells-war-diary-1914-1918/dp/B000857OVA"
                  )}
                  author="Lord Riddell"
                />

                {/* 8. Lady Diana Cooper */}
                <PrimarySource
                  title="The Rainbow Comes and Goes (Lady Diana Cooper)"
                  credibility="Medium Reliability / Memoir"
                  description="Written in 1958, this is a retrospective memoir. It captures the spirit and romance of the Coterie and the era."
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Rainbow-Comes-Diana-Cooper-Autobiog-ebook/dp/B074MBTCKQ"
                  )}
                  author="Lady Diana Cooper"
                />

                {/* 9. Lord Hankey */}
                <PrimarySource
                  title="The Supreme Command 1914–1918 (Lord Hankey)"
                  credibility="High Reliability / Authoritative Memoir-History"
                  description="Hankey was Secretary to the War Council. Considered a definitive administrative history of the war's direction."
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Supreme-Command-1914-1918-Routledge-Revivals-ebook/dp/B0B36PJRMR"
                  )}
                  author="Lord Hankey"
                />

                {/* 10. Hansard */}
                <PrimarySource
                  title="Hansard Parliamentary Debates (1912–1916)"
                  credibility="High Reliability / Official Record"
                  description="Verbatim transcripts of speeches in the House of Commons. The definitive source for what was publicly said in Parliament."
                />

                {/* 11. Winston Churchill */}
                <PrimarySource
                  title="Winston S. Churchill: Companion Volumes"
                  credibility="Highest Reliability / Primary Documentary Collection"
                  description="Raw primary documents: telegrams, secret memos, and private letters from Churchill, Asquith, Fisher, and others."
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Winston-Churchill-Companion-1874-1895-1896-1900/dp/B0097RP0UW"
                  )}
                  author="Randolph S. Churchill"
                />

                {/* 12. Weather Records */}
                <PrimarySource
                  title="UK Met Office Weather Records (1912–1916)"
                  credibility="Highest Reliability / Official Meteorological Data"
                  description="Historical weather data used to contextualize daily events and confirm atmospheric details mentioned in letters."
                />

                {/* 13. Newspapers */}
                <PrimarySource
                  title="The Times Archives & Regional Papers"
                  credibility="High Reliability / Contemporary News Source"
                  description="Contemporaneous accounts of public events, political developments, and social context from The Times, Liverpool Echo, Yorkshire Post, etc."
                />
              </div>
            </div>
            <div className="mt-16 mb-24">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                Secondary Sources (Biographies and Histories)
              </h2>

              {/* Editorial Note - styled to look like an abstract or headnote */}
              <div className="max-w-3xl mb-10">
                <p className="font-serif text-lg leading-relaxed text-stone-600 italic">
                  Alongside these, I deliberately use secondary
                  sources—biographies and historical studies—not to settle
                  debates, but to show how historians have interpreted the same
                  evidence over time. Including those perspectives makes
                  disagreements, assumptions, and blind spots visible rather
                  than implicit. This is not about replacing historians, but
                  about placing their interpretations back next to the raw
                  material.
                </p>
              </div>

              {/* 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
                {/* Source 14 */}
                <PrimarySource
                  title="Asquith (Roy Jenkins)"
                  credibility="Political Biography"
                  description="A seminal biography written by a former Home Secretary and Chancellor. It offers deep political insight into Asquith's career and decisions."
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Asquith-Roy-Jenkins-ebook/dp/B00BWL8L02"
                  )}
                  author="Roy Jenkins"
                  badgeColor="stone"
                />

                {/* Source 15 */}
                <PrimarySource
                  title="The Asquiths (Colin Clifford)"
                  credibility="Narrative History"
                  description="Published in 2002, this is a synthesis of diaries and letters. It provides a reliable narrative overview, utilizing primary sources."
                  badgeColor="stone"
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Asquiths-Colin-Clifford-ebook/dp/B0FK3NQQK2"
                  )}
                  author="Colin Clifford"
                />

                {/* Source 16 */}
                <PrimarySource
                  title="Politics, Religion and Love (Naomi B. Levine)"
                  credibility="Biographical Study"
                  description="This text reconstructs the life of Edwin Montagu using his letters and other primary archives."
                  badgeColor="stone"
                  link={withAmazonAffiliate(
                    "https://www.amazon.com/Politics-Religion-Love-Asquith-Venetia/dp/0814750575"
                  )}
                  author="Naomi B. Levine"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
