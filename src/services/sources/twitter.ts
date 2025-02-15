import { SentimentSource, SentimentResult, Mention } from "../types";

interface TwitterMention {
  id: string;
  text: string;
  sentiment: number;
  created_at: string;
}

interface TwitterResponse {
  mentions: TwitterMention[];
  average_sentiment: number;
  keywords: string[];
}

export const twitterSource: SentimentSource = {
  name: "Twitter",
  async fetchSentiment(company: string): Promise<SentimentResult> {
    const response = await fetch(
      `/api/twitter-sentiment?company=${encodeURIComponent(company)}`,
    );
    if (!response.ok) throw new Error("Failed to fetch Twitter sentiment");

    const data: TwitterResponse = await response.json();

    const mentions: Mention[] = data.mentions.map((mention) => ({
      text: mention.text,
      sentiment: mention.sentiment,
      source: "Twitter",
      date: mention.created_at,
      url: `https://twitter.com/user/status/${mention.id}`,
    }));

    return {
      mentions,
      score: data.average_sentiment,
      keywords: data.keywords,
    };
  },
};
