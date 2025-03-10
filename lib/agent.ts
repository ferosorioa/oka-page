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
      
      console.log("Executing SQL query:", query);
      const result = await supabase.rpc('execute_sql_query', { query });
      
      if (result.error) {
        console.error("Supabase RPC error:", result.error);
        throw new Error(`Supabase error: ${result.error.message}`);
      }
      
      console.log("Query result:", result.data);
      return JSON.stringify(result.data);
    } catch (error) {
      console.error("Error in executeSqlTool:", error);
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
    temperature: 0.5,
  }).bindTools(tools);

  // Define the system message with the DB schema
  const systemMessage = `Eres un asistente analítico y financiero para los administradores de OKA México, una empresa que vende productos hechos de piel de nopal y fibras naturales.
Nuestra página web es https://okamexico.com/

Tienes acceso a una base de datos con el siguiente esquema:

${DB_SCHEMA}

Cuando interactúes con administradores o equipo interno:
1. Sé profesional pero amigable, usando un tono claro y directo
2. Piensa qué consulta SQL respondería mejor a la pregunta sobre finanzas o administración
3. Ejecuta la consulta usando la herramienta execute_sql_query
4. Analiza los resultados desde una perspectiva financiera y de gestión
5. Ofrece insights profundos sobre rendimiento financiero, tendencias y oportunidades
6. Sugiere estrategias de optimización basadas en los datos

Información sobre OKA México:
- Somos una empresa que revoluciona la industria de la moda con productos sustentables
- Creamos accesorios con diseños exclusivos de piel de nopal y fibras naturales 
- Nuestro lema es "El futuro del arte y diseño no es sólo Mexicano, también es verde"
- Buscamos equilibrar nuestra misión sustentable con la rentabilidad del negocio

Cuando analices datos financieros o de operaciones, siempre:
- Destaca métricas clave de rendimiento (KPIs) y su evolución
- Analiza márgenes de ganancia y oportunidades de optimización de costos
- Identifica productos más y menos rentables
- Sugiere áreas para reducir gastos o aumentar ingresos
- Proporciona análisis de tendencias para toma de decisiones estratégicas
- Conecta el rendimiento financiero con objetivos de sustentabilidad cuando sea relevante

Verifica siempre que tus consultas SQL sean válidas y solo uses tablas y columnas que existan en el esquema.`;

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
    try {
      const response = await model.invoke([
        { role: "system", content: systemMessage },
        ...state.messages
      ]);
      return { messages: [response] };
    } catch (error) {
      console.error("Error in model invocation:", error);
      // Return a fallback message
      return { 
        messages: [
          new AIMessage({ 
            content: `I encountered an error processing your request: ${error instanceof Error ? error.message : String(error)}. Please try a simpler query.` 
          })
        ] 
      };
    }
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
  }).catch(error => {
    console.error("Agent execution error:", error);
    return {
      messages: [
        new AIMessage({
          content: `I encountered an error: ${error instanceof Error ? error.message : String(error)}. Please try again with a different query.`
        })
      ]
    };
  });

  return response;
}