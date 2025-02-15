import { DataSource } from "@/services/types";
import { HackerNewsHit } from "@/services/types/hackernews";

export class HackerNewsSource implements DataSource {
  private BASE_URL = "https://hn.algolia.com/api/v1";

  async fetchData(query: string): Promise<
    Array<{
      text: string;
      source: string;
      url?: string;
      date?: string;
    }>
  > {
    try {
      // Search HN stories and comments
      const response = await fetch(
        `${this.BASE_URL}/search?query="${query}"&tags=(story,comment)&hitsPerPage=100`,
      );
      const data = await response.json();

      // Extract relevant text content with URLs
      return data.hits
        .map((hit: HackerNewsHit) => {
          const text = hit.story_text || hit.title || "";
          const url =
            hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
          const date = hit.created_at;

          return {
            text,
            source: "Hacker News",
            url,
            date,
          };
        })
        .filter((item) => item.text);
    } catch (error) {
      console.error("Error fetching from HN:", error);
      return [];
    }
  }
}
