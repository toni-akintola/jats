import { NextRequest, NextResponse } from "next/server";
import { ChatMistralAI } from "@langchain/mistralai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";
import {
  convertLangChainMessageToVercelMessage,
  parseAgentResult,
} from "@/lib/utils";

// Define module interfaces
interface ResearchModule {
  name: string;
  description: string;
  agent: any; // Replace with proper type
  execute: (company: string) => Promise<any>;
}

// Financial Module Agents
class FinancialModule implements ResearchModule {
  name = "Financial Research";
  description = "Analyze financial health, stock performance, and funding";

  private chat = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0.2,
  });

  private tools = [
    new TavilySearchResults({
      searchDepth: "deep",
      maxResults: 5,
    }),
  ];

  agent = createReactAgent({
    llm: this.chat,
    tools: this.tools,
    messageModifier: new SystemMessage(`
      You are a financial research specialist. 
      Provide a STRUCTURED JSON response with the following format:
      {
        "stockPrice": "Current stock price and recent trend",
        "fundingRounds": "Recent funding details (amount, investors, date)",
        "secFilings": "Key insights from recent SEC filings"
      }

      IMPORTANT RULES:
      - Always return a valid JSON object
      - If information is unavailable, use null
      - Focus on recent and most relevant financial information
      - Provide concise, factual insights
    `),
  });

  async execute(company: string) {
    const result = await this.agent.invoke({
      messages: [
        {
          role: "user",
          content: `Generate a comprehensive financial overview for ${company}. 
                  Respond ONLY with the structured JSON format specified.`,
        },
      ],
    });

    // Use the new parsing utility
    const parsedResult = parseAgentResult(result);

    // If parsing fails, return default values
    return (
      parsedResult || {
        stockPrice: null,
        fundingRounds: null,
        secFilings: null,
      }
    );
  }
}

// Market Module Agents
class MarketModule implements ResearchModule {
  name = "Market Research";
  description = "Analyze market sentiment, news, and competitive landscape";

  private chat = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0.2,
  });

  private tools = [
    new TavilySearchResults({
      searchDepth: "deep",
      maxResults: 5,
    }),
  ];

  agent = createReactAgent({
    llm: this.chat,
    tools: this.tools,
    messageModifier: new SystemMessage(`
      You are a market research specialist. 
      Provide a STRUCTURED JSON response with the following format:
      {
        "newsSentiment": "Overall sentiment from recent news articles",
        "socialSentiment": "Aggregated sentiment from social media platforms",
        "competitorComparison": "Brief comparison with key market competitors"
      }

      IMPORTANT RULES:
      - Always return a valid JSON object
      - If information is unavailable, use null
      - Focus on recent market dynamics
      - Provide objective, data-driven insights
    `),
  });

  async execute(company: string) {
    const result = await this.agent.invoke({
      messages: [
        {
          role: "user",
          content: `Generate a comprehensive market analysis for ${company}. 
                  Respond ONLY with the structured JSON format specified.`,
        },
      ],
    });
    const parsedResult = parseAgentResult(result);
    // If parsing fails, return default values
    return (
      parsedResult || {
        newsSentiment: null,
        socialSentiment: null,
        competitorComparison: null,
      }
    );
  }
}

// People Module Agents
class PeopleModule implements ResearchModule {
  name = "People Research";
  description = "Analyze workforce, leadership, and talent dynamics";

  private chat = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0.2,
  });

  private tools = [
    new TavilySearchResults({
      searchDepth: "deep",
      maxResults: 5,
    }),
  ];

  agent = createReactAgent({
    llm: this.chat,
    tools: this.tools,
    messageModifier: new SystemMessage(`
      You are a talent and workforce research specialist. 
      Provide a STRUCTURED JSON response with the following format:
      {
        "leadershipChanges": "Recent key leadership hires or departures",
        "jobPostings": "Summary of current job openings and hiring trends",
        "employeeSentiment": "Overall employee satisfaction and workplace culture insights"
      }

      IMPORTANT RULES:
      - Always return a valid JSON object
      - If information is unavailable, use null
      - Focus on recent workforce developments
      - Provide factual, concise information
    `),
  });

  async execute(company: string) {
    const result = await this.agent.invoke({
      messages: [
        {
          role: "user",
          content: `Generate a comprehensive people and talent analysis for ${company}. 
                  Respond ONLY with the structured JSON format specified.`,
        },
      ],
    });
    const parsedResult = parseAgentResult(result);
    // If parsing fails, return default values
    return (
      parsedResult || {
        leadershipChanges: null, // Placeholder
        jobPostings: null, // Placeholder
        employeeSentiment: null, // Placeholder
      }
    );
  }
}

// Product Module Agents
class ProductModule implements ResearchModule {
  name = "Product Research";
  description = "Analyze product development, tech stack, and innovation";

  private chat = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0.2,
  });

  private tools = [
    new TavilySearchResults({
      searchDepth: "deep",
      maxResults: 5,
    }),
  ];

  agent = createReactAgent({
    llm: this.chat,
    tools: this.tools,
    messageModifier: new SystemMessage(`
      You are a product and technology research specialist. 
      Provide a STRUCTURED JSON response with the following format:
      {
        "githubActivity": "Recent GitHub repository activity and key developments",
        "apiChanges": "Notable API updates or changes",
        "productInnovation": "Recent product innovations or technological advancements"
      }

      IMPORTANT RULES:
      - Always return a valid JSON object
      - If information is unavailable, use null
      - Focus on recent technological developments
      - Provide objective, technical insights
    `),
  });

  async execute(company: string) {
    const result = await this.agent.invoke({
      messages: [
        {
          role: "user",
          content: `Generate a comprehensive product and technology analysis for ${company}. 
                  Respond ONLY with the structured JSON format specified.`,
        },
      ],
    });
    const parsedResult = parseAgentResult(result);
    // If parsing fails, return default values
    return (
      parsedResult || {
        githubActivity: null, // Placeholder
        apiChanges: null, // Placeholder
        productInnovation: null, // Placeholder
      }
    );
  }
}

// Main Research Orchestrator
export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json();

    if (!company) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 },
      );
    }

    // Initialize modules
    const modules = [
      new FinancialModule(),
      new MarketModule(),
      new PeopleModule(),
      new ProductModule(),
    ];

    // Execute all modules in parallel
    const results = await Promise.all(
      modules.map(async (module) => ({
        moduleName: module.name,
        moduleDescription: module.description,
        data: await module.execute(company),
      })),
    );

    return NextResponse.json({
      company,
      researchModules: results,
    });
  } catch (error) {
    console.error("Company Research Error:", error);
    return NextResponse.json(
      { error: "Failed to complete company research" },
      { status: 500 },
    );
  }
}

export const runtime = "edge";
