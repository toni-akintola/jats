"use client";

import { useState } from "react";
import { Listing } from "@/types/listing";
import { ListingsGrid } from "./listings-grid";

interface ListingsProps {
  initialListings: Listing[];
}

export default function Listings({ initialListings }: ListingsProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings);

  const handleFavoriteToggle = (id: number) => {
    setListings((current) =>
      current.map((listing) =>
        listing.id === id
          ? { ...listing, isFavorite: !listing.isFavorite }
          : listing,
      ),
    );
  };

  return (
    <div className="max-w-[2520px] mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Featured Properties
        </h2>
        <p className="text-white/60">
          Discover our handpicked selection of premium properties
        </p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <ListingsGrid
          listings={listings}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </div>
    </div>
  );
}
