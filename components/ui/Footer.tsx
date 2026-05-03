import React from 'react';
import Link from 'next/link';

type FooterLink = {
  href: string;
  label: string;
};

type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

const SPOTIFY_SHOW_URL = 'https://open.spotify.com/show/6sSEg9Sf5MHjcrqFVIb4SJ';

const defaultLinks: FooterLink[] = [
  { href: '/about', label: 'About the Project' },
  { href: '/precipice-fact-vs-fiction', label: 'Fact vs. Fiction' },
  { href: '/franz-von-papen', label: 'Franz von Papen' },
];

const baseColumns: FooterColumn[] = [
  {
    heading: 'Project',
    links: [
      { href: '/about', label: 'About the Project' },
      { href: '/essentials', label: 'The Essentials' },
    ],
  },
  {
    heading: 'Research',
    links: [
      { href: '/archive_search', label: 'Trace a Person' },
      { href: '/data-room', label: 'Data Room' },
      { href: '/lab', label: 'Simulation Lab' },
    ],
  },
  {
    heading: 'Additional Resources',
    links: [
      { href: '/precipice-fact-vs-fiction', label: 'Fact vs. Fiction' },
      { href: '/edwin-montagu-precipice', label: 'Edwin Montagu' },
      { href: '/franz-von-papen', label: 'Franz von Papen' },
    ],
  },
  {
    heading: 'Listen',
    links: [
      { href: SPOTIFY_SHOW_URL, label: 'Spotify Podcast' },
    ],
  },
];

const baseHrefSet = new Set(baseColumns.flatMap((column) => column.links.map((link) => link.href)));

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function FooterNavLink({ href, label }: FooterLink) {
  const className = 'text-sm leading-relaxed text-navy/80 hover:text-accent-green transition-colors';

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function Footer({ links = defaultLinks }: { links?: FooterLink[] }) {
  const extraLinks = links.filter(
    (link, index) =>
      links.findIndex((candidate) => candidate.href === link.href) === index &&
      !baseHrefSet.has(link.href)
  );
  const columns = extraLinks.length > 0
    ? [...baseColumns, { heading: 'More', links: extraLinks }]
    : baseColumns;

  return (
    <footer className="mt-auto border-t border-border-beige/40 bg-page-bg">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.9fr] lg:gap-16">
          <div>
            <p className="mb-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-muted-gray">
              The Venetia Project
            </p>
            <p className="max-w-2xl text-xl md:text-2xl font-serif leading-snug text-navy">
              Letters, politics, and private lives from the world around Venetia Stanley.
            </p>
            <p className="mt-3 max-w-xl text-sm md:text-base leading-relaxed text-navy/75">
              A historical reading project built from correspondence, chronology,
              and the social networks behind the drama.
            </p>
          </div>

          <div className={`grid gap-8 sm:grid-cols-2 ${columns.length > 4 ? 'xl:grid-cols-5' : 'xl:grid-cols-4'}`}>
            {columns.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <p className="mb-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-gray">
                  {column.heading}
                </p>
                <div className="grid gap-2">
                  {column.links.map((link) => (
                    <FooterNavLink key={link.href} href={link.href} label={link.label} />
                  ))}
                </div>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-border-beige/30 text-[10px] sm:text-xs uppercase tracking-widest text-muted-gray text-left">
          © {new Date().getFullYear()} The Venetia Project
        </div>
      </div>
    </footer>
  );
}
