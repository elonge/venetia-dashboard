import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, BookOpen, CalendarDays, Scale, Sparkles } from "lucide-react";

const PAGE_URL = "https://www.thevenetiaproject.com/sisi";

export const metadata: Metadata = {
  title: "Empress Elisabeth (Sisi) Archive Case Study | The Venetia Project",
  description:
    "Testing Netflix's The Empress and popular Sisi mythology against surviving Habsburg letters, diaries, and sealed poetry—a primary-source case study from The Venetia Project.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Empress Elisabeth (Sisi) Archive Case Study | The Venetia Project",
    description:
      "Primary-source fact-checks, biographical timelines, and archival context on Empress Elisabeth of Austria and Emperor Franz Joseph.",
    url: PAGE_URL,
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Empress Elisabeth (Sisi) Archive Case Study",
  description:
    "A primary-source examination of Empress Elisabeth of Austria, comparing Netflix's The Empress and popular legend against surviving Habsburg correspondence.",
  url: PAGE_URL,
  isPartOf: {
    "@type": "WebSite",
    name: "The Venetia Project",
    url: "https://www.thevenetiaproject.com",
  },
  hasPart: [
    {
      "@type": "Article",
      name: "Is Netflix's 'The Empress' Season 3 a True Story? Fact vs. Fiction",
      url: "https://www.thevenetiaproject.com/sisi/the-empress-fact-vs-fiction",
    },
    {
      "@type": "Article",
      name: "Empress Elisabeth (Sisi): Later Life After 1867 & Aftermath",
      url: "https://www.thevenetiaproject.com/sisi/after-1867",
    },
    {
      "@type": "Article",
      name: "Empress Elisabeth of Austria (Sisi): Complete Biographical Timeline (1837–1898)",
      url: "https://www.thevenetiaproject.com/sisi/timeline",
    },
  ],
};

const CLUSTER_PAGES = [
  {
    href: "/sisi/the-empress-fact-vs-fiction",
    eyebrow: "Series Verification • 1859–1867",
    title: "The Empress Season 3: Fact vs. Fiction",
    description:
      "A scene-by-scene check of Netflix's final season against Habsburg archives—examining Count Andrássy, Franz Joseph's fictional mistress Terese, Marie Valerie's paternity, and Maximilian in Mexico.",
    cta: "Read the Fact-Check",
    icon: Scale,
  },
  {
    href: "/sisi/after-1867",
    eyebrow: "Later Life • 1868–1898",
    title: "What Happened to Sisi After 1867?",
    description:
      "Where the series ends, the stranger true story begins: Elisabeth's withdrawal from Vienna, her arrangement with Katharina Schratt, Crown Prince Rudolf's death at Mayerling, and Geneva.",
    cta: "Explore Her Later Years",
    icon: Sparkles,
  },
  {
    href: "/sisi/timeline",
    eyebrow: "Chronological Dossier • 1837–1898",
    title: "Empress Elisabeth: Complete Timeline",
    description:
      "Fourteen key milestones from her Bavarian childhood at Possenhofen and her 1854 Vienna wedding to her assassination on Lake Geneva.",
    cta: "View the Full Timeline",
    icon: CalendarDays,
  },
] as const;

export default function SisiHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-page-bg text-ink">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          {/* Header */}
          <header className="border-b border-border-beige/70 pb-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-accent-brown">
              <BookOpen size={14} />
              <span>The Venetia Project • Comparative Case Study</span>
            </div>

            <h1 className="mt-4 text-4xl font-serif font-bold leading-tight text-navy md:text-5xl">
              Empress Elisabeth (Sisi): Letters, Myth &amp; Historical Reality
            </h1>

            <p className="mt-5 max-w-3xl text-xl font-serif italic leading-relaxed text-navy/85">
              Testing the romantic &ldquo;Sisi&rdquo; legend and Netflix&apos;s <em>The Empress</em> against surviving Habsburg correspondence and diaries.
            </p>

            {/* Editorial Bridge explaining the Venetia Project connection */}
            <div className="mt-7 rounded-sm border-l-4 border-accent-brown bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-brown">
                Why This Case Study Is on The Venetia Project
              </p>
              <p className="mt-2 text-base leading-relaxed text-navy/90">
                <strong>The Venetia Project</strong> began with the surviving wartime letters between British Prime Minister H.H. Asquith and Venetia Stanley—a correspondence in which one side survives in abundance while the woman&apos;s own replies vanished, leaving her life to be reshaped by later fiction and gossip.
              </p>
              <p className="mt-3 text-base leading-relaxed text-navy/90">
                Empress Elisabeth of Austria presents the exact same archival asymmetry. Emperor Franz Joseph wrote to her constantly and preserved his side of their correspondence, while Elisabeth destroyed nearly all of her letters to him. To recover her actual voice, historians turn to her letters to confidante Ida Ferenczy, the diaries of her daughter Marie Valerie, and the anti-monarchist poems she sealed in Switzerland.
              </p>
            </div>
          </header>

          {/* 3-Card Cluster Navigation */}
          <section className="py-12">
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-gray">
                Explore the Series
              </p>
              <h2 className="mt-1 text-2xl font-serif font-semibold text-navy">
                Three Ways Into the History
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {CLUSTER_PAGES.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="group flex flex-col justify-between rounded-sm border border-border-beige/70 bg-white/80 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-green/50 hover:bg-white"
                  >
                    <div>
                      <div className="flex items-center justify-between text-accent-brown">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                          {page.eyebrow}
                        </span>
                        <Icon size={16} className="shrink-0 opacity-80" />
                      </div>
                      <h3 className="mt-3 text-xl font-serif font-bold leading-snug text-navy group-hover:text-accent-green transition-colors">
                        {page.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate">
                        {page.description}
                      </p>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-brown group-hover:text-navy">
                      <span>{page.cta}</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Primary Sources Note + Link Back to Main Archive */}
          <footer className="border-t border-border-beige/70 pt-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-gray">
                  Primary Archival Foundations
                </p>
                <p className="mt-2 text-sm leading-relaxed text-navy/80">
                  Built on Brigitte Hamann&apos;s archival studies (<em>The Reluctant Empress</em> and <em>Das poetische Tagebuch</em>), Beatrix Meyer&apos;s edition of Elisabeth&apos;s letters to Ida Ferenczy, Georg Nostitz-Rieneck&apos;s edition of Franz Joseph&apos;s letters, and Archduchess Marie Valerie&apos;s diaries.
                </p>
              </div>

              <Link
                href="/precipice-fact-vs-fiction"
                className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-border-beige bg-stone-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-navy transition-colors hover:border-accent-brown hover:bg-white"
              >
                <span>Compare: Precipice Fact-Check</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}