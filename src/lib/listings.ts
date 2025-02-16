import { Listing } from "@/types/listing";

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 1,
    location: "South of Market, San Francisco",
    subtitle: "Prime Development Opportunity",
    propertyType: "Development Site",
    opportunity: "Rare development site in rapidly growing tech corridor",
    marketHighlights: [
      "Tech company expansion nearby",
      "Strong rental demand",
      "Transit-oriented location",
    ],
    size: {
      acres: 1.2,
      squareFeet: 52272,
    },
    price: 28500000,
    pricePerSqFt: 545,
    zoning: "Mixed-Use Commercial",
    potentialUse: ["Office", "Residential", "Retail"],
    status: "Available",
    timeline: "18-24 months",
    roi: {
      projected: 22,
      timeframe: "3 years",
    },
    imageUrl: "/aparts/31.jpg",
    isFavorite: false,
  },
  {
    id: 2,
    location: "Downtown Oakland",
    subtitle: "Historic Building Renovation",
    propertyType: "Renovation",
    opportunity: "Art Deco building prime for creative office conversion",
    marketHighlights: [
      "Growing tech presence",
      "Historic tax credits available",
      "Emerging arts district",
    ],
    size: {
      squareFeet: 45000,
    },
    price: 12500000,
    pricePerSqFt: 278,
    zoning: "Central Business District",
    potentialUse: ["Creative Office", "Retail", "Restaurant"],
    status: "Available",
    timeline: "12-15 months",
    roi: {
      projected: 18,
      timeframe: "5 years",
    },
    imageUrl: "/aparts/32.jpg",  // High quality historic building image
    isFavorite: false,
  },
  {
    id: 3,
    location: "Mountain View",
    subtitle: "Tech Campus Opportunity",
    propertyType: "Redevelopment",
    opportunity: "Existing industrial site suitable for modern tech campus",
    marketHighlights: [
      "Major tech companies nearby",
      "Strong office demand",
      "Excellent transportation access",
    ],
    size: {
      acres: 5.3,
      squareFeet: 230868,
    },
    price: 75000000,
    pricePerSqFt: 325,
    zoning: "Research Park",
    potentialUse: ["Office Campus", "R&D", "Life Sciences"],
    status: "Available",
    timeline: "24-36 months",
    roi: {
      projected: 25,
      timeframe: "5 years",
    },
    imageUrl: "/aparts/33.jpg",  // Modern tech campus style
    isFavorite: false,
  },
  {
    id: 4,
    location: "Berkeley, California",
    subtitle: "Student Housing Complex",
    propertyType: "Value-Add",
    opportunity: "Existing student housing with renovation potential",
    marketHighlights: [
      "100% occupancy history",
      "Below market rents",
      "Walking distance to campus",
    ],
    size: {
      squareFeet: 45000,
    },
    price: 6800000,
    pricePerSqFt: 151,
    zoning: "Multi-Family Residential",
    potentialUse: ["Student Housing", "Multi-Family"],
    status: "Under Contract",
    timeline: "6-9 months",
    roi: {
      projected: 15,
      timeframe: "7 years",
    },
    imageUrl: "/aparts/34.jpg",  // Multi-family residential building
    isFavorite: false,
  },
  {
    id: 5,
    location: "Palo Alto, California",
    subtitle: "Premium Office Space",
    propertyType: "Renovation",
    opportunity: "Class B office building ready for Class A upgrade",
    marketHighlights: [
      "Premium location",
      "Strong office demand",
      "Value-add potential",
    ],
    size: {
      squareFeet: 75000,
    },
    price: 15200000,
    pricePerSqFt: 203,
    zoning: "Commercial Office",
    potentialUse: ["Class A Office", "Life Sciences", "Tech HQ"],
    status: "Available",
    timeline: "12-18 months",
    roi: {
      projected: 20,
      timeframe: "3 years",
    },
    imageUrl: "/aparts/5.jpg",
    isFavorite: false,
  },
];

export async function getListings(): Promise<Listing[]> {
  return MOCK_LISTINGS;
}

export async function getListing(id: number): Promise<Listing | undefined> {
  return MOCK_LISTINGS.find((listing) => listing.id === id);
}
