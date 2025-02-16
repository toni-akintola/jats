"use client";
import { useState } from "react";
import { PropertySearch } from "@/components/property-search";
import Listings from "@/components/listings";
import { Listing } from "@/types/listing";
import { NavBar } from "@/components/nav-bar";

// Move the skeleton component here since it's specific to this page
function ListingSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 animate-pulse">
      <div className="aspect-video bg-white/10" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchParams: {
    location: string;
    propertyType?: string;
    priceRange?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/property-opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setListings(data.opportunities);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to find opportunities");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="py-8 min-h-screen">
      <NavBar />
      <div className="container space-y-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Property Search
          </h1>
          <p className="text-white/60 mb-8">
            Find development opportunities in your target market
          </p>

          <PropertySearch
            onSearch={handleSearch}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Listings Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            {listings.length > 0 ? "Potential Opportunities" : "Your Listings"}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <ListingSkeleton key={i} />
              ))}
            </div>
          ) : (
            listings.length > 0 && <Listings initialListings={listings} />
          )}
        </div>
      </div>
    </main>
  );
}
