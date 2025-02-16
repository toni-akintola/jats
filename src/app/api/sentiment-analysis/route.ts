import { NextResponse } from "next/server";
import { SentimentAnalyzer } from "@/services/sentiment-analyzer";
import { analyzeSentiment } from "@/services/sentiment-analyzer";
import { GooglePlacesSource } from "@/services/sources/google-places";

async function analyzeLocation(location: {
  lat: number;
  lng: number;
  sentimentBias?: number;
}) {
  // For testing, use the sentimentBias if provided, or generate a random sentiment
  const baseSentiment =
    location.sentimentBias !== undefined
      ? location.sentimentBias
      : Math.random() * 2 - 1;

  // Add some random variation to the base sentiment
  const sentiment = Math.max(
    -1,
    Math.min(1, baseSentiment + (Math.random() - 0.5) * 0.4),
  );

  // Mock place data for testing
  const mockPlaces = [
    "Local Restaurant",
    "Coffee Shop",
    "Park",
    "Shopping Center",
    "Community Center",
  ];

  const places = mockPlaces
    .slice(0, Math.floor(Math.random() * 3) + 2)
    .join(", ");

  return {
    location: [location.lng, location.lat],
    sentiment: sentiment,
    places: places,
  };
}

export async function POST(request: Request) {
  try {
    const { location, locations } = await request.json();

    // Handle single location analysis
    if (location) {
      const result = await analyzeLocation(location);
      return NextResponse.json({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              sentiment: result.sentiment,
              places: result.places,
            },
            geometry: {
              type: "Point",
              coordinates: result.location,
            },
          },
        ],
      });
    }

    // Handle multiple locations
    if (locations) {
      const sentimentResults = await Promise.all(
        locations.map(analyzeLocation),
      );

      return NextResponse.json({
        type: "FeatureCollection",
        features: sentimentResults.map((result) => ({
          type: "Feature",
          properties: {
            sentiment: result.sentiment,
            places: result.places,
          },
          geometry: {
            type: "Point",
            coordinates: result.location,
          },
        })),
      });
    }

    throw new Error("No location or locations provided");
  } catch (error) {
    console.error("Error in sentiment analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiments" },
      { status: 500 },
    );
  }
}
