"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SentimentResult } from "@/services/types";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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

    try {
      setLoading(true);
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
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
            placeholder="Enter company name..."
            value={company}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCompany(e.target.value)
            }
            disabled={loading}
          />
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? <LoadingSpinner /> : "Analyze"}
          </Button>
        </div>

        {loading && (
          <Card className="p-8">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner />
              <p className="text-sm text-muted-foreground">
                Analyzing sentiment for {company}...
              </p>
            </div>
          </Card>
        )}

        {result && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Sentiment Score</h3>
              <Progress value={(result.score + 1) * 50} className="h-4" />
              <p className="text-sm text-muted-foreground mt-2">
                Based on {result.mentions} mentions
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Top Keywords</h3>
              <div className="flex gap-2 flex-wrap">
                {result.topKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-secondary px-2 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-4 md:col-span-2">
              <h3 className="font-semibold mb-2">Recent Mentions</h3>
              <div className="space-y-2">
                {result.recentMentions.map((mention, i) => (
                  <div key={i} className="p-2 rounded bg-secondary">
                    <p className="text-sm">{mention.text}</p>
                    <span
                      className={`text-xs ${
                        mention.sentiment > 0
                          ? "text-green-500"
                          : mention.sentiment < 0
                            ? "text-red-500"
                            : "text-gray-500"
                      }`}
                    >
                      Sentiment: {mention.sentiment.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
