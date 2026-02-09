import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-border-beige/30 flex flex-col items-center gap-2">
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-gray text-center">
        <Link href="/about" className="hover:text-navy transition-colors">
          About the Project
        </Link>
        <div className="hidden sm:block w-1 h-1 rounded-full bg-border-beige" />
        <Link href="/precipice-fact-vs-fiction" className="hover:text-navy transition-colors">
          Fact vs. Fiction
        </Link>
        <div className="hidden sm:block w-1 h-1 rounded-full bg-border-beige" />
        <span className="opacity-60">
          © {new Date().getFullYear()} The Venetia Project
        </span>
      </div>
    </footer>
  );
}
