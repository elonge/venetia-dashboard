'use client';

import React from 'react';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

export default function AboutPage() {
  useChatVisibility(false);

  return (
    <div className="h-full bg-[#E8E4DC]">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-serif font-bold text-[#1A2A40] mb-8">
            What Is The Venetia Project?
          </h1>

          <p className="text-xl text-[#6B7280] mb-8 italic">
            When AI meets primary sources.
          </p>

          <div className="space-y-6 text-[#1A2A40] leading-relaxed">
            <p>
              The Venetia Project is a historical reconstruction experiment that blends archival research, data analysis, and modern AI tools to retell, day by day, the private world surrounding Venetia Stanley, Prime Minister H. H. Asquith, and Edwin Montagu during the turbulent years 1912–1916.
            </p>

            <p>
              It rebuilds history not as a summary, but as a living timeline of letters, diaries, Cabinet minutes, political pressures, emotional turning points, and shifting alliances.
            </p>

            <p>
              At its core, the project explores one question:
            </p>

            <p className="text-lg font-medium italic text-[#4A7C59]">
              What really happened—emotionally, politically, privately—on each day of this extraordinary relationship?
            </p>

            <h2 className="text-3xl font-serif font-bold text-[#1A2A40] mt-12 mb-6">
              How the Reconstruction Works
            </h2>

            <p>
              Using the primary sources listed in the research brief—letters, diaries, Hansard debates, Cabinet papers, memoirs, and eyewitness writing—the system attempts to answer for every date:
            </p>

            <ul className="list-disc list-inside space-y-3 ml-4 mt-4">
              <li>Where were Venetia, Asquith, and Edwin?</li>
              <li>Did they meet? With whom?</li>
              <li>How many letters were exchanged that day, and what was their tone?</li>
              <li>What topics appeared—politics, affection, gossip, anxiety?</li>
              <li>What was happening in Parliament or Cabinet?</li>
              <li>What did contemporaries like Violet Asquith, Margot Asquith, Cynthia Asquith, and Diana Manners record in their diaries?</li>
              <li>What did the newspapers report?</li>
              <li>Were there noticeable shifts in mood, influence, or emotional distance?</li>
            </ul>

            <p className="mt-6">
              The website compiles this into:
            </p>

            <ul className="list-disc list-inside space-y-3 ml-4 mt-4">
              <li>Letter-volume timelines</li>
              <li>Topic heat maps</li>
              <li>Emotional tone graphs</li>
              <li>Daily summaries</li>
              <li>Maps of movement</li>
              <li>Cross-perspective views ("what others did")</li>
              <li>Links between private correspondence and public events</li>
            </ul>

            <p className="mt-6">
              It turns the scattered sources of 1912–1916 into a unified, interactive archive.
            </p>

            <h2 className="text-3xl font-serif font-bold text-[#1A2A40] mt-12 mb-6">
              AI Tools Used in the Project
            </h2>

            <p>
              This project was built through multiple AI tools working together, each chosen for its strengths.
            </p>

            <div className="space-y-6 mt-6">
              <div>
                <h3 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">NotebookLM</h3>
                <p className="text-[#6B7280]">
                  To summarize diaries, build daily timelines, and identify recurring themes across long documents.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">Gemini</h3>
                <p className="text-[#6B7280]">
                  For linguistic extraction, emotional modeling, and detecting tone shifts across letters.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">Gemini Gem</h3>
                <p className="text-[#6B7280]">
                  For structuring data, clustering topics, and generating comparative timelines.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">Claude</h3>
                <p className="text-[#6B7280]">
                  For contextual reasoning, resolving conflicting accounts, and reconstructing ambiguous or partial days.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">Codex</h3>
                <p className="text-[#6B7280]">
                  For generating scripts, data pipelines, and automations that processed the source material.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">Cursor</h3>
                <p className="text-[#6B7280]">
                  My main development environment—connecting AI-assisted reasoning directly to the codebase while building the site.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">Base44</h3>
                <p className="text-[#6B7280]">
                  Used heavily for vibe-coding the entire interface: iterating layouts, UI components, design decisions, and stylistic polish.
                </p>
              </div>
            </div>

            <p className="mt-6">
              Together, these tools made it possible to build a research system that combines storytelling, data, and historical methodology.
            </p>

            <h2 className="text-3xl font-serif font-bold text-[#1A2A40] mt-12 mb-6">
              Why I Built This
            </h2>

            <p>
              I built the Venetia Project for two reasons:
            </p>

            <div className="space-y-4 mt-6">
              <div>
                <p className="font-semibold text-[#1A2A40] mb-2">1. I love history.</p>
                <p className="text-[#6B7280]">
                  Especially the moments when personal relationships intersect with political events — when private letters illuminate public decisions, and when human emotion reshapes the course of nations.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#1A2A40] mb-2">2. I love working with new AI technologies.</p>
                <p className="text-[#6B7280]">
                  This project allowed me to combine both passions: to take cutting-edge tools like Gemini, Claude, Cursor, Codex, NotebookLM, and Base44, and use them not to replace history, but to restructure it, explore it, and bring it to life.
                </p>
              </div>
            </div>

            <p className="mt-6">
              The result is a personal experiment — part research platform, part storytelling engine, part technical challenge — built out of curiosity, admiration for the past, and excitement for the future.
            </p>

            <h2 className="text-3xl font-serif font-bold text-[#1A2A40] mt-12 mb-6">
              Sources
            </h2>

            <p className="mb-6 text-[#6B7280]">
              Here is an assessment of the reliability and credibility of the provided sources, classified by their nature (primary vs. secondary) and the specific context of their creation.
            </p>

            <h3 className="text-2xl font-serif font-semibold text-[#1A2A40] mt-10 mb-4">
              Primary Sources (Diaries, Letters, and Official Records)
            </h3>

            <div className="space-y-8 mt-6">
              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  1. Hansard Parliamentary Debates (Various files from 1912–1915)
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: High Reliability / Official Record
                </p>
                <p className="text-[#6B7280]">
                  These files contain verbatim transcripts of speeches and debates in the House of Commons. As an official government record, they are the definitive source for what was publicly said in Parliament. However, they represent political posturing and public policy, not necessarily the private thoughts or secret motivations of the speakers.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  2. Winston S. Churchill: Companion Volumes (Vol II Part 3; Vol III Parts 1 & 2)
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: Highest Reliability / Primary Documentary Collection
                </p>
                <p className="text-[#6B7280]">
                  These volumes, edited by Randolph Churchill and Martin Gilbert, consist of raw primary documents: telegrams, secret memos, and private letters from Churchill, Asquith, Fisher, and others. Because these are reproductions of the original documents (e.g., "Admiralty to all HM ships... COMMENCE HOSTILITIES"), they are the most reliable factual sources for operational and administrative history, free from retrospective alteration by the authors.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  3. H.H. Asquith: Letters to Venetia Stanley (Edited by M. & E. Brock)
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: High Credibility (Psychological/Political) / Primary Source
                </p>
                <p className="text-[#6B7280]">
                  These are contemporary letters written by the Prime Minister. They offer a unique, unfiltered view of the executive mindset, containing state secrets and private anxieties shared in real-time. The editors note that Asquith was "an extremely assiduous correspondent". Their reliability is high regarding Asquith's state of mind, but one must account for his desire to impress or confide in his lover. The editors also note that Asquith later tried to edit these for publication to hide the intimacy, but this volume restores the original text.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  4. Margot Asquith's Great War Diary 1914–1916 (Edited by M. & E. Brock)
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: Mixed Reliability / Highly Subjective Primary Source
                </p>
                <p className="text-[#6B7280]">
                  While valuable for its access to the Prime Minister's inner circle, the editors explicitly warn that Margot was "an opinionated egotist, often inaccurate... and occasionally prone to fantasy". She wrote notes contemporaneously but often "wrote up" the diary later, leading to confusion in dating. It is a vital source for atmosphere and gossip but should be treated with caution regarding hard facts.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  5. Lloyd George: A Diary by Frances Stevenson (Edited by A.J.P. Taylor)
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: High Credibility / Partisan Primary Source
                </p>
                <p className="text-[#6B7280]">
                  Stevenson was both Lloyd George's secretary and mistress, placing her at the center of power. The editor notes she possessed a "lively and skeptical intelligence". However, the diary is described as "very much Lloyd George's version of events," meaning it reflects his biases and justifications. It is highly reliable for understanding Lloyd George's perspective but less so for impartial facts about his rivals.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  6. Lady Cynthia Asquith: Diaries 1915–1918
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: High Credibility (Social/Atmospheric) / Primary Source
                </p>
                <p className="text-[#6B7280]">
                  These diaries are described as an "intimate, unselfconscious record". They are highly reliable for social history, the mood of the aristocracy during the war, and the "end of an era". As she was the daughter-in-law of the Prime Minister, her political observations are privileged but informal.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  7. Lord Riddell's War Diary 1914–1918
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: High Credibility / Journalistic Primary Source
                </p>
                <p className="text-[#6B7280]">
                  Riddell was a press baron and intermediary between the government and the press. His diary is a "day-to-day" record of his interactions with Lloyd George and others. It is highly reliable regarding the relationship between the media and the government and the management of public information.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  8. The Venetia Stanley & Edwin Montagu Correspondence
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: High Reliability / Personal Primary Source
                </p>
                <p className="text-[#6B7280]">
                  These are raw transcripts of private letters. They are highly credible evidence of the personal relationship, emotional states, and social maneuvering between Venetia and Edwin. They serve as a factual check on the social timeline of the Asquith circle.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-serif font-semibold text-[#1A2A40] mt-12 mb-4">
              Secondary Sources (Biographies and Histories)
            </h3>

            <div className="space-y-8 mt-6">
              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  9. The Supreme Command 1914–1918 by Lord Hankey
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: High Reliability / Authoritative Memoir-History
                </p>
                <p className="text-[#6B7280]">
                  Hankey was the Secretary to the War Council and kept detailed diaries. He dedicates the work to the efficient conduct of war administration. While technically a memoir (written in 1961), he claims to rely on "diary... papers and recollections," checking them against other histories. It is considered a definitive administrative history of the war's direction, though written from the perspective of a super-bureaucrat.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  10. The Asquiths by Colin Clifford
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: High Reliability / Secondary Biography
                </p>
                <p className="text-[#6B7280]">
                  Published in 2002, this is a synthesis of diaries and letters (including Margot's and Violet's). It provides a reliable narrative overview, utilizing the primary sources to construct a coherent family biography. It helps contextualize the raw data found in the diaries.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  11. Politics, Religion and Love (Biography of Edwin Montagu) by Naomi B. Levine
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: Good Reliability / Secondary Biography
                </p>
                <p className="text-[#6B7280]">
                  This text reconstructs the life of Edwin Montagu using his letters and other primary archives. It offers analysis and hindsight that the primary sources lack, particularly regarding Montagu's Jewish identity and his political isolation.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  12. The Rainbow Comes and Goes by Lady Diana Cooper
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: Medium Reliability / Memoir
                </p>
                <p className="text-[#6B7280]">
                  Written in 1958, this is a retrospective memoir. The author herself admits her old letters are "dreadfully facetious stuff". While it captures the spirit and romance of the Coterie and the era, memoirs written decades later are generally less factually reliable than contemporary diaries regarding specific dates and conversations.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-serif font-semibold text-[#1A2A40] mb-2">
                  13. Champion Redoubtable / Lantern Slides (Violet Bonham Carter)
                </h4>
                <p className="text-sm font-medium text-[#4A7C59] mb-2">
                  Classification: High Credibility / Edited Primary Source
                </p>
                <p className="text-[#6B7280]">
                  These texts are edited selections of diaries and letters from Asquith's daughter. Violet was a fierce partisan for her father; the introduction notes she possessed a "strong, almost eagle-swooping personality". While the documents themselves are primary records, the selection and Violet's own perspective are intensely loyal to the Asquithian liberal viewpoint.
                </p>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-[#D1D5DB]">
              <p className="text-[#6B7280]">
                For any questions or requests, please contact me by email:{' '}
                <a 
                  href="mailto:elon@consi.io" 
                  className="text-[#4A7C59] hover:text-[#3A6B49] underline"
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
