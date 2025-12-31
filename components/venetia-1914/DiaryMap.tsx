"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icons in React
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// --- HELPER TO AUTO-PAN THE MAP ---
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, { duration: 1.5 }); // Smooth fly animation
  }, [center, map]);
  return null;
}

interface DiaryMapProps {
  center: [number, number];
  locationName: string;
}

const DiaryMap = ({ center, locationName }: DiaryMapProps) => {
  return (
    <div className="absolute top-6 left-6 z-20 w-48 h-32 rounded-lg overflow-hidden border-4 border-white shadow-2xl opacity-90 hover:opacity-100 transition-opacity">
        <MapContainer 
            center={center} 
            zoom={10} 
            scrollWheelZoom={false} 
            zoomControl={false}
            attributionControl={false}
            className="w-full h-full"
        >
            {/* Vintage-looking tiles */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={center} icon={icon}>
            </Marker>
            
            {/* Helper to fly to new coordinates when entry changes */}
            <MapUpdater center={center} />
        </MapContainer>
        
        {/* Location Label overlay on map */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-[10px] text-center font-bold uppercase py-1 tracking-widest text-stone-800 z-[1000]">
            {locationName}
        </div>
    </div>
  );
};

export default DiaryMap;
