'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Loader2, Sparkles, Search, Trash2, AlertTriangle, ArrowRight, Minus } from 'lucide-react';
import MessageBubble, { Message } from './MessageBubble';
import { trackEvent } from '@/lib/mixpanel';

const CHAT_STORAGE_KEY = 'chatMessages';
const CONVERSATION_ID_STORAGE_KEY = 'chatConversationId';
const DEFAULT_CHAT_REPLY_ERROR_MESSAGE = 'Sorry, I encountered an error. Please try again.';
const DEFAULT_CHAT_REPLY_ERROR_CODE = 'CHAT_REPLY_FAILED';

type ChatQuestionSource = 'typed' | 'suggested_question' | 'query_param';

type ChatReplyErrorDetails = {
  code: string;
  message: string;
  httpStatus?: number;
};

const SUGGESTED_QUESTIONS = [
  {
    category: "The Letters & Romance",
    questions: [
      "Why did Asquith write to Venetia?",
      "Did Venetia love Asquith?",
      "What happened to the letters?"
    ]
  },
  {
    category: "Politics & War",
    questions: [
      "How did the government collapse in 1915?",
      "What was the Shells Scandal?",
      "Did Asquith share secrets with Venetia?"
    ]
  },
  {
    category: "The Social Circle",
    questions: [
      "Who were 'The Coterie'?",
      "What was Edwin Montagu's role?",
      "Did others know about the affair?"
    ]
  }
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStringProperty(
  value: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }

  return undefined;
}

function getNumberProperty(
  value: Record<string, unknown>,
  keys: string[]
): number | undefined {
  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

async function getHttpErrorDetails(response: Response): Promise<ChatReplyErrorDetails> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (isRecord(payload)) {
    return {
      code:
        getStringProperty(payload, ['error_code', 'errorCode', 'code']) ||
        `HTTP_${response.status}`,
      message:
        getStringProperty(payload, ['error', 'message']) ||
        `Request failed with status ${response.status}`,
      httpStatus: response.status,
    };
  }

  return {
    code: `HTTP_${response.status}`,
    message: `Request failed with status ${response.status}`,
    httpStatus: response.status,
  };
}

function getStreamErrorDetails(value: unknown): ChatReplyErrorDetails | null {
  if (!isRecord(value)) {
    return null;
  }

  const hasErrorPayload =
    typeof value.error === 'string' ||
    typeof value.error_code === 'string' ||
    typeof value.errorCode === 'string' ||
    typeof value.code === 'string';

  if (!hasErrorPayload) {
    return null;
  }

  return {
    code:
      getStringProperty(value, ['error_code', 'errorCode', 'code']) ||
      DEFAULT_CHAT_REPLY_ERROR_CODE,
    message:
      getStringProperty(value, ['error', 'message']) ||
      DEFAULT_CHAT_REPLY_ERROR_MESSAGE,
    httpStatus: getNumberProperty(value, ['http_status', 'httpStatus', 'status']),
  };
}

function normalizeChatReplyError(error: unknown): ChatReplyErrorDetails {
  if (error instanceof Error) {
    const maybeError = error as Error & {
      code?: string;
      errorCode?: string;
      httpStatus?: number;
    };

    return {
      code: maybeError.errorCode || maybeError.code || DEFAULT_CHAT_REPLY_ERROR_CODE,
      message: error.message || DEFAULT_CHAT_REPLY_ERROR_MESSAGE,
      httpStatus:
        typeof maybeError.httpStatus === 'number' ? maybeError.httpStatus : undefined,
    };
  }

  if (isRecord(error)) {
    return {
      code:
        getStringProperty(error, ['error_code', 'errorCode', 'code']) ||
        DEFAULT_CHAT_REPLY_ERROR_CODE,
      message:
        getStringProperty(error, ['error', 'message']) ||
        DEFAULT_CHAT_REPLY_ERROR_MESSAGE,
      httpStatus: getNumberProperty(error, ['http_status', 'httpStatus', 'status']),
    };
  }

  return {
    code: DEFAULT_CHAT_REPLY_ERROR_CODE,
    message: DEFAULT_CHAT_REPLY_ERROR_MESSAGE,
  };
}

interface ChatInterfaceProps {
  onMinimize?: () => void;
}

