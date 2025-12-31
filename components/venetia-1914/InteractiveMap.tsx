'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationCoords {
  lat: number;
  lng: number;
  name: string;
}

interface MapUpdaterProps {
  locations: LocationCoords[];
  activeCoords?: LocationCoords;
}

function MapUpdater({ locations, activeCoords }: MapUpdaterProps) {
  const map = useMap();
  
  useEffect(() => {
    if (activeCoords) {
      map.setView([activeCoords.lat, activeCoords.lng], 12, { animate: true });
    } else if (locations.length > 0) {
      if (locations.length === 1) {
        map.setView([locations[0].lat, locations[0].lng], 12);
      } else {
        const bounds = locations.map(loc => [loc.lat, loc.lng] as [number, number]);
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 12 });
      }
    }
  }, [activeCoords, locations, map]);
  
  return null;
}

interface InteractiveMapProps {
  centerLat: number;
  centerLng: number;
  locations: LocationCoords[];
  activeCoords?: LocationCoords;
  activeLocationName?: string;
  activeDate?: string;
}

export default function InteractiveMap({
  centerLat,
  centerLng,
  locations,
  activeCoords,
  activeLocationName,
  activeDate,
}: InteractiveMapProps) {
  return (
    <div className="relative w-full h-full bg-navy rounded-sm overflow-hidden shadow-2xl border-[8px] border-white">
      <div className="absolute inset-0 bg-gradient-to-br from-navy to-black"></div>
      
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={6} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={false}
        className="sepia"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.8}
        />
        
        <MapUpdater locations={locations} activeCoords={activeCoords} />
        
        {/* Active location marker */}
        {activeCoords && (
          <Marker position={[activeCoords.lat, activeCoords.lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-navy">{activeCoords.name}</p>
                {activeDate && (
                  <p className="text-xs text-slate">{activeDate}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Overlay info */}
      {(activeLocationName || activeDate) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 to-transparent p-6">
          <div className="text-page-bg">
            {activeLocationName && (
              <h3 className="text-2xl font-serif font-bold mb-1">
                {activeLocationName}
              </h3>
            )}
            {activeDate && (
              <p className="text-sm font-mono uppercase tracking-[0.2em] text-accent-brown">
                {activeDate}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


