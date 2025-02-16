import { NextRequest } from "next/server";
import { ChatMistralAI } from "@langchain/mistralai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";
import { parseAgentResult } from "@/lib/utils";

// Base Module Interface
interface ResearchModule {
  name: string;
  description: string;
  agent: unknown;
  execute: (location: string) => Promise<unknown>;
}

// Location Analysis Module
class LocationAnalyzer implements ResearchModule {
  name = "Location Analysis";
  description =
    "Analyze demographic trends, development activity, and local amenities";

  private chat = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0.2,
  });

  private tools = [
    new TavilySearchResults({ searchDepth: "deep", maxResults: 5 }),
  ];

  agent = createReactAgent({
    llm: this.chat,
    tools: this.tools,
    messageModifier: new SystemMessage(`
      You are a location analysis specialist.
      Provide a STRUCTURED JSON response with the following format:
      {
        "demographicTrends": "Population growth, income levels, and demographic shifts",
        "developmentActivity": "New construction projects and urban planning initiatives",
        "localAmenities": "Proximity to schools, transit, retail, and other key amenities"
      }

      IMPORTANT RULES:
      - Always return a valid JSON object
      - Focus on recent demographic and development trends
      - Include specific metrics where available
      - Highlight key amenities and accessibility factors
    `),
  });

  async execute(location: string) {
    const result = await this.agent.invoke({
      messages: [
        {
          role: "user",
          content: `Analyze the location characteristics and trends for ${location}.
                 Respond ONLY with the structured JSON format specified.`,
        },
      ],
    });
    return parseAgentResult(result);
  }
}

// Market Conditions Module
class MarketConditions implements ResearchModule {
  name = "Market Conditions";
  description = "Track property prices, inventory levels, and market trends";

  private chat = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0.2,
  });

  private tools = [
    new TavilySearchResults({ searchDepth: "deep", maxResults: 5 }),
  ];

  agent = createReactAgent({
    llm: this.chat,
    tools: this.tools,
    messageModifier: new SystemMessage(`
      You are a real estate market analyst.
      Provide a STRUCTURED JSON response with the following format:
      {
        "priceTrends": "Historical price movements and current market values",
        "inventoryLevels": "Available properties and days on market metrics",
        "marketTrends": "Price per square foot trends and absorption rates"
      }

      IMPORTANT RULES:
      - Always return a valid JSON object
      - Include specific price and inventory metrics
      - Focus on recent market movements
      - Highlight key market indicators
    `),
  });

  async execute(location: string) {
    const result = await this.agent.invoke({
      messages: [
        {
          role: "user",
          content: `Analyze current market conditions in ${location}.
                 Respond ONLY with the structured JSON format specified.`,
        },
      ],
    });
    return parseAgentResult(result);
  }
}

// Competitive Intelligence Module
class CompetitiveIntel implements ResearchModule {
  name = "Competitive Analysis";
  description =
    "Analyze comparable properties, rental markets, and property features";

  private chat = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0.2,
  });

  private tools = [
    new TavilySearchResults({ searchDepth: "deep", maxResults: 5 }),
  ];

  agent = createReactAgent({
    llm: this.chat,
    tools: this.tools,
    messageModifier: new SystemMessage(`
      You are a competitive intelligence analyst.
      Provide a STRUCTURED JSON response with the following format:
      {
        "comparableProperties": "Recent sales and current listings of similar properties",
        "rentalMarket": "Local rental rates and occupancy trends",
        "propertyFeatures": "Common amenities and popular upgrades in the market"
      }

      IMPORTANT RULES:
      - Always return a valid JSON object
      - Include specific comparable properties
      - Focus on rental market dynamics
      - Detail common property features
    `),
  });

  async execute(location: string) {
    const result = await this.agent.invoke({
      messages: [
        {
          role: "user",
          content: `Analyze competitive landscape and rental market in ${location}.
                 Respond ONLY with the structured JSON format specified.`,
        },
      ],
    });
    return parseAgentResult(result);
  }
}

// Regulatory Environment Module
class RegulatoryMonitor implements ResearchModule {
  name = "Regulatory Environment";
  description =
    "Track zoning regulations, building permits, and policy changes";

  private chat = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0.2,
  });

  private tools = [
    new TavilySearchResults({ searchDepth: "deep", maxResults: 5 }),
  ];

  agent = createReactAgent({
    llm: this.chat,
    tools: this.tools,
    messageModifier: new SystemMessage(`
      You are a regulatory compliance specialist.
      Provide a STRUCTURED JSON response with the following format:
      {
        "zoningRegulations": "Current zoning laws and land use restrictions",
        "buildingPermits": "Recent permit activity and construction approvals",
        "policyChanges": "Recent or upcoming housing laws and tax policies"
      }

      IMPORTANT RULES:
      - Always return a valid JSON object
      - Focus on current regulations and recent changes
      - Include specific permit activity
      - Highlight important policy developments
    `),
  });

  async execute(location: string) {
    const result = await this.agent.invoke({
      messages: [
        {
          role: "user",
          content: `Analyze regulatory environment and policy landscape in ${location}.
                 Respond ONLY with the structured JSON format specified.`,
        },
      ],
    });
    return parseAgentResult(result);
  }
}

// Main Research Orchestrator
export async function POST(req: NextRequest) {
  try {
    const { location } = await req.json();

    if (!location) {
      return new Response(JSON.stringify({ error: "Location is required" }), {
        status: 400,
      });
    }

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Initialize modules
          const modules = [
            new LocationAnalyzer(),
            new MarketConditions(),
            new CompetitiveIntel(),
            new RegulatoryMonitor(),
          ];

          // Send initial location data
          controller.enqueue(`data: ${JSON.stringify({ location })}\n\n`);

          // Execute modules one at a time and stream results
          for (const m of modules) {
            const result = await m.execute(location);
            const moduleData = {
              moduleName: m.name,
              moduleDescription: m.description,
              data: result,
            };

            controller.enqueue(`data: ${JSON.stringify(moduleData)}\n\n`);
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Property Research Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to complete property research" }),
      { status: 500 },
    );
  }
}

export const runtime = "edge";
