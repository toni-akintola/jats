"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { hideHeader } from "@/contexts/header-context";
import { SentimentDashboard } from "@/components/sentiment-dashboard";

type ClickedLocation = {
  lng: number;
  lat: number;
  address?: string;
};

// Commented out ListingSidePanel component
/* const ListingSidePanel = ({
  listing,
  clickedLocation
}: {
  listing: DetailedListing | null;
  clickedLocation: ClickedLocation | null;
}) => {
  if (!listing) return null;
  return null;
}; */

export default function MapPage() {
  const { setHideHeader } = hideHeader();

  useEffect(() => {
    setHideHeader(true);
    return () => setHideHeader(false);
  }, [setHideHeader]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 300);
    }
  }, [clickedLocation]);

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
    <main className="min-h-screen w-full relative bg-black">
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
            <SentimentDashboard address={clickedLocation.address || ''} />
          </div>
        )}
      </div>
    </main>
  );
}
