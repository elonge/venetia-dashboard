'use client';

import React from 'react';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

export default function AboutPage() {
  useChatVisibility(false);

  return (
    <div className="h-full bg-page-bg">
      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg prose-p:text-navy prose-headings:text-navy prose-li:text-slate">
          <h1 className="text-4xl font-serif font-bold text-navy mb-8">
            About The Venetia Project
          </h1>
          <div className="space-y-6 text-navy leading-relaxed">
            <p>
              The Venetia Project began with a gap.
            </p>

            <p>
              H. H. Asquith wrote hundreds of letters to Venetia Stanley—letters that survive in remarkable detail. But Venetia&apos;s own voice is largely missing. We hear him constantly: his doubts, his political calculations, his emotional dependence. What we don&apos;t have is a clean, balanced record of what surrounded those letters day by day.
            </p>

            <p>
              At some point, that imbalance stopped feeling like a limitation and started feeling like a challenge.
            </p>

            <p>
              So instead of trying to &quot;complete&quot; Venetia&apos;s voice, I decided to do something else.
            </p>

            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              What I decided to do
            </h2>

            <p>
              I decided to approach the problem the way I usually do when something feels unresolved: by experimenting.
            </p>

            <p>
              I&apos;m a technologist, and I&apos;m deeply interested in what recent AI tools make newly possible—not in replacing human judgment, but in handling scale, complexity, and cross-reference in ways that were previously impractical. This felt like exactly the kind of historical problem those tools might help with.
            </p>

            <p>
              So instead of trying to reconstruct Venetia&apos;s missing voice directly, I decided to gather everything else.
            </p>

            <p>
              Every letter I could find.<br />
              Diaries of people around them.<br />
              Cabinet minutes. Parliamentary debates. Newspapers. Political crises. Travel records. Social events. Even the weather.
            </p>

            <p>
              I then aligned all of it chronologically and started asking questions—not grand theories, but small, practical ones that accumulate meaning:
            </p>

            <ul className="list-disc list-inside space-y-3 ml-4 mt-4 text-slate">
              <li>Where was Asquith on this day?</li>
              <li>What had just happened politically before he wrote this letter?</li>
              <li>Where was Venetia, and what was happening in her immediate world?</li>
              <li>What did contemporaries like Violet Asquith, Margot Asquith, Cynthia Asquith, and Diana Manners record in their diaries?</li>
              <li>What was happening in Parliament or Cabinet?</li>
            </ul>

            <p>
              The experiment was simple in spirit but ambitious in scale:
              to see whether modern AI tools could help reconstruct the daily texture of a historical relationship without smoothing it into a story it never was.
            </p>

            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              How the project works
            </h2>

            <p>
              Once the material was assembled, AI became a tool for navigation rather than invention.
            </p>

            <p>
              It helped me:
            </p>

            <ul className="list-disc list-inside space-y-3 ml-4 mt-4 text-slate">
              <li>Align thousands of documents by date</li>
              <li>Trace emotional shifts across correspondence</li>
              <li>Surface patterns that only appear at scale</li>
              <li>Ask questions across sources that were never meant to be read together</li>
            </ul>

            <p>
              Crucially, the AI is not filling gaps with speculation. When something is uncertain, it stays uncertain. When evidence is thin, that thinness is visible.
            </p>

            <p>
              The project moves forward day by day, not chapter by chapter—because that&apos;s how the letters were written, and how the pressure accumulated.
            </p>

            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              What you&apos;ll find on the site
            </h2>

            <p>
              The Venetia Project is designed to be explored, not consumed linearly.
            </p>

            <p>
              It includes:
            </p>

            <ul className="list-disc list-inside space-y-3 ml-4 mt-4 text-slate">
              <li>A daily view reconstructing what was happening on specific dates</li>
              <li>The underlying archive and timelines</li>
              <li>Thematic chapters on key episodes and pressures</li>
              <li>Context around political crises, social circles, and wartime decisions</li>
              <li>Experiments in asking questions directly of the historical record</li>
            </ul>

            <p>
              Some days are dense. Some are empty. Both matter.
            </p>

            <h2 className="text-3xl font-serif font-bold text-navy mt-12 mb-6">
              An open-ended project
            </h2>

            <p>
              This project isn&apos;t finished, and it isn&apos;t definitive.
            </p>

            <p>
              If you spot an error, disagree with an interpretation, have a question, or know of a source I should look at—I&apos;d genuinely like to hear from you.
            </p>

            <p>
              You can reach me at:{' '}
              <a 
                href="mailto:elon@consi.io" 
                className="text-accent-green hover:text-navy transition-colors underline decoration-accent-green/30 underline-offset-4"
              >
                elon@consi.io
              </a>
            </p>

            <p>
              History gets more interesting when it&apos;s examined closely, and more honest when its gaps are left visible.
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
              Sources and perspective
            </h2>

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

              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  13. The Times Archives & special pages from Liverpool Echo, Yorskshire post & Dundee Evenning Telegraph
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Reliability / Contemporary News Source
                </p>
                <p className="text-slate">
                  Daily newspapers from The Times provide contemporaneous accounts of public events, political developments, and social context relevant to the timeline.
                </p>
              </div>
            </div>

            <p className="mt-6">
              Alongside these, I deliberately use secondary sources—biographies and historical studies—not to settle debates, but to show how historians have interpreted the same evidence over time. Including those perspectives makes disagreements, assumptions, and blind spots visible rather than implicit. This is not about replacing historians, but about placing their interpretations back next to the raw material.
            </p>

            <div className="space-y-8 mt-6">
              <div>
                <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                  14. The Asquiths by Colin Clifford
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
                  15. Politics, Religion and Love by Naomi B. Levine
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
                  16. Asquith by Roy Jenkins
                </h4>
                <p className="text-sm font-medium text-accent-green mb-2 uppercase tracking-widest">
                  Classification: High Credibility / Authoritative Biography
                </p>
                <p className="text-slate">
                  A seminal biography written by a former Home Secretary and Chancellor. It offers deep political insight into Asquith&apos;s career and decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}