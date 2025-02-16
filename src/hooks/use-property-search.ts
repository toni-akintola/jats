"use client";
import { useState } from "react";
import { Listing } from "@/types/listing";

interface PropertySearchParams {
  location: string;
  propertyType?: string;
  priceRange?: string;
}

export function usePropertySearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastThoughtTime, setLastThoughtTime] = useState<number>(Date.now());

  const searchProperties = async (params: PropertySearchParams) => {
    setIsLoading(true);
    setThoughts([]);
    setError(null);
    setIsThinking(true);
    setLastThoughtTime(Date.now());

    try {
      const response = await fetch("/api/property-opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error("Search failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.type === "thought") {
              setThoughts((prev) => [...prev, data.content]);
              setLastThoughtTime(Date.now());
              setIsThinking(true);
            } else if (data.type === "final") {
              setListings(data.opportunities);
              setIsThinking(false);
            } else if (data.type === "error") {
              setError(data.error);
              setIsThinking(false);
            }
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setIsThinking(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchProperties,
    isLoading,
    isThinking,
    thoughts,
    listings,
    error,
    lastThoughtTime,
  };
}
