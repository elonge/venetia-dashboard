'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
// @ts-ignore - _getIconUrl is a private property that needs to be deleted
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  name: string;
  lat: number;
  long: number;
}

interface SicilyMapProps {
  locations?: Location[];
  title?: string;
  description?: string;
}

// Component to fit bounds to show all markers
function FitBounds({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = locations.map(loc => [loc.lat, loc.long] as [number, number]);
      if (bounds.length === 1) {
        // If only one location, center on it with a reasonable zoom
        map.setView(bounds[0], 12);
      } else {
        // Fit bounds to show all locations with padding
        map.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 12
        });
      }
    }
  }, [locations, map]);

  return null;
}

export default function SicilyMap({ 
  locations = [], 
  title = 'Journey Map',
  description = 'Locations from the chapter'
}: SicilyMapProps) {
  // Convert locations to map format
  const mapLocations = locations.map(loc => ({
    name: loc.name,
    coords: [loc.lat, loc.long] as [number, number]
  }));

  // Calculate center point from locations, or use default
  const centerLat = locations.length > 0 
    ? locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length
    : 37.5;
  const centerLong = locations.length > 0
    ? locations.reduce((sum, loc) => sum + loc.long, 0) / locations.length
    : 14.5;

  const routeCoords = mapLocations.map(loc => loc.coords) as [number, number][];

  // Default zoom (will be adjusted by FitBounds component)
  const zoom = 8;

  return (
    <div className="bg-[#F5F0E8] rounded-lg overflow-hidden relative z-0">
      <div className="p-4 border-b border-[#D4CFC4]">
        <h2 className="text-xs font-semibold text-[#2D3648] uppercase tracking-wider">
          {title}
        </h2>
        <p className="text-sm text-[#2D3648] mt-1">
          {description}
        </p>
      </div>
      <div className="h-80">
        <MapContainer 
          center={[centerLat, centerLong]} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Fit bounds to show all locations */}
          {locations.length > 0 && <FitBounds locations={locations} />}
          
          {/* Route line - only show if there are multiple locations */}
          {routeCoords.length > 1 && (
            <Polyline 
              positions={routeCoords} 
              color="#6B2D3C" 
              weight={2}
              opacity={0.7}
              dashArray="5, 10"
            />
          )}

          {/* Location markers */}
          {mapLocations.map((location, idx) => (
            <Marker key={idx} position={location.coords}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-[#1A2A40]">{location.name}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
