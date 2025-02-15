export interface DataSource {
  fetchData(query: string): Promise<
    Array<{
      text: string;
      source: string;
      url?: string;
      date?: string;
    }>
  >;
}

export interface SentimentTimePoint {
  date: string;
  sentiment: number;
}

export interface SentimentResult {
  score: number; // -1 to 1
  mentions: number;
  topKeywords: string[];
  recentMentions: {
    text: string;
    source: string;
    url?: string;
    sentiment: number;
    date?: string;
  }[];
  sentimentOverTime: SentimentTimePoint[];
}
