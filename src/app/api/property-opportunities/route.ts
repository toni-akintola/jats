import { NextRequest } from "next/server";
import { Listing } from "@/types/listing";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

const systemPrompt = `
You are a real estate development analyst specializing in identifying investment opportunities.
Find specific properties or development sites and return detailed analysis.

Respond with JUST a JSON array of opportunities in this exact format:
[{
  "location": "Full property address",
  "subtitle": "Brief compelling headline",
  "propertyType": "Development Site" | "Renovation" | "Value-Add" | "Redevelopment" | "Land" | "Adaptive Reuse",
  "opportunity": "2-3 sentence description of the opportunity",
  "marketHighlights": [
    "Key market feature 1",
    "Key market feature 2",
    "Key market feature 3"
  ],
  "size": {
    "acres": number (optional),
    "squareFeet": number (optional)
  },
  "price": number,
  "pricePerSqFt": number,
  "zoning": "Current zoning designation",
  "potentialUse": ["Use 1", "Use 2", "Use 3"],
  "status": "Available" | "Under Contract" | "In Due Diligence" | "Off Market",
  "timeline": "Expected development timeline (e.g., '18-24 months')",
  "roi": {
    "projected": number (percentage),
    "timeframe": "Investment horizon (e.g., '3 years')"
  }
}]

Focus on:
- Properties with clear value-add potential
- Sites in emerging or established markets
- Opportunities matching current market trends
- Realistic pricing and returns
- Diverse property types and uses
- Local market dynamics and demand drivers

Be specific with addresses, realistic with opportunities, and thorough in analysis.
`;

export async function POST(req: NextRequest) {
  try {
    const { location, propertyType, priceRange } = await req.json();

    if (!location) {
      return new Response(JSON.stringify({ error: "Location is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userPrompt = `
      Find real estate development opportunities in ${location}
      ${propertyType ? `focusing on ${propertyType} properties` : ""}
      ${priceRange ? `within the price range of ${priceRange}` : ""}.
      
      Consider:
      - Current market conditions
      - Development potential
      - Local regulations and zoning
      - Market demand drivers
      - Potential returns
      
      Return 3-5 specific opportunities.
    `;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        return_images: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      const opportunities: Listing[] = JSON.parse(content);

      // Add generated IDs and default image
      const processedOpportunities = opportunities.map((opp, index) => ({
        ...opp,
        id: Date.now() + index,
        imageUrl: "/belveron-partners.jpg",
        isFavorite: false,
      }));

      return new Response(
        JSON.stringify({ opportunities: processedOpportunities }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (e) {
      console.error("Failed to parse opportunities:", e);
      return new Response(
        JSON.stringify({
          error: "Failed to parse opportunities",
          details: "Invalid response format from AI",
        }),
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Property Opportunities Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to find property opportunities",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    );
  }
}

export const runtime = "edge";
