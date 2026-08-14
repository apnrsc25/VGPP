// "use client";

// import dynamic from "next/dynamic";
// import {
//     ChevronRight,
//     MapPin,
//     RotateCcw,
//     Check,
//     CalendarDays,
// } from "lucide-react";

// import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";

// import {
//     locationData,
//     State,
//     District,
//     Block,
//     Panchayat,
// } from "@/data/locationData";

// import LocationSelectorModal from "./LocationSelectorModal";

// const LocationMap = dynamic(
//     () => import("./LocationMap"),
//     {
//         ssr: false,
//         loading: () => (
//             <div className="flex h-full w-full items-center justify-center bg-[#edf4f8]">
//                 <div className="text-[10px] font-semibold text-slate-500">
//                     Loading GIS map...
//                 </div>
//             </div>
//         ),
//     }
// );

// interface Props {
//     proposalId: string;
// }

// type SelectionLevel =
//     | "state"
//     | "district"
//     | "block"
//     | "panchayat"
//     | null;

// export default function LocationSelectionWorkspace({
//     proposalId,
// }: Props) {
//     const router = useRouter();

//     const [selectedState, setSelectedState] =
//         useState<State | null>(null);

//     const [selectedDistrict, setSelectedDistrict] =
//         useState<District | null>(null);

//     const [selectedBlock, setSelectedBlock] =
//         useState<Block | null>(null);

//     const [selectedPanchayat, setSelectedPanchayat] =
//         useState<Panchayat | null>(null);

//     const [activeLevel, setActiveLevel] =
//         useState<SelectionLevel>(null);

//     const currentLocation = useMemo(() => {
//         if (selectedPanchayat) {
//             return {
//                 label: selectedPanchayat.name,
//                 latitude: selectedPanchayat.latitude,
//                 longitude: selectedPanchayat.longitude,
//                 zoom: 13,
//             };
//         }

//         if (selectedBlock) {
//             return {
//                 label: selectedBlock.name,
//                 latitude: selectedBlock.latitude,
//                 longitude: selectedBlock.longitude,
//                 zoom: 11,
//             };
//         }

//         if (selectedDistrict) {
//             return {
//                 label: selectedDistrict.name,
//                 latitude: selectedDistrict.latitude,
//                 longitude: selectedDistrict.longitude,
//                 zoom: 9,
//             };
//         }

//         if (selectedState) {
//             return {
//                 label: selectedState.name,
//                 latitude: selectedState.latitude,
//                 longitude: selectedState.longitude,
//                 zoom: selectedState.zoom,
//             };
//         }

//         return {
//             label: "India",
//             latitude: 22.5937,
//             longitude: 78.9629,
//             zoom: 5,
//         };
//     }, [
//         selectedState,
//         selectedDistrict,
//         selectedBlock,
//         selectedPanchayat,
//     ]);

//     const handleStateSelect = (
//         item: { id: string; name: string }
//     ) => {
//         const state = locationData.find(
//             (state) => state.id === item.id
//         );

//         if (!state) {
//             return;
//         }

//         setSelectedState(state);
//         setSelectedDistrict(null);
//         setSelectedBlock(null);
//         setSelectedPanchayat(null);
//         setActiveLevel(null);
//     };

//     const handleDistrictSelect = (
//         item: { id: string; name: string }
//     ) => {
//         const district =
//             selectedState?.districts.find(
//                 (district) =>
//                     district.id === item.id
//             );

//         if (!district) {
//             return;
//         }

//         setSelectedDistrict(district);
//         setSelectedBlock(null);
//         setSelectedPanchayat(null);
//         setActiveLevel(null);
//     };

//     const handleBlockSelect = (
//         item: { id: string; name: string }
//     ) => {
//         const block =
//             selectedDistrict?.blocks.find(
//                 (block) => block.id === item.id
//             );

//         if (!block) {
//             return;
//         }

//         setSelectedBlock(block);
//         setSelectedPanchayat(null);
//         setActiveLevel(null);
//     };

