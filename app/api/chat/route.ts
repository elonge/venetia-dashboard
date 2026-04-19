import { NextRequest, NextResponse } from 'next/server';
import { runAgentWorkflow } from '@/lib/chat/workflow';

function getChatErrorDetails(
  error: unknown,
  fallbackCode: string
): { error: string; error_code: string } {
  if (error instanceof SyntaxError) {
    return { error: 'Invalid request body', error_code: 'INVALID_REQUEST_BODY' };
  }

  if (error instanceof Error) {
    if (error.message === 'Agent run completed without a final output.') {
      return { error: error.message, error_code: 'AGENT_NO_FINAL_OUTPUT' };
    }

    return {
      error: error.message || 'An unexpected error occurred',
      error_code: fallbackCode,
    };
  }

  return { error: 'An unexpected error occurred', error_code: fallbackCode };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          error_code: 'OPENAI_API_KEY_NOT_CONFIGURED',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, conversationId = "" } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required', error_code: 'MESSAGE_REQUIRED' },
        { status: 400 }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 1. Send loading state
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ loading: true })}\n\n`));

          // 2. Execute Agent Workflow (Planner -> Tools -> Answer)
          console.log('🤖 Starting Agent Workflow for:');
          const result = await runAgentWorkflow(message, conversationId, (status) => {
             controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status })}\n\n`));
          });
          
          // 3. Send Final Result
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            markdownText: result.output.markdownText,
            footnotes: result.output.footnotes,
            done: true, 
            conversationId: result.responseId 
          })}\n\n`));
          
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const details = getChatErrorDetails(error, 'CHAT_STREAM_ERROR');
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  error: details.error,
                  error_code: details.error_code,
                  done: true,
                })}\n\n`
              )
            );
          } catch {}
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
    const details = getChatErrorDetails(error, 'CHAT_REQUEST_FAILED');
    return NextResponse.json(
      { error: details.error, error_code: details.error_code },
      { status: 500 }
    );
  }
}
