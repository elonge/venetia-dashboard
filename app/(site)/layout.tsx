'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import { ChatLayoutContext } from '@/components/chat/chat-layout-context';

const CHAT_MIN_WIDTH = 300;
const CHAT_MAX_WIDTH = 600;
const CHAT_DEFAULT_WIDTH = 400;
const HEADER_HEIGHT = 73;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    const savedChatWidth = localStorage.getItem('chatWidth');
    if (savedChatWidth) {
      const width = parseInt(savedChatWidth, 10);
      if (width >= CHAT_MIN_WIDTH && width <= CHAT_MAX_WIDTH) {
        setChatWidth(width);
      }
    }
  }, []);

  useEffect(() => {
    if (chatWidth !== CHAT_DEFAULT_WIDTH) {
      localStorage.setItem('chatWidth', chatWidth.toString());
    }
  }, [chatWidth]);

  const handleChatResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (!showChat) return;
      e.preventDefault();
      setIsResizingChat(true);
    },
    [showChat]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizingChat) return;

      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.max(
        CHAT_MIN_WIDTH,
        Math.min(CHAT_MAX_WIDTH, newWidth)
      );
      setChatWidth(clampedWidth);
    },
    [isResizingChat]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizingChat(false);
  }, []);

  useEffect(() => {
    if (isResizingChat) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingChat, handleMouseMove, handleMouseUp]);

  return (
    <ChatLayoutContext.Provider value={{ showChat, setShowChat }}>
      <div className="flex min-h-screen bg-[#E8E4DC]">
        <div className="flex-1 min-w-0 relative">{children}</div>

        <div
          className={`w-1 bg-[#D4CFC4] hover:bg-[#4A7C59] cursor-col-resize transition-colors ${
            isResizingChat ? 'bg-[#4A7C59]' : ''
          } ${showChat ? '' : 'hidden'}`}
          onMouseDown={handleChatResizeStart}
          style={{
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            marginTop: `${HEADER_HEIGHT}px`,
          }}
        >
          <div className="w-3 h-full -mx-1" />
        </div>

        <div
          className={`flex-shrink-0 bg-[#E8E4DC] h-screen overflow-hidden p-4 ${
            showChat ? '' : 'hidden'
          }`}
          style={{
            width: `${chatWidth}px`,
            minWidth: `${CHAT_MIN_WIDTH}px`,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            marginTop: `${HEADER_HEIGHT}px`,
          }}
          aria-hidden={!showChat}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-[#6B7280]">Loading chat...</p>
                </div>
              </div>
            }
          >
            <ChatInterface />
          </Suspense>
        </div>
      </div>
    </ChatLayoutContext.Provider>
  );
}
