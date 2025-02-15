import { HackerNewsSource } from "./hackernews";
import { AgentMessage, SourceData } from "../agent-types";
import { analyzeSentiment } from "../sentiment-analyzer";

export class HackerNewsAgent {
  private source: HackerNewsSource;

  constructor() {
    this.source = new HackerNewsSource();
  }

  async search(company: string): Promise<AgentMessage> {
    try {
      // Fetch data using existing HackerNewsSource
      const mentions = await this.source.fetchData(company);

      // Add sentiment analysis to each mention and ensure required fields
      const mentionsWithSentiment = await Promise.all(
        mentions.map(async (mention) => {
          const sentiment = await analyzeSentiment(mention.text);
          return {
            text: mention.text,
            sentiment: Number(sentiment.toFixed(2)),
            url: mention.url,
            source: mention.source,
            // Ensure we always have a date by providing a fallback
            date: mention.date || new Date().toISOString(),
          };
        }),
      );

      // Calculate average sentiment
      const averageSentiment = mentionsWithSentiment.length
        ? Number(
            (
              mentionsWithSentiment.reduce((sum, m) => sum + m.sentiment, 0) /
              mentionsWithSentiment.length
            ).toFixed(2),
          )
        : 0;

      const data: SourceData = {
        mentions: mentionsWithSentiment,
        sentiment: averageSentiment,
      };

      return {
        type: "source_complete",
        source: "hacker news",
        data,
      };
    } catch (error) {
      console.error("HackerNews agent error:", error);
      return {
        type: "source_error",
        source: "hacker news",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
