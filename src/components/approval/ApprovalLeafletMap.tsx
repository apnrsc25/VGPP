// "use client";

// import { useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   CircleMarker,
//   Popup,
//   useMap,
//   ZoomControl,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// interface SelectedWork {
//   id: string;
//   workName: string;
//   theme: string;
//   subTheme: string;
//   type: string;
//   geotagged: boolean;
//   latitude?: number;
//   longitude?: number;
// }

// interface ApprovalLeafletMapProps {
//   proposalId: string;
//   selectedWorks: SelectedWork[];
// }

// const DEFAULT_CENTER: [number, number] = [
//   20.259,
//   81.294,
// ];

// function MapBounds({
//   works,
// }: {
//   works: SelectedWork[];
// }) {
//   const map = useMap();

//   useEffect(() => {
//     const points = works
//       .filter(
//         (work) =>
//           typeof work.latitude === "number" &&
//           typeof work.longitude === "number"
//       )
//       .map(
//         (work) =>
//           [
//             work.latitude as number,
//             work.longitude as number,
//           ] as [number, number]
//       );

//     if (points.length === 0) {
//       map.setView(DEFAULT_CENTER, 11);
//       return;
//     }

//     if (points.length === 1) {
//       map.setView(points[0], 15);
//       return;
//     }

//     const bounds = L.latLngBounds(points);
//     map.fitBounds(bounds, {
//       padding: [45, 45],
//       maxZoom: 15,
//     });
//   }, [map, works]);

//   return null;
// }

// function getThemeColor(theme: string) {
//   if (theme === "Water Security") {
//     return "#f58220";
//   }

//   if (theme === "Rural Infrastructure") {
//     return "#7c3aed";
//   }

//   if (theme === "Livelihood Infrastructure") {
//     return "#00875a";
//   }

//   if (theme === "Climate Resilience") {
//     return "#0879b1";
//   }

//   return "#64748b";
// }

// function createMarkerIcon(theme: string) {
//   const color = getThemeColor(theme);

//   return L.divIcon({
//     className: "approval-work-marker",
//     html: `
//       <div style="
//         width:28px;
//         height:28px;
//         border-radius:50% 50% 50% 0;
//         background:${color};
//         border:3px solid white;
//         box-shadow:0 3px 10px rgba(0,0,0,0.25);
//         transform:rotate(-45deg);
//         display:flex;
//         align-items:center;
//         justify-content:center;
//       ">
//         <div style="
//           width:7px;
//           height:7px;
//           border-radius:50%;
//           background:white;
//           transform:rotate(45deg);
//         "></div>
//       </div>
//     `,
//     iconSize: [28, 28],
//     iconAnchor: [14, 28],
//     popupAnchor: [0, -28],
//   });
// }

// export default function ApprovalLeafletMap({
//   proposalId,
//   selectedWorks,
// }: ApprovalLeafletMapProps) {
//   const geotaggedWorks = selectedWorks.filter(
//     (work) =>
//       work.geotagged &&
//       typeof work.latitude === "number" &&
//       typeof work.longitude === "number"
//   );

//   return (
//     <MapContainer
//       center={DEFAULT_CENTER}
//       zoom={11}
//       zoomControl={false}
//       className="h-full w-full"
//       style={{
//         minHeight: "100%",
//         background: "#eaf1f4",
//       }}
//     >

//       <ZoomControl position="bottomright" />


//       {/* BASE MAP */}

//       <TileLayer
//         attribution='&copy; OpenStreetMap contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />


//       {/* MAP BOUNDARY */}

//       <MapBounds works={geotaggedWorks} />


//       {/* WORK MARKERS */}

//       {geotaggedWorks.map((work) => (

//         <CircleMarker
//           key={work.id}
//           center={[
//             work.latitude as number,
//             work.longitude as number,
//           ]}
//           radius={7}
//           pathOptions={{
//             color: "#ffffff",
//             weight: 3,
//             fillColor: getThemeColor(work.theme),
//             fillOpacity: 1,
//           }}
//         >

//           <Popup>

//             <div className="min-w-[190px]">

//               <div className="mb-2 border-b border-slate-200 pb-2">

//                 <p className="text-[11px] font-extrabold text-[#183b56]">
//                   {work.workName}
//                 </p>

//                 <p className="mt-0.5 text-[8px] text-slate-400">
//                   {work.id}
//                 </p>

//               </div>


//               <div className="space-y-1.5">

//                 <div className="flex justify-between gap-3">
//                   <span className="text-[8px] text-slate-400">
//                     Theme
//                   </span>

//                   <span className="text-right text-[8px] font-bold text-[#36566b]">
//                     {work.theme}
//                   </span>
//                 </div>


