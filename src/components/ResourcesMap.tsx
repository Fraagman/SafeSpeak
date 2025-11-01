"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import type { Coords } from "@/lib/geo";
import { formatDistance } from "@/lib/geo";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom pink marker for NGOs
const ngoIcon = new L.Icon({
  iconUrl: "/map-markers/marker-icon-2x-pink.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type NgoMapData = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  verified: boolean;
  contact?: string;
  distanceKm?: number;
};

type ResourcesMapProps = {
  ngos: NgoMapData[];
  userLocation: Coords | null;
  selectedNgoId?: string | null;
  onMarkerClick?: (ngoId: string) => void;
};

function CaptureMap({ onMap }: { onMap: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onMap(map);
  }, [map, onMap]);
  return null;
}

// Helper component to handle map instance
function MapInstance({ setMapInstance }: { setMapInstance: (map: L.Map) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      setMapInstance(map);
    }
    
    return () => {
      // Cleanup when component unmounts
      if (map) {
        setTimeout(() => {
          try {
            map.off();
            map.remove();
          } catch (e) {
            // Ignore errors during cleanup
          }
        }, 0);
      }
    };
  }, [map, setMapInstance]);

  return null;
}

export default function ResourcesMap({ ngos, userLocation, selectedNgoId, onMarkerClick }: ResourcesMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  
  
  // Get top 5 NGOs based on user location
  const top5Ngos = userLocation
    ? [...ngos].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)).slice(0, 5)
    : ngos.slice(0, 5);

  // Center map on user location or default to India
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [20.5937, 78.9629]; // Center of India

  const zoom = userLocation ? 11 : 5;

  // Managed by React-Leaflet's MapContainer; avoid manual Leaflet init to prevent container reuse

  // Center and open popup for selected NGO
  useEffect(() => {
    if (selectedNgoId && mapRef.current) {
      const marker = markerRefs.current.get(selectedNgoId);
      const ngo = ngos.find(n => n.id === selectedNgoId);
      if (marker && ngo) {
        mapRef.current.setView([ngo.lat, ngo.lng], 13, { animate: true });
        marker.openPopup();
      }
    }
  }, [selectedNgoId, ngos]);

  return (
    <div className="w-full h-[60vh] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        id="map"
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <CaptureMap onMap={(map) => { mapRef.current = map; }} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={100}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.4,
              }}
            />
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="text-sm font-medium">Your location</div>
              </Popup>
            </Marker>
          </>
        )}

        {/* NGO markers - showing top 5 based on location */}
        {top5Ngos.map((ngo) => (
          <Marker
            key={ngo.id}
            position={[ngo.lat, ngo.lng]}
            icon={ngoIcon}
            ref={(ref) => {
              if (ref) markerRefs.current.set(ngo.id, ref);
              else markerRefs.current.delete(ngo.id);
            }}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(ngo.id);
                }
              },
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                  {ngo.verified && (
                    <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                      ✓
                    </span>
                  )}
                </div>
                {ngo.distanceKm !== undefined && (
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDistance(ngo.distanceKm)} away
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  {ngo.contact && (
                    <a
                      href={`tel:${ngo.contact}`}
                      className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      📞 Call
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${ngo.lat},${ngo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    🗺️ Open in Maps
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
