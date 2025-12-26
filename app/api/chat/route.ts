import { NextRequest, NextResponse } from 'next/server';
import { runAgentWorkflow } from '@/lib/chat/workflow';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 1. Send loading state
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ loading: true })}\n\n`));

          // 2. Execute Agent Workflow (Planner -> Tools -> Answer)
          console.log('🤖 Starting Agent Workflow for:');
          const result = await runAgentWorkflow(message, conversationHistory, (status) => {
             controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status })}\n\n`));
          });
          
          // 3. Send Final Result
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            sources: result.sources, 
            answers: result.answers,
            done: true 
          })}\n\n`));
          
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const msg = error instanceof Error ? error.message : 'An unexpected error occurred';
          // Send error frame if possible, or just close
          // Client might not parse an error JSON in data stream easily without modification,
          // but we can try sending a content error message.
          try {
             controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: `Error: ${msg}`, done: true })}\n\n`));
          } catch (e) {}
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}