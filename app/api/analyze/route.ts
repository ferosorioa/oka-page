// File: app/api/analyze/route.ts
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Define the schema for structured output
const AnalysisSchema = z.object({
  summary: z.string().describe("A brief summary of the analysis"),
  insights: z.array(z.string()).describe("Key insights derived from the data"),
  visualizationSuggestions: z.array(
    z.object({
      type: z.string().describe("Type of visualization (e.g., bar chart, line chart)"),
      description: z.string().describe("Description of what the visualization would show"),
      relevance: z.string().describe("Why this visualization is relevant to the data")
    })
  ).describe("Suggestions for visualizing the data"),
  nextQuestions: z.array(z.string()).describe("Follow-up questions that might be useful to ask"),
});

export async function POST(req: Request) {
  try {
    const { sql, results } = await req.json();
    
    if (!results) {
      return new Response(JSON.stringify({ error: "No results provided for analysis" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Initialize the model
    const llm = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0,
    });
    
    // Create a prompt template for analysis
    const analysisPrompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a data analyst who provides insights from database query results.
      Analyze the provided data and extract key insights. Focus on patterns, trends, and notable findings.
      Provide a thorough analysis with actionable information and visualization suggestions.`],
      ["human", `SQL query executed: {sql}
      
      Query results: {results}
      
      Please analyze these results and provide structured insights.`]
    ]);

    // Create a structured output chain using withStructuredOutput
    const structuredOutputChain = analysisPrompt.pipe(
      llm.withStructuredOutput(AnalysisSchema)
    );
    
    // Generate the structured analysis
    const analysis = await structuredOutputChain.invoke({
      sql,
      results: typeof results === 'string' ? results : JSON.stringify(results, null, 2),
    });
    
    return new Response(JSON.stringify(analysis), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}