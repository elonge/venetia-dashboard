"use client";

import { ArrowRight } from "lucide-react";
import { useState, type ReactNode } from "react";

type BooksCardContext = "fact-vs-fiction" | "after-1867" | "timeline";

type BooksCardProps = {
  context?: BooksCardContext;
  placement: "intro" | "mid" | "end";
  variant?: "inline";
};

const books = [
  { title: "The Empress", author: "Gigi Griffis", isbn: "9781638930167", cover: "https://www.velato.app/shelves/empress/the_empress.jpeg" },
  { title: "The Reluctant Empress", author: "Brigitte Hamann", isbn: "9780571287567", cover: "https://www.velato.app/shelves/empress/the_reluctant_empress.jpg" },
  { title: "Sisi: Empress on Her Own", author: "Allison Pataki", isbn: "9780812989335", cover: "https://www.velato.app/shelves/empress/sisi_empress_on_her_own.jpg" },
  { title: "Twilight of Empire", author: "Greg King and Penny Wilson", isbn: "9781250083029", cover: "https://www.velato.app/shelves/empress/twilight_of_empire.jpg" },
];

const content = {
  "fact-vs-fiction": {
    tracking: "fact_vs_fiction",
    featured: books[0],
    introTitle: <>Loved <em>The Empress</em>? Read the book.</>,
    introDescription: "Discover the official companion novel and nine other books exploring Sisi, her family and the history behind the series.",
    endTitle: "Beyond the Netflix series",
    endDescription: <>Explore the woman behind the legend, the fate of the Habsburgs and the history that inspired <em>The Empress</em>.</>,
    covers: [books[0], books[1], books[2]],
  },
  "after-1867": {
    tracking: "after_1867",
    featured: books[2],
    introTitle: "Continue Sisi’s story beyond the series",
    introDescription: <>Discover historical novels and biographies that explore Elisabeth’s extraordinary life beyond the events of <em>The Empress</em>.</>,
    endTitle: "Explore Elisabeth’s world through books",
    endDescription: "From her search for freedom to the tragedies that shaped her later years, discover ten books about Sisi and the Habsburg dynasty.",
    covers: [books[1], books[2], books[3]],
  },
  "timeline": {
    tracking: "timeline",
    featured: books[1],
    introTitle: "Discover the woman behind the timeline",
    introDescription: "Explore ten books about Elisabeth, from her early years at court to her travels and the final decades of the Habsburg monarchy.",
    endTitle: "Read more about Sisi’s extraordinary life",
    endDescription: "Discover biographies, historical novels and histories of the dynasty that shaped Elisabeth’s world.",
    covers: [books[0], books[1], books[2]],
  },
} satisfies Record<BooksCardContext, {
  tracking: string;
  featured: (typeof books)[number];
  introTitle: ReactNode;
  introDescription: ReactNode;
  endTitle: string;
  endDescription: ReactNode;
  covers: (typeof books)[number][];
}>;

function Cover({ book }: { book: (typeof books)[number] }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-sm bg-stone-200 shadow-md" style={{ width: "100%", aspectRatio: "2 / 3" }}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={book.cover} alt={`${book.title} by ${book.author}`} loading="lazy" decoding="async" onError={() => setFailed(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-center bg-navy p-2 text-center text-white">
          <span className="font-serif text-xs leading-tight break-words">{book.title}</span>
        </div>
      )}
    </div>
  );
}

export default function BooksCard({ placement, variant, context = "fact-vs-fiction" }: BooksCardProps) {
  const copy = content[context];
  const compact = variant === "inline" || placement === "intro";
  const href = `https://www.velato.app/shelves/empress?utm_source=thevenetiaproject&utm_medium=referral&utm_campaign=empress_reading_guide&utm_content=${copy.tracking}_${placement}`;
  const action = "Explore the reading list";

  if (compact) {
    return (
      <aside className="not-prose my-8" aria-label="Further reading about Empress Elisabeth">
        <a href={href} className="group block border-y border-stone-300/80 py-5 text-left no-underline transition-colors hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-brown">
          <div style={{ display: "grid", gridTemplateColumns: "clamp(68px, 22vw, 98px) minmax(0, 1fr)", gap: "16px", alignItems: "start" }}>
            <Cover book={copy.featured} />
            <div className="min-w-0">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-accent-brown">Further reading</p>
              <h3 className="mb-2 font-serif text-xl font-semibold leading-tight text-navy">
                {copy.introTitle}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-navy/80">
                {copy.introDescription}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-brown group-hover:underline">{action}<ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              <p className="mt-2 text-xs text-stone-500">A curated guide on Velato</p>
            </div>
          </div>
        </a>
      </aside>
    );
  }

  return (
    <aside className="not-prose" aria-label="Books about the world of The Empress">
      <a href={href} className="group block border-y border-stone-300/80 bg-white/30 px-4 py-7 text-center no-underline transition-colors hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-brown sm:px-8 sm:py-9">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-accent-brown">Further reading</p>
        <h3 className="font-serif text-3xl font-semibold leading-tight text-navy">{copy.endTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-navy/80">{copy.endDescription}</p>
        <div className="mx-auto my-6" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", alignItems: "end", gap: "12px", width: "100%", maxWidth: "350px" }}>
          {copy.covers.map((book) => <Cover key={book.isbn} book={book} />)}
        </div>
        <span className="inline-flex items-center justify-center gap-2 border border-accent-brown px-4 py-3 text-sm font-semibold text-accent-brown transition-colors group-hover:bg-accent-brown group-hover:text-white">Explore the 10 recommended books <ArrowRight size={16} className="shrink-0" aria-hidden="true" /></span>
        <p className="mt-3 text-xs text-stone-500">A curated reading list on Velato</p>
      </a>
    </aside>
  );
}
