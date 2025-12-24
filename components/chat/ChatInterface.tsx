'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Loader2, Sparkles, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MessageBubble, { Message } from './MessageBubble';
import type { Question, QuestionAnswer } from '@/lib/questions';

const CHAT_STORAGE_KEY = 'chatMessages';
const DEFAULT_SUGGESTED_QUESTIONS_COUNT = 3;
const FALLBACK_SUGGESTED_QUESTIONS: string[] = [
  'Why did Asquith write so often?',
  'Why did Asquith mawl Venetia so often?',
  'What were the key political events of 1912–1916?',
];

function pickRandomUnique<T>(items: T[], count: number): T[] {
  if (count <= 0) return [];
  if (items.length <= count) return items.slice();

  const indices = new Set<number>();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * items.length));
  }
  return Array.from(indices).map((i) => items[i]);
}

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popularQuestions, setPopularQuestions] = useState<Question[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<Question[]>([]);
  const [isLoadingPopularQuestions, setIsLoadingPopularQuestions] = useState(true);
  const hasAutoSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load popular questions for empty state
  useEffect(() => {
    let isActive = true;

    async function loadPopularQuestions() {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) return;

        const data = (await response.json()) as Question[];
        if (!isActive || !Array.isArray(data)) return;

        setPopularQuestions(data);
      } catch (error) {
        console.error('Error fetching popular questions:', error);
      } finally {
        if (isActive) setIsLoadingPopularQuestions(false);
      }
    }

    loadPopularQuestions();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (popularQuestions.length > 0) {
      setSuggestedQuestions(
        pickRandomUnique(popularQuestions, DEFAULT_SUGGESTED_QUESTIONS_COUNT)
      );
    } else {
      setSuggestedQuestions([]);
    }
  }, [popularQuestions]);

  // Restore chat history on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) {
          const sanitizedMessages: Message[] = parsed
            .filter((msg) => msg && typeof msg.role === 'string' && typeof msg.content === 'string')
            .map((msg) => ({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              content: msg.content,
              sources: msg.sources,
              answers: msg.answers,
              isStreaming: msg.isStreaming,
            }));
          if (sanitizedMessages.length > 0) {
            setMessages(sanitizedMessages);
          }
        }
      } catch (err) {
        console.error('Failed to parse saved chat messages', err);
      }
    }
  }, []);

  // Persist chat history across pages
  useEffect(() => {
    const completedMessages = messages.filter((msg) => !msg.isStreaming);
    if (completedMessages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(completedMessages));
    } else {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
  }, [messages]);

  const handleSend = useCallback(async (questionOverride?: string) => {
    const questionToSend = questionOverride || input.trim();
    if (!questionToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: questionToSend,
    };

    const historyToSend = messages
      .filter((m) => !m.isStreaming)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    console.log('Sending chat payload', {
      question: questionToSend,
      historyCount: historyToSend.length,
      historyPreview: historyToSend.slice(-2),
    });

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    if (!questionOverride) {
      setInput('');
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: questionToSend,
          conversationHistory: historyToSend,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let sources: Array<{
        source: string;
        documentTitle?: string;
        chunkIndex: number;
        score: number;
      }> = [];
      let answers: QuestionAnswer[] | undefined = undefined;

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let fullContent = '';
      let lastUpdateTime = 0;
      let pendingUpdate: number | null = null;
      const UPDATE_THROTTLE_MS = 50;

      const updateMessage = (
        content: string, 
        isDone: boolean, 
        finalSources?: typeof sources,
        finalAnswers?: QuestionAnswer[]
      ) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content = content;
            lastMessage.isStreaming = !isDone;
            if (isDone) {
              if (finalSources) {
                lastMessage.sources = finalSources.map((s) => ({
                  source: s.source,
                  documentTitle: s.documentTitle,
                  chunkIndex: s.chunkIndex,
                  score: s.score,
                }));
              }
              if (finalAnswers) {
                lastMessage.answers = finalAnswers;
              }
            }
          }
          return newMessages;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.loading && !data.done) {
                const displayContent = ''; // Keep empty to let the UI show "Consulting Sources" loader
                const now = Date.now();
                if (now - lastUpdateTime >= UPDATE_THROTTLE_MS) {
                  if (pendingUpdate) {
                    cancelAnimationFrame(pendingUpdate);
                    pendingUpdate = null;
                  }
                  updateMessage(displayContent, false);
                  lastUpdateTime = now;
                } else if (!pendingUpdate) {
                  pendingUpdate = requestAnimationFrame(() => {
                    updateMessage(displayContent, false);
                    lastUpdateTime = Date.now();
                    pendingUpdate = null;
                  });
                }
              }
              
              if (data.content && !data.loading) {
                fullContent += data.content;
              }
              
              if (data.done) {
                if (pendingUpdate) {
                  cancelAnimationFrame(pendingUpdate);
                  pendingUpdate = null;
                }
                if (data.sources) {
                  sources = data.sources;
                }
                if (data.answers && Array.isArray(data.answers)) {
                  answers = data.answers;
                }
                const finalContent = answers && answers.length > 0 ? '' : fullContent;
                updateMessage(finalContent, true, sources, answers);
              }

              if (data.sources && !data.done) {
                sources = data.sources;
              }
              
              if (data.answers && !data.done && Array.isArray(data.answers)) {
                answers = data.answers;
              }
            } catch {
              // Ignore JSON parse errors
            }
          }
        }
      }

      if (pendingUpdate) {
        cancelAnimationFrame(pendingUpdate);
      }
      const finalContent = answers && answers.length > 0 ? '' : fullContent;
      updateMessage(finalContent, true, sources, answers);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content =
            'Sorry, I encountered an error. Please try again.';
          lastMessage.isStreaming = false;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [isLoading, input, messages]);

  useEffect(() => {
    const question = searchParams.get('q');
    if (question && !hasAutoSentRef.current && messages.length === 0 && !isLoading) {
      hasAutoSentRef.current = true;
      setTimeout(() => {
        handleSend(question);
      }, 100);
    }
  }, [searchParams, messages.length, handleSend, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F0E8] border-l border-[#D4CFC4] shadow-[-10px_0_30px_rgba(0,0,0,0.02)] font-sans relative overflow-hidden">
      
      {/* 1. HEADER: Specialized Terminal Look */}
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-[#D4CFC4] bg-[#FAF7F2] flex items-center gap-2 md:gap-3 z-10 shadow-sm">
        <div className="w-7 h-7 md:w-8 md:h-8 bg-[#1A2A40] rounded-sm flex items-center justify-center shadow-sm shrink-0">
          <Sparkles size={12} className="md:w-[14px] md:h-[14px] text-[#F5F0E8]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1A2A40]">
            Primary Source Query
          </h3>
          <p className="text-[9px] md:text-[10px] text-[#8B4513]/60 font-serif italic">
            Searching 1912–1916 Archive
          </p>
        </div>
      </div>

      {/* 2. MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 scroll-smooth space-y-4 md:space-y-6">
        {messages.length === 0 ? (
          // --- EMPTY STATE ---
          <div className="h-full flex flex-col justify-center items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
            <div className="w-16 h-16 bg-[#D4CFC4]/30 rounded-full flex items-center justify-center mb-6 border border-[#D4CFC4]/50">
              <Search size={24} className="text-[#8B4513]/40" />
            </div>
            <h2 className="font-serif text-xl md:text-2xl text-[#1A2A40] mb-3">
              Chat with History
            </h2>
            <p className="text-xs md:text-sm text-[#5A6472] max-w-[280px] leading-relaxed mb-6 md:mb-8 px-4">
              Ask questions about Venetia Stanley, H.H. Asquith, and the political events of 1912–1916. I verify every answer against the primary sources.
            </p>

            <div className="w-full max-w-sm space-y-2 md:space-y-2.5 px-4">
              {isLoadingPopularQuestions ? (
                Array.from({ length: DEFAULT_SUGGESTED_QUESTIONS_COUNT }).map((_, i) => (
                  <div key={i} className="h-12 w-full bg-white/50 border border-[#D4CFC4] rounded-sm animate-pulse" />
                ))
              ) : (suggestedQuestions.length > 0 ? suggestedQuestions.map(q => q.Question) : FALLBACK_SUGGESTED_QUESTIONS.slice(0, DEFAULT_SUGGESTED_QUESTIONS_COUNT)).map((qText, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qText)}
                  className="w-full text-left p-3 md:p-3.5 bg-white border border-[#D4CFC4] rounded-sm hover:border-[#4A7C59] hover:bg-[#4A7C59]/5 transition-all group flex items-center justify-between shadow-sm min-h-[44px]"
                >
                  <span className="text-[10px] md:text-[11px] font-bold text-[#1A2A40] group-hover:text-[#4A7C59] transition-colors line-clamp-2 md:line-clamp-1 flex-1">
                    {qText}
                  </span>
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#4A7C59] shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          // --- CHAT MESSAGES ---
          <div className="space-y-8 pb-4">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            
            {/* Thinking Indicator */}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
               <div className="flex flex-col items-start animate-in fade-in duration-300 ml-1">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-[#A67C59] rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#A67C59]">Consulting Sources...</span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 3. INPUT AREA */}
      <div className="p-4 md:p-5 bg-[#F5F0E8] border-t border-[#D4CFC4] relative z-20">
        <div className="relative flex items-center shadow-sm group">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question about the archive..."
            disabled={isLoading}
            className="w-full bg-white border border-[#D4CFC4] text-[#1A2A40] placeholder:text-[#D4CFC4] text-sm px-4 py-4 md:py-6 rounded-sm pr-12 md:pr-14 focus-visible:ring-1 focus-visible:ring-[#1A2A40]/20 focus-visible:border-[#1A2A40] transition-all font-serif"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 md:p-2.5 bg-[#1A2A40] text-white rounded-sm hover:bg-[#4A7C59] disabled:bg-[#D4CFC4] disabled:cursor-not-allowed transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Send message"
          >
            {isLoading ? (
               <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
               <Send size={16} />
            )}
          </button>
        </div>
        <div className="text-center mt-2 md:mt-3">
           <span className="text-[7px] md:text-[8px] font-bold text-[#D4CFC4] uppercase tracking-[0.2em]">
             Reconstructed from Sources • Assisted by AI
           </span>
        </div>
      </div>
    </div>
  );
}