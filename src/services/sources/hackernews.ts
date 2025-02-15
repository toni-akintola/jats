import { DataSource } from "@/services/types";
import { HackerNewsHit } from "@/services/types/hackernews";

export class HackerNewsSource implements DataSource {
  private BASE_URL = "https://hn.algolia.com/api/v1";

  async fetchData(
    companyName: string,
  ): Promise<{ text: string; source: string; url?: string }[]> {
    try {
      // Search HN stories and comments
      const response = await fetch(
        `${this.BASE_URL}/search?query="${companyName}"&tags=(story,comment)`,
      );
      const data = await response.json();

      // Extract relevant text content with URLs
      return data.hits
        .map((hit: HackerNewsHit) => {
          const text = hit.story_text || hit.title || "";
          const url = hit.url; // story_url for comments, url for stories

          return {
            text,
            source: "Hacker News",
            url: url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          };
        })
        .filter((item: { text: string }) => item.text);
    } catch (error) {
      console.error("Error fetching from HN:", error);
      return [];
    }
  }
}
