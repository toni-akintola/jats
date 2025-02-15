import { twitterSource } from "./sources/twitter";
import { redditSource } from "./sources/reddit";
import { hackernewsSource } from "./sources/hackernews";
import { SentimentResult, Mention } from "./types";

const sources = [twitterSource, redditSource, hackernewsSource];

export interface AggregatedSentiment {
  score: number;
  mentions: number;
  topKeywords: string[];
  recentMentions: Mention[];
  sentimentOverTime: {
    date: string;
    sentiment: number;
  }[];
}

export async function analyzeSentiment(
  company: string,
): Promise<AggregatedSentiment> {
  // Fetch sentiment from all sources in parallel
  const results = await Promise.all(
    sources.map(async (source) => {
      try {
        return await source.fetchSentiment(company);
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error);
        return null;
      }
    }),
  );

  // Filter out failed results and combine data
  const validResults = results.filter((r): r is SentimentResult => r !== null);

  if (validResults.length === 0) {
    throw new Error("Failed to fetch sentiment from any source");
  }

  // Combine mentions from all sources
  const allMentions = validResults.flatMap((r) => r.mentions);

  // Calculate average sentiment score
  const totalScore = validResults.reduce((sum, r) => sum + r.score, 0);
  const averageScore = totalScore / validResults.length;

  // Aggregate keywords and count occurrences
  const keywordCounts = validResults
    .flatMap((r) => r.keywords)
    .reduce(
      (acc, keyword) => {
        acc[keyword] = (acc[keyword] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  // Get top keywords
  const topKeywords = Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([keyword]) => keyword);

  // Sort mentions by date and get most recent
  const sortedMentions = allMentions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate sentiment over time
  const mentionsByDate = allMentions.reduce(
    (acc, mention) => {
      const date = new Date(mention.date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { sum: 0, count: 0 };
      }
      acc[date].sum += mention.sentiment;
      acc[date].count += 1;
      return acc;
    },
    {} as Record<string, { sum: number; count: number }>,
  );

  const sentimentOverTime = Object.entries(mentionsByDate)
    .map(([date, { sum, count }]) => ({
      date,
      sentiment: sum / count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    score: averageScore,
    mentions: allMentions.length,
    topKeywords,
    recentMentions: sortedMentions,
    sentimentOverTime,
  };
}
