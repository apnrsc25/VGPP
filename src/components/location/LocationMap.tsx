// "use client";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Circle,
//   useMap,
// } from "react-leaflet";

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import { useEffect } from "react";

// interface LocationMapProps {
//   latitude: number;
//   longitude: number;
//   zoom: number;
//   label: string;
// }

// const locationIcon = L.divIcon({
//   className: "location-selection-marker",
//   html: `
//     <div
//       style="
//         width:18px;
//         height:18px;
//         border-radius:50%;
//         background:#075a91;
//         border:3px solid white;
//         box-shadow:0 2px 10px rgba(0,59,99,.45);
//       "
//     ></div>
//   `,
//   iconSize: [18, 18],
//   iconAnchor: [9, 9],
// });

// function MapController({
//   latitude,
//   longitude,
//   zoom,
// }: {
//   latitude: number;
//   longitude: number;
//   zoom: number;
// }) {
//   const map = useMap();

//   useEffect(() => {
//     map.flyTo(
//       [latitude, longitude],
//       zoom,
//       {
//         animate: true,
//         duration: 1.2,
//       }
//     );
//   }, [
//     latitude,
//     longitude,
//     zoom,
//     map,
//   ]);

//   return null;
// }

// export default function LocationMap({
//   latitude,
//   longitude,
//   zoom,
//   label,
// }: LocationMapProps) {
//   return (
//     <div className="relative h-full min-h-0 w-full overflow-hidden">

//       <MapContainer
//         center={[latitude, longitude]}
//         zoom={zoom}
//         zoomControl={false}
//         className="absolute inset-0 h-full w-full"
//       >

//         <TileLayer
//           attribution="&copy; OpenStreetMap contributors"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <MapController
//           latitude={latitude}
//           longitude={longitude}
//           zoom={zoom}
//         />

//         <Marker
//           position={[
//             latitude,
//             longitude,
//           ]}
//           icon={locationIcon}
//         >
//           <Popup>
//             <div className="text-xs font-semibold">
//               {label}
//             </div>
//           </Popup>
//         </Marker>

//         <Circle
//           center={[
//             latitude,
//             longitude,
//           ]}
//           radius={5000}
//           pathOptions={{
//             color: "#075a91",
//             fillColor: "#075a91",
//             fillOpacity: 0.08,
//             weight: 2,
//           }}
//         />

//       </MapContainer>

//       {/* MAP LABEL */}

//       <div className="pointer-events-none absolute left-3 top-3 z-[1000]">
//         <div className="rounded-lg border border-white/60 bg-white/90 px-3 py-2 shadow-lg backdrop-blur">

//           <div className="text-[8px] font-bold uppercase tracking-[1px] text-[#f58220]">
//             CURRENT LOCATION
//           </div>

//           <div className="mt-0.5 text-[11px] font-extrabold text-[#003b63]">
//             {label}
//           </div>

//         </div>
//       </div>

//       {/* MAP STATUS */}

//       <div className="absolute bottom-3 right-3 z-[1000] rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[8px] font-semibold text-[#475569] shadow-md backdrop-blur">
//         GIS LOCATION VIEW
//       </div>

//     </div>
//   );
// }



"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* =====================================================
   TYPES
===================================================== */

interface LocationMapProps {
  latitude: number;
  longitude: number;
  zoom: number;
  label: string;

  level:
  | "state"
  | "district"
  | "block"
  | "panchayat";

  stateName?: string;
  districtName?: string;
  blockName?: string;
  panchayatName?: string;
  panchayatCode?: string;
}

interface BoundaryResponse {
  type: "FeatureCollection";
  features: any[];
}

/* =====================================================
   GIS CONFIG
===================================================== */

const GIS_BASE_URL =
  "https://mapservice.gov.in/mapserviceserv176/rest/services/Panchayat/AdminGPHierarchy/MapServer";

const LAYER_MAP = {
  state: 0,
  district: 1,
  block: 2,
  panchayat: 3,
} as const;

/* =====================================================
   SQL VALUE
===================================================== */

