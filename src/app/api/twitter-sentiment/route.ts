import { NextResponse } from "next/server";

function generateRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateMockTweet(company: string) {
  const templates = [
    `Really impressed with ${company}'s latest product launch! #Innovation`,
    `${company} customer service needs improvement. Not happy. #CustomerService`,
    `Just invested in ${company}. Feeling optimistic about their future! #Stocks`,
    `${company} is changing the game in their industry. Amazing progress!`,
    `Having issues with my ${company} device. Anyone else? #Tech`,
  ];

  const sentiment = (Math.random() * 2 - 1) * 0.8; // Random between -0.8 and 0.8
  const text = templates[Math.floor(Math.random() * templates.length)];
  const date = generateRandomDate(new Date("2024-01-01"), new Date());

  return {
    id: Math.random().toString(36).substring(7),
    text,
    sentiment,
    created_at: date.toISOString(),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company");

  if (!company) {
    return NextResponse.json(
      { error: "Company parameter is required" },
      { status: 400 },
    );
  }

  const mentions = Array.from({ length: 10 }, () => generateMockTweet(company));
  const average_sentiment =
    mentions.reduce((sum, m) => sum + m.sentiment, 0) / mentions.length;

  return NextResponse.json({
    mentions,
    average_sentiment,
    keywords: ["innovation", "technology", "growth", "market", "product"],
  });
}
