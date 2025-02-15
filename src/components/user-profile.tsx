"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { StaggeredDropdown, StaggeredDropdownProps } from "./ui/dropdown";
import { FiActivity, FiUser } from "react-icons/fi";
import { SentimentResult } from "@/services/types";

interface CompanyProps {
  name: string;
  result: SentimentResult;
}

const mockCompanies: CompanyProps[] = [
  {
    name: "Company A",
    result: {
      score: 0.5,
      mentions: 100,
      topKeywords: ["positive", "negative"],
      recentMentions: [
        {
          text: "positive text",
          source: "source1",
          url: "url1",
          sentiment: 0.7,
          date: "2024-01-01",
        },
        {
          text: "negative text",
          source: "source2",
          url: "url2",
          sentiment: 0.3,
          date: "2024-01-02",
        },
      ],
      sentimentOverTime: [
        { date: "2024-01-01", sentiment: 0.5 },
        { date: "2024-01-02", sentiment: 0.3 },
      ],
    },
  },
  {
    name: "Company B",
    result: {
      score: 0.5,
      mentions: 100,
      topKeywords: ["positive", "negative"],
      recentMentions: [
        {
          text: "positive text",
          source: "source1",
          url: "url1",
          sentiment: 0.7,
          date: "2024-01-01",
        },
        {
          text: "negative text",
          source: "source2",
          url: "url2",
          sentiment: 0.3,
          date: "2024-01-02",
        },
      ],
      sentimentOverTime: [
        { date: "2024-01-01", sentiment: 0.5 },
        { date: "2024-01-02", sentiment: 0.3 },
      ],
    },
  },
  {
    name: "Company C",
    result: {
      score: 0.5,
      mentions: 100,
      topKeywords: ["positive", "negative"],
      recentMentions: [
        {
          text: "positive text",
          source: "source1",
          url: "url1",
          sentiment: 0.7,
          date: "2024-01-01",
        },
        {
          text: "negative text",
          source: "source2",
          url: "url2",
          sentiment: 0.3,
          date: "2024-01-02",
        },
      ],
      sentimentOverTime: [
        { date: "2024-01-01", sentiment: 0.5 },
        { date: "2024-01-02", sentiment: 0.3 },
      ],
    },
  },
  {
    name: "Company D",
    result: {
      score: 0.5,
      mentions: 100,
      topKeywords: ["positive", "negative"],
      recentMentions: [
        {
          text: "positive text",
          source: "source1",
          url: "url1",
          sentiment: 0.7,
          date: "2024-01-01",
        },
        {
          text: "negative text",
          source: "source2",
          url: "url2",
          sentiment: 0.3,
          date: "2024-01-02",
        },
      ],
      sentimentOverTime: [
        { date: "2024-01-01", sentiment: 0.5 },
        { date: "2024-01-02", sentiment: 0.3 },
      ],
    },
  },
  {
    name: "Company E",
    result: {
      score: 0.5,
      mentions: 100,
      topKeywords: ["positive", "negative"],
      recentMentions: [
        {
          text: "positive text",
          source: "source1",
          url: "url1",
          sentiment: 0.7,
          date: "2024-01-01",
        },
        {
          text: "negative text",
          source: "source2",
          url: "url2",
          sentiment: 0.3,
          date: "2024-01-02",
        },
      ],
      sentimentOverTime: [
        { date: "2024-01-01", sentiment: 0.5 },
        { date: "2024-01-02", sentiment: 0.3 },
      ],
    },
  },
];

const dropdownOptions: StaggeredDropdownProps[] = [
  {
    text: "Analyzer",
    Icon: FiActivity,
    href: "/dashboard",
  },
  {
    text: "Profile",
    Icon: FiUser,
    href: "/profile",
  },
];

export function UserProfile() {
  const [companies, setCompanies] = useState<CompanyProps[]>([]);

  useEffect(() => {
    // Simulate loading company data
    setCompanies(mockCompanies);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div style={{ position: "absolute", top: 10, left: 20 }}>
        <StaggeredDropdown options={dropdownOptions} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {companies.map((company) => (
          <div key={company.name} style={{ position: "relative" }}>
            <Card className="p-6 hover:shadow-lg transition-shadow bg-white/10 backdrop-blur-md border-white/10">
              <h2 className="text-2xl font-semibold mb-2 text-white">
                {company.name}
              </h2>
              <div className="space-y-2">
                <p className="text-white">
                  <span className="font-medium">sentiment index:</span>{" "}
                  {company.result.score.toFixed(2)}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
