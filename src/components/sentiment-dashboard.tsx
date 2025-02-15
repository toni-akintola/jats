"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SentimentResult } from "@/services/types";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart } from "@/components/ui/area-chart";
import { agentCoordinator } from "@/services/agent-coordinator";
import { AgentSource, SearchState, SourceData } from "@/services/agent-types";
import { TypewriterText } from "@/components/ui/typewriter-text";

export function SentimentDashboard() {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [searchState, setSearchState] = useState<SearchState>(
    agentCoordinator.getState(),
  );
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to agent coordinator updates
    const unsubscribe = agentCoordinator.subscribe(setSearchState);
    return unsubscribe;
  }, []);

  const handleAnalyze = async () => {
    if (!company.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    try {
      await agentCoordinator.startSearch(company);

      // Keep the API call for now, but we'll move this logic to the agents later
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      if (!response.ok) throw new Error("Failed to analyze sentiment");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to analyze sentiment. Please try again.",
        variant: "destructive",
      });
    }
  };
  console.log("result is", result?.sentimentOverTime);

  const getLoadingMessages = (sources: Record<string, AgentSource>) => {
    const messages: string[] = [];

    Object.entries(sources).forEach(([source, data]) => {
      if (data.status === "running") {
        messages.push(`searching ${source}...`);
      } else if (data.status === "completed") {
        messages.push(`found data from ${source}!`);
      } else if (data.status === "error") {
        messages.push(`error searching ${source}`);
      }
    });

    return messages;
  };

  const SourceMentionsCard = ({
    source,
    data,
  }: {
    source: string;
    data?: SourceData;
  }) => {
    if (!data?.mentions.length) {
      return null;
    }

    // Sort mentions by sentiment score in descending order
    const sortedMentions = [...data.mentions].sort(
      (a, b) => b.sentiment - a.sentiment,
    );

    return (
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white capitalize">
            {source} mentions
          </h3>
          <span className="text-sm text-white/60">
            sentiment: {data.sentiment.toFixed(2)}
          </span>
        </div>
        <div className="space-y-3">
          {sortedMentions.slice(0, 5).map((mention, idx) => (
            <div key={idx} className="p-3 rounded bg-white/10">
              <Link href={mention.url || "#"} target="_blank">
                <p className="text-sm text-white/90 line-clamp-2">
                  {mention.text}
                </p>
                <div className="flex gap-2 items-center mt-2">
                  <span
                    className={`text-xs ${
                      mention.sentiment > 0
                        ? "text-green-400"
                        : mention.sentiment < 0
                          ? "text-red-400"
                          : "text-white/60"
                    }`}
                  >
                    sentiment: {mention.sentiment.toFixed(2)}
                  </span>
                  <span className="text-xs text-white/60">
                    • {new Date(mention.date).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="enter company name..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAnalyze();
              }
            }}
            className="bg-black/20 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/20"
          />
          <Button
            onClick={handleAnalyze}
            className="min-w-[100px] bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          >
            analyze
          </Button>
        </div>

        {searchState.status === "running" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4 md:col-span-2 bg-white/10 backdrop-blur-md border-white/10">
              <h3 className="font-semibold mb-2 text-white">Search Progress</h3>
              <div className="text-white/80">
                <TypewriterText
                  messages={getLoadingMessages(searchState.sources)}
                  typingSpeed={40}
                  delayBetweenMessages={800}
                />
              </div>
            </Card>

            <Card className="p-4 bg-white/10 backdrop-blur-md border-white/10">
              <h3 className="font-semibold mb-2 text-white">sentiment score</h3>
              <Skeleton className="h-8 w-24 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/20 mt-2" />
            </Card>

            <Card className="p-4 bg-white/10 backdrop-blur-md border-white/10">
              <h3 className="font-semibold mb-2 text-white">top keywords</h3>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-6 w-16 bg-white/20 rounded-full"
                  />
                ))}
              </div>
            </Card>

            <Card className="p-4 md:col-span-2 bg-white/10 backdrop-blur-md border-white/10">
              <h3 className="font-semibold mb-2 text-white">recent mentions</h3>
              <div className="space-y-2">
                {Object.entries(searchState.sources).map(
                  ([source, sourceData]) => (
                    <div key={source} className="p-3 rounded bg-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{source}</span>
                        {sourceData.status === "running" ? (
                          <LoadingSpinner className="w-4 h-4 text-white" />
                        ) : sourceData.status === "error" ? (
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <Skeleton className="h-4 w-full bg-white/20 mb-2" />
                      <Skeleton className="h-4 w-3/4 bg-white/20" />
                      <div className="flex gap-2 mt-2">
                        <Skeleton className="h-3 w-16 bg-white/20" />
                        <Skeleton className="h-3 w-16 bg-white/20" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Card>

            <Card className="p-4 md:col-span-2 bg-white/10 backdrop-blur-md border-white/10">
              <h3 className="font-semibold mb-4 text-white">
                Sentiment Over Time
              </h3>
              <div className="h-[300px] w-full">
                <Skeleton className="h-full w-full bg-white/20" />
              </div>
            </Card>
          </div>
        )}

        {result && result.score && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4 bg-white/10 backdrop-blur-md border-white/10">
              <h3 className="font-semibold mb-2 text-white">sentiment score</h3>
              <p className="text-2xl font-bold text-white">
                {result.score.toFixed(2)}
              </p>
              <p className="text-sm text-white/60 mt-2">
                based on {result.mentions} mentions
              </p>
            </Card>

            <Card className="p-4 bg-white/10 backdrop-blur-md border-white/10">
              <h3 className="font-semibold mb-2 text-white">top keywords</h3>
              <div className="flex gap-2 flex-wrap">
                {result.topKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-white/20 text-white px-2 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-4 md:col-span-2 bg-white/10 backdrop-blur-md border-white/10">
              <h3 className="font-semibold mb-2 text-white">recent mentions</h3>
              <div className="space-y-2">
                {result.recentMentions.map((mention, i) => (
                  <div key={i} className="p-2 rounded bg-white/10">
                    <Link href={mention.url || ""} target="_blank">
                      <p className="text-sm text-white/90">{mention.text}</p>
                      <div className="flex gap-2 items-center mt-2">
                        <span
                          className={`text-xs ${
                            mention.sentiment > 0
                              ? "text-green-400"
                              : mention.sentiment < 0
                                ? "text-red-400"
                                : "text-white/60"
                          }`}
                        >
                          sentiment: {mention.sentiment.toFixed(2)}
                        </span>
                        <span className="text-xs text-white/60">
                          • {mention.source}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {mention.date}{" "}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>

            {Object.entries(searchState.sources).map(
              ([source, sourceData]) =>
                sourceData.status === "completed" && (
                  <SourceMentionsCard
                    key={source}
                    source={source}
                    data={sourceData.data}
                  />
                ),
            )}

            <AreaChart
              data={[...(result.sentimentOverTime || [])].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              )}
              title="Sentiment Over Time"
              config={{
                sentiment: {
                  label: "Sentiment",
                  color: "hsl(217, 91%, 60%)", // Tailwind blue-500
                },
              }}
              xAxisKey="date"
              xAxisFormatter={(date) => new Date(date).toLocaleDateString()}
              dateRange={`${new Date(result.sentimentOverTime[0].date).toLocaleDateString()} - ${new Date(
                result.sentimentOverTime[
                  result.sentimentOverTime.length - 1
                ].date,
              ).toLocaleDateString()}`}
              trend={{
                value:
                  result.sentimentOverTime[result.sentimentOverTime.length - 1]
                    .sentiment - result.sentimentOverTime[0].sentiment,
                label: `Trending ${
                  result.sentimentOverTime[result.sentimentOverTime.length - 1]
                    .sentiment > result.sentimentOverTime[0].sentiment
                    ? "up"
                    : "down"
                } in sentiment`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
