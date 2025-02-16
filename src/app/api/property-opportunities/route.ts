import { NextRequest } from "next/server";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

interface PropertyOpportunity {
  address: string;
  type: string;
}

const systemPrompt = `
You are a real estate development analyst. Find specific properties or development sites.
Respond with JUST a JSON array of opportunities in this format:
[{
  "address": "Full property address",
  "type": "Current property type (vacant land, existing building, etc.)"
}]

Focus on:
- Underutilized properties
- Properties in emerging neighborhoods
- Sites with development potential
- Properties with value-add opportunities

Be specific with addresses and realistic with opportunities.
`;

export async function POST(req: NextRequest) {
  try {
    const { location, propertyType } = await req.json();

    if (!location) {
      return new Response(JSON.stringify({ error: "Location is required" }), {
        status: 400,
      });
    }

    const userPrompt = `
      Find 3-5 specific property development opportunities in ${location}
      ${propertyType ? `focusing on ${propertyType} properties` : ""}.
      Include only real, existing properties or development sites.
      Provide specific street addresses where possible.
    `;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1024,
        temperature: 0.2,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      // Try to parse the content as JSON
      const parsedContent = content
        .replace("```json", "")
        .replace("```", "")
        .trim();
      const opportunities: PropertyOpportunity[] = JSON.parse(parsedContent);

      return new Response(JSON.stringify({ opportunities }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("Failed to parse opportunities:", e);
      // If JSON parsing fails, try to extract addresses using regex
      const addressRegex =
        /\d+\s+[A-Za-z\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Circle|Cir|Highway|Hwy)/g;
      const addresses = content.match(addressRegex) || [];

      const opportunities = addresses.map((address) => ({
        address,
        type: "Unknown",
      }));

      return new Response(JSON.stringify({ opportunities }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
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
