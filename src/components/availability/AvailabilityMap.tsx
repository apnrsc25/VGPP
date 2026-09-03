// "use client";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polygon,
//   ZoomControl,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import type { Work } from "@/types/work";

// interface SelectedPosition {
//   latitude: number;
//   longitude: number;
// }

// interface AvailabilityMapProps {
//   works: Work[];

//   /**
//    * normal = Availability screen
//    * pin    = Create Asset screen
//    */
//   mode?: "normal" | "pin";

//   selectedPosition?: SelectedPosition | null;

//   onMapClick?: (
//     latitude: number,
//     longitude: number
//   ) => void;
// }

// const center: [number, number] = [
//   20.259,
//   81.294,
// ];

// const boundary: [number, number][] = [
//   [20.268, 81.286],
//   [20.270, 81.300],
//   [20.264, 81.309],
//   [20.254, 81.311],
//   [20.247, 81.302],
//   [20.248, 81.290],
//   [20.255, 81.284],
//   [20.268, 81.286],
// ];

// /* ----------------------------------------
//    WORK MARKER
// ----------------------------------------- */

// const workIcon = L.divIcon({
//   className: "availability-work-marker",
//   html: `
//     <div
//       style="
//         width: 13px;
//         height: 13px;
//         border-radius: 50%;
//         background: #246bdf;
//         border: 2px solid white;
//         box-shadow: 0 1px 4px rgba(0,0,0,.35);
//       "
//     ></div>
//   `,
//   iconSize: [13, 13],
//   iconAnchor: [6.5, 6.5],
// });

// /* ----------------------------------------
//    SELECTED / PIN MARKER
// ----------------------------------------- */

// const selectedIcon = L.divIcon({
//   className: "availability-selected-marker",
//   html: `
//     <div
//       style="
//         width: 18px;
//         height: 18px;
//         border-radius: 50%;
//         background: #0796d2;
//         border: 3px solid white;
//         box-shadow: 0 1px 5px rgba(0,0,0,.35);
//       "
//     ></div>
//   `,
//   iconSize: [18, 18],
//   iconAnchor: [9, 9],
// });

// /* ----------------------------------------
//    MAP CLICK HANDLER
// ----------------------------------------- */

// interface MapClickHandlerProps {
//   enabled: boolean;
//   onMapClick?: (
//     latitude: number,
//     longitude: number
//   ) => void;
// }

// function MapClickHandler({
//   enabled,
//   onMapClick,
// }: MapClickHandlerProps) {
//   useMapEvents({
//     click(event) {
//       if (!enabled) {
//         return;
//       }

//       onMapClick?.(
//         event.latlng.lat,
//         event.latlng.lng
//       );
//     },
//   });

//   return null;
// }

// /* ----------------------------------------
//    COMPONENT
// ----------------------------------------- */

// export default function AvailabilityMap({
//   works,
//   mode = "normal",
//   selectedPosition = null,
//   onMapClick,
// }: AvailabilityMapProps) {
//   const isPinMode = mode === "pin";

//   return (
//     <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[6px] border border-[#cbdde8] bg-white shadow-[0_4px_16px_rgba(0,59,99,0.08)]">

//       {/* =====================================
//           TOP HEADER
//       ====================================== */}

//       <div className="shrink-0 border-b border-[#c9dce8] bg-[#f3f9fc]">

//         {/* BRAND STRIPE */}

//         <div className="flex h-[3px] w-full">
//           <div className="flex-1 bg-[#075a91]" />
//           <div className="w-[70px] bg-[#f58220]" />
//         </div>

//         {/* NORMAL MODE HEADER */}

//         {!isPinMode && (
//           <div className="flex h-9 items-center border-b border-[#d4e2eb] bg-[#eaf6fd] px-3">
//             <span className="text-[12px] font-semibold text-[#0874b5]">
//               Availability Map — Sureli, Kanker, Uttar Bastar, Chhattisgarh
//             </span>
//           </div>
//         )}

//       </div>

//       {/* =====================================
//           MAP AREA
//       ====================================== */}

//       <div className="relative min-h-0 flex-1">

//         <MapContainer
//           center={center}
//           zoom={13}
//           zoomControl={false}
//           className="absolute inset-0 z-0 h-full w-full"
//         >