//     const handlePanchayatSelect = (
//         item: { id: string; name: string }
//     ) => {
//         const panchayat =
//             selectedBlock?.panchayats.find(
//                 (panchayat) =>
//                     panchayat.id === item.id
//             );

//         if (!panchayat) {
//             return;
//         }

//         setSelectedPanchayat(panchayat);
//         setActiveLevel(null);
//     };

//     const handleReset = () => {
//         setSelectedState(null);
//         setSelectedDistrict(null);
//         setSelectedBlock(null);
//         setSelectedPanchayat(null);
//     };

//     const handleContinue = () => {
//         if (!selectedPanchayat) {
//             return;
//         }

//         router.push(
//             `/proposal/${proposalId}/availability`
//         );
//     };

//     return (
//         <main className="relative flex h-[calc(100dvh-60px)] min-h-0 w-full flex-col overflow-hidden bg-[#eef5f8]">

//             {/* BACKGROUND */}

//             <div className="pointer-events-none absolute inset-0 overflow-hidden">

//                 <div className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full border border-[#075a91]/10" />

//                 <div className="absolute -right-40 top-[15%] h-[500px] w-[500px] rounded-full border border-[#f58220]/10" />

//                 <div
//                     className="absolute inset-0 opacity-[0.025]"
//                     style={{
//                         backgroundImage:
//                             "linear-gradient(#075a91 1px, transparent 1px), linear-gradient(90deg,#075a91 1px,transparent 1px)",
//                         backgroundSize: "38px 38px",
//                     }}
//                 />

//             </div>

//             {/* HEADER */}

//             <div className="relative z-10 shrink-0 border-b border-[#c9dce8] bg-white/95 shadow-sm">

//                 <div className="flex min-h-[52px] items-center justify-between px-3 sm:px-5 lg:px-7">

//                     <div>

//                         <div className="flex items-center gap-2">

//                             <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#075a91] text-white">
//                                 <MapPin size={14} />
//                             </div>

//                             <div>

//                                 <h1 className="text-[12px] font-extrabold tracking-wide text-[#003b63] sm:text-[14px]">
//                                     PLANNING AREA SELECTION
//                                 </h1>

//                                 <p className="text-[7px] text-slate-400 sm:text-[8px]">
//                                     Select the geographical area for
//                                     planning
//                                 </p>

//                             </div>

//                         </div>

//                     </div>

//                     <div className="hidden items-center gap-2 sm:flex">

//                         <span className="h-1.5 w-1.5 rounded-full bg-[#f58220]" />

//                         <span className="text-[8px] font-bold uppercase tracking-[1px] text-[#64748b]">
//                             VGPP • GIS PLANNING
//                         </span>

//                     </div>

//                 </div>

//                 <div className="flex h-[3px]">
//                     <div className="w-[72%] bg-[#075a91]" />
//                     <div className="w-[28%] bg-[#f58220]" />
//                 </div>

//             </div>

//             {/* CONTENT */}

//             <div className="relative z-10 min-h-0 flex-1 p-2 sm:p-3 lg:p-4">

//                 <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-[380px_minmax(0,1fr)]">

//                     {/* LEFT */}

//                     <section className="flex min-h-0 flex-col overflow-hidden rounded-[9px] border border-[#c7dce8] bg-white shadow-[0_8px_28px_rgba(0,59,99,0.09)]">

//                         {/* CARD HEADER */}

//                         <div className="shrink-0 border-b border-[#dce8ef] bg-[#f6fafc] p-4">

//                             <div className="text-[8px] font-bold uppercase tracking-[1.4px] text-[#f58220]">
//                                 Planning Hierarchy
//                             </div>

//                             <h2 className="mt-1 text-[16px] font-extrabold text-[#003b63]">
//                                 Select Location
//                             </h2>

//                             <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
//                                 Select State, District, Block and
//                                 Panchayat to continue planning.
//                             </p>

//                         </div>

//                         {/* LOCATION FIELDS */}

//                         <div className="min-h-0 flex-1 overflow-y-auto p-3">

//                             <LocationField
//                                 label="State"
//                                 required
//                                 value={selectedState?.name}
//                                 onClick={() =>
//                                     setActiveLevel("state")
//                                 }
//                             />

