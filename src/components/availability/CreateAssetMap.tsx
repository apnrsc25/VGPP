"use client";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CreateAssetMapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

const center: [number, number] = [
  15.255,
  75.125,
];

const boundary: [number, number][] = [
  [15.29, 75.10],
  [15.31, 75.15],
  [15.28, 75.17],
  [15.22, 75.16],
  [15.20, 75.11],
  [15.24, 75.09],
  [15.29, 75.10],
];

const pinnedIcon = L.divIcon({
  className: "create-work-marker",
  html: `
    <div
      style="
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #087dcc;
        border: 3px solid white;
        box-shadow: 0 1px 5px rgba(0,0,0,.35);
      "
    ></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface MapClickProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

function MapClickHandler({
  onLocationSelect,
}: MapClickProps) {
  useMapEvents({
    click(event) {
      onLocationSelect?.(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
}

interface SelectedLocation {
  lat: number;
  lng: number;
}

export default function CreateAssetMap({
  onLocationSelect,
}: CreateAssetMapProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#dce4eb] bg-white">
      {/* MAP INSTRUCTION */}
      <div className="flex h-9 shrink-0 items-center border-b border-[#d4e2eb] bg-[#eaf6fd] px-3">
        <span className="text-[12px] font-semibold text-[#0874b5]">
          Click on the map to pin the work location
        </span>
      </div>

      {/* MAP */}
      <div className="relative min-h-0 flex-1">
        <MapContainer
          center={center}
          zoom={11}
          zoomControl={false}
          className="absolute inset-0 h-full w-full"
        >
          <ZoomControl position="topleft" />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polygon
            positions={boundary}
            pathOptions={{
              color: "#7c3cff",
              weight: 2,
              dashArray: "6 5",
              fillColor: "#8b5cf6",
              fillOpacity: 0.04,
            }}
          />

          <MapClickHandler
            onLocationSelect={onLocationSelect}
          />
        </MapContainer>

        {/* LEGEND */}
        <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
          <div className="mb-1 text-[9px] font-semibold text-slate-500">
            LEGEND
          </div>

          <div className="flex items-center gap-2 text-[9px] text-slate-600">
            <span className="h-2 w-2 rounded-full bg-[#246bdf]" />
            Work instance
          </div>

          <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-600">
            <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
            Manually added
          </div>
        </div>
      </div>
    </div>
  );
}