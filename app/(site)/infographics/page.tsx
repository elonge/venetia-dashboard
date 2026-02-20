"use client";

import React, { useEffect, useState } from "react";
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
    tileClass: "md:col-span-7 md:row-span-5 md:-rotate-1",
    link: "https://thevenetiaproject.substack.com/p/from-100000-houses-to-a-crumb-of",
    linkLabel: "Read the related Substack article",
  },
  {
    slug: "ww1-origins-domino-effect-infographic",
    title: "World War I Origins",
    description:
      "A chain-reaction view of the July Crisis, showing how alliances, mobilizations, and miscalculations escalated a regional dispute into a world war.",
    alt: "Infographic showing the cascading origins of World War I",
    link: "/ww1-origins",
    linkLabel: "View the World War I origins page",
    tileClass: "md:col-span-5 md:row-span-4 md:translate-y-6 md:rotate-1",
  },
  {
    slug: "venetia-stanley-asquith-letters-infographic",
    title: "Venetia & Asquith Letters",
    description:
      "A visual map of the correspondence network and key moments between Venetia Stanley and H. H. Asquith.",
    alt: "Infographic showing the Venetia Stanley and H. H. Asquith letters and their key moments",
    link: "/",
    linkLabel: "Return to the Venetia Project home page",
    tileClass: "md:col-span-5 md:row-span-5 md:-translate-y-4 md:rotate-1",
  },
  {
    slug: "suffragettes-asquith-infographic",
    title: "Suffragettes & Asquith",
    description:
      "A briefing on the suffragette campaign, tracing key flashpoints and the government's response under Asquith.",
    alt: "Infographic showing suffragette actions and Asquith-era government responses",
    tileClass: "md:col-span-7 md:row-span-4 md:translate-y-2 md:-rotate-1",
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
  const [activeItem, setActiveItem] = useState<(typeof infographics)[number] | null>(null);

  useEffect(() => {
    if (!activeItem) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveItem(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeItem]);

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

        <div className="relative mt-12">
          <div className="pointer-events-none absolute -left-8 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,214,135,0.45),transparent_65%)] blur-2xl" />
          <div className="pointer-events-none absolute right-0 top-32 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(194,78,66,0.25),transparent_65%)] blur-3xl" />
          <div className="grid gap-6 md:auto-rows-[150px] md:grid-cols-12">
          {infographics.map((item) => {
            const pngPath = `/infographics/${item.slug}.png`;
            const pdfPath = `/infographics/${item.slug}.pdf`;

            const imageElement = (
              <div className="relative h-full w-full">
                <Image
                  src={pngPath}
                  alt={item.alt}
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 520px, (min-width: 768px) 45vw, 90vw"
                />
              </div>
            );

            return (
              <article
                key={item.slug}
                className={`group flex h-full min-h-0 flex-col rounded-3xl border border-border-beige bg-card-bg/90 p-6 shadow-[0_24px_46px_rgba(36,27,21,0.12)] transition-transform duration-500 hover:-translate-y-1 ${
                  item.tileClass ?? ""
                }`}
              >
                <div className="relative flex-1 min-h-[260px] aspect-[2/3] md:aspect-auto md:h-full md:min-h-0 overflow-hidden rounded-2xl border border-border-beige bg-page-bg p-3">
                  <button
                    type="button"
                    onClick={() => setActiveItem(item)}
                    className="group relative h-full w-full cursor-zoom-in rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-green/70"
                    aria-label={`Open ${item.title} infographic`}
                  >
                    {imageElement}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-accent-green/30" />
                  </button>
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
                    {item.link && item.linkLabel && (
                      <Link
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border-beige bg-page-bg px-3 py-1 text-accent-green transition-colors hover:text-navy"
                      >
                        View Page
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        </div>

        {activeItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4 py-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeItem.title} infographic`}
            onClick={() => setActiveItem(null)}
          >
            <div
              className="relative w-full max-w-5xl rounded-3xl border border-border-beige bg-page-bg shadow-[0_30px_80px_rgba(20,20,20,0.4)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="absolute right-4 top-4 z-10 rounded-full border border-border-beige bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-gray transition hover:text-navy"
              >
                Close
              </button>
              <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
                <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl border border-border-beige bg-white">
                  <Image
                    src={`/infographics/${activeItem.slug}.png`}
                    alt={activeItem.alt}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 720px, 90vw"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-serif font-semibold text-navy">
                    {activeItem.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate">
                    {activeItem.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-gray">
                    <a
                      href={`/infographics/${activeItem.slug}.pdf`}
                      download
                      className="rounded-full border border-border-beige bg-white px-4 py-2 text-accent-brown transition-colors hover:text-navy"
                    >
                      Download PDF
                    </a>
                    <a
                      href={`/infographics/${activeItem.slug}.png`}
                      download
                      className="rounded-full border border-border-beige bg-white px-4 py-2 text-accent-brown transition-colors hover:text-navy"
                    >
                      Download PNG
                    </a>
                    {activeItem.link && activeItem.linkLabel && (
                      <Link
                        href={activeItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full rounded-2xl border border-accent-green/40 bg-accent-green px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:-translate-y-0.5 hover:bg-accent-green/90 md:w-auto"
                      >
                        View Page
                      </Link>
                    )}
                  </div>
                  <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-gray">
                    Tip: click outside to close
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
