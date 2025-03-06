// File: app/api/chat/streaming/route.ts
import { LangChainAdapter } from 'ai';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { DB_SCHEMA } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Initialize OpenAI client with streaming enabled
    const llm = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0,
      streaming: true,
    });

    // Create a prompt template for database queries
    const dbQueryPrompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a database expert who helps users query and analyze data.
      You have access to a database with the following schema:
      
      ${DB_SCHEMA}
      
      Based on the user's question, you should:
      1. Generate a SQL query that will answer the question
      2. Provide reasoning for your SQL query
      3. Format your response as: 
      
      ANALYSIS PLAN:
      [Your reasoning for the approach]
      
      SQL QUERY:
      \`\`\`sql
      [The SQL query]
      \`\`\`
      
      Only generate SQL queries for reading data (SELECT statements). Do not generate queries that modify the database.`],
      ["human", "{question}"]
    ]);

    // Set up the chain for streaming
    const parser = new StringOutputParser();
    const chain = dbQueryPrompt.pipe(llm).pipe(parser);
    
    // Create a streaming response
    const stream = await chain.stream({
      question: lastMessage,
    });
    
    // Return the stream using the LangChain adapter
    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}