import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-border-beige/30 flex flex-col items-center gap-2">
      <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-gray">
        <Link href="/about" className="hover:text-navy transition-colors">
          About the Project
        </Link>
        <div className="w-1 h-1 rounded-full bg-border-beige" />
        <span className="opacity-60">
          © {new Date().getFullYear()} The Venetia Project
        </span>
      </div>
    </footer>
  );
}
