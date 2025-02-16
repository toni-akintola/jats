"use client";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { AreaChart, DataPoint } from "@/components/ui/area-chart";
// import {
//   StaggeredDropdown,
//   StaggeredDropdownProps,
// } from "@/components/ui/dropdown";
// import { FiHome, FiUser, FiFile } from "react-icons/fi";
import { analyzeSentiment } from "@/services/sentiment-service";

type CompanyData = {
  company: string;
  score: number;
  mentions: number;
  topKeywords: string[];
  recentMentions: {
    text: string;
    sentiment: number;
    source: string;
    date: string;
    url?: string;
  }[];
  sentimentOverTime: {
    date: string;
    sentiment: number;
  }[];
};

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function SentimentDashboard({ 
  address,
  onRemoveLocation,
  onClose,
}: { 
  address: string;
  onRemoveLocation: (location: string, isLast: boolean) => void;
  onClose?: () => void;
}) {
  const [companies, setCompanies] = useState<string[]>([]);
  const [newCompany, setNewCompany] = useState("");
  const [results, setResults] = useState<Record<string, CompanyData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingSources, setLoadingSources] = useState<{
    [key: string]: boolean;
  }>({});
  const { toast } = useToast();

  const analyzeCompany = useCallback(async (company: string) => {
    try {
      setLoadingSources((prev) => ({
        ...prev,
        [company]: true,
      }));

      const data = await analyzeSentiment(company);

      setResults((prev) => ({
        ...prev,
        [company]: { ...data, company },
      }));
    } catch (error) {
      console.error(error);
      toast({
        title: `Error analyzing ${company}`,
        description: "Failed to analyze sentiment. Please try again.",
        variant: "destructive",
      });
      setCompanies((prev) => prev.filter((c) => c !== company));
    } finally {
      setLoadingSources((prev) => ({
        ...prev,
        [company]: false,
      }));
    }
  }, [toast]);

  const handleAddCompany = useCallback(async (companyName?: string) => {
    const company = (companyName || newCompany).trim();
    if (!company) return;

    if (companies.includes(company)) {
      toast({
        title: "Location already added",
        description: "This location is already in the analysis list.",
        variant: "destructive",
      });
      return;
    }

    setCompanies((prev) => [...prev, company]);
    // Only clear the input if it's not the address
    if (!address || company !== address) {
      setNewCompany("");
    }
    await analyzeCompany(company);
  }, [address, companies, newCompany, toast, analyzeCompany]);

  // Auto-analyze address when provided
  useEffect(() => {
    if (address && !companies.includes(address)) {
      setNewCompany(address);
      handleAddCompany(address);
    }
  }, [address, companies, handleAddCompany]);

  // const response = await fetch("/api/sentiment", {
  //   method: "POST",
  //   body: JSON.stringify({ company: companyToAnalyze }),
  //   headers: { "Content-Type": "application/json" },
  // });

  const handleRemoveCompany = (company: string) => {
    const isLastCompany = companies.length === 1;
    setCompanies(companies.filter((c) => c !== company));
    setResults((prev) => {
      const newResults = { ...prev };
      delete newResults[company];
      return newResults;
    });
    if (onRemoveLocation) {
      onRemoveLocation(company, isLastCompany);
    }
  };

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

  // useEffect(() => {
  //   const companyFromUrl = searchParams.get("company");
  //   if (companyFromUrl) {
  //     setCompany(companyFromUrl);
  //     handleAnalyze(companyFromUrl);
  //   }
  // }, [searchParams]);

  const combinedSentimentData = (() => {
    const allDates = new Set(
      Object.values(results).flatMap((data) =>
        data.sentimentOverTime.map((point) => point.date),
      ),
    );

    const dataPoints: DataPoint[] = Array.from(allDates)
      .sort()
      .map((date) => {
        const dataPoint: DataPoint = { date };
        Object.entries(results).forEach(([company, data]) => {
          const matchingPoint = data.sentimentOverTime.find(
            (p) => p.date === date,
          );
          dataPoint[company] = matchingPoint ? matchingPoint.sentiment : 0;
        });
        return dataPoint;
      });

    return dataPoints;
  })();

  // const dropdownOptions: StaggeredDropdownProps[] = [
  //   {
  //     text: "Home",
  //     Icon: FiHome,
  //     href: "/",
  //   },
  //   {
  //     text: "Profile",
  //     Icon: FiUser,
  //     href: "/profile",
  //   },
  //   {
  //     text: "Spreadsheet",
  //     Icon: FiFile,
  //     href: "/spreadsheet",
  //   },
  // ];

  return (
    <div className="h-full p-8 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          aria-label="Close dashboard"
        >
          ×
        </button>
      )}
      <div className="space-y-8">
        <div className="space-y-4">

          <h2 className="text-2xl font-bold text-white">
            Sentiment Analysis
          </h2>

          <div className="flex gap-2">
            <Input
              placeholder="Enter company name..."
              value={address ? address : newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCompany()}
              className="max-w-xs"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || companies.length === 0}
            >
              {loading ? "Analyzing..." : "Analyze Sentiment"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {companies.map((company) => (
              <div
                key={company}
                className="bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/30 transition-colors"
              >
                <span>{company}</span>
                <button
                  onClick={() => handleRemoveCompany(company)}
                  className="hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Sentiment Scores</h3>
                {Object.entries(results).map(([company, data], index) => (
                  <div
                    key={company}
                    className={`p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors ${
                      loadingSources[company] ? "opacity-50" : ""
                    }`}
                    style={{
                      borderLeft: `4px solid ${COLORS[index % COLORS.length]}`,
                    }}
                  >
                    <h4 className="font-medium text-white">{company}</h4>
                    <p className="text-2xl font-bold text-white">
                      {data.score.toFixed(2)}
                    </p>
                    <p className="text-sm text-white/60">
                      {data.mentions} mentions
                    </p>
                  </div>
                ))}
              </div>

              <div className="md:col-span-2">
                <AreaChart
                  data={combinedSentimentData}
                  title="Sentiment Comparison"
                  config={Object.fromEntries(
                    Object.keys(results).map((company, index) => [
                      company,
                      { label: company, color: COLORS[index % COLORS.length] },
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
                {Object.entries(results).map(([company, data]) => (
                  <Card
                    key={company}
                    className="p-4 bg-white/10 backdrop-blur-md border-white/10 min-w-[350px] max-w-[400px] flex-shrink-0"
                  >
                    <h3 className="font-semibold mb-4 text-white">{company}</h3>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white/80 mb-2">
                        Top Keywords
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {data.topKeywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="bg-white/20 text-white px-2 py-1 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white/80 mb-2">
                        Recent Mentions
                      </h4>
                      <div className="space-y-2">
                        {data.recentMentions.map((mention, i) => (
                          <div key={i} className="p-2 rounded bg-white/10">
                            <Link href={mention.url || ""} target="_blank">
                              <p className="text-sm text-white/90">
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
                                  • {mention.source}
                                </span>
                                <span className="text-xs text-white/60">
                                  {mention.date}
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
