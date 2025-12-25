'use client';

import React from 'react';
import { useChatVisibility } from '@/components/chat/useChatVisibility';
import { BookOpen, Sparkles, Gem, Brain, Code, Terminal, Mic, Palette, Database } from 'lucide-react';

export default function AboutPage() {
  useChatVisibility(false);

  return (
    <div className="h-full bg-page-bg">
      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg prose-p:text-navy prose-headings:text-navy prose-li:text-slate">
          <h1 className="text-4xl font-serif font-bold text-navy mb-8">
            What Is The Venetia Project?
          </h1>
          <div className="space-y-6 text-navy leading-relaxed">
            <p>
              The Venetia Project is a historical reconstruction experiment that <span className="bg-accent-amber/60 font-semibold p-1 rounded-sm">blends archival research, data analysis, and modern AI tools</span> to retell, day by day, the private world surrounding Venetia Stanley, Prime Minister H. H. Asquith, and Edwin Montagu during the turbulent years 1912–1916.
            </p>

            <p>
              It rebuilds history not as a summary, but as a <span className="bg-accent-amber/60 font-semibold p-1 rounded-sm">living timeline</span> of letters, diaries, Cabinet minutes, political pressures, emotional turning points, and shifting alliances.
            </p>

            <p>
              At its core, the project explores one question:
            </p>

            <p className="text-xl font-medium italic text-navy text-center border-y border-border-beige py-6 my-8 leading-relaxed">
              What really happened—emotionally, politically, privately—on each day of this extraordinary relationship?
            </p>

            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              How the Reconstruction Works
            </h2>

            <p>
              Using the primary sources listed in the research brief—letters, diaries, Hansard debates, Cabinet papers, memoirs, and eyewitness writing—the system attempts to answer for <span className="bg-accent-amber/60 font-semibold p-1 rounded-sm">every day between 1912 and 1916</span>: 
            </p>

            <ul className="list-disc list-inside space-y-3 ml-4 mt-4 text-slate">
              <li>Where were Venetia, Asquith, and Edwin?</li>
              <li>Did they meet? With whom?</li>
              <li>How many letters were exchanged that day, and what was their tone?</li>
              <li>What topics appeared—politics, affection, gossip, anxiety?</li>
              <li>What was happening in Parliament or Cabinet?</li>
              <li>What did contemporaries like Violet Asquith, Margot Asquith, Cynthia Asquith, and Diana Manners record in their diaries?</li>
              <li>Were there <span className="bg-accent-amber/60 font-semibold p-1 rounded-sm">noticeable shifts in mood, influence, or emotional distance?</span></li>
            </ul>

            <p className="mt-6">
              The website compiles this into:
            </p>

            <ul className="list-disc list-inside space-y-3 ml-4 mt-4 text-slate">
              <li>Letter-volume timelines</li>
              <li>Topic heat maps</li>
              <li>Emotional tone graphs</li>
              <li>Daily summaries</li>
              <li>Maps of movement</li>
              <li>Cross-perspective views (&quot;what others did&quot;)</li>
              <li>Links between private correspondence and public events</li>
            </ul>

            <p className="mt-6">
              It turns the scattered sources of 1912–1916 into a <span className="bg-accent-amber/60 font-semibold p-1 rounded-sm">unified, interactive archive.</span>
            </p>

            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              AI Tools Used in the Project
            </h2>

            <p>
              This project was built through multiple AI tools working together, each chosen for its strengths.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-card-bg p-6 rounded-sm border border-border-beige shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent-green/30">
                <h3 className="text-xl font-serif font-semibold text-navy mb-2">NotebookLM</h3>
                <p className="text-muted-gray text-sm">
                  Served as the project&apos;s &quot;brain,&quot; ingesting historical documents to reason across raw data without the bias of hindsight.
                </p>
              </div>

              <div className="bg-card-bg p-6 rounded-sm border border-border-beige shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent-green/30">
                <h3 className="text-xl font-serif font-semibold text-navy mb-2">Gemini</h3>
                <p className="text-muted-gray text-sm">
                  Functioned as the chief assistant for infrastructural work: writing Python code to download, scrape, and reconcile data from various sources.
                </p>
              </div>

              <div className="bg-card-bg p-6 rounded-sm border border-border-beige shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent-green/30">
                <h3 className="text-xl font-serif font-semibold text-navy mb-2">Gemini Gem</h3>
                <p className="text-muted-gray text-sm">
                  Configured as a history assistant to find additional primary sources by answering targeted questions about dates, authors, and corroborating materials.
                </p>
              </div>

              <div className="bg-card-bg p-6 rounded-sm border border-border-beige shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent-green/30">
                <h3 className="text-xl font-serif font-semibold text-navy mb-2">Claude</h3>
                <p className="text-muted-gray text-sm">
                  Acted as a &quot;thinking partner&quot; for reframing questions and resolving narrative difficulties when data models hit a wall.
                </p>
              </div>

              <div className="bg-card-bg p-6 rounded-sm border border-border-beige shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent-green/30">
                <h3 className="text-xl font-serif font-semibold text-navy mb-2">Codex</h3>
                <p className="text-muted-gray text-sm">
                  Collaborated with Claude to stabilize the UI produced by Base44, transitioning exploratory designs into a functional platform.
                </p>
              </div>

              <div className="bg-card-bg p-6 rounded-sm border border-border-beige shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent-green/30">
                <h3 className="text-xl font-serif font-semibold text-navy mb-2">Cursor</h3>
                <p className="text-muted-gray text-sm">
                  My main development environment—connecting AI-assisted reasoning directly to the codebase while building the site.
                </p>
              </div>

              <div className="bg-card-bg p-6 rounded-sm border border-border-beige shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent-green/30">
                <h3 className="text-xl font-serif font-semibold text-navy mb-2">ElevenLabs</h3>
                <p className="text-muted-gray text-sm">
                  To generate the audio reconstruction of Asquith reading his letters.
                </p>
              </div>

              <div className="bg-card-bg p-6 rounded-sm border border-border-beige shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent-green/30">
                <h3 className="text-xl font-serif font-semibold text-navy mb-2">MongoDB</h3>
                <p className="text-muted-gray text-sm">
                  Underpins the archive with Vector Search, storing embeddings to facilitate live, conversational interaction across thousands of documents.
                </p>
              </div>

              <div className="bg-card-bg p-6 rounded-sm border border-border-beige shadow-sm md:col-span-2 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent-green/30">
                <h3 className="text-xl font-serif font-semibold text-navy mb-2">Base44</h3>
                <p className="text-muted-gray text-sm">
                  Used heavily for &quot;vibe-coding&quot;: enabling rapid iteration on layout, structure, and UI to maintain flexibility as ideas evolved.
                </p>
              </div>
            </div>

            <p className="mt-6">
              Together, these tools made it possible to build a research system that combines storytelling, data, and historical methodology.
            </p>

            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              Why I Built This
            </h2>

            <p>
              I built the Venetia Project for two reasons:
            </p>

            <div className="space-y-6 mt-8">
              <div className="bg-white p-8 rounded-sm border border-border-beige border-l-4 border-l-accent-brown shadow-sm transition-all hover:shadow-md">
                <h3 className="font-serif font-bold text-navy text-xl md:text-2xl mb-3 tracking-tight">1. I love history.</h3>
                <p className="text-navy text-base md:text-lg leading-relaxed italic">
                  Especially the moments when personal relationships intersect with political events — when private letters illuminate public decisions, and when human emotion reshapes the course of nations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-sm border border-border-beige border-l-4 border-l-accent-green shadow-sm transition-all hover:shadow-md">
                <h3 className="font-serif font-bold text-navy text-xl md:text-2xl mb-3 tracking-tight">2. I love working with new AI technologies.</h3>
                <p className="text-navy text-base md:text-lg leading-relaxed italic">
                  This project allowed me to combine both passions: to take cutting-edge tools like Gemini, Claude, Cursor, Codex, NotebookLM, and Base44, and use them not to replace history, but to restructure it, explore it, and bring it to life.
                </p>
              </div>
            </div>

            <p className="mt-6">
              The result is a <span className="bg-accent-amber/60 font-semibold p-1 rounded-sm">personal experiment</span> — part research platform, part storytelling engine, part technical challenge — built out of curiosity, admiration for the past, and excitement for the future.
            </p>

            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              Sources
            </h2>

            <p className="mb-6 text-muted-gray">
              Here is an assessment of the reliability and credibility of the provided sources, classified by their nature (primary vs. secondary) and the specific context of their creation.
            </p>

            <h3 className="text-2xl font-serif font-semibold text-navy mt-10 mb-4">
              Primary Sources (Diaries, Letters, and Official Records)
            </h3>

            <div className="space-y-8 mt-6">
              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  1. Hansard Parliamentary Debates (Various files from 1912–1916)
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Reliability / Official Record
                </p>
                <p className="text-slate">
                  These files contain verbatim transcripts of speeches and debates in the House of Commons. As an official government record, they are the definitive source for what was publicly said in Parliament.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  2. Winston S. Churchill: Companion Volumes (Vol II Part 3; Vol III Parts 1 & 2)
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: Highest Reliability / Primary Documentary Collection
                </p>
                <p className="text-slate">
                  These volumes, edited by Randolph Churchill and Martin Gilbert, consist of raw primary documents: telegrams, secret memos, and private letters from Churchill, Asquith, Fisher, and others.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  3. H.H. Asquith: Letters to Venetia Stanley (Edited by M. & E. Brock)
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Credibility / Primary Source
                </p>
                <p className="text-slate">
                  These are contemporary letters written by the Prime Minister. They offer a unique, unfiltered view of the executive mindset, containing state secrets and private anxieties shared in real-time.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  4. Margot Asquith&apos;s Great War Diary 1914–1916 (Edited by M. & E. Brock)
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: Mixed Reliability / Subjective Primary Source
                </p>
                <p className="text-slate">
                  While valuable for its access to the Prime Minister&apos;s inner circle, the editors explicitly warn that Margot was &quot;an opinionated egotist, often inaccurate... and occasionally prone to fantasy&quot;.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  5. Lloyd George: A Diary by Frances Stevenson (Edited by A.J.P. Taylor)
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Credibility / Partisan Primary Source
                </p>
                <p className="text-slate">
                  Stevenson was both Lloyd George&apos;s secretary and mistress, placing her at the center of power. The diary reflects his biases and justifications.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  6. Lady Cynthia Asquith: Diaries 1915–1918
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Credibility / Primary Source
                </p>
                <p className="text-slate">
                  These diaries are described as an &quot;intimate, unselfconscious record&quot;. They are highly reliable for social history and the mood of the aristocracy during the war.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  7. Lord Riddell&apos;s War Diary 1914–1918
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Credibility / Journalistic Primary Source
                </p>
                <p className="text-slate">
                  Riddell was a press baron and intermediary. His diary is highly reliable regarding the relationship between the media and the government.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  8. The Venetia Stanley & Edwin Montagu Correspondence
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Reliability / Personal Primary Source
                </p>
                <p className="text-slate">
                  These are raw transcripts of private letters. They are highly credible evidence of the personal relationship and social maneuvering between Venetia and Edwin.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  9. Champion Redoubtable / Lantern Slides (Violet Bonham Carter)
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Credibility / Edited Primary Source
                </p>
                <p className="text-slate">
                  These texts are edited selections of diaries and letters from Asquith&apos;s daughter, intensely loyal to the Asquithian liberal viewpoint.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  10. The Supreme Command 1914–1918 by Lord Hankey
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Reliability / Authoritative Memoir-History
                </p>
                <p className="text-slate">
                  Hankey was the Secretary to the War Council. It is considered a definitive administrative history of the war&apos;s direction.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  11. The Rainbow Comes and Goes by Lady Diana Cooper
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: Medium Reliability / Memoir
                </p>
                <p className="text-slate">
                  Written in 1958, this is a retrospective memoir. It captures the spirit and romance of the Coterie and the era.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  12. Weather Records (1912–1916)
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: Highest Reliability / Official Meteorological Data
                </p>
                <p className="text-slate">
                  Historical weather data from the UK Met Office archives, used to contextualize daily events and confirm atmospheric details mentioned in letters.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-serif font-semibold text-navy mt-12 mb-4">
              Secondary Sources (Biographies and Histories)
            </h3>

            <div className="space-y-8 mt-6">
              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  13. The Asquiths by Colin Clifford
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Reliability / Secondary Biography
                </p>
                <p className="text-slate">
                  Published in 2002, this is a synthesis of diaries and letters. It provides a reliable narrative overview, utilizing primary sources.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  14. Politics, Religion and Love by Naomi B. Levine
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: Good Reliability / Secondary Biography
                </p>
                <p className="text-slate">
                  This text reconstructs the life of Edwin Montagu using his letters and other primary archives.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  15. Asquith by Roy Jenkins
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Credibility / Authoritative Biography
                </p>
                <p className="text-slate">
                  A seminal biography written by a former Home Secretary and Chancellor. It offers deep political insight into Asquith's career and decisions.
                </p>
              </div>
            </div>

            <div className="mt-16 p-8 bg-section-bg/30 border-2 border-dashed border-border-beige rounded-md">
              <h3 className="text-2xl font-serif font-bold text-navy mb-6">Future Archives</h3>
              <p className="text-muted-gray italic mb-8">
                The Venetia Project is an ongoing reconstruction. The following primary sources are currently being sought for integration into the daily timeline:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-navy">Raymond Asquith: Life and Letters</h4>
                  <p className="text-sm text-slate">To integrate the perspective of the Prime Minister's eldest son—a core member of the Coterie whose wit and cynicism offer a vital counterpoint to his father's romanticism.</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-navy">Daily Newspaper Headlines</h4>
                  <p className="text-sm text-slate">Digital archives of the Times and Daily Mail (1912–1916) to provide the daily public backdrop to the private correspondence.</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-navy">Edwin Montagu&apos;s Letters (Post-May 1912)</h4>
                  <p className="text-sm text-slate">Locating the missing side of the correspondence between Edwin and Venetia during the critical years of their courtship and conversion.</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-navy">The Henley Archives</h4>
                  <p className="text-sm text-slate">The private papers of Sylvia Henley and her husband; critical because they provide rare access to Asquith&apos;s personal state and correspondence after Venetia&apos;s engagement and his subsequent breakdown.</p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-border-beige">
              <p className="text-muted-gray text-sm italic">
                For any questions or requests, please contact me by email:{' '}
                <a 
                  href="mailto:elon@consi.io" 
                  className="text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
                >
                  elon@consi.io
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}