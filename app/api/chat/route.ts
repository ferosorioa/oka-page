// File: app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { createDbAgent } from '@/lib/agent';
import { AIMessage } from '@langchain/core/messages';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Create and run the agent
    const agentResult = await createDbAgent(lastMessage);

    // Extract the final AI response
    const finalMessages = agentResult.messages;
    
    // Check if finalMessages is an array and has elements
    if (!Array.isArray(finalMessages) || finalMessages.length === 0) {
      throw new Error("Agent returned no messages");
    }
    
    const finalResponse = finalMessages[finalMessages.length - 1] as AIMessage;
    
    // Return the result
    return NextResponse.json({ 
      response: finalResponse.content,
      // Include additional data to show execution trace if needed
      traceInfo: {
        steps: finalMessages.length,
        toolCalls: finalMessages.filter(m => 
          typeof m === 'object' && 
          'tool_calls' in m && 
          Array.isArray(m.tool_calls) && 
          m.tool_calls?.length > 0
        ).length
      }
    });
  } catch (error) {
    console.error("Error in agent execution:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}