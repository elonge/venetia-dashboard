'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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

const sicilianLocations: Array<{
  name: string;
  description: string;
  coords: [number, number];
}> = [
  {
    name: 'Palermo',
    description: 'Arrival point - explored the Norman Palace and Cathedral',
    coords: [38.1157, 13.3615] as [number, number]
  },
  {
    name: 'Taormina',
    description: 'Visited the ancient Greek Theater, a pivotal moment',
    coords: [37.8526, 15.2876] as [number, number]
  },
  {
    name: 'Syracuse',
    description: 'Explored ancient ruins and the Ear of Dionysius',
    coords: [37.0755, 15.2866] as [number, number]
  },
  {
    name: 'Agrigento',
    description: 'Visited the Valley of the Temples',
    coords: [37.3118, 13.5765] as [number, number]
  }
];

export default function SicilyMap() {
  const routeCoords = sicilianLocations.map(loc => loc.coords) as [number, number][];

  return (
    <div className="bg-[#F5F0E8] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#D4CFC4]">
        <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
          Journey Through Sicily
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          The route taken during the Mediterranean cruise
        </p>
      </div>
      <div className="h-80">
        <MapContainer 
          center={[37.5, 14.5]} 
          zoom={8} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route line */}
          <Polyline 
            positions={routeCoords} 
            color="#6B2D3C" 
            weight={2}
            opacity={0.7}
            dashArray="5, 10"
          />

          {/* Location markers */}
          {sicilianLocations.map((location, idx) => (
            <Marker key={idx} position={location.coords}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-[#1A2A40]">{location.name}</p>
                  <p className="text-xs text-[#6B7280] mt-1">{location.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}