//           <ZoomControl position="topleft" />

//           <TileLayer
//             attribution="&copy; OpenStreetMap contributors"
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           {/* BLOCK BOUNDARY */}

//           <Polygon
//             positions={boundary}
//             pathOptions={{
//               color: "#7c3cff",
//               weight: 2,
//               dashArray: "6 5",
//               fillColor: "#8b5cf6",
//               fillOpacity: 0.04,
//             }}
//           />

//           {/* MAP CLICK */}

//           <MapClickHandler
//             enabled={isPinMode}
//             onMapClick={onMapClick}
//           />

//           {/* EXISTING WORK MARKERS */}

//           {!isPinMode &&
//             works.map((work) => {
//               if (!work.location) {
//                 return null;
//               }

//               return (
//                 <Marker
//                   key={work.id}
//                   position={[
//                     work.location.lat,
//                     work.location.lng,
//                   ]}
//                   icon={workIcon}
//                 >
//                   <Popup>
//                     <div className="text-xs">

//                       <div className="font-semibold">
//                         {work.workName}
//                       </div>

//                       <div className="mt-1 text-slate-500">
//                         {work.vgpId}
//                       </div>

//                     </div>
//                   </Popup>
//                 </Marker>
//               );
//             })}

//           {/* SELECTED LOCATION */}

//           {isPinMode && selectedPosition && (
//             <Marker
//               position={[
//                 selectedPosition.latitude,
//                 selectedPosition.longitude,
//               ]}
//               icon={selectedIcon}
//               draggable={true}
//               eventHandlers={{
//                 dragend(event) {
//                   const marker =
//                     event.target as L.Marker;

//                   const position =
//                     marker.getLatLng();

//                   onMapClick?.(
//                     position.lat,
//                     position.lng
//                   );
//                 },
//               }}
//             />
//           )}

//         </MapContainer>

//         {/* =====================================
//             LEGEND
//         ====================================== */}

//         {!isPinMode ? (
//           <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">

//             <div className="mb-1 text-[9px] font-semibold text-slate-500">
//               LEGEND
//             </div>

//             <div className="flex items-center gap-2 text-[9px] text-slate-600">
//               <span className="h-2 w-2 rounded-full bg-[#246bdf]" />
//               Work instance
//             </div>

//             <div className="mt-1 flex items-center gap-2 text-[9px] text-slate-600">
//               <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
//               Manually added
//             </div>

//           </div>
//         ) : (
//           <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">

//             <div className="flex items-center gap-2 text-[9px] text-slate-600">
//               <span className="h-2 w-2 rounded-full bg-[#0796d2]" />
//               Pinned location (drag to adjust)
//             </div>

//           </div>
//         )}

//       </div>

//     </div>
//   );
// }





"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  Popup,
  useMapEvents,
  GeoJSON,
  useMap,
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
  mode?: "normal" | "pin";
  selectedPosition?: SelectedPosition | null;
  onMapClick?: (latitude: number, longitude: number) => void;
}

interface SessionLocation {
  state: string;
  district: string;
  block: string;
  panchayat: string;
}

interface GeoFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSON.Feature[];
}

const DEFAULT_LOCATION: SessionLocation = {
  state: "Chhattisgarh",
  district: "Uttar Bastar",
  block: "Kanker",
  panchayat: "Sureli",
};

const DEFAULT_CENTER: [number, number] = [
  20.258828,
  81.293894,
];

const DEFAULT_ZOOM = 13;

const workIcon = L.divIcon({
  className: "availability-work-marker",
  html: `<div style="width:13px;height:13px;border-radius:50%;background:#246bdf;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35);"></div>`,
  iconSize: [13, 13],
  iconAnchor: [6.5, 6.5],
});

