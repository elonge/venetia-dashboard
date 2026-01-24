'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initMixpanel, trackEvent } from '@/lib/mixpanel';

export default function MixpanelAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url += `?${searchParams.toString()}`;
      }
      trackEvent('Page View', { url, pathname });
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Try to get meaningful info about what was clicked
      const elementInfo = {
        tagName: target.tagName,
        id: target.id,
        className: target.className,
        innerText: target.innerText?.substring(0, 50), // Truncate to avoid huge payloads
        href: (target as HTMLAnchorElement).href,
        alt: (target as HTMLImageElement).alt,
        title: target.title,
        x: e.clientX,
        y: e.clientY,
      };

      // Filter out empty properties to keep it clean
      const cleanInfo = Object.fromEntries(
        Object.entries(elementInfo).filter(([, v]) => v != null && v !== '')
      );

      trackEvent('User Click', cleanInfo);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}
