import { NextRequest } from "next/server";
import { HackerNewsSource } from "@/services/sources/hackernews";
import { SentimentAnalyzer } from "@/services/sentiment-analyzer";

export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json();

    if (!company) {
      return Response.json(
        { error: "Company name is required" },
        { status: 400 },
      );
    }

    const analyzer = new SentimentAnalyzer([new HackerNewsSource()]);
    const result = await analyzer.analyze(company);

    return Response.json(result);
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return Response.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 },
    );
  }
}
