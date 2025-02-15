"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SentimentResult } from "@/services/types";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SentimentDashboard() {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const handleAnalyze = async (companyToAnalyze: string) => {
    if (!companyToAnalyze.trim()) {
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
        body: JSON.stringify({ company: companyToAnalyze }),
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

  useEffect(() => {
    const companyFromUrl = searchParams.get("company");
    if (companyFromUrl) {
      setCompany(companyFromUrl);
      handleAnalyze(companyFromUrl);
    }
  }, [searchParams]);

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
            onClick={() => handleAnalyze(company)}
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
              <p className="text-2xl font-bold">{result.score.toFixed(2)}</p>
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
                    <Link href={mention.url || ""} target="_blank">
                      <p className="text-sm">{mention.text}</p>

                      <div className="flex gap-2 items-center">
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
                        <span className="text-xs text-muted-foreground">
                          • {mention.source}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {mention.date} </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 md:col-span-2">
              <h3 className="font-semibold mb-4">Sentiment Over Time</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...(result.sentimentOverTime || [])].sort((a, b) => 
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                    )}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value: number) => [value.toFixed(2), "Sentiment"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#2563eb"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
