import { SentimentSource, SentimentResult, Mention } from "../types";
import { generateMentionText } from "../sentiment-service";

interface RedditMention {
  id: string;
  text: string;
  sentiment: number;
  created_utc: string;
  permalink: string;
}

export const redditSource: SentimentSource = {
  name: "Reddit",
  async fetchSentiment(location: string): Promise<SentimentResult> {
    // Generate random sentiment data
    const mentionCount = Math.floor(Math.random() * 15) + 5; // 5-20 mentions
    const mentions: Mention[] = [];
    const baseScore = Math.random() * 2 - 1; // Base sentiment between -1 and 1

    for (let i = 0; i < 5; i++) {
      const sentiment = baseScore + (Math.random() * 0.8 - 0.4); // Add more variation for Reddit
      const daysAgo = Math.floor(Math.random() * 30); // Random date within last month
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const postId = Math.random().toString(36).substr(2, 6);
      const subreddit = ["citydiscussion", "urbanliving", "localcommunity"][
        Math.floor(Math.random() * 3)
      ];

      mentions.push({
        text: generateMentionText(location, sentiment, "Reddit"),
        sentiment,
        source: "Reddit",
        date: date.toISOString(),
        url: `https://www.reddit.com/r/Damnthatsinteresting/comments/14c4qig/three_years_ago_today_rick_astlet_got_rick_rolled`,
      });
    }

    // Generate keywords based on sentiment
    const keywords = [
      "community",
      "discussion",
      "local",
      "urban",
      "living",
      location.toLowerCase(),
      mentions[0].sentiment > 0.5 ? "positive" : "mixed",
      mentions[0].sentiment > 0 ? "improvement" : "feedback",
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
