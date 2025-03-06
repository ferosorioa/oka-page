// app/lib/agent.ts
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { DB_SCHEMA } from "@/lib/schema";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Create a tool for running SQL queries
const executeSqlTool = new DynamicStructuredTool({
  name: "execute_sql_query",
  description: "Run a SQL query against the database",
  schema: z.object({
    query: z.string().describe("The SQL query to execute"),
  }),
  func: async ({ query }) => {
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
        if (pattern.test(query)) {
          throw new Error("Query contains forbidden operations");
        }
      }
      
      // Only allow SELECT statements
      if (!query.trim().toUpperCase().startsWith('SELECT')) {
        throw new Error("Only SELECT queries are allowed");
      }
      
      const result = await supabase.rpc('execute_sql_query', { query });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return JSON.stringify(result.data);
    } catch (error) {
      return `Error executing query: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

// Create the agent factory function
export async function createDbAgent(userMessage: string) {
  // Define the tools
  const tools = [executeSqlTool];
  const toolNode = new ToolNode(tools);

  // Create a model and give it access to the tools
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  }).bindTools(tools);

  // Define the system message with the DB schema
  const systemMessage = `You are a database expert who helps users query and analyze data.
  You have access to a database with the following schema:
  
  ${DB_SCHEMA}
  
  1. When asked a question, think about what SQL query would answer it
  2. Use the execute_sql_query tool to run the query
  3. Analyze the results and provide insights
  4. Be concise but thorough in your analysis
  
  Always verify your queries are valid and only use tables and columns that exist in the schema.`;

  // Define the function that determines whether to continue or not
  function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM makes a tool call, route to the "tools" node
    if (lastMessage.tool_calls?.length) {
      return "tools";
    }
    // Otherwise, stop and reply to the user
    return "__end__";
  }

  // Define the function that calls the model
  async function callModel(state: typeof MessagesAnnotation.State) {
    const response = await model.invoke([
      { role: "system", content: systemMessage },
      ...state.messages
    ]);

    return { messages: [response] };
  }

  // Define a new graph
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addNode("tools", toolNode)
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue);

  // Compile it into a LangChain Runnable
  const app = workflow.compile();

  // Use the agent
  const response = await app.invoke({
    messages: [new HumanMessage(userMessage)],
  });

  return response;
}