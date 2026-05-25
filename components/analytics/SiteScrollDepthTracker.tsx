'use client';

import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/mixpanel';

const SCROLL_CHECKPOINTS = [10, 25, 50, 75, 90] as const;

type ScrollMetrics = {
  isScrollable: boolean;
  scrollHeight: number;
  scrollPercent: number;
  scrollTop: number;
  viewportHeight: number;
};

function measureScroll(container: HTMLElement): ScrollMetrics {
  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const viewportHeight = container.clientHeight;
  const maxScrollTop = Math.max(scrollHeight - viewportHeight, 0);
  const scrollPercent =
    maxScrollTop === 0
      ? 0
      : Math.min(100, Math.round((scrollTop / maxScrollTop) * 100));

  return {
    isScrollable: maxScrollTop > 0,
    scrollHeight,
    scrollPercent,
    scrollTop,
    viewportHeight,
  };
}

export default function SiteScrollDepthTracker({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const pathname = usePathname();
  const latestMetricsRef = useRef<ScrollMetrics | null>(null);
  const maxScrollPercentRef = useRef(0);
  const maxScrollTopRef = useRef(0);
  const reachedCheckpointsRef = useRef<Set<number>>(new Set());
  const rafIdRef = useRef<number | null>(null);
  const hasSentSummaryRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    reachedCheckpointsRef.current = new Set();
    maxScrollPercentRef.current = 0;
    maxScrollTopRef.current = 0;
    latestMetricsRef.current = measureScroll(container);
    hasSentSummaryRef.current = false;

    const trackSummary = (reason: 'cleanup' | 'pagehide') => {
      if (hasSentSummaryRef.current) {
        return;
      }

      const metrics = latestMetricsRef.current ?? measureScroll(container);
      const maxScrollPercent = Math.max(
        maxScrollPercentRef.current,
        metrics.scrollPercent
      );
      const maxScrollTop = Math.max(maxScrollTopRef.current, metrics.scrollTop);

      hasSentSummaryRef.current = true;

      trackEvent(
        'Page Scroll Summary',
        {
          did_scroll: maxScrollTop > 0,
          max_scroll_percent: maxScrollPercent,
          max_scroll_top: maxScrollTop,
          pathname,
          reached_checkpoints: Array.from(reachedCheckpointsRef.current),
          scroll_height: metrics.scrollHeight,
          scrollable: metrics.isScrollable,
          summary_reason: reason,
          url: window.location.href,
          viewport_height: metrics.viewportHeight,
        },
        { transport: 'sendBeacon' }
      );
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        return;
      }

      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;

        const metrics = measureScroll(container);
        latestMetricsRef.current = metrics;
        maxScrollPercentRef.current = Math.max(
          maxScrollPercentRef.current,
          metrics.scrollPercent
        );
        maxScrollTopRef.current = Math.max(
          maxScrollTopRef.current,
          metrics.scrollTop
        );

        if (!metrics.isScrollable) {
          return;
        }

        for (const checkpoint of SCROLL_CHECKPOINTS) {
          if (
            metrics.scrollPercent >= checkpoint &&
            !reachedCheckpointsRef.current.has(checkpoint)
          ) {
            reachedCheckpointsRef.current.add(checkpoint);

            trackEvent('Page Scroll Depth', {
              checkpoint,
              did_scroll: maxScrollTopRef.current > 0,
              max_scroll_percent: maxScrollPercentRef.current,
              max_scroll_top: maxScrollTopRef.current,
              pathname,
              scroll_height: metrics.scrollHeight,
              scroll_percent: metrics.scrollPercent,
              scroll_top: metrics.scrollTop,
              url: window.location.href,
              viewport_height: metrics.viewportHeight,
            });
          }
        }
      });
    };

    const handlePageHide = () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      latestMetricsRef.current = measureScroll(container);
      maxScrollPercentRef.current = Math.max(
        maxScrollPercentRef.current,
        latestMetricsRef.current.scrollPercent
      );
      maxScrollTopRef.current = Math.max(
        maxScrollTopRef.current,
        latestMetricsRef.current.scrollTop
      );
      trackSummary('pagehide');
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', handlePageHide);

      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      latestMetricsRef.current = measureScroll(container);
      maxScrollPercentRef.current = Math.max(
        maxScrollPercentRef.current,
        latestMetricsRef.current.scrollPercent
      );
      maxScrollTopRef.current = Math.max(
        maxScrollTopRef.current,
        latestMetricsRef.current.scrollTop
      );
      trackSummary('cleanup');
    };
  }, [containerRef, pathname]);

  return null;
}
