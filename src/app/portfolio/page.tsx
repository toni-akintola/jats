import Listings from "@/components/listings";
import { getListings } from "@/lib/listings";

export default async function PortfolioPage() {
  const listings = await getListings();

  return (
    <div className="pt-24">
      <Listings initialListings={listings} />
    </div>
  );
}
