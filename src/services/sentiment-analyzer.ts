import { DataSource, SentimentResult } from "./types";
import Sentiment from "sentiment";

interface SentimentData {
  text: {
    text: string;
    source: string;
    url?: string;
  };
  analysis: {
    score: number;
    comparative: number;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  };
}

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
    const sentiments: SentimentData[] = flattenedTexts.map((item) => ({
      text: item,
      analysis: this.sentimentAnalyzer.analyze(item.text),
    }));

    // Calculate aggregate metrics
    const avgScore =
      sentiments.reduce((acc, curr) => acc + curr.analysis.comparative, 0) /
      sentiments.length;

    // Extract top keywords from positive and negative words
    const keywords = this.extractTopKeywords(sentiments);

    return {
      score: avgScore,
      mentions: flattenedTexts.length,
      topKeywords: keywords,
      recentMentions: sentiments.slice(0, 5).map((s) => ({
        text: s.text.text,
        source: s.text.source,
        url: s.text.url,
        sentiment: s.analysis.comparative,
      })),
    };
  }

  private extractTopKeywords(sentiments: SentimentData[]): string[] {
    // Collect all words that contributed to sentiment
    const words = sentiments.flatMap((s) => [
      ...s.analysis.positive,
      ...s.analysis.negative,
    ]);

    // Count word frequencies
    const wordCount = words.reduce(
      (acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Sort by frequency and take top 10
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }
}
