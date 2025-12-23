'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';
import { ChatLayoutContext } from '@/components/chat/chat-layout-context';

const CHAT_MIN_WIDTH = 300;
const CHAT_MAX_WIDTH = 600;
const CHAT_DEFAULT_WIDTH = 400;

function getHeaderSubtitle(pathname: string): string {
  if (pathname === '/') return 'When AI Meets Primary Sources';
  if (pathname === '/about') return 'About';
  if (pathname === '/chat') return 'Chat with Historical Documents';
  if (pathname === '/qa') return 'Q&A';
  if (pathname === '/chapter') return 'Chapter';
  if (pathname === '/data-room') return 'Data Room';
  if (pathname.startsWith('/daily/')) return 'Daily View';
  if (pathname === '/venetia') return 'Venetia Stanley';
  if (pathname === '/lab') return 'Simulation Lab';
  return 'The Venetia Project';
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const headerSubtitle = useMemo(() => getHeaderSubtitle(pathname), [pathname]);
  const isHome = pathname === '/';
  const isAbout = pathname === '/about';

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

  const handleHeaderBack = useCallback(() => {
    if (pathname === '/data-room') {
      const from = new URLSearchParams(window.location.search).get('from');
      if (from && from.startsWith('/')) {
        router.push(from);
        return;
      }
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  }, [pathname, router]);

  return (
    <ChatLayoutContext.Provider value={{ showChat, setShowChat }}>
      <div className="flex h-screen flex-col bg-[#E8E4DC]">
        <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-6 py-3 flex items-center justify-between w-full">
          <div className="flex items-center gap-4 min-w-0">
            {isHome ? (
              <h1 className="text-[#1A2A40] font-serif text-2xl font-medium truncate">
                The Venetia Project
              </h1>
            ) : (
              <button
                type="button"
                onClick={handleHeaderBack}
                className="flex items-center gap-2 text-[#1A2A40] hover:text-[#4A7C59] transition-colors min-w-0"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="font-serif text-lg font-medium truncate">
                  The Venetia Project
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-6 justify-center flex-1 min-w-0 px-6">
            <span className="text-[#6B7280] text-base truncate">
              {headerSubtitle}
            </span>
            {!isAbout ? (
              <Link
                href="/about"
                className="hidden md:inline text-[#1A2A40] hover:text-[#4A7C59] transition-colors text-base font-medium whitespace-nowrap"
              >
                What is the Venetia Project?
              </Link>
            ) : null}
          </div>

          <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-medium">V</span>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-w-0 relative overflow-y-auto">
            {children}
          </div>

          <div
            className={`w-1 bg-[#D4CFC4] hover:bg-[#4A7C59] cursor-col-resize transition-colors ${
              isResizingChat ? 'bg-[#4A7C59]' : ''
            } ${showChat ? '' : 'hidden'}`}
            onMouseDown={handleChatResizeStart}
          >
            <div className="w-3 h-full -mx-1" />
          </div>

          <div
            className={`flex-shrink-0 bg-[#E8E4DC] h-full overflow-hidden p-4 ${
              showChat ? '' : 'hidden'
            }`}
            style={{
              width: `${chatWidth}px`,
              minWidth: `${CHAT_MIN_WIDTH}px`,
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
      </div>
    </ChatLayoutContext.Provider>
  );
}
