'use client';

import { useEffect } from 'react';
import { useChatLayoutContext } from './chat-layout-context';

export function useChatVisibility(show: boolean) {
  const { setShowChat } = useChatLayoutContext();

  useEffect(() => {
    setShowChat(show);
  }, [setShowChat, show]);
}
