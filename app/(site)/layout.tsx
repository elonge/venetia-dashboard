'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';
import { ChatLayoutContext } from '@/components/chat/chat-layout-context';
import { useIsMobile } from '@/lib/useMediaQuery';

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
  const isMobile = useIsMobile();

  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const [showChat, setShowChat] = useState(false); // Start closed, will open on desktop via useEffect
  const [isChatOpen, setIsChatOpen] = useState(false); // For mobile bottom sheet - always starts closed

  const headerSubtitle = useMemo(() => getHeaderSubtitle(pathname), [pathname]);
  const isHome = pathname === '/';
  const isAbout = pathname === '/about';

  // Update showChat when mobile state changes - desktop shows chat by default, mobile hides it
  useEffect(() => {
    if (isMobile) {
      setShowChat(false);
      setIsChatOpen(false);
    } else {
      setShowChat(true);
      setIsChatOpen(false);
    }
  }, [isMobile]);

  // On mobile, never auto-open the chat drawer across route changes.
  useEffect(() => {
    if (isMobile) setIsChatOpen(false);
  }, [isMobile, pathname]);

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
      if (!showChat || isMobile) return; // Disable resizing on mobile
      e.preventDefault();
      setIsResizingChat(true);
    },
    [showChat, isMobile]
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
    router.push('/');
  }, [pathname, router]);

  const toggleMobileChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const closeMobileChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  // Prevent body scroll when mobile chat is open
  useEffect(() => {
    if (isMobile && isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isChatOpen]);

  return (
    <ChatLayoutContext.Provider value={{ showChat: isMobile ? isChatOpen : showChat, setShowChat: isMobile ? setIsChatOpen : setShowChat }}>
      <div className="flex h-screen flex-col bg-[#E8E4DC]">
        <header className="bg-[#F5F0E8] border-b border-[#D4CFC4] px-4 md:px-6 py-3 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-shrink">
            {isHome ? (
              <h1 className="text-[#1A2A40] font-serif text-xl md:text-2xl font-medium truncate">
                The Venetia Project
              </h1>
            ) : (
              <button
                type="button"
                onClick={handleHeaderBack}
                className="flex items-center gap-1 md:gap-2 text-[#1A2A40] hover:text-[#4A7C59] transition-colors min-w-0"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="font-serif text-base md:text-lg font-medium truncate">
                  The Venetia Project
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-6 justify-center flex-1 min-w-0 px-2 md:px-6">
            <span className="text-[#6B7280] text-sm md:text-base truncate">
              {headerSubtitle}
            </span>
            {!isAbout ? (
              <Link
                href="/about"
                className="hidden sm:inline text-[#1A2A40] hover:text-[#4A7C59] transition-colors text-sm md:text-base font-medium whitespace-nowrap"
              >
                What is the Venetia Project?
              </Link>
            ) : null}
          </div>

          <div className="w-8 h-8 rounded-full bg-[#4A7C59] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-medium">V</span>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 relative">
          <div className="flex-1 min-w-0 relative overflow-y-auto">
            {children}
          </div>

          {/* Desktop Chat Sidebar */}
          {!isMobile && (
            <>
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
            </>
          )}

          {/* Mobile Chat Bottom Sheet */}
          {isMobile && (
            <>
              {/* Backdrop */}
              {isChatOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                  onClick={closeMobileChat}
                  aria-hidden="true"
                />
              )}

              {/* Bottom Sheet */}
              <div
                className={`fixed inset-x-0 bottom-0 z-50 bg-[#E8E4DC] rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
                  isChatOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{
                  height: '85vh',
                  maxHeight: '85vh',
                }}
              >
                {/* Handle bar */}
                <div className="flex items-center justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-[#D4CFC4] rounded-full" />
                  <button
                    onClick={closeMobileChat}
                    className="absolute right-4 top-3 p-2 text-[#1A2A40] hover:text-[#4A7C59] transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat content */}
                <div className="h-[calc(85vh-3rem)] overflow-hidden">
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

              {/* Floating Chat Toggle Button */}
              <button
                onClick={toggleMobileChat}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#4A7C59] text-white rounded-full shadow-lg hover:bg-[#3a6b49] transition-all z-30 flex items-center justify-center active:scale-95"
                aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
              >
                {isChatOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MessageCircle className="w-6 h-6" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </ChatLayoutContext.Provider>
  );
}
