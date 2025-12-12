'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#E8E4DC]">
      {/* Header */}
      <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[#1A2A40] hover:text-[#4A7C59] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <h1 className="font-serif text-lg font-medium">The Venetia Project</h1>
          </Link>
        </div>
        <span className="text-[#6B7280] text-base">When AI Meets Primary Sources</span>
        <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center">
          <span className="text-white text-xs font-medium">V</span>
        </div>
      </header>

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
          </div>
        </div>
      </div>
    </div>
  );
}

