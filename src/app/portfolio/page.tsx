import Listings from "@/components/listings";
import { Listing } from "@/types/listing";

// This data would typically come from an API or database
const getListings = async (): Promise<Listing[]> => {
  return [
    {
      id: 1,
      location: "Moss Beach, California",
      subtitle: "Beach and ocean views",
      dates: "5 nights · Feb 26 – Mar 3",
      price: 4303,
      rating: 4.92,
      isFavorite: false,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 2,
      location: "Moss Beach, California",
      subtitle: "Beach and ocean views",
      dates: "5 nights · Feb 18 – 23",
      price: 23965,
      rating: 4.91,
      isFavorite: true,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 3,
      location: "Daly City, California",
      subtitle: "Beach and bay views",
      dates: "5 nights · Mar 6 – 11",
      price: 3153,
      rating: 4.82,
      isFavorite: true,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 4,
      location: "Half Moon Bay, California",
      subtitle: "Beach and ocean views",
      dates: "5 nights · Feb 24 – Mar 1",
      price: 2491,
      rating: 4.82,
      isFavorite: true,
      imageUrl: "/moss-beach.png",
    },
    // New listings
    {
      id: 5,
      location: "San Francisco, California",
      subtitle: "Luxury High-Rise Development Opportunity",
      dates: "Investment Timeline: 24-36 months",
      price: 12500000,
      rating: 4.95,
      isFavorite: false,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 6,
      location: "Silicon Valley, California",
      subtitle: "Tech Campus Development Site",
      dates: "Ready for Development",
      price: 8750000,
      rating: 4.88,
      isFavorite: false,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 7,
      location: "Oakland, California",
      subtitle: "Mixed-Use Redevelopment Project",
      dates: "Urban Renewal Zone",
      price: 4250000,
      rating: 4.79,
      isFavorite: true,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 8,
      location: "Berkeley, California",
      subtitle: "Student Housing Complex",
      dates: "Near UC Berkeley",
      price: 6800000,
      rating: 4.86,
      isFavorite: false,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 9,
      location: "Palo Alto, California",
      subtitle: "Premium Office Space",
      dates: "Prime Location",
      price: 15200000,
      rating: 4.93,
      isFavorite: true,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 10,
      location: "San Jose, California",
      subtitle: "Industrial Park Development",
      dates: "Expanding Tech Corridor",
      price: 7500000,
      rating: 4.84,
      isFavorite: false,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 11,
      location: "Marin County, California",
      subtitle: "Luxury Residential Development",
      dates: "Exclusive Location",
      price: 18500000,
      rating: 4.97,
      isFavorite: true,
      imageUrl: "/moss-beach.png",
    },
    {
      id: 12,
      location: "Santa Clara, California",
      subtitle: "Retail Plaza Opportunity",
      dates: "High-Traffic Area",
      price: 5900000,
      rating: 4.81,
      isFavorite: false,
      imageUrl: "/moss-beach.png",
    },
  ];
};

export default async function PortfolioPage() {
  const listings = await getListings();

  return (
    <div className="pt-24">
      <Listings initialListings={listings} />
    </div>
  );
}
