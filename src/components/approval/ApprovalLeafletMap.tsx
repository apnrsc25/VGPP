"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  ZoomControl,
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

const DEFAULT_CENTER: [number, number] = [
  20.259,
  81.294,
];

function MapBounds({
  works,
}: {
  works: SelectedWork[];
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

    if (points.length === 0) {
      map.setView(DEFAULT_CENTER, 11);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 15,
    });
  }, [map, works]);

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
    html: `
      <div style="
        width:28px;
        height:28px;
        border-radius:50% 50% 50% 0;
        background:${color};
        border:3px solid white;
        box-shadow:0 3px 10px rgba(0,0,0,0.25);
        transform:rotate(-45deg);
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <div style="
          width:7px;
          height:7px;
          border-radius:50%;
          background:white;
          transform:rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export default function ApprovalLeafletMap({
  proposalId,
  selectedWorks,
}: ApprovalLeafletMapProps) {
  const geotaggedWorks = selectedWorks.filter(
    (work) =>
      work.geotagged &&
      typeof work.latitude === "number" &&
      typeof work.longitude === "number"
  );

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={11}
      zoomControl={false}
      className="h-full w-full"
      style={{
        minHeight: "100%",
        background: "#eaf1f4",
      }}
    >

      <ZoomControl position="bottomright" />


      {/* BASE MAP */}

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {/* MAP BOUNDARY */}

      <MapBounds works={geotaggedWorks} />


      {/* WORK MARKERS */}

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
  );
}