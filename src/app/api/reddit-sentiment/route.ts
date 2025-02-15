import { NextResponse } from "next/server";

function generateRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateMockRedditPost(company: string) {
  const templates = [
    `Discussion: What do you think about ${company}'s market position?`,
    `${company} Q4 Earnings Report - Analysis and Discussion`,
    `Why I believe ${company} is undervalued right now`,
    `${company}'s new strategy seems concerning. Thoughts?`,
    `Deep dive into ${company}'s competitive advantages`,
  ];

  const sentiment = (Math.random() * 2 - 1) * 0.8; // Random between -0.8 and 0.8
  const text = templates[Math.floor(Math.random() * templates.length)];
  const date = generateRandomDate(new Date("2024-01-01"), new Date());

  return {
    id: Math.random().toString(36).substring(7),
    text,
    sentiment,
    created_utc: date.toISOString(),
    permalink: `https://reddit.com/r/stocks/comments/${Math.random().toString(36).substring(7)}`,
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

  const mentions = Array.from({ length: 8 }, () =>
    generateMockRedditPost(company),
  );
  const average_sentiment =
    mentions.reduce((sum, m) => sum + m.sentiment, 0) / mentions.length;

  return NextResponse.json({
    mentions,
    average_sentiment,
    keywords: ["investment", "earnings", "market", "strategy", "analysis"],
  });
}