//                 <div className="flex justify-between gap-3">
//                   <span className="text-[8px] text-slate-400">
//                     Sub Theme
//                   </span>

//                   <span className="text-right text-[8px] font-bold text-[#36566b]">
//                     {work.subTheme}
//                   </span>
//                 </div>


//                 <div className="flex justify-between gap-3">
//                   <span className="text-[8px] text-slate-400">
//                     Type
//                   </span>

//                   <span className="text-right text-[8px] font-bold text-[#36566b]">
//                     {work.type}
//                   </span>
//                 </div>

//               </div>


//               <div className="mt-2 border-t border-slate-200 pt-2">

//                 <p className="text-[7px] text-slate-400">
//                   Proposal
//                 </p>

//                 <p className="font-mono text-[7px] font-bold text-[#075a91]">
//                   {proposalId}
//                 </p>

//               </div>

//             </div>

//           </Popup>

//         </CircleMarker>

//       ))}

//     </MapContainer>
//   );
// }




"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  ZoomControl,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface SelectedWork {
  id: string;
  workName: string;
  theme: string;
  subTheme: string;
  type: string;
  geotagged: boolean;
  latitude?: number;
  longitude?: number;
}

interface ApprovalLeafletMapProps {
  proposalId: string;
  selectedWorks: SelectedWork[];
}

interface ProposalLocation {
  proposalId?: string;
  state?: {
    id?: string;
    name?: string;
  };
  district?: {
    id?: string;
    name?: string;
  };
  block?: {
    id?: string;
    name?: string;
  };
  panchayat?: {
    id?: string;
    name?: string;
    gpcode?: string;
  };
}

interface GeoFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSON.Feature[];
}

const DEFAULT_CENTER: [number, number] = [
  21.2787,
  81.8661,
];

const DEFAULT_ZOOM = 7;

function MapBounds({
  works,
  hierarchyBounds,
}: {
  works: SelectedWork[];
  hierarchyBounds: L.LatLngBounds | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points = works
      .filter(
        (work) =>
          typeof work.latitude === "number" &&
          typeof work.longitude === "number"
      )
      .map(
        (work) =>
          [
            work.latitude as number,
            work.longitude as number,
          ] as [number, number]
      );

    if (hierarchyBounds && hierarchyBounds.isValid()) {
      map.fitBounds(hierarchyBounds, {
        padding: [35, 35],
        maxZoom: 15,
      });
      return;
    }

    if (points.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }

    map.fitBounds(L.latLngBounds(points), {
      padding: [45, 45],
      maxZoom: 15,
    });
  }, [map, works, hierarchyBounds]);

  return null;
}

function getThemeColor(theme: string) {
  if (theme === "Water Security") {
    return "#f58220";
  }

  if (theme === "Rural Infrastructure") {
    return "#7c3aed";
  }

  if (theme === "Livelihood Infrastructure") {
    return "#00875a";
  }

  if (theme === "Climate Resilience") {
    return "#0879b1";
  }

  return "#64748b";
}

