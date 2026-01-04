"use client";

import React, { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Coords = { lat: number; lng: number };

function FitBounds({ points }: { points: [Coords, Coords] }) {
  const map = useMap();
  const bounds = useMemo(
    () =>
      L.latLngBounds([
        [points[0].lat, points[0].lng],
        [points[1].lat, points[1].lng],
      ]).pad(0.25), // Reduced padding slightly for tighter framing
    [points]
  );

  useEffect(() => {
    map.fitBounds(bounds, { animate: false, maxZoom: 12 });
  }, [map, bounds]);

  return null;
}

export default function ProximityMap({
  pm,
  venetia,
  hasMeeting,
}: {
  pm: Coords;
  venetia: Coords;
  hasMeeting?: boolean;
}) {
  const center: [number, number] = useMemo(
    () => [(pm.lat + venetia.lat) / 2, (pm.lng + venetia.lng) / 2],
    [pm.lat, pm.lng, venetia.lat, venetia.lng]
  );

  const polyline: Array<[number, number]> = useMemo(
    () => [
      [pm.lat, pm.lng],
      [venetia.lat, venetia.lng],
    ],
    [pm.lat, pm.lng, venetia.lat, venetia.lng]
  );

  const distance = useMemo(() => {
    if (typeof window === 'undefined') return 10000; // Default large distance on server
    return L.latLng(pm.lat, pm.lng).distanceTo(L.latLng(venetia.lat, venetia.lng));
  }, [pm, venetia]);

  const isClose = distance < 2000; // Less than 2km
  const showMergedPin = isClose || hasMeeting;

  return (
    // THE PHYSICAL ARTIFACT CONTAINER
    <div className="relative h-full w-full bg-[#E8E4D9] border-[6px] border-white shadow-xl rotate-1 overflow-hidden rounded-sm">
      
      {/* 1. ARCHIVAL FILTER STYLES */}
      <style jsx global>{`
        /* Forces the map tiles to look like old paper */
        .archival-tiles {
          filter: grayscale(100%) sepia(20%) contrast(110%) brightness(95%);
          mix-blend-mode: multiply;
        }
        /* Removes default white box from tooltips for a 'stamped' look */
        .leaflet-tooltip-pane .leaflet-tooltip {
          background: transparent;
          border: none;
          box-shadow: none;
          font-family: serif;
          font-weight: bold;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-shadow: 0 1px 2px rgba(255,255,255,0.8);
        }
        /* Hides the tiny triangle tip of the tooltip */
        .leaflet-tooltip-tip {
          display: none;
        }
      `}</style>

      {/* 2. PINNED PAPER EFFECT */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-black/10 rounded-full blur-sm z-[400] pointer-events-none"></div>
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#4A7C59] z-[401] pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>
      </div>

      <MapContainer
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%", background: '#E8E4D9' }}
        scrollWheelZoom={false}
        zoomControl={false} // Remove modern +/- buttons
        attributionControl={false} // Clean look (add attribution elsewhere if needed)
      >
        <FitBounds points={[pm, venetia]} />
        
        {/* 3. CARTODB TILES + SEPIA FILTER */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          className="archival-tiles"
          maxNativeZoom={12} // Prevents loading high-detail tiles with building footprints
        />

        {/* 4. HAND-DRAWN CONNECTION LINE (Only if NOT merged) */}
        {!showMergedPin && (
          <Polyline 
            positions={polyline} 
            pathOptions={{ 
              color: "#8B4513", 
              weight: 2, 
              opacity: 0.6, 
              dashArray: "6, 8" // Creates the 'dotted line' effect
            }} 
          />
        )}

        {/* 5. MARKERS */}
        {showMergedPin ? (
          /* MERGED MARKER */
          <CircleMarker
            center={center} // Use midpoint
            radius={hasMeeting ? 8 : 6}
            pathOptions={{ 
              color: hasMeeting ? "#8B4513" : "#555555", // Darker brown for meeting, neutral grey-ish for just close
              fillColor: hasMeeting ? "#8B4513" : "#555555", 
              fillOpacity: 1, 
              weight: hasMeeting ? 2 : 1 
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
              <span className={hasMeeting ? "text-[#8B4513]" : "text-[#555555]"}>
                {hasMeeting ? "Meeting" : "Together"}
              </span>
            </Tooltip>
          </CircleMarker>
        ) : (
          /* SEPARATE MARKERS */
          <>
            <CircleMarker
              center={[pm.lat, pm.lng]}
              radius={5}
              pathOptions={{ color: "#1A2A40", fillColor: "#1A2A40", fillOpacity: 1, weight: 1 }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent>
                <span className="text-[#1A2A40]">Asquith</span>
              </Tooltip>
            </CircleMarker>

            <CircleMarker
              center={[venetia.lat, venetia.lng]}
              radius={5}
              pathOptions={{ color: "#4A7C59", fillColor: "#4A7C59", fillOpacity: 1, weight: 1 }}
            >
              <Tooltip direction="bottom" offset={[0, 5]} opacity={1} permanent>
                 <span className="text-[#4A7C59]">Venetia</span>
              </Tooltip>
            </CircleMarker>
          </>
        )}
      </MapContainer>
    </div>
  );
}