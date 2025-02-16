import { SentimentSource, SentimentResult, Mention } from "../types";
import { generateMentionText } from "../sentiment-service";

interface TwitterMention {
  id: string;
  text: string;
  sentiment: number;
  created_at: string;
}

export const twitterSource: SentimentSource = {
  name: "Twitter",
  async fetchSentiment(location: string): Promise<SentimentResult> {
    // Generate random sentiment data
    const mentionCount = 5;
    const mentions: Mention[] = [];
    for (let i = 0; i < mentionCount; i++) {
      const sentiment = Math.random() * 2 - 1; // Random sentiment between -1 and 1
      const date = new Date();
      const daysAgo = Math.floor(Math.random() * 7); // More recent for Twitter
      date.setDate(date.getDate() - daysAgo);
      const tweetId = Math.random().toString(36).substring(7);

      mentions.push({
        text: generateMentionText(location, sentiment, "Twitter"),
        sentiment,
        source: "Twitter",
        date: date.toISOString(),
        url: `https://twitter.com/user/status/${tweetId}`,
      });
    }

    // Generate keywords based on sentiment
    const keywords = [
      "trending",
      "social",
      "buzz",
      "conversation",
      "update",
      location.toLowerCase(),
      mentions[0].sentiment > 0.5 ? "love" : "thoughts",
      mentions[0].sentiment > 0 ? "excited" : "concerned",
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
