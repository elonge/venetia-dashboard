'use client';

import { createContext, useContext } from 'react';

type ChatLayoutContextValue = {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
};

export const ChatLayoutContext = createContext<ChatLayoutContextValue | null>(null);

export function useChatLayoutContext() {
  const context = useContext(ChatLayoutContext);
  if (!context) {
    throw new Error('useChatLayoutContext must be used within the chat layout');
  }
  return context;
}
