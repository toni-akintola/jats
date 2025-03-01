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
    <div className="grid grid-cols-1 gap-8 w-full sm:grid-cols-[repeat(auto-fit,minmax(450px,1fr))]">
      {listings.map((listing) => (
        <Link
          href={
            isSearch
              ? `/listing/${encodeURIComponent(listing.location)}`
              : `/property/${listing.id}`
          }
          key={listing.id}
          className="h-full"
        >
          <ListingCard listing={listing} onFavoriteToggle={onFavoriteToggle} />
        </Link>
      ))}
    </div>
  );
}
