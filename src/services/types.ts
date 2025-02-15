export interface DataSource {
  fetchData(query: string): Promise<string[]>;
}

export interface SentimentResult {
  score: number; // -1 to 1
  mentions: number;
  topKeywords: string[];
  recentMentions: {
    text: string;
    sentiment: number;
    date?: string;
  }[];
}
