import React from 'react';
import Link from 'next/link';

type FooterLink = {
  href: string;
  label: string;
};

const defaultLinks: FooterLink[] = [
  { href: '/about', label: 'About the Project' },
  { href: '/precipice-fact-vs-fiction', label: 'Fact vs. Fiction' },
  { href: '/franz-von-papen', label: 'Franz von Papen' },

];

export function Footer({ links = defaultLinks }: { links?: FooterLink[] }) {
  return (
    <footer className="mt-auto py-8 border-t border-border-beige/30 flex flex-col items-center gap-2">
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-gray text-center">
        {links.map((link, index) => (
          <React.Fragment key={link.href}>
            <Link href={link.href} className="hover:text-navy transition-colors">
              {link.label}
            </Link>
            {index < links.length - 1 && (
              <div className="hidden sm:block w-1 h-1 rounded-full bg-border-beige" />
            )}
          </React.Fragment>
        ))}
        <div className="hidden sm:block w-1 h-1 rounded-full bg-border-beige" />
        <span className="opacity-60">
          © {new Date().getFullYear()} The Venetia Project
        </span>
      </div>
    </footer>
  );
}
