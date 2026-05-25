'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import SiteScrollDepthTracker from '@/components/analytics/SiteScrollDepthTracker';
import ChatInterface from '@/components/chat/ChatInterface';
import { ChatLayoutContext } from '@/components/chat/chat-layout-context';
import { trackEvent } from '@/lib/mixpanel';
import { useIsMobile } from '@/lib/useMediaQuery';
import { Footer } from '@/components/ui/Footer';

const CHAT_MIN_WIDTH = 300;
const CHAT_MAX_WIDTH = 1200;
const CHAT_DEFAULT_WIDTH = 400;

function getPreferredChatWidth() {
  if (typeof window === 'undefined') {
    return CHAT_DEFAULT_WIDTH;
  }

  const savedChatWidth = window.localStorage.getItem('chatWidth');
  if (savedChatWidth) {
    const width = parseInt(savedChatWidth, 10);
    if (width >= CHAT_MIN_WIDTH && width <= CHAT_MAX_WIDTH) {
      return width;
    }
  }

  const preferredWidth = Math.floor(window.innerWidth * 0.33);
  return Math.max(CHAT_MIN_WIDTH, Math.min(CHAT_MAX_WIDTH, preferredWidth));
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);
  const [isResizingChat, setIsResizingChat] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isHome = pathname === '/';
  const hideChat = pathname === '/archive_search' || pathname === '/franz-von-papen';
  const isWw1Origins = pathname === '/ww1-origins';
  const isFranzVonPapen = pathname === '/franz-von-papen';
  const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL ?? 'https://thevenetiaproject.substack.com';
  const footerLinks = isWw1Origins
    ? [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About the Project' },
      ]
    : isFranzVonPapen
      ? [
          { href: '/', label: 'Home' },
          ...(substackUrl ? [{ href: substackUrl, label: 'Substack' }] : []),
        ]
      : undefined;
  const isDesktopChatOpen = !isMobile && !hideChat && showChat;
  const isMobileChatOpen = isMobile && !hideChat && isChatOpen;

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setChatWidth((currentWidth) => {
        const preferredWidth = getPreferredChatWidth();
        return currentWidth === preferredWidth ? currentWidth : preferredWidth;
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (chatWidth !== CHAT_DEFAULT_WIDTH) {
      localStorage.setItem('chatWidth', chatWidth.toString());
    }
  }, [chatWidth]);

  const handleChatResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (!isDesktopChatOpen) return; // Disable resizing when the desktop sidebar is hidden
      e.preventDefault();
      setIsResizingChat(true);
    },
    [isDesktopChatOpen]
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
  }, [router]);

  const openDesktopChat = useCallback(() => {
    trackEvent('Chat: Opened', {
      device: 'desktop',
      trigger: 'floating_button',
      pathname,
    });
    setShowChat(true);
  }, [pathname]);

  const closeDesktopChat = useCallback(() => {
    setShowChat(false);
  }, []);

  const toggleMobileChat = useCallback(() => {
    trackEvent('Chat: Opened', {
      device: 'mobile',
      trigger: 'floating_button',
      pathname,
    });
    setIsChatOpen((prev) => !prev);
  }, [pathname]);

  const closeMobileChat = useCallback((trigger: 'header_button' | 'backdrop') => {
    trackEvent('Chat: Closed', {
      device: 'mobile',
      trigger,
      pathname,
    });
    setIsChatOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile chat is open
  useEffect(() => {
    if (isMobileChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileChatOpen]);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ left: 0, top: 0 });
  }, [pathname]);

  return (
    <ChatLayoutContext.Provider value={{ showChat: isMobile ? isMobileChatOpen : isDesktopChatOpen, setShowChat: isMobile ? setIsChatOpen : setShowChat }}>
      <div className="flex h-screen flex-col bg-page-bg">
<header className="sticky top-0 z-50 w-full bg-page-bg/95 backdrop-blur-sm border-b border-border-beige shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300">
  <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
    
    {/* 1. LEFT: THE MASTHEAD */}
    <div className="flex items-center gap-2 min-w-0 flex-shrink">
      {!isHome ? (
        <button
          type="button"
          onClick={handleHeaderBack}
          className="cursor-pointer group flex items-center gap-3 text-navy hover:text-accent-green transition-colors min-w-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" />
          <div className="flex flex-col items-start">
             <span className="font-serif text-lg md:text-xl font-bold leading-none">
               The Venetia Project
             </span>
             <span className="text-[8px] font-bold text-accent-brown uppercase tracking-[0.2em] opacity-80 mt-0.5">
               Return to Index
             </span>
          </div>
        </button>
      ) : (
        <div className="flex flex-col">
          <h1 className="text-navy font-serif text-xl md:text-2xl font-bold tracking-tight leading-none">
            The Venetia Project
          </h1>
          <span className="text-[9px] font-bold text-accent-brown uppercase tracking-[0.3em] opacity-80 mt-1 pl-0.5">
            When AI Meets Primary Sources
          </span>
        </div>
      )}
    </div>

  </div>
</header>

        <div className="flex flex-1 min-h-0 relative">
          <div
            ref={scrollContainerRef}
            className="flex-1 min-w-0 relative overflow-y-auto flex flex-col"
          >
            <SiteScrollDepthTracker containerRef={scrollContainerRef} />
            <div className="flex-1">
              {children}
            </div>
            
            <Footer links={footerLinks} />
          </div>

          {/* Desktop Chat Sidebar */}
          {!isMobile && !hideChat && (
            <>
              {!isDesktopChatOpen && (
                <button
                  type="button"
                  onClick={openDesktopChat}
                  className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full border border-[#1A2A40]/12 bg-[#1A2A40] px-5 py-3 text-sm font-semibold text-[#F5F0E8] shadow-[0_18px_45px_rgba(26,42,64,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#27415f] active:translate-y-0"
                  aria-label="Open archive chat"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>Chat with the archives</span>
                </button>
              )}

              <div
                className={`w-1 bg-border-beige hover:bg-accent-green cursor-col-resize transition-colors ${
                  isResizingChat ? 'bg-accent-green' : ''
                } ${isDesktopChatOpen ? '' : 'hidden'}`}
                onMouseDown={handleChatResizeStart}
              >
                <div className="w-3 h-full -mx-1" />
              </div>

              <div
                className={`flex-shrink-0 bg-page-bg h-full overflow-hidden p-4 border-l border-border-beige ${
                  isDesktopChatOpen ? '' : 'hidden'
                }`}
                style={{
                  width: `${chatWidth}px`,
                  minWidth: `${CHAT_MIN_WIDTH}px`,
                }}
                aria-hidden={!isDesktopChatOpen}
              >
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-muted-gray">Loading chat...</p>
                      </div>
                    </div>
                  }
                >
                  <ChatInterface onMinimize={closeDesktopChat} />
                </Suspense>
              </div>
            </>
          )}

          {/* Mobile Chat Bottom Sheet */}
          {isMobile && !hideChat && (
            <>
              {/* Backdrop */}
              {isMobileChatOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                  onClick={() => closeMobileChat('backdrop')}
                  aria-hidden="true"
                />
              )}

              {/* Bottom Sheet */}
              <div
                className={`fixed inset-x-0 bottom-0 z-50 bg-page-bg rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
                  isMobileChatOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{
                  height: '85vh',
                  maxHeight: '85vh',
                }}
              >
                {/* Handle bar */}
                <div className="flex items-center justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-border-beige rounded-full" />
                  <button
                    onClick={() => closeMobileChat('header_button')}
                    className="absolute right-4 top-3 p-2 text-navy hover:text-accent-green transition-colors"
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
                          <p className="text-muted-gray">Loading chat...</p>
                        </div>
                      </div>
                    }
                  >
                    <ChatInterface />
                  </Suspense>
                </div>
              </div>

              {!isMobileChatOpen && (
                <button
                  type="button"
                  onClick={toggleMobileChat}
                  className="fixed bottom-6 right-6 z-[60] inline-flex min-h-14 items-center gap-3 rounded-full bg-accent-green px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-green/90 active:scale-95"
                  aria-label="Open archive chat"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  <span>Chat with the archives</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </ChatLayoutContext.Provider>
  );
}
