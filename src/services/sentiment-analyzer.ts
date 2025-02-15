import { DataSource, SentimentResult, SentimentTimePoint } from "./types";
import Sentiment from "sentiment";

interface SentimentData {
  text: {
    text: string;
    source: string;
    url?: string;
    date?: string;
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

    const sentimentOverTime: SentimentTimePoint[] = [];
    for (const sentiment of sentiments) {
      sentimentOverTime.push({
        date: sentiment.text.date || "",
        sentiment: sentiment.analysis.score,
      });
    }

    const result = {
      score: avgScore,
      mentions: flattenedTexts.length,
      sentimentOverTime: sentimentOverTime.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
      topKeywords: keywords,
      recentMentions: sentiments.slice(0, 5).map((s) => ({
        text: s.text.text,
        source: s.text.source,
        url: s.text.url,
        sentiment: s.analysis.comparative,
        date: s.text.date,
      })),
    };

    return result;
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

export async function analyzeSentiment(text: string): Promise<number> {
  // Simple word-based sentiment analysis
  const positiveWords = new Set([
    "good",
    "great",
    "awesome",
    "excellent",
    "happy",
    "love",
    "wonderful",
    "fantastic",
    "amazing",
    "positive",
    "success",
    "successful",
    "win",
    "winning",
    "innovative",
    "improve",
    "improved",
    "improvement",
    "grow",
    "growing",
    "growth",
    "profit",
    "profitable",
    "benefit",
    "beneficial",
  ]);

  const negativeWords = new Set([
    "bad",
    "terrible",
    "awful",
    "horrible",
    "sad",
    "hate",
    "poor",
    "negative",
    "fail",
    "failing",
    "failed",
    "failure",
    "lose",
    "losing",
    "loss",
    "decline",
    "declining",
    "decrease",
    "decreasing",
    "worry",
    "worried",
    "concerning",
    "concern",
    "problem",
    "problematic",
  ]);

  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  let relevantWords = 0;

  words.forEach((word) => {
    if (positiveWords.has(word)) {
      score += 1;
      relevantWords++;
    } else if (negativeWords.has(word)) {
      score -= 1;
      relevantWords++;
    }
  });

  // Normalize score to be between -1 and 1
  return relevantWords > 0 ? score / relevantWords : 0;
}
