import { SentimentSource, SentimentResult, Mention } from "../types";

interface RedditMention {
  id: string;
  text: string;
  sentiment: number;
  created_utc: string;
  permalink: string;
}

interface RedditResponse {
  mentions: RedditMention[];
  average_sentiment: number;
  keywords: string[];
}

export const redditSource: SentimentSource = {
  name: "Reddit",
  async fetchSentiment(company: string): Promise<SentimentResult> {
    const response = await fetch(
      `/api/reddit-sentiment?company=${encodeURIComponent(company)}`,
    );
    if (!response.ok) throw new Error("Failed to fetch Reddit sentiment");

    const data: RedditResponse = await response.json();

    const mentions: Mention[] = data.mentions.map((mention) => ({
      text: mention.text,
      sentiment: mention.sentiment,
      source: "Reddit",
      date: mention.created_utc,
      url: mention.permalink,
    }));

    return {
      mentions,
      score: data.average_sentiment,
      keywords: data.keywords,
    };
  },
};
