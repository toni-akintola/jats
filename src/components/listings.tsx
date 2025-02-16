"use client";

import { useState, useEffect } from "react";
import { Listing } from "@/types/listing";
import { ListingsGrid } from "./listings-grid";

interface ListingsProps {
  initialListings: Listing[];
}

export default function Listings({ initialListings }: ListingsProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings);

  useEffect(() => {
    localStorage.setItem("propertyListings", JSON.stringify(initialListings));
  }, [initialListings]);

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
    <div className="max-w-[2520px] mx-auto">
      <ListingsGrid
        listings={listings}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  );
}
