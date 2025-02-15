"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  StaggeredDropdown,
  StaggeredDropdownProps,
} from "@/components/ui/dropdown";
import { FiHome, FiUser } from "react-icons/fi";

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

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function SentimentDashboard() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [newCompany, setNewCompany] = useState("");
  const [results, setResults] = useState<Record<string, CompanyData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingSources, setLoadingSources] = useState<{
    [key: string]: boolean;
  }>({});
  const { toast } = useToast();

  const analyzeCompany = async (company: string) => {
    try {
      setLoadingSources(prev => ({
        ...prev,
        [company]: true
      }));

      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      if (!response.ok) throw new Error(`Failed to analyze ${company}`);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [company]: { ...data, company }
      }));
    } catch (error) {
      toast({
        title: `Error analyzing ${company}`,
        description: "Failed to analyze sentiment. Please try again.",
        variant: "destructive",
      });
      setCompanies(prev => prev.filter(c => c !== company));
    } finally {
      setLoadingSources(prev => ({
        ...prev,
        [company]: false
      }));
    }
  };

  const handleAddCompany = async () => {
    if (!newCompany.trim()) return;
    
    const company = newCompany.trim();
    if (companies.includes(company)) {
      toast({
        title: "Company already added",
        description: "This company is already in the comparison list.",
        variant: "destructive",
      });
      return;
    }

    setCompanies(prev => [...prev, company]);
    setNewCompany("");
    await analyzeCompany(company);
  };

  const handleRemoveCompany = (company: string) => {
    setCompanies(companies.filter(c => c !== company));
    setResults(prev => {
      const newResults = { ...prev };
      delete newResults[company];
      return newResults;
    });
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

  const combinedSentimentData = (() => {
    const allDates = new Set(
      Object.values(results).flatMap(data => 
        data.sentimentOverTime.map(point => point.date)
      )
    );

    return Array.from(allDates).sort().map(date => {
      const dataPoint: any = { date };
      Object.entries(results).forEach(([company, data]) => {
        const matchingPoint = data.sentimentOverTime.find(p => p.date === date);
        dataPoint[company] = matchingPoint ? matchingPoint.sentiment : null;
      });
      return dataPoint;
    });
  })();

  const dropdownOptions: StaggeredDropdownProps[] = [
    {
      text: "Home",
      Icon: FiHome,
      href: "/",
    },
    {
      text: "Profile",
      Icon: FiUser,
      href: "/profile",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-4">

          <div style={{ position: 'absolute', top: 10, left: 20 }}>
            <StaggeredDropdown options={dropdownOptions} />
          </div>

          <h2 className="text-2xl font-bold text-white">
            Company Sentiment Analysis
          </h2>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter company name..."
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCompany()}
              className="max-w-xs"
            />
            <Button onClick={handleAddCompany}>Add Company</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {companies.map((company) => (
              <div
                key={company}
                className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-2"
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

          <Button
            onClick={handleAnalyze}
            disabled={loading || companies.length === 0}
          >
            {loading ? "Analyzing..." : "Analyze Sentiment"}
          </Button>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Sentiment Scores</h3>
                {Object.entries(results).map(([company, data], index) => (
                  <div
                    key={company}
                    className="p-3 rounded bg-white/5"
                    style={{ borderLeft: `4px solid ${COLORS[index % COLORS.length]}` }}
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
                <Card className="p-4 h-full">
                  <h3 className="font-semibold mb-4">Sentiment Comparison</h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={combinedSentimentData}
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
                          tickFormatter={(date) =>
                            new Date(date).toLocaleDateString()
                          }
                        />
                        <YAxis domain={[-1, 1]} />
                        <Tooltip
                          labelFormatter={(date) =>
                            new Date(date).toLocaleDateString()
                          }
                          formatter={(value: number) => [value?.toFixed(2) || 'N/A', "Sentiment"]}
                        />
                        <Legend />
                        {Object.keys(results).map((company, index) => (
                          <Line
                            key={company}
                            type="monotone"
                            dataKey={company}
                            stroke={COLORS[index % COLORS.length]}
                            dot={false}
                            name={company}
                            connectNulls
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Company Details</h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {Object.entries(results).map(([company, data], index) => (
                  <Card key={company} className="p-4 bg-white/10 backdrop-blur-md border-white/10 min-w-[350px] max-w-[400px] flex-shrink-0">
                    <h3 className="font-semibold mb-4 text-white">{company}</h3>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white/80 mb-2">Top Keywords</h4>
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
                      <h4 className="text-sm font-medium text-white/80 mb-2">Recent Mentions</h4>
                      <div className="space-y-2">
                        {data.recentMentions.map((mention, i) => (
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
