'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<LocationFeature[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationFeature | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98, 39],
      zoom: 3
    });

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
    <div className="w-full h-screen relative">
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
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}