import Listings from "@/components/listings";
import { Listing } from "@/types/listing";

// This data would typically come from an API or database
const getListings = async (): Promise<Listing[]> => {
  return [
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
      isFavorite: false,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      timeline: "18-24 months",
      roi: {
        projected: 22,
        timeframe: "3 years",
      },
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
      isFavorite: true,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      roi: {
        projected: 18,
        timeframe: "5 years",
      },
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
      isFavorite: false,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      timeline: "24-36 months",
      roi: {
        projected: 25,
        timeframe: "5 years",
      },
    },
    // New listings
    {
      id: 5,
      location: "San Francisco, California",
      subtitle: "Luxury High-Rise Development Opportunity",
      propertyType: "Development Site",
      opportunity: "Prime location for luxury residential tower development",
      marketHighlights: [
        "Strong luxury market demand",
        "Panoramic bay views",
        "Transit-oriented location",
      ],
      size: {
        acres: 0.8,
        squareFeet: 34848,
      },
      price: 12500000,
      pricePerSqFt: 358,
      zoning: "High-Density Residential",
      potentialUse: ["Luxury Condos", "Mixed-Use", "Hotel"],
      isFavorite: false,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      timeline: "24-36 months",
      roi: {
        projected: 28,
        timeframe: "4 years",
      },
    },
    {
      id: 6,
      location: "Silicon Valley, California",
      subtitle: "Tech Campus Development Site",
      propertyType: "Development Site",
      opportunity:
        "Large-scale campus development opportunity in tech corridor",
      marketHighlights: [
        "Major tech companies nearby",
        "Strong office demand",
        "Excellent accessibility",
      ],
      size: {
        acres: 15.3,
        squareFeet: 666468,
      },
      price: 8750000,
      pricePerSqFt: 275,
      zoning: "Research & Development",
      potentialUse: ["Tech Campus", "R&D Facility", "Innovation Center"],
      isFavorite: false,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      timeline: "36-48 months",
      roi: {
        projected: 22,
        timeframe: "5 years",
      },
    },
    {
      id: 7,
      location: "Oakland, California",
      subtitle: "Mixed-Use Redevelopment Project",
      propertyType: "Redevelopment",
      opportunity: "Urban renewal project in rapidly gentrifying area",
      marketHighlights: [
        "Growing residential demand",
        "Emerging retail corridor",
        "Arts district proximity",
      ],
      size: {
        squareFeet: 85000,
      },
      price: 4250000,
      pricePerSqFt: 50,
      zoning: "Mixed-Use Urban",
      potentialUse: ["Apartments", "Retail", "Creative Office"],
      isFavorite: true,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      timeline: "18-24 months",
      roi: {
        projected: 24,
        timeframe: "3 years",
      },
    },
    {
      id: 8,
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
      zoning: "High-Density Residential",
      potentialUse: ["Student Housing", "Multi-family", "Co-living"],
      isFavorite: false,
      imageUrl: "/belveron-partners.jpg",
      status: "Under Contract",
      timeline: "12-18 months",
      roi: {
        projected: 18,
        timeframe: "5 years",
      },
    },
    {
      id: 9,
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
      isFavorite: true,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      timeline: "12-18 months",
      roi: {
        projected: 20,
        timeframe: "3 years",
      },
    },
    {
      id: 10,
      location: "San Jose, California",
      subtitle: "Industrial Park Development",
      propertyType: "Development Site",
      opportunity:
        "Large industrial park development in expanding tech corridor",
      marketHighlights: [
        "Growing tech manufacturing demand",
        "Strategic location",
        "Excellent highway access",
      ],
      size: {
        acres: 25.5,
        squareFeet: 1110780,
      },
      price: 7500000,
      pricePerSqFt: 67,
      zoning: "Industrial",
      potentialUse: ["Manufacturing", "Warehousing", "R&D Facilities"],
      isFavorite: false,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      timeline: "24-36 months",
      roi: {
        projected: 19,
        timeframe: "5 years",
      },
    },
    {
      id: 11,
      location: "Marin County, California",
      subtitle: "Luxury Residential Development",
      propertyType: "Land",
      opportunity: "Premium hillside location for luxury home development",
      marketHighlights: [
        "Panoramic bay views",
        "High-end market area",
        "Limited luxury inventory",
      ],
      size: {
        acres: 8.2,
      },
      price: 18500000,
      pricePerSqFt: 52,
      zoning: "Residential Estate",
      potentialUse: ["Luxury Homes", "Gated Community", "High-End Condos"],
      isFavorite: true,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      timeline: "36-48 months",
      roi: {
        projected: 35,
        timeframe: "4 years",
      },
    },
    {
      id: 12,
      location: "Santa Clara, California",
      subtitle: "Retail Plaza Opportunity",
      propertyType: "Value-Add",
      opportunity: "Existing retail plaza with significant upside potential",
      marketHighlights: [
        "High traffic location",
        "Below market rents",
        "Renovation potential",
      ],
      size: {
        squareFeet: 65000,
      },
      price: 5900000,
      pricePerSqFt: 91,
      zoning: "Commercial Retail",
      potentialUse: ["Retail", "Restaurant", "Mixed-Use"],
      isFavorite: false,
      imageUrl: "/belveron-partners.jpg",
      status: "Available",
      timeline: "12-18 months",
      roi: {
        projected: 21,
        timeframe: "3 years",
      },
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
