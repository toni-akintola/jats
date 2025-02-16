import { DataSource } from "@/services/types";
import { HackerNewsHit } from "@/services/types/hackernews";
import { SentimentSource, SentimentResult, Mention } from "../types";
import { generateMentionText } from "../sentiment-service";

interface HNItem {
  text: string;
  source: string;
  url?: string;
  date?: string;
}

export class HackerNewsSource implements DataSource {
  private BASE_URL = "https://hn.algolia.com/api/v1";

  async fetchData(query: string): Promise<
    Array<{
      text: string;
      source: string;
      url?: string;
      date?: string;
    }>
  > {
    try {
      // Search HN stories and comments
      const response = await fetch(
        `${this.BASE_URL}/search?query="${query}"&tags=(story,comment)&hitsPerPage=100`,
      );
      const data = await response.json();

      // Extract relevant text content with URLs
      return data.hits
        .map((hit: HackerNewsHit) => {
          const text = hit.story_text || hit.title || "";
          const url =
            hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
          const date = hit.created_at;

          return {
            text,
            source: "Hacker News",
            url,
            date,
          };
        })
        .filter((item: HNItem) => item.text);
    } catch (error) {
      console.error("Error fetching from HN:", error);
      return [];
    }
  }
}

export const hackernewsSource: SentimentSource = {
  name: "Hacker News",
  async fetchSentiment(location: string): Promise<SentimentResult> {
    // Generate random sentiment data
    const mentionCount = Math.floor(Math.random() * 10) + 3; // 3-13 mentions (HN typically has fewer)
    const mentions: Mention[] = [];
    const baseScore = Math.random() * 2 - 1; // Base sentiment between -1 and 1

    for (let i = 0; i < mentionCount; i++) {
      const sentiment = baseScore + (Math.random() * 1.0 - 0.5); // More extreme variations for HN
      const daysAgo = Math.floor(Math.random() * 60); // Random date within last 2 months
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const itemId = Math.floor(Math.random() * 1000000) + 30000000;

      mentions.push({
        text: generateMentionText(location, sentiment, "Hacker News"),
        sentiment,
        source: "Hacker News",
        date: date.toISOString(),
        url: `https://news.ycombinator.com/item?id=${itemId}`,
      });
    }

    // Generate keywords based on sentiment
    const keywords = [
      "technology",
      "startup",
      "innovation",
      "development",
      "community",
      location.toLowerCase(),
      mentions[0].sentiment > 0.5 ? "growth" : "challenges",
      mentions[0].sentiment > 0 ? "opportunity" : "concern",
    ];

    // Calculate average sentiment
    const averageSentiment =
      mentions.reduce((sum, m) => sum + m.sentiment, 0) / mentions.length;

    return {
      mentions,
      score: averageSentiment,
      keywords: keywords,
    };
  },
};
