'use client';

import { useEffect } from 'react';
import { useChatLayoutContext } from './chat-layout-context';
import { useIsMobile } from '@/lib/useMediaQuery';

export function useChatVisibility(show: boolean) {
  const { setShowChat } = useChatLayoutContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    // On mobile, don't automatically open/close chat - user controls it via button
    // On desktop, respect the show parameter
    if (!isMobile) {
      setShowChat(show);
    }
  }, [setShowChat, show, isMobile]);
}
