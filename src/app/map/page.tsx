'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { hideHeader } from "@/contexts/header-context";
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

const MAPBOX_TOKEN = 'pk.eyJ1IjoiamcyMzY4IiwiYSI6ImNtNzcwYnE1aTEzbDMyaW9sNDRhZHNjOTQifQ.1v5AL-rjwGQC5_jd3pSJHQ';
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
  const { setHideHeader } = hideHeader();

  useEffect(() => {
    setHideHeader(true);
    return () => setHideHeader(false);
  }, [setHideHeader]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [locationsMap, setLocationsMap] = useState<LocationsMap>({});
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const handleRemoveLocation = (address: string, isLast: boolean) => {
    setLocationsMap(prev => {
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
    setLocationsMap(prev => {
      const location = prev[address];
      if (!location) return prev;

      // Create a new marker with the risk color
      const newMarker = new mapboxgl.Marker({
        color: getRiskColor(riskScore)
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
          marker: newMarker
        }
      };
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 300);
    }
  }, [activeLocation]);

  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<LocationFeature[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    console.log("Initializing map...");
    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-98, 39],
        zoom: 3,
      });

      const map = mapRef.current;
      console.log("Map created successfully");

      // Add click event handler
      const handleClick = async (e: mapboxgl.MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        
        try {
          // Reverse geocode the clicked location
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const address = data.features[0].place_name;
            
            // Create and add new marker
            const newMarker = new mapboxgl.Marker({ color: '#FFFFFF' })
              .setLngLat([lng, lat])
              .addTo(map);
            
            // Add to locations map
            setLocationsMap(prev => ({
              ...prev,
              [address]: {
                lng,
                lat,
                address,
                marker: newMarker
              }
            }));
            
            // Set as active location
            setActiveLocation(address);
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
        map.addSource("earthquakes", {
          type: "geojson",
          data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        });

        map.addLayer(
          {
            id: "earthquakes-heat",
            type: "heatmap",
            source: "earthquakes",
            maxzoom: 9,
            paint: {
              // Increase the heatmap weight based on frequency and property magnitude
              "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                0,
                0,
                6,
                1,
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
              // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
              // Begin color ramp at 0-stop with a 0-transparancy color
              // to create a blur-like effect.
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(0,0,255,0)",
                0.2,
                "rgb(173,216,230)",
                0.4,
                "rgb(135,206,235)",
                0.6,
                "rgb(65,105,225)",
                0.8,
                "rgb(0,0,205)",
                1,
                "rgb(0,0,139)",
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
            id: "earthquakes-point",
            type: "circle",
            source: "earthquakes",
            minzoom: 7,
            paint: {
              // Size circle radius by earthquake magnitude and zoom level
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7,
                ["interpolate", ["linear"], ["get", "mag"], 1, 1, 6, 4],
                16,
                ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 50],
              ],
              // Color circle by earthquake magnitude
              "circle-color": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1,
                "rgba(0,0,255,0)",
                2,
                "rgb(173,216,230)",
                3,
                "rgb(135,206,235)",
                4,
                "rgb(65,105,225)",
                5,
                "rgb(0,0,205)",
                6,
                "rgb(0,0,139)",
              ],
              "circle-stroke-color": "white",
              "circle-stroke-width": 1,
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
        setSearchResults(data.features.map((feature: LocationFeature) => ({
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
          className={`flex-grow transition-all duration-300 ease-in-out ${activeLocation ? 'mr-[45%]' : ''}`}
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
              )`
            }}>
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