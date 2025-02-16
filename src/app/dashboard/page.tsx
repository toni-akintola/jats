"use client";

import { PropertySearch } from "@/components/property-search";
import Listings from "@/components/listings";
import { usePropertySearch } from "@/hooks/use-property-search";

export default function DashboardPage() {
  const { listings } = usePropertySearch();

  return (
    <main className="min-h-screen py-8">
      <div className="container space-y-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Property Search
          </h1>
          <p className="text-white/60 mb-8">
            Find development opportunities in your target market
          </p>

          <PropertySearch />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {listings.length > 0 ? "Search Results" : "Your Listings"}
          </h2>
          <Listings initialListings={listings} />
        </div>
      </div>
    </main>
  );
}
