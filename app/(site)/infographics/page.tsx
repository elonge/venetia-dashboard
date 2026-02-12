"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useChatVisibility } from "@/components/chat/useChatVisibility";

const infographics = [
  {
    slug: "weimar-republic-hyperinflation-1923-infographic",
    title: "Weimar Hyperinflation, 1923",
    description:
      "A visual briefing on the inflationary spiral that hollowed out the Weimar economy and accelerated political instability.",
    alt: "Infographic showing the hyperinflation crisis in the Weimar Republic",
  },
  {
    slug: "ww1-origins-domino-effect-infographic",
    title: "World War I Origins",
    description:
      "A chain-reaction view of the July Crisis, showing how alliances, mobilizations, and miscalculations escalated a regional dispute into a world war.",
    alt: "Infographic showing the cascading origins of World War I",
    link: "/ww1-origins",
    linkLabel: "View the World War I origins page",
  },
  {
    slug: "venetia-stanley-asquith-letters-infographic",
    title: "Venetia & Asquith Letters",
    description:
      "A visual map of the correspondence network and key moments between Venetia Stanley and H. H. Asquith.",
    alt: "Infographic showing the Venetia Stanley and H. H. Asquith letters and their key moments",
    link: "/",
    linkLabel: "Return to the Venetia Project home page",
  },
];

const socialLinks = [
  { label: "Podcast", href: process.env.NEXT_PUBLIC_PODCAST_URL },
  { label: "Substack", href: process.env.NEXT_PUBLIC_SUBSTACK_URL },
].filter(
  (link): link is { label: string; href: string } => Boolean(link.href)
);

export default function InfographicsPage() {
  useChatVisibility(false);

  return (
    <div className="min-h-screen bg-page-bg text-ink">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-border-beige bg-card-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-brown">
            Visual Briefings
          </span>
          <h1 className="mt-6 text-4xl font-serif font-bold text-navy md:text-5xl">
            Historical Data Visualizations
          </h1>
          <p className="mt-4 text-lg text-slate">
Compact visual summaries of a world in transition. While rooted in the archives of the Edwardian period, these briefings explore the cascading political and economic events of the 20th century          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {infographics.map((item) => {
            const pngPath = `/infographics/${item.slug}.png`;
            const pdfPath = `/infographics/${item.slug}.pdf`;

            const imageElement = (
              <Image
                src={pngPath}
                alt={item.alt}
                width={1024}
                height={1536}
                className="h-auto w-full object-cover"
                sizes="(min-width: 1024px) 520px, (min-width: 768px) 45vw, 90vw"
              />
            );

            return (
              <article
                key={item.slug}
                className="rounded-3xl border border-border-beige bg-card-bg/90 p-6 shadow-[0_24px_46px_rgba(36,27,21,0.12)]"
              >
                <div className="overflow-hidden rounded-2xl border border-border-beige bg-page-bg">
                  {item.link ? (
                    <Link href={item.link} aria-label={item.linkLabel} className="block">
                      {imageElement}
                    </Link>
                  ) : (
                    imageElement
                  )}
                </div>
                <div className="mt-6">
                  <h2 className="text-2xl font-serif font-semibold text-navy">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate">
                    {item.description}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-gray">
                    <span>Download High-Res PDF/PNG:</span>
                    <a
                      href={pdfPath}
                      download
                      className="rounded-full border border-border-beige bg-page-bg px-3 py-1 text-accent-brown transition-colors hover:text-navy"
                    >
                      PDF
                    </a>
                    <a
                      href={pngPath}
                      download
                      className="rounded-full border border-border-beige bg-page-bg px-3 py-1 text-accent-brown transition-colors hover:text-navy"
                    >
                      PNG
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

{socialLinks.length > 0 && (
  <div className="mt-16 overflow-hidden rounded-2xl border border-border-beige bg-section-bg/90 shadow-sm transition-all hover:shadow-md">
    <div className="flex flex-col items-center p-8 md:flex-row md:justify-between">
      <div className="mb-6 text-center md:mb-0 md:text-left">
        <h3 className="font-serif text-xl font-bold text-navy">
          The Shadows of History
        </h3>
        <p className="mt-1 max-w-md text-sm italic text-slate">
          Behind every headline is a hidden correspondence. Explore the private letters and untold stories of the figures who moved in the shadows of the Great War.
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-accent-green/30 bg-white px-6 py-2.5 text-sm font-semibold text-accent-green transition-all hover:border-accent-green hover:bg-accent-green hover:text-white"
          >
            {link.label}
            <span className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  </div>
)}      </section>
    </div>
  );
}
