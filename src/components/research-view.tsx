"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, MapPin, AlertCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ResearchModule,
  LocationAnalysis,
  MarketConditionsInterface,
  CompetitiveAnalysis,
  RegulatoryEnvironment,
  isLocationAnalysis,
  isMarketConditions,
  isCompetitiveAnalysis,
  isRegulatoryEnvironment,
} from "@/types/research";
import { AgentSwarmLoading } from "@/components/agent-loading";

interface ResearchViewProps {
  location: string;
}

// Add this interface for tracking agent status
interface AgentStatus {
  id: string;
  name: string;
  status: "pending" | "active" | "complete";
  startTime?: number;
}

const RESEARCH_AGENTS = [
  { id: "location", name: "Location Analyzer" },
  { id: "market", name: "Market Analyst" },
  { id: "competitive", name: "Competitive Intel" },
  { id: "regulatory", name: "Regulatory Monitor" },
];

export function ResearchView({ location }: ResearchViewProps) {
  const [modules] = useState<ResearchModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Render different components based on module type
  const renderModuleData = (
    data:
      | LocationAnalysis
      | MarketConditionsInterface
      | CompetitiveAnalysis
      | RegulatoryEnvironment
      | null,
  ) => {
    if (!data) return null;

    if (isLocationAnalysis(data)) {
      return (
        <div className="grid gap-4">
          <ModuleSection
            title="Demographic Trends"
            content={data.demographicTrends}
          />
          <ModuleSection
            title="Development Activity"
            content={data.developmentActivity}
          />
          <ModuleSection
            title="Local Amenities"
            content={data.localAmenities}
          />
        </div>
      );
    }

    if (isMarketConditions(data)) {
      return (
        <div className="grid gap-4">
          <ModuleSection title="Price Trends" content={data.priceTrends} />
          <ModuleSection
            title="Inventory Levels"
            content={data.inventoryLevels}
          />
          <ModuleSection title="Market Trends" content={data.marketTrends} />
        </div>
      );
    }

    if (isCompetitiveAnalysis(data)) {
      return (
        <div className="grid gap-4">
          <ModuleSection
            title="Comparable Properties"
            content={data.comparableProperties}
          />
          <ModuleSection title="Rental Market" content={data.rentalMarket} />
          <ModuleSection
            title="Property Features"
            content={data.propertyFeatures}
          />
        </div>
      );
    }

    if (isRegulatoryEnvironment(data)) {
      return (
        <div className="grid gap-4">
          <ModuleSection
            title="Zoning Regulations"
            content={data.zoningRegulations}
          />
          <ModuleSection
            title="Building Permits"
            content={data.buildingPermits}
          />
          <ModuleSection title="Policy Changes" content={data.policyChanges} />
        </div>
      );
    }

    return null;
  };

  function ModuleSkeleton() {
    return (
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 animate-pulse">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <div className="h-6 w-48 bg-white/10 rounded" />
            <div className="h-4 w-64 bg-white/10 rounded" />
          </div>
          <div className="h-6 w-16 bg-white/10 rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="h-4 w-32 bg-white/10 rounded mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-white/10 rounded" />
                <div className="h-4 w-4/6 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function AgentStatus({ agent }: { agent: AgentStatus }) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <div className="relative">
          <Bot
            className={`h-5 w-5 ${
              agent.status === "active"
                ? "text-blue-400"
                : agent.status === "complete"
                  ? "text-green-400"
                  : "text-white/40"
            }`}
          />
          {agent.status === "active" && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-blue-400 rounded-full animate-ping" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-white/80 font-medium">{agent.name}</p>
          <p className="text-white/40 text-xs">
            {agent.status === "pending" && "Waiting to start..."}
            {agent.status === "active" && "Analyzing data..."}
            {agent.status === "complete" && "Analysis complete"}
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch("/api/listing-research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location }),
        });

        if (!response.ok) throw new Error("Failed to fetch research data");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        const modules: ResearchModule[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(5));
              if (data.moduleName) {
                modules.push(data);
                setModules([...modules]);
                setCompletedModules((prev) => [...prev, data.moduleName]);
              }
            }
          }
        }

        setIsLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
        setIsLoading(false);
      }
    };

    fetchResearch();
  }, [location]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Market Research</h1>
            <div className="flex items-center text-white/60 mt-2">
              <MapPin className="h-4 w-4 mr-2" />
              {location}
            </div>
          </div>
          <Link href="/search">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>

        <AgentSwarmLoading completedModules={completedModules} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Research</h1>
          <div className="flex items-center text-white/60 mt-2">
            <MapPin className="h-4 w-4 mr-2" />
            {location}
          </div>
        </div>
        <Link href="/search">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Research Modules */}
      <div className="grid gap-6">
        {modules.map((module, index) => (
          <section
            key={index}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {module.moduleName}
                </h2>
                <p className="text-white/60 text-sm mt-1">
                  {module.moduleDescription}
                </p>
              </div>
              <Badge variant="outline" className="bg-white/5">
                {index + 1} of {modules.length}
              </Badge>
            </div>

            {module.data === null ? (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-white/60">Data analysis in progress...</p>
              </div>
            ) : (
              renderModuleData(module.data)
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

// Helper component for consistent section rendering
function ModuleSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <h3 className="text-white/60 text-sm mb-2 capitalize">{title}</h3>
      <div className="prose prose-invert max-w-none">
        <p className="text-white leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}