//                             <LocationField
//                                 label="District"
//                                 required
//                                 value={selectedDistrict?.name}
//                                 disabled={!selectedState}
//                                 onClick={() =>
//                                     setActiveLevel("district")
//                                 }
//                             />

//                             <LocationField
//                                 label="Block"
//                                 required
//                                 value={selectedBlock?.name}
//                                 disabled={!selectedDistrict}
//                                 onClick={() =>
//                                     setActiveLevel("block")
//                                 }
//                             />

//                             <LocationField
//                                 label="Panchayat"
//                                 required
//                                 value={selectedPanchayat?.name}
//                                 disabled={!selectedBlock}
//                                 onClick={() =>
//                                     setActiveLevel("panchayat")
//                                 }
//                             />

//                             {/* FINANCIAL YEAR */}

//                             <div className="mt-3 rounded-lg border border-[#dce8ef] bg-[#f9fbfc] p-3">

//                                 <div className="mb-1.5 flex items-center gap-1.5">

//                                     <CalendarDays
//                                         size={11}
//                                         className="text-[#075a91]"
//                                     />

//                                     <span className="text-[8px] font-bold uppercase tracking-wide text-[#475569]">
//                                         Financial Year
//                                     </span>

//                                 </div>

//                                 <div className="flex h-9 items-center justify-between rounded-md border border-[#cbd9e2] bg-white px-3">

//                                     <span className="text-[9px] font-semibold text-[#20354a]">
//                                         Current Financial Year
//                                     </span>

//                                     <span className="rounded-full bg-[#eaf6fd] px-2 py-1 text-[7px] font-bold text-[#075a91]">
//                                         CURRENT
//                                     </span>

//                                 </div>

//                             </div>

//                             {/* SELECTION SUMMARY */}

//                             {selectedPanchayat && (
//                                 <div className="mt-3 rounded-lg border border-[#bce6d5] bg-[#effbf5] p-3">

//                                     <div className="flex items-center gap-2">

//                                         <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00875a] text-white">
//                                             <Check size={12} />
//                                         </div>

//                                         <div>

//                                             <div className="text-[9px] font-bold text-[#00875a]">
//                                                 Location selected
//                                             </div>

//                                             <div className="text-[8px] text-[#526273]">
//                                                 Ready to continue planning
//                                             </div>

//                                         </div>

//                                     </div>

//                                 </div>
//                             )}

//                         </div>

//                         {/* FOOTER */}

//                         <div className="flex shrink-0 items-center gap-2 border-t border-[#dce8ef] bg-[#f9fbfc] p-3">

//                             <button
//                                 type="button"
//                                 onClick={handleReset}
//                                 className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#cbd9e2] bg-white px-4 text-[9px] font-bold text-[#475569] transition hover:border-[#075a91] hover:text-[#075a91]"
//                             >
//                                 <RotateCcw size={11} />
//                                 Reset
//                             </button>

//                             <button
//                                 type="button"
//                                 disabled={!selectedPanchayat}
//                                 onClick={handleContinue}
//                                 className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#075a91] px-4 text-[9px] font-bold text-white shadow-sm transition hover:bg-[#003b63] disabled:cursor-not-allowed disabled:opacity-40"
//                             >
//                                 Continue to Planning
//                                 <ChevronRight size={13} />
//                             </button>

//                         </div>

//                     </section>

//                     {/* RIGHT MAP */}

//                     <section className="relative min-h-[360px] overflow-hidden rounded-[9px] border border-[#c7dce8] bg-white shadow-[0_8px_28px_rgba(0,59,99,0.09)]">

//                         <LocationMap
//                             latitude={currentLocation.latitude}
//                             longitude={currentLocation.longitude}
//                             zoom={currentLocation.zoom}
//                             label={currentLocation.label}
//                         />

//                         {/* BREADCRUMB */}

//                         <div className="absolute bottom-3 left-3 z-[1000] max-w-[75%] rounded-lg border border-white/70 bg-white/90 px-3 py-2 shadow-md backdrop-blur">

//                             <div className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
//                                 SELECTED HIERARCHY
//                             </div>

