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

export interface Mention {
  text: string;
  sentiment: number;
  source: string;
  date: string;
  url?: string;
}

export interface SentimentResult {
  score: number;
  mentions: number;
  topKeywords: string[];
  recentMentions: Array<{
    sentiment: number;
    date?: string;
    keywords?: string[];
  }>;
}

export interface SentimentSource {
  name: string;
  fetchSentiment: (company: string) => Promise<SentimentResult>;
}
