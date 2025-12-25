'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
// @ts-ignore - _getIconUrl is a private property that needs to be deleted
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const locations: Array<{
  person: string;
  location: string;
  coords: [number, number];
}> = [
  { 
    person: 'Asquith', 
    location: '10 Downing St, London',
    coords: [51.5034, -0.1276] as [number, number] // 10 Downing Street coordinates
  },
  { 
    person: 'Venetia', 
    location: '8 Queen Anne\'s Gate, London',
    coords: [51.4985, -0.1332] as [number, number] // Queen Anne's Gate coordinates
  },
  { 
    person: 'Edwin', 
    location: '11 Downing St, London',
    coords: [51.5033, -0.1274] as [number, number] // 11 Downing Street coordinates
  }
];

export default function LocationMap() {
  return (
    <div className="bg-card-bg rounded-lg overflow-hidden border border-border-beige shadow-sm">
      <div className="p-3 border-b border-border-beige">
        <h4 className="text-xs font-semibold text-slate uppercase tracking-wider">
          Location of People Involved
        </h4>
      </div>
      <div className="h-64">
        <MapContainer 
          center={[51.5015, -0.1300]} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="sepia"
          />
          {locations.map((loc, idx) => (
            <Marker key={idx} position={loc.coords}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-navy">{loc.person}</p>
                  <p className="text-xs text-slate">{loc.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}