//                             <div className="mt-1 flex flex-wrap items-center gap-1 text-[8px] font-semibold text-[#003b63]">

//                                 <span>
//                                     {selectedState?.name ||
//                                         "India"}
//                                 </span>

//                                 {selectedDistrict && (
//                                     <>
//                                         <ChevronRight size={9} />
//                                         <span>
//                                             {selectedDistrict.name}
//                                         </span>
//                                     </>
//                                 )}

//                                 {selectedBlock && (
//                                     <>
//                                         <ChevronRight size={9} />
//                                         <span>
//                                             {selectedBlock.name}
//                                         </span>
//                                     </>
//                                 )}

//                                 {selectedPanchayat && (
//                                     <>
//                                         <ChevronRight size={9} />
//                                         <span className="text-[#075a91]">
//                                             {selectedPanchayat.name}
//                                         </span>
//                                     </>
//                                 )}

//                             </div>

//                         </div>

//                     </section>

//                 </div>

//             </div>

//             {/* MODALS */}

//             <LocationSelectorModal
//                 open={activeLevel === "state"}
//                 title="State"
//                 items={locationData.map(
//                     (state) => ({
//                         id: state.id,
//                         name: state.name,
//                     })
//                 )}
//                 onSelect={handleStateSelect}
//                 onClose={() =>
//                     setActiveLevel(null)
//                 }
//             />

//             <LocationSelectorModal
//                 open={activeLevel === "district"}
//                 title="District"
//                 items={
//                     selectedState?.districts.map(
//                         (district) => ({
//                             id: district.id,
//                             name: district.name,
//                         })
//                     ) ?? []
//                 }
//                 onSelect={handleDistrictSelect}
//                 onClose={() =>
//                     setActiveLevel(null)
//                 }
//             />

//             <LocationSelectorModal
//                 open={activeLevel === "block"}
//                 title="Block"
//                 items={
//                     selectedDistrict?.blocks.map(
//                         (block) => ({
//                             id: block.id,
//                             name: block.name,
//                         })
//                     ) ?? []
//                 }
//                 onSelect={handleBlockSelect}
//                 onClose={() =>
//                     setActiveLevel(null)
//                 }
//             />

//             <LocationSelectorModal
//                 open={activeLevel === "panchayat"}
//                 title="Panchayat"
//                 items={
//                     selectedBlock?.panchayats.map(
//                         (panchayat) => ({
//                             id: panchayat.id,
//                             name: panchayat.name,
//                         })
//                     ) ?? []
//                 }
//                 onSelect={handlePanchayatSelect}
//                 onClose={() =>
//                     setActiveLevel(null)
//                 }
//             />

//         </main>
//     );
// }

// /* =========================================================
//    LOCATION FIELD
// ========================================================= */

// function LocationField({
//     label,
//     value,
//     required,
//     disabled,
//     onClick,
// }: {
//     label: string;
//     value?: string;
//     required?: boolean;
//     disabled?: boolean;
//     onClick: () => void;
// }) {
//     return (
//         <button
//             type="button"
//             disabled={disabled}
//             onClick={onClick}
//             className="mb-2.5 flex w-full cursor-pointer flex-col rounded-lg border border-[#dce8ef] bg-white p-3 text-left transition hover:border-[#8bbbd3] hover:bg-[#f8fcfe] disabled:cursor-not-allowed disabled:opacity-50"
//         >

//             <div className="mb-1.5 flex items-center gap-1">

//                 <span className="text-[8px] font-bold uppercase tracking-[1px] text-[#475569]">
//                     {label}
//                 </span>

//                 {required && (
//                     <span className="text-[9px] font-bold text-[#f58220]">
//                         *
//                     </span>
//                 )}

//             </div>

//             <div className="flex min-h-8 items-center justify-between rounded-md border border-[#cbd9e2] bg-[#f9fbfc] px-3">

//                 <span
//                     className={
//                         value
//                             ? "truncate text-[9px] font-semibold text-[#20354a]"
//                             : "text-[9px] text-slate-400"
//                     }
//                 >
//                     {value ||
//                         `Select ${label.toLowerCase()}`}
//                 </span>

