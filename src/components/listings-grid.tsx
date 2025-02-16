import { Listing } from "@/types/listing";
import { ListingCard } from "./listing-card";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ListingsGridProps {
  listings: Listing[];
  onFavoriteToggle?: (id: number) => void;
}

export function ListingsGrid({
  listings,
  onFavoriteToggle,
}: ListingsGridProps) {
  const pathname = usePathname();
  const isSearch = pathname === "/search";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <Link
          href={
            isSearch
              ? `/listing/${encodeURIComponent(listing.location)}`
              : `/property/${listing.id}`
          }
          key={listing.id}
        >
          <ListingCard listing={listing} onFavoriteToggle={onFavoriteToggle} />
        </Link>
      ))}
    </div>
  );
}
