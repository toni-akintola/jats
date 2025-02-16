'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { hideHeader } from "@/contexts/header-context";
import { SentimentDashboard } from "@/components/sentiment-dashboard";
import { useProfileStore } from "@/store/profile-store";

type ClickedLocation = {
  lng: number;
  lat: number;
  address?: string;
};

const MAPBOX_TOKEN = 'pk.eyJ1IjoiamcyMzY4IiwiYSI6ImNtNzcwYnE1aTEzbDMyaW9sNDRhZHNjOTQifQ.1v5AL-rjwGQC5_jd3pSJHQ';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface LocationFeature {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  text: string;
  context?: any[];
}

export default function MapPage() {
  const { setHideHeader } = hideHeader();
  const profile = useProfileStore((state) => state.profile);

  useEffect(() => {
    setHideHeader(true);
    return () => setHideHeader(false);
  }, [setHideHeader]);

  // Function to geocode profile location
  const geocodeLocation = async (location: string) => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is not set');
      return null;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
    return null;
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, any>>({});
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRemoveCompany = (company: string, isLast: boolean) => {
    setCompanies((prev) => prev.filter((c: string) => c !== company));
    setResults((prev) => {
      const newResults = { ...prev };
      delete newResults[company];
      return newResults;
    });

    // Remove the marker for this company if it exists
    const marker = markersRef.current.get(company);
    if (marker) {
      marker.remove();
      markersRef.current.delete(company);
    }

    // Close sidebar if this was the last location
    if (isLast) {
      setClickedLocation(null);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 300);
    }
  }, [clickedLocation]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<LocationFeature[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationFeature | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    console.log("Initializing map...");
    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-119.4179, 36.7783],  // California center coordinates
        zoom: 6,
      });

      const map = mapRef.current;
      console.log("Map created successfully");

      // Function to analyze a single point
      const analyzeSinglePoint = async (point: { lat: number; lng: number }) => {
        try {
          const response = await fetch('/api/sentiment-analysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: point }),
          });

          const data = await response.json();
          
          // Update the map source by adding the new feature
          if (map.getSource('sentiments')) {
            const source = map.getSource('sentiments') as mapboxgl.GeoJSONSource;
            const currentData = (source as any)._data || { type: 'FeatureCollection', features: [] };
            currentData.features.push(...data.features);
            source.setData(currentData);
          }
        } catch (error) {
          console.error('Error analyzing point:', error);
        }
      };

      // Function to analyze sentiments
      const analyzeSentiments = async () => {
        setIsAnalyzing(true);
        try {
          // Generate random points around the current center
          const center = map.getCenter();
          const points = Array.from({ length: 20 }, () => ({
            lat: center.lat + (Math.random() - 0.5) * 0.1,
            lng: center.lng + (Math.random() - 0.5) * 0.1
          }));

          // Analyze points one by one
          for (const point of points) {
            await analyzeSinglePoint(point);
            // Small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error('Error analyzing sentiments:', error);
        } finally {
          setIsAnalyzing(false);
        }
      };

      map.on('load', async () => {
        // California state coordinates
        const coords = { lat: 36.7783, lng: -119.4179 };
        
        map.flyTo({
          center: [coords.lng, coords.lat],
          zoom: 6,
          essential: true
        });

        // Generate diverse clusters across California
        const gridPoints = [];
        
        // Define cluster regions with sentiment biases
        const clusterRegions = [
          { 
            center: { lat: 37.7749, lng: -122.4194 }, // SF
            radius: 0.3,
            points: 25,
            sentimentBias: 0.7  // Tech hub - positive
          },
          { 
            center: { lat: 34.0522, lng: -118.2437 }, // LA
            radius: 0.4,
            points: 30,
            sentimentBias: 0.3  // Entertainment - slightly positive
          },
          { 
            center: { lat: 32.7157, lng: -117.1611 }, // San Diego
            radius: 0.25,
            points: 20,
            sentimentBias: 0.5  // Military/Tech - moderately positive
          },
          { 
            center: { lat: 38.5816, lng: -121.4944 }, // Sacramento
            radius: 0.35,
            points: 25,
            sentimentBias: -0.2  // Government - slightly negative
          },
          { 
            center: { lat: 36.7378, lng: -119.7871 }, // Fresno
            radius: 0.3,
            points: 20,
            sentimentBias: 0.1  // Agriculture - neutral
          },
          { 
            center: { lat: 39.5296, lng: -119.8138 }, // Reno/Tahoe
            radius: 0.4,
            points: 25,
            sentimentBias: 0.6  // Tourism/Nature - positive
          },
          { 
            center: { lat: 35.3733, lng: -119.0187 }, // Bakersfield
            radius: 0.25,
            points: 20,
            sentimentBias: -0.3  // Industry - slightly negative
          },
          { 
            center: { lat: 33.8366, lng: -117.9143 }, // Santa Ana/OC
            radius: 0.3,
            points: 25,
            sentimentBias: 0.4  // Suburban/Tech - moderately positive
          },
          { 
            center: { lat: 36.3728, lng: -120.7210 }, // Central Valley
            radius: 0.5,
            points: 30,
            sentimentBias: -0.1  // Agriculture/Industry - slightly negative
          },
          { 
            center: { lat: 40.7648, lng: -124.2026 }, // Eureka
            radius: 0.4,
            points: 20,
            sentimentBias: 0.2  // Nature/Tourism - slightly positive
          }
        ];

        // Generate points for each cluster with varying patterns
        clusterRegions.forEach(region => {
          for (let i = 0; i < region.points; i++) {
            // Generate random angle and distance for more organic spread
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * region.radius;
            
            // Convert polar coordinates to lat/lng offset
            const latOffset = distance * Math.cos(angle);
            const lngOffset = distance * Math.sin(angle);
            
            // Add some randomness to the sentiment while maintaining the region's bias
            const sentimentNoise = (Math.random() - 0.5) * 0.4; // ±0.2 variation
            const sentiment = Math.max(-1, Math.min(1, region.sentimentBias + sentimentNoise));
            
            gridPoints.push({
              lat: region.center.lat + latOffset,
              lng: region.center.lng + lngOffset,
              sentimentBias: sentiment
            });
          }
        });

        // Analyze each point in the grid
        for (const point of gridPoints) {
          await analyzeSinglePoint(point);
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      });

      // Add click event handler
      const handleClick = async (e: mapboxgl.MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        console.log('Clicked coordinates:', { lng, lat });
        setClickedLocation({ lng, lat });

        try {
          // Reverse geocode the clicked location
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const address = data.features[0].place_name;
            console.log('Address:', address);
            setClickedLocation(prev => prev ? { ...prev, address } : null);

            // Create and add new marker
            const newMarker = new mapboxgl.Marker({ color: '#FF0000' })
              .setLngLat([lng, lat])
              .addTo(map);
            
            markersRef.current.set(address, newMarker);
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
        }
      };

      map.on('click', handleClick);

      // Add a pointer cursor when hovering over the map
      map.getCanvas().style.cursor = 'pointer';

      map.on("load", () => {
        console.log("Map loaded");
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        map.addSource("sentiments", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });

        map.addLayer(
          {
            id: "sentiments-heat",
            type: "heatmap",
            source: "sentiments",
            maxzoom: 9,
            paint: {
              // Weight based on sentiment magnitude
              "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["abs", ["get", "sentiment"]],
                0,
                0.3,  // Lower weight for neutral sentiments
                0.5,
                0.7,  // Medium weight for moderate sentiments
                1,
                1.0   // Full weight for extreme sentiments
              ],
              // Simplified color ramp for heatmap
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(0,0,0,0)",               // Transparent for lowest density
                0.1,
                "rgba(255,182,193,0.4)",      // Light pink
                0.3,
                "rgba(255,160,172,0.5)",      // Soft pink
                0.5,
                "rgba(230,230,250,0.6)",      // Lavender
                0.7,
                "rgba(176,196,222,0.6)",      // Light steel blue
                0.9,
                "rgba(135,206,235,0.7)",      // Sky blue
                1,
                "rgba(100,149,237,0.8)"       // Cornflower blue
              ],
              // Increase the heatmap color weight weight by zoom level
              // heatmap-intensity is a multiplier on top of heatmap-weight
              "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                1,
                9,
                3,
              ],
              // Adjust the heatmap radius by zoom level
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                2,
                9,
                20,
              ],
              // Transition from heatmap to circle layer by zoom level
              "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7,
                1,
                9,
                0,
              ],
            },
          },
          "waterway-label",
        );

        map.addLayer(
          {
            id: "sentiments-point",
            type: "circle",
            source: "sentiments",
            minzoom: 7,
            paint: {
              // Dynamic circle radius based on zoom and sentiment
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                6,  // At zoom level 6
                ["interpolate", 
                  ["linear"],
                  ["abs", ["get", "sentiment"]],
                  0, 3,  // Smaller for neutral
                  1, 5   // Larger for strong sentiment
                ],
                16,  // At zoom level 16
                ["interpolate", 
                  ["linear"],
                  ["abs", ["get", "sentiment"]],
                  0, 6,   // Smaller for neutral
                  1, 10   // Larger for strong sentiment
                ]
              ],
              // Enhanced color interpolation for sentiment
              "circle-color": [
                "interpolate",
                ["linear"],
                ["get", "sentiment"],
                -1,
                "rgba(255,182,193,0.9)",    // Light pink
                -0.5,
                "rgba(255,218,224,0.8)",    // Softer pink
                0,
                "rgba(230,230,250,0.7)",    // Lavender for neutral
                0.5,
                "rgba(176,196,222,0.8)",    // Light steel blue
                1,
                "rgba(135,206,235,0.9)"     // Sky blue
              ],
              "circle-stroke-color": [
                "interpolate",
                ["linear"],
                ["get", "sentiment"],
                -1,
                "rgba(219,112,147,0.8)",   // Pale violet red
                0,
                "rgba(180,180,200,0.7)",   // Soft gray-purple
                1,
                "rgba(70,130,180,0.8)"    // Steel blue
              ],
              "circle-stroke-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                6,
                0.5,
                16,
                2
              ],
              // Transition from heatmap to circle layer by zoom level
              "circle-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7,
                0,
                8,
                1,
              ],
            },
          },
          "waterway-label",
        );
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      mapRef.current?.remove();
    };
  }, []);

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
        `limit=5`
      );
      const data = await response.json();
      
      if (data.features) {
        setSearchResults(data.features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center,
          place_type: feature.place_type,
          text: feature.text,
          context: feature.context
        })));
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationSelect = async (location: LocationFeature) => {
    if (!mapRef.current) return;
    
    try {
      setSelectedLocation(location);
      setSearchInput(location.place_name);
      setSearchResults([]);

      const zoomLevel = location.place_type[0] === 'country' ? 4 :
                       location.place_type[0] === 'region' ? 6 : 10;

      mapRef.current.flyTo({
        center: location.center,
        zoom: zoomLevel,
        essential: true
      });
    } catch (error) {
      console.error('Error selecting location:', error);
    }
  };

  return (
    <main className="min-h-screen w-full relative bg-[#2e4c6c] backdrop-blur-md">
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg min-w-[300px]">
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
          className={`flex-grow transition-all duration-300 ease-in-out ${clickedLocation ? 'mr-[45%]' : ''}`}
        />
      {clickedLocation && (
          <div 
            className="absolute right-8 top-8 bottom-8 w-[45%] overflow-y-auto z-10 backdrop-blur-md rounded-3xl shadow-2xl"
            style={{
              background: `linear-gradient(135deg, 
                rgba(14, 59, 92, 0.5) 0%,
                rgba(94, 79, 109, 0.5) 25%,
                rgba(159, 102, 113, 0.5) 50%,
                rgba(216, 137, 123, 0.5) 75%,
                rgba(244, 172, 123, 0.5) 100%
              )`
            }}>
            <SentimentDashboard 
              address={clickedLocation.address || ''} 
              onClose={() => setClickedLocation(null)}
              onRemoveLocation={(location, isLast) => handleRemoveCompany(location, isLast)}
            />
          </div>
        )}
      </div>
    </main>
 );
}