const selectedIcon = L.divIcon({
  className: "availability-selected-marker",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#0796d2;border:3px solid white;box-shadow:0 1px 5px rgba(0,0,0,.35);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function normalize(value?: string) {
  return (value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}

function getProperty(
  properties: Record<string, unknown>,
  keys: string[]
) {
  for (const key of keys) {
    const value = properties[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return String(value);
    }
  }

  return "";
}

function matchesPanchayat(
  feature: GeoJSON.Feature,
  panchayatName: string
) {
  const properties =
    (feature.properties ?? {}) as Record<
      string,
      unknown
    >;

  const wanted = normalize(panchayatName);

  const geoName = normalize(
    getProperty(properties, [
      "name",
      "NAME",
      "Name",
      "panchayat",
      "PANCHAYAT",
      "panchayat_name",
      "PANCHAYAT_NAME",
      "gp_name",
      "GP_NAME",
      "gpname",
      "GPName",
      "locality",
      "LOCALITY",
    ])
  );

  if (!geoName || !wanted) {
    return false;
  }

  const cleanGeoName = geoName
    .replace(/\s+GRAM\s+PANCHAYAT$/i, "")
    .replace(/\s+GRAM\s+PANCHAYAT$/i, "")
    .replace(/\s+GP$/i, "")
    .trim();

  const cleanWanted = wanted
    .replace(/\s+GRAM\s+PANCHAYAT$/i, "")
    .replace(/\s+GP$/i, "")
    .trim();

  return (
    geoName === wanted ||
    geoName === `${wanted} GP` ||
    geoName === `${wanted} GRAM PANCHAYAT` ||
    cleanGeoName === cleanWanted
  );
}

function PanchayatBounds({
  feature,
}: {
  feature: GeoJSON.Feature | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!feature) {
      return;
    }

    try {
      const layer = L.geoJSON(feature);
      const bounds = layer.getBounds();

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [40, 40],
          maxZoom: 15,
        });
      }
    } catch (error) {
      console.error(
        "Panchayat boundary zoom failed:",
        error
      );
    }
  }, [map, feature]);

  return null;
}

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

