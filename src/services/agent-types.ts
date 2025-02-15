export interface SourceData {
  mentions: Array<{
    text: string;
    sentiment: number;
    url?: string;
    source: string;
    date: string;
  }>;
  sentiment: number;
}

export interface AgentSource {
  name: string;
  status: "idle" | "running" | "completed" | "error";
  data?: SourceData;
  error?: string;
}

export interface AgentMessage {
  type: "start_search" | "source_complete" | "source_error";
  source: string;
  data?: SourceData;
  error?: string;
}

export interface SearchState {
  company: string;
  sources: Record<string, AgentSource>;
  status: "idle" | "running" | "completed" | "error";
}
