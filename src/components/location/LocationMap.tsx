"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  zoom: number;
  label: string;
}

const locationIcon = L.divIcon({
  className: "location-selection-marker",
  html: `
    <div
      style="
        width:18px;
        height:18px;
        border-radius:50%;
        background:#075a91;
        border:3px solid white;
        box-shadow:0 2px 10px rgba(0,59,99,.45);
      "
    ></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function MapController({
  latitude,
  longitude,
  zoom,
}: {
  latitude: number;
  longitude: number;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(
      [latitude, longitude],
      zoom,
      {
        animate: true,
        duration: 1.2,
      }
    );
  }, [
    latitude,
    longitude,
    zoom,
    map,
  ]);

  return null;
}

export default function LocationMap({
  latitude,
  longitude,
  zoom,
  label,
}: LocationMapProps) {
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">

      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        zoomControl={false}
        className="absolute inset-0 h-full w-full"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          latitude={latitude}
          longitude={longitude}
          zoom={zoom}
        />

        <Marker
          position={[
            latitude,
            longitude,
          ]}
          icon={locationIcon}
        >
          <Popup>
            <div className="text-xs font-semibold">
              {label}
            </div>
          </Popup>
        </Marker>

        <Circle
          center={[
            latitude,
            longitude,
          ]}
          radius={5000}
          pathOptions={{
            color: "#075a91",
            fillColor: "#075a91",
            fillOpacity: 0.08,
            weight: 2,
          }}
        />

      </MapContainer>

      {/* MAP LABEL */}

      <div className="pointer-events-none absolute left-3 top-3 z-[1000]">
        <div className="rounded-lg border border-white/60 bg-white/90 px-3 py-2 shadow-lg backdrop-blur">

          <div className="text-[8px] font-bold uppercase tracking-[1px] text-[#f58220]">
            CURRENT LOCATION
          </div>

          <div className="mt-0.5 text-[11px] font-extrabold text-[#003b63]">
            {label}
          </div>

        </div>
      </div>

      {/* MAP STATUS */}

      <div className="absolute bottom-3 right-3 z-[1000] rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[8px] font-semibold text-[#475569] shadow-md backdrop-blur">
        GIS LOCATION VIEW
      </div>

    </div>
  );
}