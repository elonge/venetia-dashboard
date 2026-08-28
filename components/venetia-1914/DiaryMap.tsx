"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CARTO_ATTRIBUTION, CARTO_LIGHT_TILE_URL } from '@/lib/carto-basemap';

// Fix for default Leaflet marker icons in React
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// --- HELPER TO AUTO-PAN OR FIT BOUNDS ---
function MapUpdater({ center, destination }: { center: [number, number], destination?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!center || isNaN(center[0]) || isNaN(center[1])) return;

    if (destination && !isNaN(destination[0]) && !isNaN(destination[1])) {
      const bounds = L.latLngBounds([center, destination]);
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 8, animate: true, duration: 1.5 });
    } else {
      map.flyTo(center, 7, { duration: 1.5 });
    }
  }, [center, destination, map]);
  return null;
}

interface DiaryMapProps {
  center: [number, number];
  destination?: [number, number];
  locationName: string;
}

const DiaryMap = ({ center, destination, locationName }: DiaryMapProps) => {
  if (!center || isNaN(center[0]) || isNaN(center[1])) return null;

  if (!CARTO_LIGHT_TILE_URL) {
    return (
      <div className="absolute top-6 left-6 z-20 flex h-32 w-48 items-center justify-center rounded-lg border-4 border-white bg-stone-200 px-3 text-center text-[10px] font-bold uppercase tracking-widest text-stone-600 shadow-2xl">
        Map unavailable: NEXT_PUBLIC_CARTO_API_KEY is not configured
      </div>
    );
  }

  return (
    <div className="absolute top-6 left-6 z-20 w-48 h-32 rounded-lg overflow-hidden border-4 border-white shadow-2xl opacity-90 hover:opacity-100 transition-opacity">
        <MapContainer 
            center={center} 
            zoom={7} 
            scrollWheelZoom={false} 
            zoomControl={false}
            attributionControl
            className="w-full h-full"
        >
            {/* Vintage-looking tiles */}
            <TileLayer
                url={CARTO_LIGHT_TILE_URL}
                attribution={CARTO_ATTRIBUTION}
            />
            <Marker position={center} icon={icon}></Marker>
            
            {destination && (
              <>
                <Marker position={destination} icon={icon}></Marker>
                <Polyline 
                  positions={[center, destination]} 
                  pathOptions={{ color: '#78350f', dashArray: '5, 10', opacity: 0.7 }} 
                />
              </>
            )}
            
            {/* Helper to fly to new coordinates when entry changes */}
            <MapUpdater center={center} destination={destination} />
        </MapContainer>
        
        {/* Location Label overlay on map */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-[10px] text-center font-bold uppercase py-1 tracking-widest text-stone-800 z-[1000]">
            {locationName}
        </div>
    </div>
  );
};

export default DiaryMap;
