import { DataSource } from "@/services/types";
import { HackerNewsHit } from "@/services/types/hackernews";
import { SentimentSource, SentimentResult } from "../types";

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
  async fetchSentiment(company: string): Promise<SentimentResult> {
    const response = await fetch("/api/hackernews-sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company }),
    });

    if (!response.ok) throw new Error("Failed to fetch Hacker News sentiment");

    const data = await response.json();

    return {
      mentions: data.recentMentions.map(
        (mention: {
          text: string;
          sentiment: number;
          date: string;
          url?: string;
        }) => ({
          text: mention.text,
          sentiment: mention.sentiment,
          source: "Hacker News",
          date: mention.date,
          url: mention.url,
        }),
      ),
      score: data.score,
      keywords: data.topKeywords,
    };
  },
};
