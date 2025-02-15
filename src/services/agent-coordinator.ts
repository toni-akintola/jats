import { SearchState, AgentMessage, SourceData } from "./agent-types";
import { HackerNewsAgent } from "@/services/sources/hackernews-agent";

const SUPPORTED_SOURCES = ["hacker news", "twitter", "reddit"] as const;

// Helper to generate a random date within the last month
const getRandomDate = () => {
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(
    oneMonthAgo.getTime() +
      Math.random() * (now.getTime() - oneMonthAgo.getTime()),
  );
};

const createMockMentions = (source: string): SourceData => {
  const dates = Array(5)
    .fill(null)
    .map(() => getRandomDate())
    .sort((a, b) => b.getTime() - a.getTime());

  return {
    mentions: dates.map((date, i) => ({
      text: `This is a sample ${source} mention ${i + 1}. The company seems to be doing ${
        Math.random() > 0.5 ? "well" : "poorly"
      } according to recent reports.`,
      sentiment: Number((Math.random() * 2 - 1).toFixed(2)),
      url: "#",
      source,
      date: date.toISOString(),
    })),
    sentiment: Number((Math.random() * 2 - 1).toFixed(2)),
  };
};

// Create agents
const hackerNewsAgent = new HackerNewsAgent();

export class AgentCoordinator {
  private state: SearchState;
  private subscribers: ((state: SearchState) => void)[] = [];

  constructor() {
    this.state = {
      company: "",
      sources: SUPPORTED_SOURCES.reduce(
        (acc, source) => ({
          ...acc,
          [source]: { name: source, status: "idle" },
        }),
        {},
      ),
      status: "idle",
    };
  }

  subscribe(callback: (state: SearchState) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private updateState(newState: Partial<SearchState>) {
    this.state = { ...this.state, ...newState };
    this.subscribers.forEach((cb) => cb(this.state));
  }

  async startSearch(company: string) {
    this.updateState({
      company,
      status: "running",
      sources: SUPPORTED_SOURCES.reduce(
        (acc, source) => ({
          ...acc,
          [source]: { name: source, status: "running" },
        }),
        {},
      ),
    });

    // Start HackerNews search
    hackerNewsAgent
      .search(company)
      .then((message) => this.handleMessage(message));

    // Keep the mock data for other sources for now
    setTimeout(
      () =>
        this.handleMessage({
          type: "source_error",
          source: "twitter",
          error: "API rate limit exceeded",
        }),
      3500,
    );

    setTimeout(
      () =>
        this.handleMessage({
          type: "source_complete",
          source: "reddit",
          data: createMockMentions("reddit"),
        }),
      5000,
    );
  }

  private handleMessage(message: AgentMessage) {
    const { sources } = this.state;

    switch (message.type) {
      case "source_complete":
        sources[message.source] = {
          name: message.source,
          status: "completed",
          data: message.data,
        };
        break;
      case "source_error":
        sources[message.source] = {
          name: message.source,
          status: "error",
          error: message.error,
        };
        break;
    }

    const allComplete = Object.values(sources).every((source) =>
      ["completed", "error"].includes(source.status),
    );

    this.updateState({
      sources,
      status: allComplete ? "completed" : "running",
    });
  }

  getState() {
    return this.state;
  }
}

// Create a singleton instance
export const agentCoordinator = new AgentCoordinator();