function escapeSql(value?: string) {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .replace(/'/g, "''")
}

/* =====================================================
   LOCATION MARKER
===================================================== */

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

/* =====================================================
   MAP CONTROLLER
===================================================== */

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
        duration: 1.1,
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

/* =====================================================
   BOUNDARY FIT CONTROLLER
===================================================== */

function BoundaryController({
  data,
}: {
  data: BoundaryResponse | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (
      !data ||
      !data.features ||
      data.features.length === 0
    ) {
      return;
    }

    const layer = L.geoJSON(
      data as any
    );

    const bounds = layer.getBounds();

    if (bounds.isValid()) {
      map.flyToBounds(
        bounds,
        {
          padding: [35, 35],

          // Different hierarchy levels
          // need different maximum zoom.
          maxZoom: 15,

          animate: true,
          duration: 1.1,
        }
      );
    }
  }, [
    data,
    map,
  ]);

  return null;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function LocationMap({
  latitude,
  longitude,
  zoom,
  label,
  level,
  stateName,
  districtName,
  blockName,
  panchayatName,
  panchayatCode,
}: LocationMapProps) {
  const [
    boundary,
    setBoundary,
  ] = useState<BoundaryResponse | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /* ===================================================
     BUILD GIS WHERE CLAUSE
  =================================================== */

  const where = useMemo(() => {
    if (!stateName) {
      return "";
    }

    const state =
      escapeSql(stateName).toUpperCase();

    /* =================================================
       STATE - LAYER 0

       Example:

       STNAME='JHARKHAND'
    ================================================= */

    if (level === "state") {
      return `STNAME='${state}'`;
    }

    /* =================================================
       DISTRICT - LAYER 1

       IMPORTANT:

       Your GIS service is returning Ranchi geometry
       with:

       stname='JHARKHAND'
       AND D_Pan_Name='RANCHI'

       NOT DTNAME='RANCHI'
    ================================================= */

    if (
      level === "district" &&
      districtName
    ) {
      const district = escapeSql(districtName).toUpperCase();

      return [
        `stname='${state}'`,
        `D_Pan_Name='${district}'`,
      ].join(" AND ");
    }
    /* =================================================
       BLOCK - LAYER 2

       Fields from Layer 2:

       state
       district
       block_name

       Example:

       state='JHARKHAND'
       AND district='RANCHI'
       AND block_name='KANKE'
    ================================================= */

    if (
      level === "block" &&
      districtName &&
      blockName
    ) {
      const district = escapeSql(districtName);
      const block = escapeSql(blockName).toUpperCase();

      return [
        `state='${state}'`,
        `district='${district}'`,
        `block_name='${block}'`,
      ].join(" AND ");
    }

    /* =================================================
       PANCHAYAT - LAYER 3

       Fields from Layer 3:

       STNAME
       DTNAME
       blkname
       GPNAME

       Example:

       STNAME='JHARKHAND'
       AND DTNAME='RANCHI'
       AND blkname='KANKE'
       AND GPNAME='K...'
    ================================================= */

    if (level === "panchayat" && panchayatCode) {
      return `GPCODE='${escapeSql(panchayatCode)}'`;
    }



    return "";
  }, [
    level,
    stateName,
    districtName,
    blockName,
    panchayatName,
    panchayatCode,
  ]);

  /* ===================================================
     LOAD GIS BOUNDARY
  =================================================== */

  useEffect(() => {
    if (!where) {
      setBoundary(null);
      setError("");
      return;
    }

    const controller =
      new AbortController();

    async function loadBoundary() {
      try {
        setLoading(true);
        setError("");
        setBoundary(null);

        const layer =
          LAYER_MAP[level];

        const params =
          new URLSearchParams({
            where,

            outFields: "*",

            returnGeometry: "true",

            outSR: "4326",

            f: "geojson",
          });

        const url =
          `${GIS_BASE_URL}/${layer}/query?${params.toString()}`;

        console.log(
          "================================="
        );

        console.log(
          "GIS LEVEL:",
          level
        );

        console.log(
          "GIS LAYER:",
          layer
        );

        console.log(
          "GIS WHERE:",
          where
        );

        console.log(
          "GIS URL:",
          url
        );

        console.log(
          "================================="
        );

        const response =
          await fetch(url, {
            method: "GET",
            cache: "no-store",
            signal:
              controller.signal,
          });

        if (!response.ok) {
          throw new Error(
            `GIS request failed: ${response.status}`
          );
        }

        const data =
          (await response.json()) as BoundaryResponse;

        console.log(
          "GIS FEATURES:",
          data?.features?.length ?? 0
        );

        console.log(
          "GIS DATA:",
          data
        );

        if (
          !data?.features ||
          data.features.length === 0
        ) {
          throw new Error(
            `No ${level} boundary found`
          );
        }

        setBoundary(data);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "GIS boundary error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load GIS boundary"
        );
      } finally {
        setLoading(false);
      }
    }

    loadBoundary();

    return () => {
      controller.abort();
    };
  }, [
    level,
    where,
  ]);

  /* ===================================================
     BOUNDARY STYLE
  =================================================== */

  const boundaryStyle =
    useMemo(() => {
      switch (level) {
        case "state":
          return {
            color: "#075a91",
            weight: 4,
            opacity: 1,
            fillColor: "#075a91",
            fillOpacity: 0.08,
          };

        case "district":
          return {
            color: "#f58220",
            weight: 4,
            opacity: 1,
            fillColor: "#f58220",
            fillOpacity: 0.09,
          };

        case "block":
          return {
            color: "#7c3aed",
            weight: 4,
            opacity: 1,
            fillColor: "#7c3aed",
            fillOpacity: 0.09,
          };

        case "panchayat":
          return {
            color: "#00875a",
            weight: 4,
            opacity: 1,
            fillColor: "#00875a",
            fillOpacity: 0.1,
            dashArray: "6 4",
          };

        default:
          return {
            color: "#075a91",
            weight: 3,
            opacity: 1,
            fillOpacity: 0.08,
          };
      }
    }, [
      level,
    ]);

  /* ===================================================
     RETURN
  =================================================== */

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">

      <MapContainer
        center={[
          latitude,
          longitude,
        ]}
        zoom={zoom}
        zoomControl={true}
        className="absolute inset-0 h-full w-full"
      >

        {/* =========================================
            BASE MAP
        ========================================= */}

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* =========================================
            NORMAL LOCATION MOVE
        ========================================= */}

        <MapController
          latitude={latitude}
          longitude={longitude}
          zoom={zoom}
        />

        {/* =========================================
            FIT SELECTED GIS BOUNDARY
        ========================================= */}

        <BoundaryController
          data={boundary}
        />

        {/* =========================================
            MARKER
        ========================================= */}

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

        {/* =========================================
            GIS BOUNDARY
        ========================================= */}

        {boundary && (
          <GeoJSON
            key={`${level}-${where}`}
            data={boundary as any}
            style={() =>
              boundaryStyle
            }
          />
        )}

      </MapContainer>

      {/* =========================================
          CURRENT LOCATION CARD
      ========================================= */}

      <div className="pointer-events-none absolute left-3 top-3 z-[1000]">

        <div className="rounded-lg border border-white/70 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">

          <div className="text-[8px] font-bold uppercase tracking-[1px] text-[#f58220]">
            CURRENT LOCATION
          </div>

          <div className="mt-0.5 text-[11px] font-extrabold text-[#003b63]">
            {label}
          </div>

          <div className="mt-1 text-[7px] font-semibold uppercase tracking-wide text-slate-400">
            {level} boundary
          </div>

        </div>

      </div>

      {/* =========================================
          LOADING
      ========================================= */}

      {loading && (
        <div className="absolute right-3 top-3 z-[1000] rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[8px] font-bold text-[#075a91] shadow-md">
          Loading {level} boundary...
        </div>
      )}

      {/* =========================================
          ERROR
      ========================================= */}

      {error && !loading && (
        <div className="absolute bottom-3 left-3 z-[1000] max-w-[320px] rounded-lg border border-red-200 bg-white/95 px-3 py-2 shadow-lg">

          <div className="text-[8px] font-bold uppercase tracking-wide text-red-600">
            GIS Boundary Error
          </div>

          <div className="mt-1 text-[8px] text-slate-500">
            {error}
          </div>

        </div>
      )}

      {/* =========================================
          LEGEND
      ========================================= */}

      <div className="absolute bottom-3 left-3 z-[900] rounded-lg border border-white/70 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">

        <div className="mb-1 text-[7px] font-extrabold uppercase tracking-wide text-[#003b63]">
          BOUNDARIES
        </div>

        <div className="flex items-center gap-2 text-[8px] text-slate-600">
          <span className="h-2 w-5 rounded-sm border-2 border-[#075a91]" />
          State
        </div>

        <div className="mt-1 flex items-center gap-2 text-[8px] text-slate-600">
          <span className="h-2 w-5 rounded-sm border-2 border-[#f58220]" />
          District
        </div>

        <div className="mt-1 flex items-center gap-2 text-[8px] text-slate-600">
          <span className="h-2 w-5 rounded-sm border-2 border-[#7c3aed]" />
          Block
        </div>

        <div className="mt-1 flex items-center gap-2 text-[8px] text-slate-600">
          <span className="h-2 w-5 rounded-sm border-2 border-[#00875a]" />
          Gram Panchayat
        </div>

      </div>

      {/* =========================================
          GIS STATUS
      ========================================= */}

      <div className="absolute bottom-3 right-3 z-[900] rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[8px] font-semibold text-[#475569] shadow-md backdrop-blur">
        GIS ADMINISTRATIVE VIEW
      </div>

    </div>
  );
}