export default function AvailabilityMap({
  works,
  mode = "normal",
  selectedPosition = null,
  onMapClick,
}: AvailabilityMapProps) {
  const isPinMode = mode === "pin";

  const [location, setLocation] =
    useState<SessionLocation>(
      DEFAULT_LOCATION
    );

  const [panchayatGeoJson, setPanchayatGeoJson] =
    useState<GeoFeatureCollection | null>(null);

  const [geoLoading, setGeoLoading] =
    useState(true);

  const [geoError, setGeoError] =
    useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const readLocation = () => {
      try {
        const stored =
          sessionStorage.getItem(
            "vgpp_location"
          );

        if (!stored) {
          setLocation(DEFAULT_LOCATION);
          return;
        }

        const parsed = JSON.parse(
          stored
        ) as Partial<SessionLocation>;

        setLocation({
          state:
            parsed.state ||
            DEFAULT_LOCATION.state,
          district:
            parsed.district ||
            DEFAULT_LOCATION.district,
          block:
            parsed.block ||
            DEFAULT_LOCATION.block,
          panchayat:
            parsed.panchayat ||
            DEFAULT_LOCATION.panchayat,
        });
      } catch (error) {
        console.error(
          "Location session read failed:",
          error
        );

        setLocation(DEFAULT_LOCATION);
      }
    };

    readLocation();

    const handleLocationChange = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<SessionLocation>;

      if (customEvent.detail) {
        setLocation({
          state:
            customEvent.detail.state ||
            DEFAULT_LOCATION.state,
          district:
            customEvent.detail.district ||
            DEFAULT_LOCATION.district,
          block:
            customEvent.detail.block ||
            DEFAULT_LOCATION.block,
          panchayat:
            customEvent.detail.panchayat ||
            DEFAULT_LOCATION.panchayat,
        });
      } else {
        readLocation();
      }
    };

    window.addEventListener(
      "vgpp-location-change",
      handleLocationChange
    );

    return () => {
      window.removeEventListener(
        "vgpp-location-change",
        handleLocationChange
      );
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPanchayatGeoJson() {
      setGeoLoading(true);
      setGeoError(false);

      try {
        const response = await fetch(
          "/geo/Sureli_GP.geojson",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `GeoJSON request failed: ${response.status}`
          );
        }

        const data =
          (await response.json()) as GeoFeatureCollection;

        if (cancelled) {
          return;
        }

        if (
          !data ||
          data.type !== "FeatureCollection" ||
          !Array.isArray(data.features)
        ) {
          throw new Error(
            "Invalid Panchayat GeoJSON"
          );
        }

        setPanchayatGeoJson(data);
      } catch (error) {
        console.error(
          "Panchayat GeoJSON loading failed:",
          error
        );

        if (!cancelled) {
          setPanchayatGeoJson(null);
          setGeoError(true);
        }
      } finally {
        if (!cancelled) {
          setGeoLoading(false);
        }
      }
    }

    loadPanchayatGeoJson();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedPanchayat = useMemo(() => {
    if (
      !panchayatGeoJson ||
      !location.panchayat
    ) {
      return null;
    }

    const feature =
      panchayatGeoJson.features.find(
        (item) =>
          matchesPanchayat(
            item,
            location.panchayat
          )
      );

    return feature ?? null;
  }, [
    panchayatGeoJson,
    location.panchayat,
  ]);

  const panchayatStyle = {
    color: "#f58220",
    weight: 5,
    opacity: 1,
    fillColor: "#f58220",
    fillOpacity: 0.22,
  };

  const geotaggedWorks = works.filter(
    (work) =>
      work.location &&
      typeof work.location.lat === "number" &&
      typeof work.location.lng === "number"
  );

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[6px] border border-[#cbdde8] bg-white shadow-[0_4px_16px_rgba(0,59,99,0.08)]">

      <div className="shrink-0 border-b border-[#c9dce8] bg-[#f3f9fc]">

        <div className="flex h-[3px] w-full">
          <div className="flex-1 bg-[#075a91]" />
          <div className="w-[70px] bg-[#f58220]" />
        </div>

        {!isPinMode && (
          <div className="flex h-9 items-center border-b border-[#d4e2eb] bg-[#eaf6fd] px-3">
            <span className="truncate text-[12px] font-semibold text-[#0874b5]">
              Availability Map —{" "}
              {location.panchayat},{" "}
              {location.block},{" "}
              {location.district},{" "}
              {location.state}
            </span>
          </div>
        )}

      </div>

      <div className="relative min-h-0 flex-1">

        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          zoomControl={false}
          className="absolute inset-0 z-0 h-full w-full"
        >

          <ZoomControl position="topleft" />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {selectedPanchayat && (
            <>
              <GeoJSON
                key={`panchayat-${location.panchayat}`}
                data={selectedPanchayat}
                style={() => panchayatStyle}
              />

              <PanchayatBounds
                feature={selectedPanchayat}
              />
            </>
          )}

          <MapClickHandler
            enabled={isPinMode}
            onMapClick={onMapClick}
          />

          {!isPinMode &&
            geotaggedWorks.map((work) => (
              <Marker
                key={work.id}
                position={[
                  work.location!.lat,
                  work.location!.lng,
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
            ))}

          {isPinMode &&
            selectedPosition && (
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

        {!isPinMode && (
          <div className="absolute left-3 top-3 z-[1000] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur">

            <div className="mb-1 text-[8px] font-extrabold uppercase tracking-[0.5px] text-[#075a91]">
              Selected Area
            </div>

            <div className="space-y-0.5 text-[8px]">
              <div>
                <span className="text-slate-400">
                  State:{" "}
                </span>
                <span className="font-bold text-[#36566b]">
                  {location.state}
                </span>
              </div>

              <div>
                <span className="text-slate-400">
                  District:{" "}
                </span>
                <span className="font-bold text-[#36566b]">
                  {location.district}
                </span>
              </div>

              <div>
                <span className="text-slate-400">
                  Block:{" "}
                </span>
                <span className="font-bold text-[#36566b]">
                  {location.block}
                </span>
              </div>

              <div>
                <span className="text-slate-400">
                  Panchayat:{" "}
                </span>
                <span className="font-bold text-[#f58220]">
                  {location.panchayat}
                </span>
              </div>
            </div>

          </div>
        )}

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
              <span className="h-2 w-2 rounded-full bg-[#f58220]" />
              {location.panchayat} boundary
            </div>

            {geoLoading && (
              <div className="mt-1 text-[8px] text-slate-400">
                Loading boundary...
              </div>
            )}

            {!geoLoading &&
              !selectedPanchayat && (
                <div className="mt-1 text-[8px] font-semibold text-red-500">
                  {location.panchayat} boundary not found
                </div>
              )}

            {geoError && (
              <div className="mt-1 text-[8px] font-semibold text-red-500">
                GeoJSON unavailable
              </div>
            )}

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