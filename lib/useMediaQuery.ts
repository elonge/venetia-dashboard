'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport matches a media query
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create handler
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Convenience hook to check if viewport is mobile (< 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * Convenience hook to check if viewport is tablet or larger (>= 768px)
 */
export function useIsTabletOrLarger(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

