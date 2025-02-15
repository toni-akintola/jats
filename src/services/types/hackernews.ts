interface HighlightResult {
  matchLevel: string;
  matchedWords: string[];
  value: string;
  fullyHighlighted?: boolean;
}

interface HighlightResults {
  author: HighlightResult;
  story_text?: HighlightResult;
  title: HighlightResult;
  url?: HighlightResult;
}

export interface HackerNewsHit {
  _highlightResult: HighlightResults;
  _tags: string[];
  author: string;
  children: number[];
  created_at: string;
  created_at_i: number;
  num_comments: number;
  objectID: string;
  points: number;
  story_id: number;
  story_text?: string;
  title: string;
  updated_at: string;
  url?: string;
}
