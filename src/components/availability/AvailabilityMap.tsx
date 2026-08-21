"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  ZoomControl,
  Popup,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { Work } from "@/types/work";

interface SelectedPosition {
  latitude: number;
  longitude: number;
}

interface AvailabilityMapProps {
  works: Work[];

  /**
   * normal = Availability screen
   * pin    = Create Asset screen
   */
  mode?: "normal" | "pin";

  selectedPosition?: SelectedPosition | null;

  onMapClick?: (
    latitude: number,
    longitude: number
  ) => void;
}

const center: [number, number] = [
  20.259,
  81.294,
];

const boundary: [number, number][] = [
  [20.268, 81.286],
  [20.270, 81.300],
  [20.264, 81.309],
  [20.254, 81.311],
  [20.247, 81.302],
  [20.248, 81.290],
  [20.255, 81.284],
  [20.268, 81.286],
];

/* ----------------------------------------
   WORK MARKER
----------------------------------------- */

const workIcon = L.divIcon({
  className: "availability-work-marker",
  html: `
    <div
      style="
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: #246bdf;
        border: 2px solid white;
        box-shadow: 0 1px 4px rgba(0,0,0,.35);
      "
    ></div>
  `,
  iconSize: [13, 13],
  iconAnchor: [6.5, 6.5],
});

/* ----------------------------------------
   SELECTED / PIN MARKER
----------------------------------------- */

const selectedIcon = L.divIcon({
  className: "availability-selected-marker",
  html: `
    <div
      style="
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #0796d2;
        border: 3px solid white;
        box-shadow: 0 1px 5px rgba(0,0,0,.35);
      "
    ></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/* ----------------------------------------
   MAP CLICK HANDLER
----------------------------------------- */

interface MapClickHandlerProps {
  enabled: boolean;
  onMapClick?: (
    latitude: number,
    longitude: number
  ) => void;
}

function MapClickHandler({
  enabled,
  onMapClick,
}: MapClickHandlerProps) {
  useMapEvents({
    click(event) {
      if (!enabled) {
        return;
      }

      onMapClick?.(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
}

/* ----------------------------------------
   COMPONENT
----------------------------------------- */

export default function AvailabilityMap({
  works,
  mode = "normal",
  selectedPosition = null,
  onMapClick,
}: AvailabilityMapProps) {
  const isPinMode = mode === "pin";

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[6px] border border-[#cbdde8] bg-white shadow-[0_4px_16px_rgba(0,59,99,0.08)]">

      {/* =====================================
          TOP HEADER
      ====================================== */}

      <div className="shrink-0 border-b border-[#c9dce8] bg-[#f3f9fc]">

        {/* BRAND STRIPE */}

        <div className="flex h-[3px] w-full">
          <div className="flex-1 bg-[#075a91]" />
          <div className="w-[70px] bg-[#f58220]" />
        </div>

        {/* NORMAL MODE HEADER */}

        {!isPinMode && (
          <div className="flex h-9 items-center border-b border-[#d4e2eb] bg-[#eaf6fd] px-3">
            <span className="text-[12px] font-semibold text-[#0874b5]">
              Availability Map — Sureli, Kanker, Uttar Bastar, Chhattisgarh
            </span>
          </div>
        )}

      </div>

      {/* =====================================
          MAP AREA
      ====================================== */}

      <div className="relative min-h-0 flex-1">

        <MapContainer
          center={center}
          zoom={13}
          zoomControl={false}
          className="absolute inset-0 z-0 h-full w-full"
        >

          <ZoomControl position="topleft" />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* BLOCK BOUNDARY */}

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

          {/* MAP CLICK */}

          <MapClickHandler
            enabled={isPinMode}
            onMapClick={onMapClick}
          />

          {/* EXISTING WORK MARKERS */}

          {!isPinMode &&
            works.map((work) => {
              if (!work.location) {
                return null;
              }

              return (
                <Marker
                  key={work.id}
                  position={[
                    work.location.lat,
                    work.location.lng,
                  ]}
                  icon={workIcon}
                >
                  <Popup>
                    <div className="text-xs">

                      <div className="font-semibold">
                        {work.workName}
                      </div>

                      <div className="mt-1 text-slate-500">
                        {work.vgpId}
                      </div>

                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* SELECTED LOCATION */}

          {isPinMode && selectedPosition && (
            <Marker
              position={[
                selectedPosition.latitude,
                selectedPosition.longitude,
              ]}
              icon={selectedIcon}
              draggable={true}
              eventHandlers={{
                dragend(event) {
                  const marker =
                    event.target as L.Marker;

                  const position =
                    marker.getLatLng();

                  onMapClick?.(
                    position.lat,
                    position.lng
                  );
                },
              }}
            />
          )}

        </MapContainer>

        {/* =====================================
            LEGEND
        ====================================== */}

        {!isPinMode ? (
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
        ) : (
          <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">

            <div className="flex items-center gap-2 text-[9px] text-slate-600">
              <span className="h-2 w-2 rounded-full bg-[#0796d2]" />
              Pinned location (drag to adjust)
            </div>

          </div>
        )}

      </div>

    </div>
  );
}