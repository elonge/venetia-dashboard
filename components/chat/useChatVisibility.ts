'use client';

import { useEffect } from 'react';
import { useChatLayoutContext } from './chat-layout-context';
import { useIsMobile } from '@/lib/useMediaQuery';

export function useChatVisibility(show: boolean) {
  const { setShowChat } = useChatLayoutContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    // On mobile, don't automatically open/close chat - user controls it via button.
    // On desktop, only auto-open when a page explicitly opts in.
    // Never auto-close here so the user's manual open/minimize state can persist while browsing.
    if (!isMobile && show) {
      setShowChat(true);
    }
  }, [setShowChat, show, isMobile]);
}
