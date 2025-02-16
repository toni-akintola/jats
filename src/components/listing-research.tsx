"use client";
import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Listing } from "@/types/listing";

interface ResearchModule {
  moduleName: string;
  moduleDescription: string;
  data: Record<string, string | number>;
}

interface ListingResearchProps {
  listing: Listing;
  backUrl: string;
}

export function ListingResearch({ listing, backUrl }: ListingResearchProps) {
  const [modules, setModules] = useState<ResearchModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch("/api/listing-research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: listing.location }),
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
              }
            }
          }
        }

        setModules(modules);
        setIsLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
        setIsLoading(false);
      }
    };

    fetchResearch();
  }, [listing.location]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container max-w-6xl">
        {/* Back Button */}
        <Link href={backUrl}>
          <Button
            variant="ghost"
            className="mb-6 text-white/60 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Property
          </Button>
        </Link>

        {/* Property Header */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                {listing.propertyType}
              </Badge>
              <h1 className="text-2xl font-bold text-white mb-2">
                Market Research
              </h1>
              <div className="flex items-center text-white/60">
                <MapPin className="h-4 w-4 mr-2" />
                {listing.location}
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Property Value</p>
              <p className="text-white font-semibold text-xl">
                ${listing.price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Research Modules */}
        <div className="space-y-6">
          {modules.map((module, index) => (
            <section
              key={index}
              className="bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-bold text-white mb-2">
                {module.moduleName}
              </h2>
              <p className="text-white/60 text-sm mb-6">
                {module.moduleDescription}
              </p>

              <div className="grid gap-4">
                {Object.entries(module.data).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <h3 className="text-white/60 text-sm mb-2 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <p className="text-white leading-relaxed">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
