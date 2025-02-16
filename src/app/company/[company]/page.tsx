"use client";

import Head from "next/head";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypewriterText } from "@/components/ui/typewriter-text";

interface PropertyData {
  location: string;
  researchModules: {
    moduleName: string;
    moduleDescription: string;
    data: Record<string, string>;
  }[];
}

export default function PropertyPage() {
  const params = useParams();
  const locationSlug = params.company as string; // We'll update the route later

  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [researchModules, setResearchModules] = useState<
    PropertyData["researchModules"]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");
  const [viewedTabs, setViewedTabs] = useState<string[]>([]);
  const [animatingTab, setAnimatingTab] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPropertyData() {
      try {
        setIsLoading(true);
        setResearchModules([]);

        const response = await fetch("/api/company-research", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ location: locationSlug }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch property data");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));

              if ("location" in data) {
                setPropertyData((prev) => ({
                  ...prev,
                  location: data.location,
                  researchModules: prev?.researchModules || [],
                }));
              } else {
                setResearchModules((prev) => {
                  const newModules = [...prev];
                  const existingIndex = newModules.findIndex(
                    (m) => m.moduleName === data.moduleName,
                  );

                  if (existingIndex >= 0) {
                    newModules[existingIndex] = data;
                  } else {
                    newModules.push(data);
                  }

                  if (newModules.length === 1) {
                    setActiveTab(data.moduleName);
                  }

                  return newModules;
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching property data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPropertyData();
  }, [locationSlug]);

  const handleTabChange = (tab: string) => {
    setViewedTabs((prev) => [...prev, activeTab]);
    setActiveTab(tab);
    if (!viewedTabs.includes(tab)) {
      setAnimatingTab(tab);
    }
  };

  const handleAnimationComplete = (moduleName: string) => {
    if (animatingTab === moduleName) {
      setViewedTabs((prev) => [...prev, moduleName]);
      setAnimatingTab(null);
    }
  };

  if (!propertyData?.location) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-8" />
          <div className="h-96 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{propertyData.location} Market Analysis | PropAI</title>
        <meta
          name="description"
          content={`Comprehensive property analysis for ${propertyData.location}`}
        />
      </Head>

      <h1 className="text-4xl font-bold mb-8">
        <TypewriterText
          text={`${propertyData.location} Market Analysis`}
          speed={50}
          startDelay={0}
        />
      </h1>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          {researchModules.map((module) => (
            <TabsTrigger
              key={module.moduleName}
              value={module.moduleName}
              className={isLoading ? "animate-pulse" : ""}
            >
              {module.moduleName}
            </TabsTrigger>
          ))}
        </TabsList>
        {researchModules.map((module) => (
          <TabsContent key={module.moduleName} value={module.moduleName}>
            <Card>
              <CardHeader>
                <CardTitle>{module.moduleName}</CardTitle>
                <CardDescription>{module.moduleDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(module.data).map(([key, value], index) => {
                  const isLastItem =
                    index === Object.entries(module.data).length - 1;
                  return (
                    <div key={key} className="mb-4">
                      <h3 className="text-lg font-semibold capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <p>
                        {!viewedTabs.includes(module.moduleName) ? (
                          <TypewriterText
                            text={value || "Loading..."}
                            speed={20}
                            startDelay={index * 1000 + 1500}
                            onComplete={
                              isLastItem
                                ? () =>
                                    handleAnimationComplete(module.moduleName)
                                : undefined
                            }
                          />
                        ) : (
                          value || "Loading..."
                        )}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
