import { Listing } from "@/types/listing";
import { ListingCard } from "./listing-card";

interface ListingsGridProps {
  listings: Listing[];
  onFavoriteToggle?: (id: number) => void;
}

export function ListingsGrid({
  listings,
  onFavoriteToggle,
}: ListingsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}
