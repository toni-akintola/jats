// app/api/perplexity/route.ts
import { NextResponse, NextRequest } from "next/server";
import { Listing } from "@/types/listing";

const systemPrompt = `
You are a real estate development analyst specializing in identifying investment opportunities.
Find specific properties or development sites and return detailed analysis.

Return a JSON array of 3-5 opportunities in this exact format:
[{
  "location": "Full property address",
  "subtitle": "Brief compelling headline",
  "propertyType": "Development Site" | "Renovation" | "Value-Add" | "Redevelopment" | "Land" | "Adaptive Reuse",
  "opportunity": "2-3 sentence description of the opportunity",
  "marketHighlights": ["Key market feature 1", "Key market feature 2", "Key market feature 3"],
  "size": { "acres": number, "squareFeet": number },
  "price": number,
  "pricePerSqFt": number,
  "zoning": "Current zoning designation",
  "potentialUse": ["Use 1", "Use 2", "Use 3"],
  "status": "Available",
  "timeline": "18-24 months",
  "imageUrl": "URL of an image of the property or the area",
  "roi": { "projected": number, "timeframe": "3 years" }
}]

Focus on realistic opportunities with clear value-add potential in emerging or established markets.
`;

// async function getPropertyImage(propertyType: string, location: string): Promise<string> {
//   try {
//     // Create a search query based on property details
//     const searchQuery = `${propertyType} building ${location}`;

//     const response = await fetch(
//       `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
//         searchQuery
//       )}&per_page=1&orientation=landscape`,
//       {
//         headers: {
//           Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch image");
//     }

//     const data = await response.json();

//     // If we found a specific image, use it
//     if (data.results && data.results.length > 0) {
//       return data.results[0].urls.regular;
//     }

//     // Fallback to a random query from our predefined list
//     const fallbackQuery = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)];
//     const fallbackResponse = await fetch(
//       `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
//         fallbackQuery
//       )}&per_page=1&orientation=landscape`,
//       {
//         headers: {
//           Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
//         },
//       }
//     );

//     if (!fallbackResponse.ok) {
//       throw new Error("Failed to fetch fallback image");
//     }

//     const fallbackData = await fallbackResponse.json();
//     return fallbackData.results[0].urls.regular;
//   } catch (error) {
//     console.error("Error fetching image:", error);
//     // Return a default image if all else fails
//     return "/belveron-partners.jpg";
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const { location, propertyType, priceRange } = await req.json();

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 },
      );
    }

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "opportunities",
            strict: true,
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  location: { type: "string" },
                  subtitle: { type: "string" },
                  propertyType: { type: "string" },
                  opportunity: { type: "string" },
                  marketHighlights: {
                    type: "array",
                    items: { type: "string" },
                  },
                  size: {
                    type: "object",
                    properties: {
                      acres: { type: "number" },
                      squareFeet: { type: "number" },
                    },
                  },
                  price: { type: "number" },
                  pricePerSqFt: { type: "number" },
                  zoning: { type: "string" },
                  potentialUse: { type: "array", items: { type: "string" } },
                  status: { type: "string" },
                  timeline: { type: "string" },
                  roi: {
                    type: "object",
                    properties: {
                      projected: { type: "number" },
                      timeframe: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Find real estate opportunities in ${location}${propertyType ? ` focusing on ${propertyType} properties` : ""}${priceRange ? ` within ${priceRange}` : ""}.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON array from the response text
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response");
    }

    // Get images for each opportunity
    const opportunities: Listing[] = await Promise.all(
      JSON.parse(jsonMatch[0]).map(async (opp: Listing, index: number) => {
        return {
          ...opp,
          id: Date.now() + index,
          isFavorite: false,
        };
      }),
    );

    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to find opportunities" },
      { status: 500 },
    );
  }
}

export const runtime = "edge";
