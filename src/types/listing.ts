export interface Listing {
  id: number;
  location: string;
  subtitle: string;
  propertyType:
    | "Development Site"
    | "Renovation"
    | "Value-Add"
    | "Redevelopment"
    | "Land"
    | "Adaptive Reuse";
  opportunity: string; // Brief description of the opportunity
  marketHighlights: string[]; // Key market features/stats
  size: {
    acres?: number;
    squareFeet?: number;
  };
  price: number;
  pricePerSqFt?: number;
  zoning: string;
  potentialUse: string[];
  isFavorite: boolean;
  imageUrl: string;
  status: "Available" | "Under Contract" | "In Due Diligence" | "Off Market";
  timeline?: string;
  roi?: {
    projected: number;
    timeframe: string;
  };
}

// Optional: Create a type for the listing status
export type ListingStatus =
  | "Available"
  | "Under Contract"
  | "In Due Diligence"
  | "Off Market";

// Detailed listing now properly extends the base listing
export interface DetailedListing extends Omit<Listing, "zoning"> {
  description?: string;
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  lastSold?: {
    date: string;
    price: number;
  };
  zoning: string; // Making this required to match the base Listing
  lotSize?: number;
  parkingSpaces?: number;
  environmentalFeatures?: string[];
  constructionDetails?: {
    foundation?: string;
    roofType?: string;
    buildingMaterials?: string[];
  };
  financialMetrics?: {
    capRate?: number;
    noi?: number;
    occupancyRate?: number;
  };
}

// Optional: Create a type for listing filters
export interface ListingFilters {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: Listing["propertyType"];
  location?: string;
  status?: ListingStatus;
  minSize?: number;
  maxSize?: number;
  zoning?: string[];
  potentialUse?: string[];
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
