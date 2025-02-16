export interface Listing {
  id: number;
  location: string;
  subtitle: string;
  dates: string;
  price: number;
  rating: number;
  isFavorite: boolean;
  imageUrl: string;
}

// Optional: Create a type for the listing status
export type ListingStatus = "available" | "pending" | "sold" | "off-market";

// Optional: Create a more detailed listing type that extends the base listing
export interface DetailedListing extends Listing {
  description?: string;
  amenities?: string[];
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: "single-family" | "multi-family" | "commercial" | "land";
  yearBuilt?: number;
  lastSold?: {
    date: string;
    price: number;
  };
  zoning?: string;
  lotSize?: number;
  parkingSpaces?: number;
  status?: ListingStatus;
}

// Optional: Create a type for listing filters
export interface ListingFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  location?: string;
  propertyType?: DetailedListing["propertyType"];
  status?: ListingStatus;
  favorites?: boolean;
}

// Optional: Create a type for the listing search response
export interface ListingSearchResponse {
  listings: Listing[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
