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

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const target = e.target;
      if (!(target instanceof HTMLDetailsElement)) return;

      const summary = target.querySelector('summary');
      const summaryText = summary?.innerText
        ?.replace(/\s+/g, ' ')
        .trim()
        .substring(0, 120);

      const sectionId =
        target.dataset.trackSection ||
        target.closest('section')?.id ||
        undefined;

      trackEvent('Content Toggle', {
        pathname,
        component: target.dataset.trackComponent || 'details',
        item: target.dataset.trackItem || undefined,
        sectionId,
        state: target.open ? 'expanded' : 'collapsed',
        summaryText,
      });
    };

    document.addEventListener('toggle', handleToggle, true);

    return () => {
      document.removeEventListener('toggle', handleToggle, true);
    };
  }, [pathname]);

  return null;
}
