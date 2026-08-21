"use client";

import dynamic from "next/dynamic";
import { Layers3, MapPinned, Maximize2, Map as MapIcon } from "lucide-react";

const ApprovalLeafletMap = dynamic(
  () => import("./ApprovalLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#eef4f7]">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c8dbe5] bg-white shadow-sm">
            <MapPinned size={22} className="text-[#075a91]" />
          </div>
          <p className="mt-2 text-[9px] font-bold text-[#36566b]">
            Loading map...
          </p>
        </div>
      </div>
    ),
  }
);

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

interface ApprovalMapProps {
  proposalId: string;
  selectedWorks: SelectedWork[];
}

export default function ApprovalMap({
  proposalId,
  selectedWorks,
}: ApprovalMapProps) {
  const waterCount = selectedWorks.filter(
    (work) => work.theme === "Water Security"
  ).length;

  const ruralCount = selectedWorks.filter(
    (work) => work.theme === "Rural Infrastructure"
  ).length;

  const livelihoodCount = selectedWorks.filter(
    (work) => work.theme === "Livelihood Infrastructure"
  ).length;

  const climateCount = selectedWorks.filter(
    (work) => work.theme === "Climate Resilience"
  ).length;

  const geotaggedWorks = selectedWorks.filter(
    (work) =>
      work.geotagged &&
      typeof work.latitude === "number" &&
      typeof work.longitude === "number"
  );

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-[10px] border border-[#d5e2ea] bg-white shadow-[0_4px_18px_rgba(0,59,99,0.08)]">

      <div className="relative flex h-12 shrink-0 items-center justify-between border-b border-[#d7e5ed] bg-gradient-to-r from-[#f1f8fc] via-white to-[#fffaf5] px-3">

        <div className="flex min-w-0 items-center gap-2.5">

          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#075a91] text-white shadow-[0_3px_8px_rgba(7,90,145,0.22)]">
            <MapPinned size={15} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#f58220]" />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h2 className="truncate text-[11px] font-extrabold uppercase tracking-[0.5px] text-[#183b56] sm:text-[12px]">
                Final VGP AAP Map
              </h2>

              <span className="hidden rounded-full border border-[#c9dfeb] bg-[#f1f8fc] px-2 py-0.5 text-[6px] font-extrabold uppercase tracking-[0.4px] text-[#075a91] sm:inline-flex">
                Spatial Verification
              </span>

            </div>

            <p className="truncate text-[7px] text-slate-400 sm:text-[8px]">
              Geotagged works & spatial verification
            </p>

          </div>

        </div>


        <div className="flex shrink-0 items-center gap-1.5">

          <div className="hidden items-center gap-1.5 rounded-full border border-[#cce5d9] bg-[#f1fbf6] px-2.5 py-1 sm:flex">

            <span className="h-1.5 w-1.5 rounded-full bg-[#00875a]" />

            <span className="text-[7px] font-extrabold text-[#00875a]">
              {geotaggedWorks.length} GEOTAGGED
            </span>

          </div>

          <div className="rounded-full border border-[#c8ddea] bg-[#f1f8fc] px-2.5 py-1 text-[7px] font-extrabold text-[#075a91]">
            {selectedWorks.length} WORKS
          </div>

          <button
            type="button"
            title="Expand map"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[5px] border border-[#c8dbe5] bg-white text-[#526b7b] transition hover:border-[#075a91] hover:bg-[#eef7fb] hover:text-[#075a91]"
          >
            <Maximize2 size={12} />
          </button>

        </div>

      </div>


      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#eaf1f4]">

        <ApprovalLeafletMap
          proposalId={proposalId}
          selectedWorks={selectedWorks}
        />


        <div className="pointer-events-none absolute left-3 top-3 z-[500]">

          <div className="flex items-center gap-2 rounded-[6px] border border-white/80 bg-white/95 px-2.5 py-2 shadow-[0_3px_12px_rgba(0,0,0,0.12)] backdrop-blur">

            <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#075a91] text-white">
              <MapIcon size={12} />
            </div>

            <div>

              <p className="text-[7px] font-extrabold uppercase tracking-[0.4px] text-[#183b56]">
                VGP AAP
              </p>

              <p className="text-[6px] text-slate-400">
                Final spatial view
              </p>

            </div>

          </div>

        </div>


        <div className="pointer-events-none absolute right-3 top-3 z-[500]">

          <div className="flex h-8 w-8 items-center justify-center rounded-[5px] border border-white bg-white/95 text-[#36566b] shadow-[0_3px_10px_rgba(0,0,0,0.12)] backdrop-blur">
            <Layers3 size={13} />
          </div>

        </div>


        <div className="pointer-events-none absolute bottom-3 left-3 z-[500]">

          <div className="rounded-[7px] border border-white/90 bg-white/95 px-3 py-2 shadow-[0_3px_12px_rgba(0,0,0,0.12)] backdrop-blur">

            <div className="flex items-center gap-2">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00875a] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00875a]" />
              </span>

              <span className="text-[7px] font-extrabold text-[#36566b]">
                {geotaggedWorks.length > 0
                  ? "Spatial verification ready"
                  : "Waiting for geotagged works"}
              </span>

            </div>

          </div>

        </div>

      </div>


      <div className="flex min-h-9 shrink-0 items-center gap-1.5 overflow-x-auto border-t border-[#d7e5ed] bg-white px-3 py-1.5">

        <span className="mr-1 shrink-0 text-[7px] font-extrabold uppercase tracking-[0.4px] text-slate-400">
          THEMES
        </span>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#c9e1ef] bg-[#f1f9fd] px-2 py-1 text-[7px] font-bold text-[#075a91]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f58220]" />
          Water {waterCount}
        </span>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#ddd0f7] bg-[#f8f5ff] px-2 py-1 text-[7px] font-bold text-[#7c3aed]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed]" />
          Rural {ruralCount}
        </span>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#cce8da] bg-[#f2fbf6] px-2 py-1 text-[7px] font-bold text-[#00875a]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00875a]" />
          Livelihood {livelihoodCount}
        </span>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#c9e1ef] bg-[#f1f9fd] px-2 py-1 text-[7px] font-bold text-[#0879b1]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0879b1]" />
          Climate {climateCount}
        </span>

      </div>

    </section>
  );
}