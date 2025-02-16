"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSearchParams } from "next/navigation";
import { DetailedListing } from "@/types/listing";
import Image from "next/image";
import { hideHeader } from "@/contexts/header-context";

type ClickedLocation = {
  lng: number;
  lat: number;
  address?: string;
};

const ListingSidePanel = ({
  listing,
  clickedLocation
}: {
  listing: DetailedListing | null;
  clickedLocation: ClickedLocation | null;
}) => {
  if (!listing) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white shadow-lg overflow-y-auto p-4 z-10">
      {clickedLocation && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Clicked Location</h3>
          <p className="text-sm text-gray-600 mb-1">Longitude: {clickedLocation.lng.toFixed(6)}</p>
          <p className="text-sm text-gray-600 mb-1">Latitude: {clickedLocation.lat.toFixed(6)}</p>
          {clickedLocation.address && (
            <p className="text-sm text-gray-600">Address: {clickedLocation.address}</p>
          )}
        </div>
      )}
      <div className="relative h-48 w-full mb-4">
        <Image
          src={listing.imageUrl}
          alt={listing.location}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <h2 className="text-xl font-bold mb-2">{listing.location}</h2>
      <p className="text-gray-600 mb-4">{listing.subtitle}</p>
      <div className="flex justify-between mb-4">
        <span className="text-lg font-semibold">${listing.price.toLocaleString()}</span>
        <span className="text-yellow-500">★ {listing.rating}</span>
      </div>
      {listing.description && (
        <p className="text-gray-700 mb-4">{listing.description}</p>
      )}
      {listing.amenities && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Amenities</h3>
          <ul className="list-disc list-inside">
            {listing.amenities.map((amenity, index) => (
              <li key={index} className="text-gray-600">{amenity}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {listing.bedrooms && (
          <div className="text-gray-600">
            <span className="font-semibold">Bedrooms:</span> {listing.bedrooms}
          </div>
        )}
        {listing.bathrooms && (
          <div className="text-gray-600">
            <span className="font-semibold">Bathrooms:</span> {listing.bathrooms}
          </div>
        )}
        {listing.squareFeet && (
          <div className="text-gray-600">
            <span className="font-semibold">Sq Ft:</span> {listing.squareFeet.toLocaleString()}
          </div>
        )}
        {listing.yearBuilt && (
          <div className="text-gray-600">
            <span className="font-semibold">Year Built:</span> {listing.yearBuilt}
          </div>
        )}
      </div>
    </div>
  );
};

export default function MapPage() {
  const { setHideHeader } = hideHeader();

  useEffect(() => {
    setHideHeader(true);
    return () => setHideHeader(false);
  }, [setHideHeader]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const searchParams = useSearchParams();
  const [selectedListing, setSelectedListing] = useState<DetailedListing | null>(null);
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 300);
    }
  }, [selectedListing]);

  useEffect(() => {
    const selectedId = searchParams.get('selectedListingId');
    if (selectedId) {
      setSelectedListing({
        id: parseInt(selectedId),
        location: "123 Example St, San Francisco, CA",
        subtitle: "Beautiful Modern Home",
        dates: "Available Now",
        price: 1250000,
        rating: 4.8,
        isFavorite: false,
        imageUrl: "/moss-beach.png",
        description: "Stunning modern home with panoramic views of the city. Recently renovated with high-end finishes throughout.",
        amenities: ["Hardwood Floors", "Granite Countertops", "Smart Home Features", "2-Car Garage"],
        squareFeet: 2500,
        bedrooms: 4,
        bathrooms: 3,
        propertyType: "single-family",
        yearBuilt: 2020
      });
    } else {
      setSelectedListing(null);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("Map container:", mapContainerRef.current);
    if (!mapContainerRef.current) {
      console.error("Map container not found");
      return;
    }

    mapboxgl.accessToken =
      "pk.eyJ1IjoiamcyMzY4IiwiYSI6ImNtNzcwYnE1aTEzbDMyaW9sNDRhZHNjOTQifQ.1v5AL-rjwGQC5_jd3pSJHQ";

    console.log("Initializing map...");
    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-120, 50],
        zoom: 2,
      });

      const map = mapRef.current;
      console.log("Map created successfully");

      // Add click event handler
      map.on('click', async (e) => {
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
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
        }
      });

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
                "rgba(33,102,172,0)",
                0.2,
                "rgb(103,169,207)",
                0.4,
                "rgb(209,229,240)",
                0.6,
                "rgb(253,219,199)",
                0.8,
                "rgb(239,138,98)",
                1,
                "rgb(178,24,43)",
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
                "rgba(33,102,172,0)",
                2,
                "rgb(103,169,207)",
                3,
                "rgb(209,229,240)",
                4,
                "rgb(253,219,199)",
                5,
                "rgb(239,138,98)",
                6,
                "rgb(178,24,43)",
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
      console.log("Cleaning up map...");
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <main className="min-h-screen w-full relative">
      <div className="absolute inset-0 flex">
        <div
          ref={mapContainerRef}
          className={`flex-grow transition-all duration-300 ease-in-out ${selectedListing ? 'mr-[50vw]' : ''}`}
        />
        <ListingSidePanel listing={selectedListing} clickedLocation={clickedLocation} />
      </div>
    </main>
  );
}
