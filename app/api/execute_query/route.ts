// File: app/api/execute_query/route.ts
import { ChatOpenAI } from "@langchain/openai";
import { LangChainAdapter } from "ai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Function to execute SQL query
async function executeQuery(sql: string) {
  try {
    // Basic validation to prevent destructive operations
    const forbiddenPatterns = [
      /DROP\s+/i,
      /DELETE\s+/i,
      /TRUNCATE\s+/i,
      /ALTER\s+/i,
      /CREATE\s+/i,
      /INSERT\s+/i,
      /UPDATE\s+/i
    ];
    
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(sql)) {
        throw new Error("Query contains forbidden operations");
      }
    }
    
    // Only allow SELECT statements
    if (!sql.trim().toUpperCase().startsWith('SELECT')) {
      throw new Error("Only SELECT queries are allowed");
    }
    
    const result = await supabase.rpc('execute_sql_query', { query: sql });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function POST(req: Request) {
  try {
    const { sql } = await req.json();
    
    if (!sql) {
      return new Response(JSON.stringify({ error: "No SQL query provided" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Execute SQL query
    const results = await executeQuery(sql);
    
    // Initialize LLM for analysis
    const llm = new ChatOpenAI({
      modelName: "gpt-4o", // Or use gpt-3.5-turbo for lower cost
      temperature: 0,
      streaming: true,
    });
    
    // Create a prompt for analyzing the results
    const analysisPrompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a data analyst who provides insights from database query results.
      Analyze the provided data and extract key insights. Focus on patterns, trends, and notable findings.
      Provide a concise but thorough analysis with actionable information.`],
      ["human", `SQL query executed: {sql}
      
      Query results: {results}
      
      Please analyze these results and provide key insights.`]
    ]);
    
    // Set up the analysis chain
    const parser = new StringOutputParser();
    const analysisChain = analysisPrompt.pipe(llm).pipe(parser);
    
    // Stream the analysis
    const stream = await analysisChain.stream({
      sql,
      results: JSON.stringify(results, null, 2),
    });
    
    // Return streaming response
    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    console.error("Database or analysis error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}