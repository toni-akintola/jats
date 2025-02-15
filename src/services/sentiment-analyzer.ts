import { DataSource, SentimentResult } from "./types";
import Sentiment from "sentiment"; // We'll use a simple sentiment library for this example

export class SentimentAnalyzer {
  private sources: DataSource[];
  private sentimentAnalyzer: Sentiment;

  constructor(sources: DataSource[]) {
    this.sources = sources;
    this.sentimentAnalyzer = new Sentiment();
  }

  async analyze(companyName: string): Promise<SentimentResult> {
    // Fetch data from all sources
    const allTexts = await Promise.all(
      this.sources.map((source) => source.fetchData(companyName)),
    );

    const flattenedTexts = allTexts.flat();

    // Analyze sentiment for each text
    const sentiments = flattenedTexts.map((text) => ({
      text,
      analysis: this.sentimentAnalyzer.analyze(text),
    }));

    // Calculate aggregate metrics
    const avgScore =
      sentiments.reduce((acc, curr) => acc + curr.analysis.comparative, 0) /
      sentiments.length;

    // Extract top keywords (excluding common words)
    const keywords = this.extractTopKeywords(sentiments);

    return {
      score: avgScore,
      mentions: flattenedTexts.length,
      topKeywords: keywords,
      recentMentions: sentiments.slice(0, 5).map((s) => ({
        text: s.text,
        sentiment: s.analysis.comparative,
      })),
    };
  }

  private extractTopKeywords(sentiments: any[]): string[] {
    // Implementation for keyword extraction
    // This is a simplified version
    return ["keyword1", "keyword2", "keyword3"];
  }
}
