"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SentimentResult } from "@/services/types";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart } from "@/components/ui/area-chart";

export function SentimentDashboard() {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!company.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to analyze sentiment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className="min-w-[100px] bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          >
            {loading ? <LoadingSpinner className="w-4 h-4" /> : "analyze"}
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
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
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded bg-white/10">
                    <Skeleton className="h-4 w-full bg-white/20 mb-2" />
                    <Skeleton className="h-4 w-3/4 bg-white/20" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-3 w-16 bg-white/20" />
                      <Skeleton className="h-3 w-16 bg-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : result ? (
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
                    <Link href={mention.url || "#"} target="_blank">
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
                        {mention.date && (
                          <span className="text-xs text-white/60">
                            • {new Date(mention.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>

            {result.sentimentOverTime && (
              <Card className="p-4 md:col-span-2 bg-white/10 backdrop-blur-md border-white/10">
                <h3 className="font-semibold mb-4 text-white">
                  Sentiment Over Time
                </h3>
                <AreaChart
                  data={result.sentimentOverTime}
                  title="Sentiment Trend"
                  config={{
                    sentiment: {
                      label: "Sentiment",
                      color: "hsl(217, 91%, 60%)", // Tailwind blue-500
                    },
                  }}
                  xAxisKey="date"
                  xAxisFormatter={(date) => new Date(date).toLocaleDateString()}
                  dateRange={`${new Date(
                    result.sentimentOverTime[0].date,
                  ).toLocaleDateString()} - ${new Date(
                    result.sentimentOverTime[
                      result.sentimentOverTime.length - 1
                    ].date,
                  ).toLocaleDateString()}`}
                  trend={{
                    value:
                      result.sentimentOverTime[
                        result.sentimentOverTime.length - 1
                      ].sentiment - result.sentimentOverTime[0].sentiment,
                    label: `Trending ${
                      result.sentimentOverTime[
                        result.sentimentOverTime.length - 1
                      ].sentiment > result.sentimentOverTime[0].sentiment
                        ? "up"
                        : "down"
                    } in sentiment`,
                  }}
                />
              </Card>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