//                 <ChevronRight
//                     size={13}
//                     className="shrink-0 text-slate-400"
//                 />

//             </div>

//         </button>
//     );
// }




"use client";

import {
  MapPin,
  ChevronRight,
  Check,
  CalendarDays,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import LocationSelectorModal from "./LocationSelectorModal";
import LocationMap from "./LocationMap";

import {
  locationData,
  State,
  District,
  Block,
  Panchayat,
} from "@/data/locationData";
import { useRouter } from "next/navigation";

interface LocationSelectionWorkspaceProps {
  proposalId: string;
}

type SelectionLevel =
  | "state"
  | "district"
  | "block"
  | "panchayat";

export default function LocationSelectionWorkspace({
  proposalId,
}: LocationSelectionWorkspaceProps) {
  const [selectedState, setSelectedState] =
    useState<State | null>(null);

  const [selectedDistrict, setSelectedDistrict] =
    useState<District | null>(null);

  const [selectedBlock, setSelectedBlock] =
    useState<Block | null>(null);

  const [selectedPanchayat, setSelectedPanchayat] =
    useState<Panchayat | null>(null);

  const [modalLevel, setModalLevel] =
    useState<SelectionLevel | null>(null);

  const router = useRouter();

  /*
   * ----------------------------------------
   * CURRENT MAP LEVEL
   * ----------------------------------------
   */

  const mapLevel: SelectionLevel =
    selectedPanchayat
      ? "panchayat"
      : selectedBlock
        ? "block"
        : selectedDistrict
          ? "district"
          : "state";

  /*
   * ----------------------------------------
   * CURRENT MAP LOCATION
   * ----------------------------------------
   */

  const mapLocation = useMemo(() => {
    if (selectedPanchayat) {
      return {
        latitude: selectedPanchayat.latitude,
        longitude: selectedPanchayat.longitude,
        zoom: 14,
        label: selectedPanchayat.name,
      };
    }

    if (selectedBlock) {
      return {
        latitude: selectedBlock.latitude,
        longitude: selectedBlock.longitude,
        zoom: 11,
        label: selectedBlock.name,
      };
    }

    if (selectedDistrict) {
      return {
        latitude: selectedDistrict.latitude,
        longitude: selectedDistrict.longitude,
        zoom: 10,
        label: selectedDistrict.name,
      };
    }

    if (selectedState) {
      return {
        latitude: selectedState.latitude,
        longitude: selectedState.longitude,
        zoom: selectedState.zoom,
        label: selectedState.name,
      };
    }

    return {
      latitude: 22.5937,
      longitude: 78.9629,
      zoom: 5,
      label: "India",
    };
  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
  ]);

  /*
   * ----------------------------------------
   * MODAL DATA
   * ----------------------------------------
   */

  const modalItems = useMemo(() => {
    if (modalLevel === "state") {
      return locationData;
    }

    if (
      modalLevel === "district" &&
      selectedState
    ) {
      return selectedState.districts;
    }

    if (
      modalLevel === "block" &&
      selectedDistrict
    ) {
      return selectedDistrict.blocks;
    }

    if (
      modalLevel === "panchayat" &&
      selectedBlock
    ) {
      return selectedBlock.panchayats;
    }

    return [];
  }, [
    modalLevel,
    selectedState,
    selectedDistrict,
    selectedBlock,
  ]);

  /*
   * ----------------------------------------
   * STATE
   * ----------------------------------------
   */

  const handleStateSelect = (item: {
    id: string;
    name: string;
  }) => {
    const state = locationData.find(
      (value) => value.id === item.id
    );

    if (!state) {
      return;
    }

    setSelectedState(state);

    // Reset lower hierarchy
    setSelectedDistrict(null);
    setSelectedBlock(null);
    setSelectedPanchayat(null);

    setModalLevel(null);

    // setModalLevel("district");
  };

  /*
   * ----------------------------------------
   * DISTRICT
   * ----------------------------------------
   */

  const handleDistrictSelect = (item: {
    id: string;
    name: string;
  }) => {
    if (!selectedState) {
      return;
    }

    const district =
      selectedState.districts.find(
        (value) => value.id === item.id
      );

    if (!district) {
      return;
    }

    setSelectedDistrict(district);

    // Reset lower hierarchy
    setSelectedBlock(null);
    setSelectedPanchayat(null);

    setModalLevel(null);
    // setModalLevel("block");
  };

  /*
   * ----------------------------------------
   * BLOCK
   * ----------------------------------------
   */

  const handleBlockSelect = (item: {
    id: string;
    name: string;
  }) => {
    if (!selectedDistrict) {
      return;
    }

    const block =
      selectedDistrict.blocks.find(
        (value) => value.id === item.id
      );

    if (!block) {
      return;
    }

    setSelectedBlock(block);

    // Reset lower hierarchy
    setSelectedPanchayat(null);

    setModalLevel(null);
    // setModalLevel("panchayat");
  };

  /*
   * ----------------------------------------
   * PANCHAYAT
   * ----------------------------------------
   */

  const handlePanchayatSelect = (item: {
    id: string;
    name: string;
  }) => {
    if (!selectedBlock) {
      return;
    }

    const panchayat =
      selectedBlock.panchayats.find(
        (value) => value.id === item.id
      );

    if (!panchayat) {
      return;
    }

    setSelectedPanchayat(panchayat);

    setModalLevel(null);
  };

  /*
   * ----------------------------------------
   * CONTINUE
   * ----------------------------------------
   */

  const isComplete = Boolean(
    selectedState &&
    selectedDistrict &&
    selectedBlock &&
    selectedPanchayat
  );

  const handleContinue = () => {
    if (!isComplete) {
      return;
    }

    console.log(
      "Selected planning location:",
      {
        proposalId,
        state: selectedState,
        district: selectedDistrict,
        block: selectedBlock,
        panchayat: selectedPanchayat,
      }
    );

    router.push(
      `/proposal/${proposalId}/availability`
    );

    /*
     * TODO:
     * Actual next route yahan lagana.
     *
     * Example:
     *
     * router.push(
     *   `/proposal/${proposalId}/requirements`
     * );
     */
  };

  return (
    <main className="h-screen overflow-hidden bg-[#eef5f8]">
      <div className="flex h-full min-h-0 flex-col p-2 sm:p-3 lg:p-4">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[#c7dce8] bg-white shadow-[0_10px_35px_rgba(0,59,99,0.10)]">

          {/* HEADER */}

          <header className="relative shrink-0 border-b border-[#dce8ef] bg-white">
            <div className="h-[4px] bg-gradient-to-r from-[#075a91] via-[#087fb8] to-[#f58220]" />

            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
              <div>
                <div className="mb-0.5 text-[7px] font-extrabold uppercase tracking-[1.5px] text-[#f58220]">
                  VGPP GIS PLANNING
                </div>

                <h1 className="text-[17px] font-extrabold text-[#003b63] sm:text-[20px]">
                  Select Planning Location
                </h1>

                <p className="mt-0.5 text-[8px] text-slate-500 sm:text-[9px]">
                  Select State, District, Block and
                  Gram Panchayat to continue planning.
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-[#c9dfea] bg-[#f5fafc] px-3 py-1.5 sm:flex">
                <MapPin
                  size={12}
                  className="text-[#075a91]"
                />

                <span className="text-[7px] font-bold uppercase tracking-wide text-[#075a91]">
                  GIS Location Selection
                </span>
              </div>
            </div>
          </header>

          {/* CONTENT */}

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)]">

            {/* LEFT PANEL */}

            <section className="flex min-h-0 flex-col border-b border-[#dce8ef] bg-[#f8fbfd] lg:border-b-0 lg:border-r">

              <div className="shrink-0 border-b border-[#dce8ef] px-4 py-3">
                <div className="text-[7px] font-extrabold uppercase tracking-[1.2px] text-[#f58220]">
                  Planning Hierarchy
                </div>

                <h2 className="mt-0.5 text-[14px] font-extrabold text-[#003b63]">
                  Select Administrative Area
                </h2>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">

                {/* STATE */}

                <LocationField
                  label="STATE"
                  value={selectedState?.name}
                  placeholder="Select State"
                  enabled
                  selected={Boolean(selectedState)}
                  onClick={() =>
                    setModalLevel("state")
                  }
                />

                {/* DISTRICT */}

                <LocationField
                  label="DISTRICT"
                  value={selectedDistrict?.name}
                  placeholder="Select District"
                  enabled={Boolean(selectedState)}
                  selected={Boolean(selectedDistrict)}
                  onClick={() => {
                    if (selectedState) {
                      setModalLevel("district");
                    }
                  }}
                />

                {/* BLOCK */}

                <LocationField
                  label="BLOCK"
                  value={selectedBlock?.name}
                  placeholder="Select Block"
                  enabled={Boolean(selectedDistrict)}
                  selected={Boolean(selectedBlock)}
                  onClick={() => {
                    if (selectedDistrict) {
                      setModalLevel("block");
                    }
                  }}
                />

                {/* PANCHAYAT */}

                <LocationField
                  label="GRAM PANCHAYAT"
                  value={selectedPanchayat?.name}
                  placeholder="Select Gram Panchayat"
                  enabled={Boolean(selectedBlock)}
                  selected={Boolean(selectedPanchayat)}
                  onClick={() => {
                    if (selectedBlock) {
                      setModalLevel("panchayat");
                    }
                  }}
                />

                {/* FINANCIAL YEAR */}

                <div className="mt-3 rounded-lg border border-[#dce8ef] bg-[#f9fbfc] p-3">

                  <div className="mb-1.5 flex items-center gap-1.5">

                    <CalendarDays
                      size={11}
                      className="text-[#075a91]"
                    />

                    <span className="text-[8px] font-bold uppercase tracking-wide text-[#475569]">
                      Financial Year
                    </span>

                  </div>

                  <div className="flex h-9 items-center justify-between rounded-md border border-[#cbd9e2] bg-white px-3">

                    <span className="text-[9px] font-semibold text-[#20354a]">
                      Current Financial Year
                    </span>

                    <span className="rounded-full bg-[#eaf6fd] px-2 py-1 text-[7px] font-bold text-[#075a91]">
                      CURRENT
                    </span>

                  </div>

                </div>

                {/* SELECTED LOCATION */}

                {selectedState && (
                  <div className="mt-5 rounded-lg border border-[#c9dfea] bg-white p-3 shadow-sm">

                    <div className="mb-2 text-[7px] font-extrabold uppercase tracking-[1px] text-[#075a91]">
                      Selected Location
                    </div>

                    <div className="flex items-start gap-2">

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf6fd] text-[#075a91]">
                        <MapPin size={13} />
                      </div>

                      <div className="min-w-0">

                        <div className="truncate text-[10px] font-extrabold text-[#003b63]">
                          {selectedPanchayat?.name ||
                            selectedBlock?.name ||
                            selectedDistrict?.name ||
                            selectedState.name}
                        </div>

                        <div className="mt-0.5 text-[7px] text-slate-400">
                          {[
                            selectedPanchayat?.name,
                            selectedBlock?.name,
                            selectedDistrict?.name,
                            selectedState.name,
                          ]
                            .filter(Boolean)
                            .join(" • ")}
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CONTINUE */}

              <div className="shrink-0 border-t border-[#dce8ef] bg-white p-3">
                <button
                  type="button"
                  disabled={!isComplete}
                  onClick={handleContinue}
                  className="flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#075a91] px-4 text-[9px] font-bold text-white shadow-[0_5px_14px_rgba(0,59,99,0.18)] transition hover:bg-[#003b63] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>
                    Continue Planning
                  </span>

                  <ChevronRight size={13} />
                </button>
              </div>
            </section>

            {/* RIGHT MAP */}

            <section className="relative min-h-[360px] min-w-0 flex-1 bg-[#eaf1f4] lg:min-h-0">

              <LocationMap
                latitude={mapLocation.latitude}
                longitude={mapLocation.longitude}
                zoom={mapLocation.zoom}
                label={mapLocation.label}
                level={mapLevel}
                stateName={selectedState?.name}
                districtName={selectedDistrict?.name}
                blockName={selectedBlock?.name}
                panchayatName={selectedPanchayat?.name}
                panchayatCode={selectedPanchayat?.gpcode}
              />

              {/* BOUNDARY LEGEND */}

              <div className="absolute bottom-3 left-3 z-[1000] hidden rounded-lg border border-white/80 bg-white/95 p-2.5 shadow-lg backdrop-blur sm:block">

                <div className="mb-1.5 text-[7px] font-extrabold uppercase tracking-wide text-[#003b63]">
                  Boundaries
                </div>

                <div className="flex items-center gap-2 text-[7px] text-slate-600">
                  <span className="h-2.5 w-5 rounded-sm border-2 border-[#075a91]" />
                  State
                </div>

                <div className="mt-1 flex items-center gap-2 text-[7px] text-slate-600">
                  <span className="h-2.5 w-5 rounded-sm border-2 border-[#f58220]" />
                  District
                </div>

                <div className="mt-1 flex items-center gap-2 text-[7px] text-slate-600">
                  <span className="h-2.5 w-5 rounded-sm border-2 border-[#7c3aed]" />
                  Block
                </div>

                <div className="mt-1 flex items-center gap-2 text-[7px] text-slate-600">
                  <span className="h-2.5 w-5 rounded-sm border-2 border-[#00875a]" />
                  Gram Panchayat
                </div>

              </div>
            </section>
          </div>
        </section>
      </div>

      {/* MODAL */}

      <LocationSelectorModal
        open={modalLevel !== null}
        title={
          modalLevel === "state"
            ? "State"
            : modalLevel === "district"
              ? "District"
              : modalLevel === "block"
                ? "Block"
                : "Gram Panchayat"
        }
        items={modalItems}
        onSelect={(item) => {
          switch (modalLevel) {
            case "state":
              handleStateSelect(item);
              break;

            case "district":
              handleDistrictSelect(item);
              break;

            case "block":
              handleBlockSelect(item);
              break;

            case "panchayat":
              handlePanchayatSelect(item);
              break;
          }
        }}
        onClose={() =>
          setModalLevel(null)
        }
      />
    </main>
  );
}

/* =====================================================
   LOCATION FIELD
===================================================== */

function LocationField({
  label,
  value,
  placeholder,
  enabled,
  selected,
  onClick,
}: {
  label: string;
  value?: string;
  placeholder: string;
  enabled: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mb-3">

      <div className="mb-1.5 flex items-center justify-between">

        <span className="text-[7px] font-extrabold tracking-[0.8px] text-[#475569]">
          {label}
        </span>

        {selected && (
          <span className="text-[6px] font-bold uppercase text-[#00875a]">
            Selected
          </span>
        )}

      </div>

      <button
        type="button"
        disabled={!enabled}
        onClick={onClick}
        className={`group flex min-h-[42px] w-full cursor-pointer items-center gap-2 rounded-[6px] border px-3 text-left transition ${selected
          ? "border-[#075a91] bg-white shadow-[0_3px_10px_rgba(0,59,99,0.08)]"
          : enabled
            ? "border-[#cbdde8] bg-white hover:border-[#075a91] hover:bg-[#f7fbfd]"
            : "cursor-not-allowed border-[#e5edf1] bg-[#f4f7f9] opacity-55"
          }`}
      >
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${selected
            ? "bg-[#075a91] text-white"
            : "bg-[#eaf6fd] text-[#075a91]"
            }`}
        >
          {selected ? (
            <Check size={11} />
          ) : (
            <MapPin size={11} />
          )}
        </div>

        <span
          className={`min-w-0 flex-1 truncate text-[9px] font-semibold ${selected
            ? "text-[#003b63]"
            : enabled
              ? "text-slate-500"
              : "text-slate-400"
            }`}
        >
          {value || placeholder}
        </span>

        <ChevronRight
          size={13}
          className={`shrink-0 transition ${enabled
            ? "text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#075a91]"
            : "text-slate-300"
            }`}
        />
      </button>
    </div>
  );
}