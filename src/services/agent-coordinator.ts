import {
  AgentSource,
  SearchState,
  AgentMessage,
  SourceData,
} from "./agent-types";

const SUPPORTED_SOURCES = ["hacker news", "twitter", "reddit"] as const;

const mockSourceData: SourceData = {
  mentions: [],
  sentiment: 0,
};

const createMockMentions = (source: string) => ({
  mentions: Array(5)
    .fill(null)
    .map((_, i) => ({
      text: `This is a sample ${source} mention ${i + 1}. The company seems to be doing ${
        Math.random() > 0.5 ? "well" : "poorly"
      } according to recent reports.`,
      sentiment: Number((Math.random() * 2 - 1).toFixed(2)),
      url: "#",
      source,
      date: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    })),
  sentiment: Number((Math.random() * 2 - 1).toFixed(2)),
});

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

    // Simulate different sources completing at different times with different outcomes
    setTimeout(
      () =>
        this.handleMessage({
          type: "source_complete",
          source: "hacker news",
          data: createMockMentions("hacker news"),
        }),
      2000,
    );

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