function createMarkerIcon(theme: string) {
  const color = getThemeColor(theme);

  return L.divIcon({
    className: "approval-work-marker",
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${color};border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.25);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;"><div style="width:7px;height:7px;border-radius:50%;background:white;transform:rotate(45deg);"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function normalize(value?: string) {
  return (value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}

function findDistrict(
  data: GeoFeatureCollection,
  districtName: string
) {
  const wanted = normalize(districtName);

  return data.features.find((feature) => {
    const name = normalize(
      feature.properties?.name as string
    );

    return name === wanted;
  });
}

function findBlock(
  data: GeoFeatureCollection,
  districtName: string,
  blockName: string
) {
  const wantedDistrict = normalize(districtName);
  const wantedBlock = normalize(blockName);

  return data.features.find((feature) => {
    const properties = feature.properties ?? {};

    const featureDistrict = normalize(
      properties.district as string
    );

    const featureBlock = normalize(
      properties.block_name as string
    );

    return (
      featureDistrict === wantedDistrict &&
      featureBlock === wantedBlock
    );
  });
}

function getFeatureBounds(
  features: GeoJSON.Feature[]
) {
  const bounds = L.latLngBounds([]);

  features.forEach((feature) => {
    try {
      const layer = L.geoJSON(feature);

      const layerBounds = layer.getBounds();

      if (layerBounds.isValid()) {
        bounds.extend(layerBounds);
      }
    } catch {
      // Ignore invalid geometry.
    }
  });

  return bounds.isValid() ? bounds : null;
}

export default function ApprovalLeafletMap({
  proposalId,
  selectedWorks,
}: ApprovalLeafletMapProps) {
  const [location, setLocation] =
    useState<ProposalLocation | null>(null);

  const [stateGeoJson, setStateGeoJson] =
    useState<GeoFeatureCollection | null>(null);

  const [districtGeoJson, setDistrictGeoJson] =
    useState<GeoFeatureCollection | null>(null);

  const [blockGeoJson, setBlockGeoJson] =
    useState<GeoFeatureCollection | null>(null);

  const [panchayatGeoJson, setPanchayatGeoJson] =
    useState<GeoFeatureCollection | null>(null);

  const [geoError, setGeoError] =
    useState(false);

  useEffect(() => {
    const storedLocation =
      sessionStorage.getItem(
        `proposal_location_${proposalId}`
      );

    if (!storedLocation) {
      return;
    }

    try {
      const parsed =
        JSON.parse(storedLocation) as ProposalLocation;

      setLocation(parsed);
    } catch {
      setLocation(null);
    }
  }, [proposalId]);

  useEffect(() => {
    let cancelled = false;

    async function loadGeoData() {
      try {
        const [
          stateResponse,
          districtResponse,
          blockResponse,
          panchayatResponse,
        ] = await Promise.all([
          fetch("/geo/State_CG.geojson"),
          fetch("/geo/District_CG.geojson"),
          fetch("/geo/Block_CG.geojson"),
          fetch("/geo/Sureli_GP.geojson"),
        ]);

        if (
          !stateResponse.ok ||
          !districtResponse.ok ||
          !blockResponse.ok ||
          !panchayatResponse.ok
        ) {
          throw new Error(
            "GIS files could not be loaded"
          );
        }

        const [
          stateData,
          districtData,
          blockData,
          panchayatData,
        ] = await Promise.all([
          stateResponse.json(),
          districtResponse.json(),
          blockResponse.json(),
          panchayatResponse.json(),
        ]);

        if (cancelled) {
          return;
        }

        setStateGeoJson(stateData);
        setDistrictGeoJson(districtData);
        setBlockGeoJson(blockData);
        setPanchayatGeoJson(panchayatData);
      } catch (error) {
        console.error(
          "GIS data loading failed:",
          error
        );

        if (!cancelled) {
          setGeoError(true);
        }
      }
    }

    loadGeoData();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedDistrict = useMemo(() => {
    if (
      !districtGeoJson ||
      !location?.district?.name
    ) {
      return null;
    }

    return findDistrict(
      districtGeoJson,
      location.district.name
    );
  }, [districtGeoJson, location]);

  const selectedBlock = useMemo(() => {
    if (
      !blockGeoJson ||
      !location?.district?.name ||
      !location?.block?.name
    ) {
      return null;
    }

    return findBlock(
      blockGeoJson,
      location.district.name,
      location.block.name
    );
  }, [blockGeoJson, location]);

  const selectedPanchayat = useMemo(() => {
    if (!panchayatGeoJson || !location?.panchayat?.name) {
      return null;
    }

    const wanted = normalize(location.panchayat.name);

    return panchayatGeoJson.features.find((feature) => {
      const properties = feature.properties ?? {};

      const names = [
        properties.name,
        properties.panchayat,
        properties.gp_name,
        properties.gpname,
        properties.gpName,
      ]
        .filter(Boolean)
        .map((value) => normalize(String(value)));

      return names.some((name) => name === wanted || name === `${wanted} GP`);
    }) ?? null;
  }, [panchayatGeoJson, location]);

  const hierarchyBounds = useMemo(() => {
    const features: GeoJSON.Feature[] = [];

    if (selectedDistrict) {
      features.push(selectedDistrict);
    }

    if (selectedBlock) {
      features.push(selectedBlock);
    }

    if (selectedPanchayat) {
      features.push(selectedPanchayat);
    }

    return getFeatureBounds(features);
  }, [
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
  ]);

  const geotaggedWorks = selectedWorks.filter(
    (work) =>
      work.geotagged &&
      typeof work.latitude === "number" &&
      typeof work.longitude === "number"
  );

  const stateStyle = {
    color: "#075a91",
    weight: 2,
    fillColor: "#075a91",
    fillOpacity: 0.03,
  };

  const districtStyle = {
    color: "#0879b1",
    weight: 3,
    fillColor: "#0879b1",
    fillOpacity: 0.08,
  };

  const blockStyle = {
    color: "#7c3aed",
    weight: 3,
    dashArray: "8 6",
    fillColor: "#7c3aed",
    fillOpacity: 0.10,
  };

  const panchayatStyle = {
    color: "#f58220",
    weight: 4,
    fillColor: "#f58220",
    fillOpacity: 0.16,
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        className="h-full w-full"
        style={{
          minHeight: "100%",
          background: "#eaf1f4",
        }}
      >
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds
          works={geotaggedWorks}
          hierarchyBounds={hierarchyBounds}
        />

        {/* ===============================
            CHHATTISGARH STATE
        =============================== */}

        {stateGeoJson && (
          <GeoJSON
            key="chhattisgarh-state"
            data={stateGeoJson}
            style={() => stateStyle}
          />
        )}

        {/* ===============================
            SELECTED DISTRICT
        =============================== */}

        {selectedDistrict && (
          <GeoJSON
            key={`district-${location?.district?.id ?? location?.district?.name}`}
            data={selectedDistrict}
            style={() => districtStyle}
          />
        )}

        {/* ===============================
            SELECTED BLOCK
        =============================== */}

        {selectedBlock && (
          <GeoJSON
            key={`block-${location?.block?.id ?? location?.block?.name}`}
            data={selectedBlock}
            style={() => blockStyle}
          />
        )}

        {/* ===============================
            SELECTED PANCHAYAT
        =============================== */}

        {selectedPanchayat && (
          <GeoJSON
            key={`panchayat-${location?.panchayat?.id ?? location?.panchayat?.name}`}
            data={selectedPanchayat}
            style={() => panchayatStyle}
          />
        )}

        {/* ===============================
            WORK MARKERS
        =============================== */}

        {geotaggedWorks.map((work) => (
          <CircleMarker
            key={work.id}
            center={[
              work.latitude as number,
              work.longitude as number,
            ]}
            radius={7}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: getThemeColor(work.theme),
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="min-w-[190px]">
                <div className="mb-2 border-b border-slate-200 pb-2">
                  <p className="text-[11px] font-extrabold text-[#183b56]">
                    {work.workName}
                  </p>

                  <p className="mt-0.5 text-[8px] text-slate-400">
                    {work.id}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between gap-3">
                    <span className="text-[8px] text-slate-400">
                      Theme
                    </span>

                    <span className="text-right text-[8px] font-bold text-[#36566b]">
                      {work.theme}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[8px] text-slate-400">
                      Sub Theme
                    </span>

                    <span className="text-right text-[8px] font-bold text-[#36566b]">
                      {work.subTheme}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[8px] text-slate-400">
                      Type
                    </span>

                    <span className="text-right text-[8px] font-bold text-[#36566b]">
                      {work.type}
                    </span>
                  </div>
                </div>

                <div className="mt-2 border-t border-slate-200 pt-2">
                  <p className="text-[7px] text-slate-400">
                    Proposal
                  </p>

                  <p className="font-mono text-[7px] font-bold text-[#075a91]">
                    {proposalId}
                  </p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* ===============================
          GIS STATUS
      =============================== */}

      <div className="pointer-events-none absolute left-3 top-3 z-[500]">
        <div className="rounded-[7px] border border-white/90 bg-white/95 px-3 py-2 shadow-[0_3px_12px_rgba(0,0,0,0.12)] backdrop-blur">
          <p className="text-[7px] font-extrabold uppercase tracking-[0.5px] text-[#183b56]">
            Spatial Hierarchy
          </p>

          <div className="mt-1 space-y-0.5">
            {location?.state?.name && (
              <p className="text-[7px] font-semibold text-[#075a91]">
                State: {location.state.name}
              </p>
            )}

            {location?.district?.name && (
              <p className="text-[7px] font-semibold text-[#0879b1]">
                District: {location.district.name}
              </p>
            )}

            {location?.block?.name && (
              <p className="text-[7px] font-semibold text-[#7c3aed]">
                Block: {location.block.name}
              </p>
            )}

            {location?.panchayat?.name && (
              <p className="text-[7px] font-semibold text-[#f58220]">
                GP: {location.panchayat.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===============================
          LEGEND
      =============================== */}

      <div className="pointer-events-none absolute bottom-3 left-3 z-[500]">
        <div className="rounded-[7px] border border-white/90 bg-white/95 px-3 py-2 shadow-[0_3px_12px_rgba(0,0,0,0.12)]">
          <p className="mb-1 text-[7px] font-extrabold uppercase tracking-[0.4px] text-slate-400">
            GIS Layers
          </p>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0879b1]" />
              <span className="text-[7px] text-slate-600">
                District
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#7c3aed]" />
              <span className="text-[7px] text-slate-600">
                Block
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#f58220]" />
              <span className="text-[7px] text-slate-600">
                Panchayat
              </span>
            </div>
          </div>

          {geoError && (
            <p className="mt-2 text-[6px] font-semibold text-red-500">
              GIS boundary data unavailable
            </p>
          )}
        </div>
      </div>
    </div>
  );
}