'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble, { Message } from './MessageBubble';

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hasAutoSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async (questionOverride?: string) => {
    const questionToSend = questionOverride || input.trim();
    if (!questionToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: questionToSend,
    };

    let currentMessages: Message[] = [];
    setMessages((prev) => {
      currentMessages = [...prev, userMessage];
      return currentMessages;
    });
    if (!questionOverride) {
      setInput('');
    }
    setIsLoading(true);

    // Add placeholder for assistant response
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: questionToSend,
          conversationHistory: currentMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
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

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let fullContent = '';
      let lastUpdateTime = 0;
      let pendingUpdate: number | null = null;
      const UPDATE_THROTTLE_MS = 50; // Update at most every 50ms to reduce flickering

      const updateMessage = (content: string, isDone: boolean, finalSources?: typeof sources) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content = content;
            lastMessage.isStreaming = !isDone;
            if (isDone && finalSources) {
              lastMessage.sources = finalSources.map((s) => ({
                source: s.source,
                documentTitle: s.documentTitle,
                chunkIndex: s.chunkIndex,
                score: s.score,
              }));
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
              
              if (data.content) {
                fullContent += data.content;
                
                // If done, update immediately with all data
                if (data.done) {
                  if (pendingUpdate) {
                    cancelAnimationFrame(pendingUpdate);
                    pendingUpdate = null;
                  }
                  if (data.sources) {
                    sources = data.sources;
                  }
                  updateMessage(fullContent, true, sources);
                } else {
                  // Throttle updates during streaming
                  const now = Date.now();
                  if (now - lastUpdateTime >= UPDATE_THROTTLE_MS) {
                    // Update immediately if enough time has passed
                    if (pendingUpdate) {
                      cancelAnimationFrame(pendingUpdate);
                      pendingUpdate = null;
                    }
                    updateMessage(fullContent, false);
                    lastUpdateTime = now;
                  } else if (!pendingUpdate) {
                    // Schedule an update if we haven't updated recently
                    pendingUpdate = requestAnimationFrame(() => {
                      updateMessage(fullContent, false);
                      lastUpdateTime = Date.now();
                      pendingUpdate = null;
                    });
                  }
                }
              }

              if (data.sources && !data.done) {
                sources = data.sources;
              }
            } catch (e) {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }

      // Ensure final update is applied
      if (pendingUpdate) {
        cancelAnimationFrame(pendingUpdate);
      }
      updateMessage(fullContent, true, sources);
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
  }, [isLoading, input]);

  // Auto-send question from URL parameter
  useEffect(() => {
    const question = searchParams.get('q');
    if (question && !hasAutoSentRef.current && messages.length === 0 && !isLoading) {
      hasAutoSentRef.current = true;
      // Check if this question is already in messages to prevent duplicates
      const questionAlreadySent = messages.some(
        (msg) => msg.role === 'user' && msg.content === question
      );
      
      if (!questionAlreadySent) {
        // Small delay to ensure component is fully mounted
        setTimeout(() => {
          handleSend(question);
        }, 100);
      }
    }
  }, [searchParams, messages.length, handleSend, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#E8E4DC]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-serif text-[#1A2A40] mb-2">
                Chat with Historical Documents
              </h2>
              <p className="text-[#6B7280]">
                Ask questions about Venetia Stanley, H.H. Asquith, Edwin Montagu,
                and the political events of 1912-1916. I'll search through the
                primary sources to provide accurate answers.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#D4CFC4] bg-[#F5F0E8] px-6 py-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the historical documents..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

