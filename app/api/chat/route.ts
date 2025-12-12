import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchSimilarChunks, SearchResult } from '@/lib/vector-search';

const SYSTEM_PROMPT = `You are an expert historian specializing in early 20th century British politics, particularly the Asquith government, World War I, and the relationships between Venetia Stanley, H.H. Asquith, and Edwin Montagu. 

Answer questions based on the provided context from primary sources. When citing information, reference the specific source documents. Be precise and accurate, and if information is not available in the context, say so clearly.

Format your responses naturally, and when referencing specific documents or sources, mention them by name (e.g., "According to Asquith's memoir..." or "In Venetia's letters...").`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
}

// Build context from search results
function buildContext(searchResults: SearchResult[]): string {
  if (searchResults.length === 0) {
    return 'No relevant documents found.';
  }

  const contextParts = searchResults.map((result, index) => {
    const sourceName = result.metadata.documentTitle || result.source;
    return `[Source ${index + 1}: ${sourceName}]\n${result.content}`;
  });

  return contextParts.join('\n\n---\n\n');
}

// Build a query string that includes conversation context for better embedding
function buildQueryWithContext(currentMessage: string, conversationHistory: Message[]): string {
  if (conversationHistory.length === 0) {
    return currentMessage;
  }

  // Take the last 3-4 messages for context (last user question + assistant response + maybe one more)
  // This helps the embedding understand what the current question is referring to
  const recentMessages = conversationHistory.slice(-4);
  
  // Build context string from recent messages
  const contextParts: string[] = [];
  for (const msg of recentMessages) {
    if (msg.role === 'user') {
      contextParts.push(`Previous question: ${msg.content}`);
    } else if (msg.role === 'assistant') {
      // Include a brief summary of the assistant's response for context
      const briefResponse = msg.content.substring(0, 200);
      contextParts.push(`Previous answer: ${briefResponse}${msg.content.length > 200 ? '...' : ''}`);
    }
  }
  
  // Combine context with current message
  if (contextParts.length > 0) {
    return `${contextParts.join('\n')}\n\nCurrent question: ${currentMessage}`;
  }
  
  return currentMessage;
}

// Format sources for response
function formatSources(searchResults: SearchResult[]): Array<{
  source: string;
  documentTitle?: string;
  chunkIndex: number;
  score: number;
}> {
  return searchResults.map((result) => ({
    source: result.source,
    documentTitle: result.metadata.documentTitle,
    chunkIndex: result.chunkIndex,
    score: result.score,
  }));
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body: ChatRequest = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build query with conversation context for better embedding search
    const queryWithContext = buildQueryWithContext(message, conversationHistory);
    
    // Search for relevant chunks using the contextualized query
    const searchResults = await searchSimilarChunks(queryWithContext, 8);
    
    if (searchResults.length === 0) {
      return NextResponse.json({
        message: "I couldn't find any relevant information in the documents to answer your question. Please try rephrasing your query or asking about a different topic.",
        sources: [],
      });
    }

    // Build context from search results
    const context = buildContext(searchResults);
    
    // Build conversation messages
    // conversationHistory already contains all previous messages (user + assistant)
    // We just need to add the current user message
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'system',
        content: `Use the following context from primary sources to answer the question. If the answer cannot be found in the context, say so.\n\nContext:\n${context}`,
      },
      ...(conversationHistory || []).filter(m => m.role !== 'system'),
      { role: 'user', content: message },
    ];

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Determine model - try GPT-5, fallback to GPT-4o
    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    
    // Create streaming response
    console.log('messages', messages);
    const stream = await openai.chat.completions.create({
      model,
      messages: messages as any,
      stream: true,
      max_completion_tokens: 2000,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          
          // Send sources at the end
          const sources = formatSources(searchResults);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources, done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

