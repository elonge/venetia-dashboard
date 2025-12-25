import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { 
  searchSimilarChunks, 
  searchPrimaryEntries, 
  SearchIntent, 
  SearchResult 
} from '@/lib/vector-search';
import { QuestionAnswer } from '@/lib/questions';

const SYSTEM_PROMPT = `You are an expert historian specializing in early 20th century British politics, particularly the Asquith government, World War I, and the relationships between Venetia Stanley, H.H. Asquith, and Edwin Montagu. 

Answer questions based on the provided context from primary sources. When citing information, reference the specific source documents. Be precise and accurate, and if information is not available in the context, say so clearly.
STRICT RULE: Only state that a letter exists if the provided context explicitly shows a non-empty date tag from a PRIMARY SOURCE. If you find a date in a SECONDARY SOURCE (Book), you must state 'According to [Book Name]...' and not claim it is a direct letter date unless verified
IMPORTANT: You must respond with a valid JSON object in the following format:
{
  "answers": [
    {
      "text": "First paragraph of your answer here. Reference sources naturally within the text.",
      "link": "source_document_name_or_identifier"
    },
    {
      "text": "Second paragraph of your answer here.",
      "link": "source_document_name_or_identifier"
    }
  ]
}

Each answer should be a distinct paragraph or section. The "link" field should reference the source document name (from the context provided). If multiple sources are relevant, use the primary source. Format your responses naturally, and when referencing specific documents or sources, mention them by name (e.g., "According to Asquith's memoir..." or "In Venetia's letters...").`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
}

async function analyzeIntent(query: string, openai: OpenAI): Promise<SearchIntent> {
const analysisPrompt = `
    Analyze the user's historical query about Asquith, Venetia, and Montagu.
    Return a JSON object with:
    - type: 'specific_date', 'timeline', 'sentiment_trend', or 'general_context'
    - dateRange: { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' } (or null)
    - sentiment: 'positive', 'negative', or null
    - author: The name of the person writing the letter (e.g., 'Asquith', 'Montagu', 'Venetia') if specified.
    - recipient: The name of the person receiving the letter if specified.
    - requiresSecondary: boolean
    
    Query: "${query}"
`;
try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast & cheap
      messages: [{ role: "system", content: "You are a precise query analyzer." }, { role: "user", content: analysisPrompt }],
      response_format: { type: "json_object" },
      temperature: 0
    });

    return JSON.parse(completion.choices[0].message.content || '{}') as SearchIntent;
  } catch (e) {
    console.error("Intent analysis failed:", e);
    // Fallback intent
    return { type: 'general_context', requiresSecondary: true };
  }
}

function buildCombinedContext(primaryResults: any[], vectorResults: any[]): string {
  let context = "";

  if (primaryResults.length > 0) {
    context += "--- PRIMARY SOURCES (Letters/Diaries/Timeline) ---\n";
    primaryResults.forEach(r => {
      const dateStr = r.date ? new Date(r.date).toISOString().split('T')[0] : 'Unknown Date';
      context += `[Author: ${r.author || 'Unknown'}] [Recipient: ${r.recipient || 'Unknown'}] [Date: ${dateStr}] [Sentiment: ${r.sentiment}]\n`;
      context += `Content: ${r.content.substring(0, 1500)}\n\n`;      
    });
  }

  if (vectorResults.length > 0) {
    context += "\n--- SECONDARY/CONTEXT SOURCES ---\n";
    vectorResults.forEach((r, i) => {
      context += `[Source: ${r.metadata?.documentTitle || r.source}]\n${r.content}\n\n`;
    });
  }

  return context || "No relevant documents found.";
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
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const body: ChatRequest = await request.json();
    const { message, conversationHistory = [] } = body;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('📝 Processing Query:', message.slice(0, 50));

    // 1. Analyze Intent
    const intent = await analyzeIntent(message, openai);
    console.log("🧠 Intent detected:", intent);

    // 2. Prepare Parallel Searches
    const promises: Promise<any>[] = [];

    // Track A: Primary/Metadata Search (Dates/Timeline/Sentiment)
    if (intent.type !== 'general_context' || intent.dateRange) {
        const limit = intent.type === 'timeline' ? 30 : 15;
        promises.push(searchPrimaryEntries(intent, limit));
    } else {
        promises.push(Promise.resolve([]));
    }

    // Track B: Vector Search (Contextual)
    // We use the "history-aware" query for better vector matching
    const queryWithContext = buildQueryWithContext(message, conversationHistory);
    // If strict date search found nothing, or intent explicitly asks for context, ensure we search wide
    promises.push(searchSimilarChunks(queryWithContext, 8)); 

    const [primaryResults, vectorResults] = await Promise.all(promises);

    // 3. Combine Results
    const context = buildCombinedContext(primaryResults, vectorResults);
    
    // Quick exit if absolutely nothing found
    if (primaryResults.length === 0 && vectorResults.length === 0) {
      return NextResponse.json({
        message: "I couldn't find any relevant information in the documents matching that specific timeline or criteria.",
        sources: [],
      });
    }

    // 4. Combine Sources for Frontend (Normalization)
    // The frontend expects a specific structure for the "Sources" dropdown
    const combinedSources = [
      ...primaryResults.map((r: any) => ({
          source: r.source,
          documentTitle: r.metadata.documentTitle,
          chunkIndex: 0,
          score: 1.0 // High confidence for exact matches
      })),
      ...vectorResults.map((r: any) => ({
           source: r.source,
           documentTitle: r.metadata?.documentTitle,
           chunkIndex: r.chunkIndex,
           score: r.score
      }))
    ];

    // 5. Build Final Messages
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: `Context:\n${context}` },
      ...(conversationHistory || []).filter(m => m.role !== 'system'),
      { role: 'user', content: message },
    ];

    // 6. Streaming Generation
    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    const stream = await openai.chat.completions.create({
      model,
      messages: messages as any,
      stream: true,
      max_completion_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        let parsedAnswers: QuestionAnswer[] | null = null;
        
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              // Stream loading indicator
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: '', loading: true })}\n\n`));
            }
          }
          
          // Parse final JSON
          try {
            const jsonResponse = JSON.parse(fullResponse);
            if (jsonResponse.answers && Array.isArray(jsonResponse.answers)) {
              parsedAnswers = jsonResponse.answers.map((answer: any) => {
                // Link Resolution Logic
                let link = answer.link || '';
                
                // Try to find a matching source title in our combined results
                if (!link && combinedSources.length > 0) {
                    const match = combinedSources.find(s => 
                        s.documentTitle === link || s.source === link
                    );
                    link = match ? (match.documentTitle || match.source) : (combinedSources[0].documentTitle || combinedSources[0].source);
                }
                
                return {
                  text: answer.text || '',
                  link: link || ''
                };
              });
            }
          } catch (parseError) {
            console.error('Failed to parse JSON response:', fullResponse);
          }
          
          // Final Payload
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            sources: combinedSources, 
            answers: parsedAnswers,
            done: true 
          })}\n\n`));
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
    const msg = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
