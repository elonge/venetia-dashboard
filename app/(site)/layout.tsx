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

  const isHome = pathname === '/';

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
<header className="sticky top-0 z-50 w-full bg-[#F5F0E8]/95 backdrop-blur-sm border-b border-[#D4CFC4] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300">
  <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
    
    {/* 1. LEFT: THE MASTHEAD */}
    <div className="flex items-center gap-2 min-w-0 flex-shrink">
      {!isHome ? (
        <button
          type="button"
          onClick={handleHeaderBack}
          className="group flex items-center gap-3 text-[#1A2A40] hover:text-[#4A7C59] transition-colors min-w-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" />
          <div className="flex flex-col items-start">
             <span className="font-serif text-lg md:text-xl font-bold leading-none">
               The Venetia Project
             </span>
             <span className="text-[8px] font-bold text-[#8B4513] uppercase tracking-[0.2em] opacity-80 mt-0.5">
               Return to Index
             </span>
          </div>
        </button>
      ) : (
        <div className="flex flex-col">
          <h1 className="text-[#1A2A40] font-serif text-xl md:text-2xl font-bold tracking-tight leading-none">
            The Venetia Project
          </h1>
          <span className="text-[9px] font-bold text-[#8B4513] uppercase tracking-[0.3em] opacity-80 mt-1 pl-0.5">
            When AI Meets Primary Sources
          </span>
        </div>
      )}
    </div>

    {/* 2. RIGHT: NAVIGATION & SEAL */}
    {/* <div className="flex items-center gap-6 md:gap-8 justify-end flex-1 min-w-0 pl-4">
      
      <nav className="flex items-center gap-6 overflow-hidden">
        <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#5A6472] hover:text-[#1A2A40] relative group py-1 cursor-default">
        </span>
      </nav>

      <div className="h-4 w-px bg-[#D4CFC4] hidden sm:block" />

      <div className="group relative w-9 h-9 flex items-center justify-center rounded-full bg-[#4A7C59] text-[#F5F0E8] shadow-sm hover:bg-[#3D664A] hover:shadow-md transition-all duration-300 border-[3px] border-[#F5F0E8] outline outline-1 outline-[#D4CFC4] shrink-0 cursor-default">
        <span className="font-serif italic font-bold text-lg leading-none translate-y-[1px]">
          V
        </span>
      </div>
    </div> */}

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
