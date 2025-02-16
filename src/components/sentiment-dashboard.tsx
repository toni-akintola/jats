"use client";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { AreaChart, DataPoint } from "@/components/ui/area-chart";
import { analyzeSentiment } from "@/services/sentiment-service";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Chart } from "@/components/ui/chart";

type CompanyData = {
  name: string;
  sentiment: number;
  dataPoints: DataPoint[];
  url?: string;
};

interface SentimentDashboardProps {
  companies: string[];
}

export function SentimentDashboard({ companies }: SentimentDashboardProps) {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSources, setLoadingSources] = useState<{
    [key: string]: boolean;
  }>({});
  const { toast } = useToast();

  const analyzeCompany = useCallback(
    async (company: string) => {
      try {
        setLoadingSources((prev) => ({
          ...prev,
          [company]: true,
        }));

        const sentimentData = await analyzeSentiment(company);
        const companyData: CompanyData = {
          name: company,
          sentiment: sentimentData.score,
          dataPoints: sentimentData.dataPoints || [],
          url: sentimentData.url,
        };

        setData((prev) => [...prev, companyData]);
      } catch (error) {
        console.error(error);
        toast({
          title: `Error analyzing ${company}`,
          description: "Failed to analyze sentiment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingSources((prev) => ({
          ...prev,
          [company]: false,
        }));
      }
    },
    [toast],
  );

  // Auto-analyze locations when provided
  useEffect(() => {
    const newCompanies = companies.filter((company) => !data.some((c) => c.name === company));
    if (newCompanies.length > 0) {
      newCompanies.forEach((company) => {
        analyzeCompany(company);
      });
    }
  }, [companies, analyzeCompany, data]);

  const handleAnalyze = async () => {
    if (companies.length === 0) {
      toast({
        title: "No companies selected",
        description: "Please add at least one company to analyze.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await Promise.all(companies.map(analyzeCompany));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const combinedSentimentData = (() => {
    const allDates = new Set(
      data.flatMap((company) =>
        company.dataPoints.map((point) => point.date),
      ),
    );

    const dataPoints: DataPoint[] = Array.from(allDates)
      .sort()
      .map((date) => {
        const dataPoint: DataPoint = { date };
        data.forEach((company) => {
          const matchingPoint = company.dataPoints.find(
            (p) => p.date === date,
          );
          dataPoint[company.name] = matchingPoint ? matchingPoint.sentiment : 0;
        });
        return dataPoint;
      });

    return dataPoints;
  })();

  return (
    <div className="h-full p-8 relative">
      <div className="space-y-8">
        {Object.keys(data).length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Sentiment Scores</h3>
                {data.map((company, index) => (
                  <div
                    key={company.name}
                    className={`p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors ${
                      loadingSources[company.name] ? "opacity-50" : ""
                    }`}
                  >
                    <h4 className="font-medium text-white">{company.name}</h4>
                    <p className="text-2xl font-bold text-white">
                      {company.sentiment.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="md:col-span-2">
                <AreaChart
                  data={combinedSentimentData}
                  title="Sentiment Comparison"
                  config={Object.fromEntries(
                    data.map((company, index) => [
                      company.name,
                      { label: company.name, color: index % 5 },
                    ]),
                  )}
                  xAxisKey="date"
                  xAxisFormatter={(date) => new Date(date).toLocaleDateString()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Company Details</h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {data.map((company) => (
                  <Card
                    key={company.name}
                    className="p-4 bg-white/10 backdrop-blur-md border-white/10 min-w-[350px] max-w-[400px] flex-shrink-0"
                  >
                    <h3 className="font-semibold mb-4 text-white">{company.name}</h3>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white/80 mb-2">
                        Top Keywords
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {company.dataPoints.map((point) => (
                          <span
                            key={point.date}
                            className="bg-white/20 text-white px-2 py-1 rounded-full text-sm"
                          >
                            {point.date}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white/80 mb-2">
                        Recent Mentions
                      </h4>
                      <div className="space-y-2">
                        {company.dataPoints.map((point, i) => (
                          <div key={i} className="p-2 rounded bg-white/10">
                            <Link href={point.url || ""} target="_blank">
                              <p className="text-sm text-white/90">
                                {point.date}
                              </p>
                              <div className="flex gap-2 items-center mt-2">
                                <span
                                  className={`text-xs ${
                                    point.sentiment > 0
                                      ? "text-green-400"
                                      : point.sentiment < 0
                                        ? "text-red-400"
                                        : "text-white/60"
                                  }`}
                                >
                                  sentiment: {point.sentiment.toFixed(2)}
                                </span>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
