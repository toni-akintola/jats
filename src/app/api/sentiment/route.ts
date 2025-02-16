import { NextResponse } from "next/server";
import { HackerNewsSource } from "@/services/sources/hackernews";
import { SentimentAnalyzer } from "@/services/sentiment-analyzer";

export async function POST(request: Request) {
  try {
    const { company } = await request.json();

    if (!company) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 },
      );
    }

    const analyzer = new SentimentAnalyzer([new HackerNewsSource()]);
    const result = await analyzer.analyze(company);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 },
    );
  }
}