export default function ChatInterface({ onMinimize }: ChatInterfaceProps) {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const hasAutoSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Restore chat history and conversationId on mount
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
              markdownText: msg.markdownText,
              footnotes: msg.footnotes,
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

    // Restore conversationId
    const savedConversationId = localStorage.getItem(CONVERSATION_ID_STORAGE_KEY);
    if (savedConversationId) {
      setConversationId(savedConversationId);
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

  // Persist conversationId to localStorage
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem(CONVERSATION_ID_STORAGE_KEY, conversationId);
    } else {
      localStorage.removeItem(CONVERSATION_ID_STORAGE_KEY);
    }
  }, [conversationId]);

  const handleClearChat = () => {
    setMessages([]);
    setConversationId('');
    localStorage.removeItem(CHAT_STORAGE_KEY);
    localStorage.removeItem(CONVERSATION_ID_STORAGE_KEY);
    setIsClearConfirmOpen(false);
  };

  const handleSend = useCallback(async (
    questionOverride?: string,
    source: ChatQuestionSource = questionOverride ? 'suggested_question' : 'typed'
  ) => {
    const questionToSend = questionOverride || input.trim();
    if (!questionToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: questionToSend,
    };

    console.log('Old messages:', messages);
    const historyToSend = messages
      .filter((m) => !m.isStreaming)
      .map((m) => ({
        role: m.role,
        content: m.content || m.markdownText,
      }));

    console.log('Sending chat payload', {
      question: questionToSend,
      historyCount: historyToSend.length,
      historyPreview: historyToSend.slice(-2),
    });

    trackEvent('Chat: Question Asked', {
      question_text: questionToSend,
      question_source: source,
      conversation_id: conversationId || undefined,
      history_count: historyToSend.length,
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
          conversationId: conversationId
        }),
      });

      if (!response.ok) {
        throw await getHttpErrorDetails(response);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let markdownText: string | undefined = undefined;
      let footnotes: Array<{ sourceId: string; date: string | null }> | undefined = undefined;
      let responseConversationId = conversationId;
      let streamError: ChatReplyErrorDetails | null = null;

      if (!reader) {
        throw {
          code: 'NO_RESPONSE_BODY',
          message: 'No response body',
          httpStatus: response.status,
        };
      }

      let buffer = '';
      let fullContent = '';
      let lastUpdateTime = 0;
      let pendingUpdate: number | null = null;
      const UPDATE_THROTTLE_MS = 50;

      const updateMessage = (
        content: string, 
        isDone: boolean, 
        status?: string,
        finalMarkdownText?: string,
        finalFootnotes?: typeof footnotes
      ) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content = content;
            lastMessage.isStreaming = !isDone;
            if (status) {
              lastMessage.status = status;
            }
            if (isDone) {
              if (finalMarkdownText) {
                lastMessage.markdownText = finalMarkdownText;
              }
              if (finalFootnotes) {
                lastMessage.footnotes = finalFootnotes;
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
              const data: unknown = JSON.parse(line.slice(6));
              const streamErrorDetails = getStreamErrorDetails(data);

              if (streamErrorDetails) {
                if (pendingUpdate) {
                  cancelAnimationFrame(pendingUpdate);
                  pendingUpdate = null;
                }

                streamError = streamErrorDetails;
                updateMessage(DEFAULT_CHAT_REPLY_ERROR_MESSAGE, true);
                continue;
              }

              if (!isRecord(data)) {
                continue;
              }

              if (typeof data.status === 'string') {
                updateMessage(fullContent, false, data.status);
              }

              if (data.loading === true && data.done !== true) {
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
              
              if (typeof data.content === 'string' && data.loading !== true) {
                fullContent += data.content;
              }

              if (typeof data.markdownText === 'string') {
                markdownText = data.markdownText;
              }
              if (Array.isArray(data.footnotes)) {
                footnotes = data.footnotes as Array<{ sourceId: string; date: string | null }>;
              }
              
              if (data.done === true) {
                if (pendingUpdate) {
                  cancelAnimationFrame(pendingUpdate);
                  pendingUpdate = null;
                }
                if (typeof data.markdownText === 'string') {
                    markdownText = data.markdownText;
                }
                if (Array.isArray(data.footnotes)) {
                    footnotes = data.footnotes as Array<{ sourceId: string; date: string | null }>;
                }

                console.log('Final markdownText:', markdownText, footnotes);
                const finalContent = markdownText ? '' : fullContent;
                updateMessage(finalContent, true, undefined, markdownText, footnotes);
              }
              if (typeof data.conversationId === 'string') {
                console.log('Conversation ID:', data.conversationId);
                responseConversationId = data.conversationId;
                setConversationId(data.conversationId);
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

      if (streamError) {
        trackEvent('Chat: Response Failed', {
          question_text: questionToSend,
          question_source: source,
          conversation_id: responseConversationId || undefined,
          error_code: streamError.code,
          error_message: streamError.message,
          http_status: streamError.httpStatus,
        });
        return;
      }

      const finalContent = markdownText ? '' : fullContent;
      updateMessage(finalContent, true, undefined, markdownText, footnotes);
      trackEvent('Chat: Response Succeeded', {
        question_text: questionToSend,
        question_source: source,
        conversation_id: responseConversationId || undefined,
        response_char_count: markdownText?.length ?? finalContent.length,
        response_format: markdownText ? 'markdown' : 'text',
        footnote_count: footnotes?.length ?? 0,
      });
    } catch (error) {
      const errorDetails = normalizeChatReplyError(error);
      console.error('Error sending message:', error);
      trackEvent('Chat: Response Failed', {
        question_text: questionToSend,
        question_source: source,
        conversation_id: conversationId || undefined,
        error_code: errorDetails.code,
        error_message: errorDetails.message,
        http_status: errorDetails.httpStatus,
      });
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content = DEFAULT_CHAT_REPLY_ERROR_MESSAGE;
          lastMessage.isStreaming = false;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [isLoading, input, messages, conversationId]);

  useEffect(() => {
    const question = searchParams.get('q');
    if (question && !hasAutoSentRef.current && messages.length === 0 && !isLoading) {
      hasAutoSentRef.current = true;
      setTimeout(() => {
        handleSend(question, 'query_param');
      }, 100);
    }
  }, [searchParams, messages.length, handleSend, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full rounded-md bg-[#F5F0E8] border-l border-[#D4CFC4] shadow-[-10px_0_30px_rgba(0,0,0,0.02)] font-sans relative overflow-hidden">
      
      {/* 1. HEADER: Specialized Terminal Look */}
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-[#D4CFC4] bg-[#FAF7F2] flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-[#1A2A40] rounded-md flex items-center justify-center shadow-sm shrink-0">
            <Sparkles size={12} className="md:w-[14px] md:h-[14px] text-[#F5F0E8]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1A2A40]">
              Primary Source Query
            </h3>
            <p className="text-[9px] md:text-[10px] text-[#8B4513] font-serif italic">
              Searching 1912–1916 Archive
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onMinimize && (
            <button
              type="button"
              onClick={() => {
                trackEvent('Chat: Minimized', {
                  device: 'desktop',
                  trigger: 'header_button',
                });
                onMinimize();
              }}
              className="p-2 text-[#5A6472] hover:text-[#1A2A40] hover:bg-[#1A2A40]/8 rounded-md transition-colors"
              aria-label="Minimize chat"
              title="Minimize chat"
            >
              <Minus size={16} />
            </button>
          )}

          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearConfirmOpen(true)}
              className="p-2 text-[#5A6472] hover:text-[#C24E42] hover:bg-[#C24E42]/10 rounded-md transition-colors"
              title="Clear chat history"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 scroll-smooth space-y-4 md:space-y-6">
        {messages.length === 0 ? (
          // --- EMPTY STATE ---
          <div className="h-full flex flex-col justify-center items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
            <div className="w-16 h-16 bg-[#D4CFC4]/30 rounded-full flex items-center justify-center mb-6 border border-[#D4CFC4]/50 mt-8 md:mt-0">
              <Search size={24} className="text-[#8B4513]/40" />
            </div>
            <h2 className="font-serif text-xl md:text-2xl text-[#1A2A40] mb-3">
              Chat with History
            </h2>
            <p className="text-xs md:text-sm text-[#5A6472] max-w-[280px] leading-relaxed mb-6 md:mb-8 px-4">
              Ask questions about Venetia Stanley, H.H. Asquith, and the political events of 1912–1916. I verify every answer against the primary sources.
            </p>

            <div className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left mt-2 md:mt-4">
              {SUGGESTED_QUESTIONS.map((section, idx) => (
                <div key={idx} className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#8B4513] border-b border-[#D4CFC4] pb-2 mb-2">
                    {section.category}
                  </h4>
                  <div className="space-y-2">
                    {section.questions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(q, 'suggested_question')}
                        className="w-full text-left p-2.5 md:p-3 text-xs md:text-sm text-[#1A2A40] bg-white/50 border border-transparent hover:border-[#D4CFC4] hover:bg-white hover:shadow-sm rounded-md transition-all duration-200 group flex items-start justify-between"
                      >
                        <span className="group-hover:text-[#4A7C59] transition-colors pr-2 leading-relaxed">{q}</span>
                        <ArrowRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#4A7C59] shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
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
        <div className="relative flex items-end shadow-sm group">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask the Venetia Project archive..."
            disabled={isLoading}
            rows={3}
            className="w-full bg-white border border-border-beige text-navy placeholder:text-muted-gray text-sm px-4 py-3 rounded-md pr-14 md:pr-16 focus-visible:ring-1 focus-visible:ring-navy/20 focus-visible:border-navy transition-all font-serif resize-none leading-5"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bottom-2 p-2! md:p-2.5! bg-[#1A2A40] text-white rounded-md hover:bg-[#4A7C59] disabled:bg-[#D4CFC4] disabled:cursor-not-allowed transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
           <span className="text-[7px] md:text-[8px] font-bold text-[#5A6472] uppercase tracking-[0.2em]">
             Reconstructed from Sources • Assisted by AI
           </span>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {isClearConfirmOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#F5F0E8]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white border border-[#D4CFC4] shadow-xl rounded-md p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-4 text-[#C24E42]">
                 <AlertTriangle size={24} />
                 <h3 className="text-lg font-bold font-serif text-[#1A2A40]">Clear History?</h3>
              </div>
              <p className="text-sm text-[#5A6472] mb-6 leading-relaxed">
                 This will permanently remove your conversation history from this device. Are you sure?
              </p>
              <div className="flex justify-end gap-3">
                 <button 
                    onClick={() => setIsClearConfirmOpen(false)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#5A6472] hover:bg-[#F5F0E8] rounded-md transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleClearChat}
                    className="px-4 py-2 bg-[#C24E42] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#A0352A] shadow-sm transition-colors"
                 >
                    Clear All
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
