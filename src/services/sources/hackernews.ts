import { DataSource } from "@/services/types";

export class HackerNewsSource implements DataSource {
  private BASE_URL = "https://hn.algolia.com/api/v1";

  async fetchData(companyName: string): Promise<string[]> {
    try {
      // Search HN stories and comments
      const response = await fetch(
        `${this.BASE_URL}/search?query="${companyName}"&tags=(story,comment)`,
      );
      const data = await response.json();

      // Extract relevant text content
      return data.hits
        .map((hit: any) => {
          return hit.comment_text || hit.story_text || hit.title || "";
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error fetching from HN:", error);
      return [];
    }
  }
}
