'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initMixpanel, trackEvent } from '@/lib/mixpanel';

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/1914-diary': '1914 Diary',
  '/about': 'About',
  '/archive_search': 'Archive Search',
  '/chapter': 'Chapters',
  '/chat': 'Chat',
  '/data-room': 'Data Room',
  '/edwin-montagu-precipice': 'Edwin Montagu Precipice',
  '/essentials': 'Essentials',
  '/franz-von-papen': 'Franz von Papen',
  '/infographics': 'Infographics',
  '/lab': 'Simulation Lab',
  '/precipice-fact-vs-fiction': 'Precipice Fact vs Fiction',
  '/qa': 'Q&A',
  '/venetia': 'Venetia Biography',
  '/venetia-stanley-after-1915': 'Venetia Stanley After 1915',
  '/venetia-stanley-edwin-montagu-marriage': 'Venetia and Edwin Marriage',
  '/ww1-origins': 'WWI Origins',
};

function getPageName(pathname: string) {
  if (pathname.startsWith('/chapter/')) return 'Chapter Detail';
  if (pathname.startsWith('/daily/')) return 'Daily Entry';

  return PAGE_NAMES[pathname] ?? 'Unknown Page';
}

function cleanText(value: string | null | undefined, maxLength = 120) {
  return value?.replace(/\s+/g, ' ').trim().substring(0, maxLength) || undefined;
}

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
      if (!(e.target instanceof Element)) return;

      // Use the containing control instead of the nested icon/span that happened
      // to receive the click. data-track-action can provide a stable action name
      // when visible text or an accessibility label is not descriptive enough.
      const target = e.target;
      const interactiveElement = target.closest<HTMLElement>(
        '[data-track-action], a, button, summary, input, select, textarea, [role="button"], [role="link"], [role="tab"]'
      );
      const trackedElement = interactiveElement ?? target;
      const pageName = getPageName(pathname);
      const href =
        trackedElement instanceof HTMLAnchorElement
          ? trackedElement.href
          : trackedElement.getAttribute('href') || undefined;
      const action =
        interactiveElement?.dataset.trackAction ||
        cleanText(interactiveElement?.getAttribute('aria-label')) ||
        cleanText(interactiveElement?.getAttribute('title')) ||
        cleanText(interactiveElement?.textContent, 80) ||
        (href ? 'Open link' : undefined) ||
        `Click ${trackedElement.tagName.toLowerCase()}`;

      const elementInfo = {
        pathname,
        pageName,
        action,
        tagName: trackedElement.tagName,
        id: trackedElement.id,
        className:
          typeof trackedElement.className === 'string'
            ? trackedElement.className
            : undefined,
        innerText: cleanText(trackedElement.textContent, 80),
        href,
        alt:
          trackedElement instanceof HTMLImageElement
            ? trackedElement.alt
            : trackedElement.querySelector('img')?.alt,
        title: trackedElement.getAttribute('title') || undefined,
        sectionId: trackedElement.closest('section')?.id || undefined,
        x: e.clientX,
        y: e.clientY,
      };

      // Filter out empty properties to keep it clean
      const cleanInfo = Object.fromEntries(
        Object.entries(elementInfo).filter(([, v]) => v != null && v !== '')
      );

      trackEvent('User Click', cleanInfo);
      trackEvent(`${pageName}: Click`, cleanInfo);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [pathname]);

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
