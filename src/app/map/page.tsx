"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useProfileStore } from "@/store/profile-store";
import { TabbedDashboard, getRiskColor } from "@/components/tabbed-dashboard";

type ClickedLocation = {
  lng: number;
  lat: number;
  address: string;
  marker: mapboxgl.Marker;
};

type LocationsMap = {
  [address: string]: ClickedLocation;
};

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiamcyMzY4IiwiYSI6ImNtNzcwYnE1aTEzbDMyaW9sNDRhZHNjOTQifQ.1v5AL-rjwGQC5_jd3pSJHQ";
mapboxgl.accessToken = MAPBOX_TOKEN;

interface LocationFeature {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  text: string;
  context?: Record<string, unknown>[];
}

export default function MapPage() {
  const profile = useProfileStore((state) => state.profile);

  // useEffect(() => {
  //   setHideHeader(true);
  //   return () => setHideHeader(false);
  // }, [setHideHeader]);

  // Function to geocode profile location
  const geocodeLocation = async (location: string) => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is not set");
      return null;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
    }
    return null;
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [clickedLocation, setClickedLocation] =
    useState<ClickedLocation | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, any>>({});
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [locationsMap, setLocationsMap] = useState<LocationsMap>({});
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const handleRemoveLocation = (address: string, isLast: boolean) => {
    setLocationsMap((prev) => {
      const newLocations = { ...prev };
      // Remove the marker from the map
      newLocations[address]?.marker.remove();
      delete newLocations[address];
      return newLocations;
    });

    // Close sidebar if this was the last location
    if (isLast) {
      setActiveLocation(null);
    }
  };

  const handleRiskDataLoaded = (address: string, riskScore: number) => {
    setLocationsMap((prev) => {
      const location = prev[address];
      if (!location) return prev;

      // Create a new marker with the risk color
      const newMarker = new mapboxgl.Marker({
        color: getRiskColor(riskScore),
      })
        .setLngLat([location.lng, location.lat])
        .addTo(mapRef.current!);

      // Remove the old marker
      location.marker.remove();

      // Update the locations map with the new marker
      return {
        ...prev,
        [address]: {
          ...location,
          marker: newMarker,
        },
      };
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    console.log("Initializing map...");
    try {
      // Clear any existing map instance
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Create new map instance
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-119.4179, 36.7783], // California center coordinates
        zoom: 6,
        preserveDrawingBuffer: true
      });

      const map = mapRef.current;
      
      // Force a resize when the map is loaded
      map.on('load', () => {
        setTimeout(() => {
          map.resize();
        }, 0);
      });

      // Clean up on unmount
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []);

  // Handle resize when sidebar changes
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 0);
    }
  }, [activeLocation]);

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<LocationFeature[]>([]);

  const handleSearchInput = async (value: string) => {
    setSearchInput(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?` +
          `access_token=${MAPBOX_TOKEN}&` +
          `types=place,region,country&` +
          `country=US&` +
          `limit=5`,
      );
      const data = await response.json();

      if (data.features) {
        const features = data.features.map((feature: LocationFeature) => ({
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center,
          place_type: feature.place_type,
          text: feature.text,
          context: feature.context,
        }));

        setSearchResults(features);

        const analyzeSinglePoint = async (point: {
          lat: number;
          lng: number;
        }) => {
          try {
            const response = await fetch("/api/sentiment-analysis", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ location: point }),
            });

            const data = await response.json();

            // Update the map source by adding the new feature
            if (mapRef.current?.getSource("sentiments")) {
              const source = mapRef.current.getSource(
                "sentiments",
              ) as mapboxgl.GeoJSONSource;
              const currentData = (source as any)._data || {
                type: "FeatureCollection",
                features: [],
              };
              currentData.features.push(...data.features);
              source.setData(currentData);
            }
          } catch (error) {
            console.error("Error analyzing point:", error);
          }
        };

        // Generate sentiment clusters for the first result
        if (features.length > 0) {
          const mainLocation = features[0];
          const [lng, lat] = mainLocation.center;

          // Create clusters of points with different densities
          const clusters = [
            { radius: 0.1, points: 10, offset: 0 }, // Dense inner cluster
            { radius: 0.2, points: 15, offset: 0.1 }, // Medium density middle ring
            { radius: 0.3, points: 20, offset: 0.2 }, // Sparse outer ring
          ];

          // Generate points for each cluster
          for (const cluster of clusters) {
            for (let i = 0; i < cluster.points; i++) {
              // Generate points in a circular pattern
              const angle = (i / cluster.points) * 2 * Math.PI;
              const r = cluster.radius * Math.sqrt(Math.random()); // Square root for uniform distribution

              const point = {
                lat: lat + r * Math.cos(angle) + cluster.offset,
                lng: lng + r * Math.sin(angle) + cluster.offset,
              };

              // Analyze sentiment for this point
              await analyzeSinglePoint(point);
              await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay between points
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleLocationSelect = async (location: LocationFeature) => {
    if (!mapRef.current) return;

    try {
      setSearchInput(location.place_name);
      setSearchResults([]);

      const zoomLevel =
        location.place_type[0] === "country"
          ? 4
          : location.place_type[0] === "region"
            ? 6
            : 10;

      mapRef.current.flyTo({
        center: location.center,
        zoom: zoomLevel,
        essential: true,
      });
    } catch (error) {
      console.error("Error selecting location:", error);
    }
  };

  return (
    <main className="min-h-screen w-full relative bg-[#c5e5be] -mt-16 backdrop-blur-md">
      <div className="absolute top-24 left-4 z-10 bg-white p-4 rounded-lg shadow-lg min-w-[300px]">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search for a location..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchResults.length > 0 && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleLocationSelect(result)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {result.place_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="absolute inset-0 flex">
        <div
          ref={mapContainerRef}
          className={`flex-grow transition-all duration-300 ease-in-out ${activeLocation ? "mr-[45%]" : ""}`}
        />
        {activeLocation && (
          <div
            className="absolute right-8 top-8 bottom-8 w-[45%] overflow-y-auto z-10 backdrop-blur-md rounded-3xl shadow-2xl"
            style={{
              background: `linear-gradient(135deg, 
                rgba(14, 59, 92, 0.5) 0%,
                rgba(94, 79, 109, 0.5) 25%,
                rgba(159, 102, 113, 0.5) 50%,
                rgba(216, 137, 123, 0.5) 75%,
                rgba(244, 172, 123, 0.5) 100%
              )`,
            }}
          >
            <TabbedDashboard
              address={activeLocation}
              onClose={() => setActiveLocation(null)}
              onRemoveLocation={handleRemoveLocation}
              onRiskDataLoaded={handleRiskDataLoaded}
            />
          </div>
        )}
      </div>
    </main>
  );
}
