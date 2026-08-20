// "use client";

// import {
//   MapPin,
//   ChevronRight,
//   Check,
//   CalendarDays,
// } from "lucide-react";

// import {
//   useMemo,
//   useState,
//   useEffect,
//   useRef,
// } from "react";

// import LocationSelectorModal from "./LocationSelectorModal";
// import LocationMap from "./LocationMap";
// import {
//   getAuthSession,
//   updateAuthLocation,
// } from "@/config/auth";
// import {
//   locationData,
//   State,
//   District,
//   Block,
//   Panchayat,
// } from "@/data/locationData";
// import { useRouter } from "next/navigation";
// import Header from "../common/Header";

// interface LocationSelectionWorkspaceProps {
//   proposalId: string;
// }

// type SelectionLevel =
//   | "state"
//   | "district"
//   | "block"
//   | "panchayat";

// export default function LocationSelectionWorkspace({
//   proposalId,
// }: LocationSelectionWorkspaceProps) {
//   const [selectedState, setSelectedState] =
//     useState<State | null>(null);

//   const [selectedDistrict, setSelectedDistrict] =
//     useState<District | null>(null);

//   const [selectedBlock, setSelectedBlock] =
//     useState<Block | null>(null);

//   const [selectedPanchayat, setSelectedPanchayat] =
//     useState<Panchayat | null>(null);

//   const [modalLevel, setModalLevel] =
//     useState<SelectionLevel | null>(null);

//   const router = useRouter();


//   const stateFieldRef = useRef<HTMLDivElement>(null);

//   const districtFieldRef =
//     useRef<HTMLDivElement>(null);

//   const blockFieldRef =
//     useRef<HTMLDivElement>(null);

//   const panchayatFieldRef =
//     useRef<HTMLDivElement>(null);




//   useEffect(() => {
//     const session = getAuthSession();

//     if (!session) {
//       router.replace(
//         `/login?proposalId=${encodeURIComponent(
//           proposalId
//         )}`
//       );

//       return;
//     }

//     const jharkhand =
//       locationData.find(
//         (state) => state.id === "jharkhand"
//       );

//     if (!jharkhand) {
//       return;
//     }

//     /* =====================================================
//        PLANNER / PANCHAYAT

//        Normally Planner yahan aayega hi nahi because
//        login ke baad direct availability par redirect
//        ho raha hai.
//     ====================================================== */

//     if (session.role === "Planner") {
//       router.replace(
//         `/proposal/${proposalId}/availability`
//       );

//       return;
//     }


//     /* =====================================================
//        STATE ADMIN

//        Jharkhand selected
//        District selection enabled
//     ====================================================== */

//     if (session.role === "State Admin") {

//       setSelectedState(jharkhand);
//       setSelectedDistrict(null);
//       setSelectedBlock(null);
//       setSelectedPanchayat(null);

//       setModalLevel("district");

//       return;
//     }


//     /* =====================================================
//        DISTRICT ADMIN

//        Jharkhand
//          ↓
//        Ranchi selected
//          ↓
//        Block selection enabled
//     ====================================================== */

//     if (session.role === "District Admin") {

//       const ranchi =
//         jharkhand.districts.find(
//           (district) =>
//             district.id === "ranchi"
//         );

//       if (!ranchi) {
//         return;
//       }

//       setSelectedState(jharkhand);
//       setSelectedDistrict(ranchi);
//       setSelectedBlock(null);
//       setSelectedPanchayat(null);

//       setModalLevel("block");

//       return;
//     }


//     /* =====================================================
//        BLOCK ADMIN

//        Jharkhand
//          ↓
//        Ranchi
//          ↓
//        Kanke
//          ↓
//        Panchayat selection enabled
//     ====================================================== */

//     if (session.role === "Block Admin") {

//       const ranchi =
//         jharkhand.districts.find(
//           (district) =>
//             district.id === "ranchi"
//         );

//       if (!ranchi) {
//         return;
//       }

//       const kanke =
//         ranchi.blocks.find(
//           (block) =>
//             block.id === "kanke"
//         );

//       if (!kanke) {
//         return;
//       }

//       setSelectedState(jharkhand);
//       setSelectedDistrict(ranchi);
//       setSelectedBlock(kanke);
//       setSelectedPanchayat(null);

//       setModalLevel("panchayat");

//       return;
//     }

//   }, [proposalId, router]);




//   /*
//    * ----------------------------------------
//    * CURRENT MAP LEVEL
//    * ----------------------------------------
//    */

//   const mapLevel: SelectionLevel =
//     selectedPanchayat
//       ? "panchayat"
//       : selectedBlock
//         ? "block"
//         : selectedDistrict
//           ? "district"
//           : "state";

//   /*
//    * ----------------------------------------
//    * CURRENT MAP LOCATION
//    * ----------------------------------------
//    */

//   const mapLocation = useMemo(() => {
//     if (selectedPanchayat) {
//       return {
//         latitude: selectedPanchayat.latitude,
//         longitude: selectedPanchayat.longitude,
//         zoom: 14,
//         label: selectedPanchayat.name,
//       };
//     }

//     if (selectedBlock) {
//       return {
//         latitude: selectedBlock.latitude,
//         longitude: selectedBlock.longitude,
//         zoom: 11,
//         label: selectedBlock.name,
//       };
//     }

//     if (selectedDistrict) {
//       return {
//         latitude: selectedDistrict.latitude,
//         longitude: selectedDistrict.longitude,
//         zoom: 10,
//         label: selectedDistrict.name,
//       };
//     }

//     if (selectedState) {
//       return {
//         latitude: selectedState.latitude,
//         longitude: selectedState.longitude,
//         zoom: selectedState.zoom,
//         label: selectedState.name,
//       };
//     }

//     return {
//       latitude: 22.5937,
//       longitude: 78.9629,
//       zoom: 5,
//       label: "India",
//     };
//   }, [
//     selectedState,
//     selectedDistrict,
//     selectedBlock,
//     selectedPanchayat,
//   ]);

//   /*
//    * ----------------------------------------
//    * MODAL DATA
//    * ----------------------------------------
//    */

//   const modalItems = useMemo(() => {
//     if (modalLevel === "state") {
//       return locationData;
//     }

//     if (
//       modalLevel === "district" &&
//       selectedState
//     ) {
//       return selectedState.districts;
//     }

//     if (
//       modalLevel === "block" &&
//       selectedDistrict
//     ) {
//       return selectedDistrict.blocks;
//     }

//     if (
//       modalLevel === "panchayat" &&
//       selectedBlock
//     ) {
//       return selectedBlock.panchayats;
//     }

//     return [];
//   }, [
//     modalLevel,
//     selectedState,
//     selectedDistrict,
//     selectedBlock,
//   ]);

//   /*
//    * ----------------------------------------
//    * STATE
//    * ----------------------------------------
//    */

//   const handleStateSelect = (item: {
//     id: string;
//     name: string;
//   }) => {
//     const state = locationData.find(
//       (value) => value.id === item.id
//     );

//     if (!state) {
//       return;
//     }

//     setSelectedState(state);

//     // Reset lower hierarchy
//     setSelectedDistrict(null);
//     setSelectedBlock(null);
//     setSelectedPanchayat(null);

//     // setModalLevel(null);

//     setModalLevel("district");
//   };

//   /*
//    * ----------------------------------------
//    * DISTRICT
//    * ----------------------------------------
//    */

//   const handleDistrictSelect = (item: {
//     id: string;
//     name: string;
//   }) => {
//     if (!selectedState) {
//       return;
//     }

//     const district =
//       selectedState.districts.find(
//         (value) => value.id === item.id
//       );

//     if (!district) {
//       return;
//     }

//     setSelectedDistrict(district);

//     // Reset lower hierarchy
//     setSelectedBlock(null);
//     setSelectedPanchayat(null);

//     // setModalLevel(null);
//     setModalLevel("block");
//   };

//   /*
//    * ----------------------------------------
//    * BLOCK
//    * ----------------------------------------
//    */

//   const handleBlockSelect = (item: {
//     id: string;
//     name: string;
//   }) => {
//     if (!selectedDistrict) {
//       return;
//     }

//     const block =
//       selectedDistrict.blocks.find(
//         (value) => value.id === item.id
//       );

//     if (!block) {
//       return;
//     }

//     setSelectedBlock(block);

//     // Reset lower hierarchy
//     setSelectedPanchayat(null);

//     // setModalLevel(null);
//     setModalLevel("panchayat");
//   };

//   /*
//    * ----------------------------------------
//    * PANCHAYAT
//    * ----------------------------------------
//    */

//   const handlePanchayatSelect = (item: {
//     id: string;
//     name: string;
//   }) => {
//     if (!selectedBlock) {
//       return;
//     }

//     const panchayat =
//       selectedBlock.panchayats.find(
//         (value) => value.id === item.id
//       );

//     if (!panchayat) {
//       return;
//     }

//     setSelectedPanchayat(panchayat);

//     setModalLevel(null);
//   };


//   const isComplete = Boolean(
//     selectedState &&
//     selectedDistrict &&
//     selectedBlock &&
//     selectedPanchayat
//   );

//   const handleContinue = () => {
//     if (
//       !selectedState ||
//       !selectedDistrict ||
//       !selectedBlock ||
//       !selectedPanchayat
//     ) {
//       return;
//     }

//     updateAuthLocation({
//       stateName: selectedState.name,
//       districtName: selectedDistrict.name,
//       blockName: selectedBlock.name,
//       panchayatName: selectedPanchayat.name,
//       panchayatCode: selectedPanchayat.gpcode,
//     });

//     sessionStorage.setItem(
//       `proposal_location_${proposalId}`,
//       JSON.stringify({
//         state: {
//           id: selectedState.id,
//           name: selectedState.name,
//         },
//         district: {
//           id: selectedDistrict.id,
//           name: selectedDistrict.name,
//         },
//         block: {
//           id: selectedBlock.id,
//           name: selectedBlock.name,
//         },
//         panchayat: {
//           id: selectedPanchayat.id,
//           name: selectedPanchayat.name,
//           gpcode: selectedPanchayat.gpcode,
//         },
//       })
//     );

//     router.push(
//       `/proposal/${proposalId}/availability`
//     );
//   };

//   return (
//     <main className="h-screen overflow-hidden bg-[#eef5f8]">
//       <Header />
//       <div className="flex h-full min-h-0 flex-col p-2 sm:p-3 lg:p-4">
//         <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[#c7dce8] bg-white shadow-[0_10px_35px_rgba(0,59,99,0.10)]">

//           {/* HEADER */}

//           <header className="relative shrink-0 border-b border-[#dce8ef] bg-white">
//             <div className="h-[4px] bg-gradient-to-r from-[#075a91] via-[#087fb8] to-[#f58220]" />

//             <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
//               <div>
//                 <div className="mb-0.5 text-[7px] font-extrabold uppercase tracking-[1.5px] text-[#f58220]">
//                   VGPP GIS PLANNING
//                 </div>

//                 <h1 className="text-[17px] font-extrabold text-[#003b63] sm:text-[20px]">
//                   Select Planning Location
//                 </h1>

//                 <p className="mt-0.5 text-[8px] text-slate-500 sm:text-[9px]">
//                   Select State, District, Block and
//                   Gram Panchayat to continue planning.
//                 </p>
//               </div>

//               <div className="hidden items-center gap-2 rounded-full border border-[#c9dfea] bg-[#f5fafc] px-3 py-1.5 sm:flex">
//                 <MapPin
//                   size={12}
//                   className="text-[#075a91]"
//                 />

//                 <span className="text-[7px] font-bold uppercase tracking-wide text-[#075a91]">
//                   GIS Location Selection
//                 </span>
//               </div>
//             </div>
//           </header>

//           {/* CONTENT */}

//           <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)]">

//             {/* LEFT PANEL */}

//             <section className="flex min-h-0 flex-col border-b border-[#dce8ef] bg-[#f8fbfd] lg:border-b-0 lg:border-r">

//               <div className="shrink-0 border-b border-[#dce8ef] px-4 py-3">
//                 <div className="text-[7px] font-extrabold uppercase tracking-[1.2px] text-[#f58220]">
//                   Planning Hierarchy
//                 </div>

//                 <h2 className="mt-0.5 text-[14px] font-extrabold text-[#003b63]">
//                   Select Administrative Area
//                 </h2>
//               </div>

//               <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">

//                 {/* STATE */}

//                 <div ref={stateFieldRef}>
//                   <LocationField
//                     label="STATE"
//                     value={selectedState?.name}
//                     placeholder="Select State"
//                     enabled
//                     selected={Boolean(selectedState)}
//                     onClick={() =>
//                       setModalLevel("state")
//                     }
//                   />
//                 </div>

//                 {/* DISTRICT */}

//                 <div ref={districtFieldRef}>
//                   <LocationField
//                     label="DISTRICT"
//                     value={selectedDistrict?.name}
//                     placeholder="Select District"
//                     enabled={Boolean(selectedState)}
//                     selected={Boolean(selectedDistrict)}
//                     onClick={() => {
//                       if (selectedState) {
//                         setModalLevel("district");
//                       }
//                     }}
//                   />
//                 </div>

//                 {/* BLOCK */}

//                 <div ref={blockFieldRef}>
//                   <LocationField
//                     label="BLOCK"
//                     value={selectedBlock?.name}
//                     placeholder="Select Block"
//                     enabled={Boolean(selectedDistrict)}
//                     selected={Boolean(selectedBlock)}
//                     onClick={() => {
//                       if (selectedDistrict) {
//                         setModalLevel("block");
//                       }
//                     }}
//                   />
//                 </div>

//                 {/* PANCHAYAT */}

//                 <div ref={panchayatFieldRef}>
//                   <LocationField
//                     label="GRAM PANCHAYAT"
//                     value={selectedPanchayat?.name}
//                     placeholder="Select Gram Panchayat"
//                     enabled={Boolean(selectedBlock)}
//                     selected={Boolean(selectedPanchayat)}
//                     onClick={() => {
//                       if (selectedBlock) {
//                         setModalLevel("panchayat");
//                       }
//                     }}
//                   />
//                 </div>
//                 {/* FINANCIAL YEAR */}

//                 {/* <div className="mt-3 rounded-lg border border-[#dce8ef] bg-[#f9fbfc] p-3">

//                   <div className="mb-1.5 flex items-center gap-1.5">

//                     <CalendarDays
//                       size={11}
//                       className="text-[#075a91]"
//                     />

//                     <span className="text-[8px] font-bold uppercase tracking-wide text-[#475569]">
//                       Financial Year
//                     </span>

//                   </div>

//                   <div className="flex h-9 items-center justify-between rounded-md border border-[#cbd9e2] bg-white px-3">

//                     <span className="text-[9px] font-semibold text-[#20354a]">
//                       Current Financial Year
//                     </span>

//                     <span className="rounded-full bg-[#eaf6fd] px-2 py-1 text-[7px] font-bold text-[#075a91]">
//                       CURRENT
//                     </span>

//                   </div>

//                 </div> */}

//                 {/* SELECTED LOCATION */}

//                 {selectedState && (
//                   <div className="mt-5 rounded-lg border border-[#c9dfea] bg-white p-3 shadow-sm">

//                     <div className="mb-2 text-[7px] font-extrabold uppercase tracking-[1px] text-[#075a91]">
//                       Selected Location
//                     </div>

//                     <div className="flex items-start gap-2">

//                       <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf6fd] text-[#075a91]">
//                         <MapPin size={13} />
//                       </div>

//                       <div className="min-w-0">

//                         <div className="truncate text-[10px] font-extrabold text-[#003b63]">
//                           {selectedPanchayat?.name ||
//                             selectedBlock?.name ||
//                             selectedDistrict?.name ||
//                             selectedState.name}
//                         </div>

//                         <div className="mt-0.5 text-[7px] text-slate-400">
//                           {[
//                             selectedPanchayat?.name,
//                             selectedBlock?.name,
//                             selectedDistrict?.name,
//                             selectedState.name,
//                           ]
//                             .filter(Boolean)
//                             .join(" • ")}
//                         </div>

//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* CONTINUE */}

//               <div className="shrink-0 border-t border-[#dce8ef] bg-white p-3">
//                 <button
//                   type="button"
//                   disabled={!isComplete}
//                   onClick={handleContinue}
//                   className="flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#075a91] px-4 text-[9px] font-bold text-white shadow-[0_5px_14px_rgba(0,59,99,0.18)] transition hover:bg-[#003b63] disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   <span>
//                     Continue Planning
//                   </span>

//                   <ChevronRight size={13} />
//                 </button>
//               </div>
//             </section>

//             {/* RIGHT MAP */}

//             <section className="relative min-h-[360px] min-w-0 flex-1 bg-[#eaf1f4] lg:min-h-0">

//               <LocationMap
//                 latitude={mapLocation.latitude}
//                 longitude={mapLocation.longitude}
//                 zoom={mapLocation.zoom}
//                 label={mapLocation.label}
//                 level={mapLevel}
//                 stateName={selectedState?.name}
//                 districtName={selectedDistrict?.name}
//                 blockName={selectedBlock?.name}
//                 panchayatName={selectedPanchayat?.name}
//                 panchayatCode={selectedPanchayat?.gpcode}
//               />

//               {/* BOUNDARY LEGEND */}

//               <div className="absolute bottom-3 left-3 z-[1000] hidden rounded-lg border border-white/80 bg-white/95 p-2.5 shadow-lg backdrop-blur sm:block">

//                 <div className="mb-1.5 text-[7px] font-extrabold uppercase tracking-wide text-[#003b63]">
//                   Boundaries
//                 </div>

//                 <div className="flex items-center gap-2 text-[7px] text-slate-600">
//                   <span className="h-2.5 w-5 rounded-sm border-2 border-[#075a91]" />
//                   State
//                 </div>

//                 <div className="mt-1 flex items-center gap-2 text-[7px] text-slate-600">
//                   <span className="h-2.5 w-5 rounded-sm border-2 border-[#f58220]" />
//                   District
//                 </div>

//                 <div className="mt-1 flex items-center gap-2 text-[7px] text-slate-600">
//                   <span className="h-2.5 w-5 rounded-sm border-2 border-[#7c3aed]" />
//                   Block
//                 </div>

//                 <div className="mt-1 flex items-center gap-2 text-[7px] text-slate-600">
//                   <span className="h-2.5 w-5 rounded-sm border-2 border-[#00875a]" />
//                   Gram Panchayat
//                 </div>

//               </div>
//             </section>
//           </div>
//         </section>
//       </div>

//       {/* MODAL */}

//       <LocationSelectorModal
//         open={modalLevel !== null}
//         title={
//           modalLevel === "state"
//             ? "State"
//             : modalLevel === "district"
//               ? "District"
//               : modalLevel === "block"
//                 ? "Block"
//                 : "Gram Panchayat"
//         }
//         items={modalItems}
//         anchorRef={
//           modalLevel === "state"
//             ? stateFieldRef
//             : modalLevel === "district"
//               ? districtFieldRef
//               : modalLevel === "block"
//                 ? blockFieldRef
//                 : panchayatFieldRef
//         }
//         onSelect={(item) => {
//           switch (modalLevel) {
//             case "state":
//               handleStateSelect(item);
//               break;

//             case "district":
//               handleDistrictSelect(item);
//               break;

//             case "block":
//               handleBlockSelect(item);
//               break;

//             case "panchayat":
//               handlePanchayatSelect(item);
//               break;
//           }
//         }}
//         onClose={() => setModalLevel(null)}
//       />
//     </main>
//   );
// }

// /* =====================================================
//    LOCATION FIELD
// ===================================================== */

// function LocationField({
//   label,
//   value,
//   placeholder,
//   enabled,
//   selected,
//   onClick,
// }: {
//   label: string;
//   value?: string;
//   placeholder: string;
//   enabled: boolean;
//   selected: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <div className="mb-3">

//       <div className="mb-1.5 flex items-center justify-between">

//         <span className="text-[7px] font-extrabold tracking-[0.8px] text-[#475569]">
//           {label}
//         </span>

//         {selected && (
//           <span className="text-[6px] font-bold uppercase text-[#00875a]">
//             Selected
//           </span>
//         )}

//       </div>

//       <button
//         type="button"
//         disabled={!enabled}
//         onClick={onClick}
//         className={`group flex min-h-[42px] w-full cursor-pointer items-center gap-2 rounded-[6px] border px-3 text-left transition ${selected
//           ? "border-[#075a91] bg-white shadow-[0_3px_10px_rgba(0,59,99,0.08)]"
//           : enabled
//             ? "border-[#cbdde8] bg-white hover:border-[#075a91] hover:bg-[#f7fbfd]"
//             : "cursor-not-allowed border-[#e5edf1] bg-[#f4f7f9] opacity-55"
//           }`}
//       >
//         <div
//           className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${selected
//             ? "bg-[#075a91] text-white"
//             : "bg-[#eaf6fd] text-[#075a91]"
//             }`}
//         >
//           {selected ? (
//             <Check size={11} />
//           ) : (
//             <MapPin size={11} />
//           )}
//         </div>

//         <span
//           className={`min-w-0 flex-1 truncate text-[9px] font-semibold ${selected
//             ? "text-[#003b63]"
//             : enabled
//               ? "text-slate-500"
//               : "text-slate-400"
//             }`}
//         >
//           {value || placeholder}
//         </span>

//         <ChevronRight
//           size={13}
//           className={`shrink-0 transition ${enabled
//             ? "text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#075a91]"
//             : "text-slate-300"
//             }`}
//         />
//       </button>
//     </div>
//   );
// }







"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import LocationSelectorModal, {
  LocationBreadcrumb,
  LocationItem,
  LocationLevel,
} from "./LocationSelectorModal";

import LocationMap from "./LocationMap";


/* ============================================================
   TYPES
============================================================ */

export type LoginLevel =
  | "STATE"
  | "DISTRICT"
  | "BLOCK"
  | "PANCHAYAT";

interface InitialLocation {
  state?: LocationItem;
  district?: LocationItem;
  block?: LocationItem;
  panchayat?: LocationItem;
}

interface LocationSelectionWorkspaceProps {

  loginLevel: LoginLevel;

  initialLocation?: InitialLocation;

  states: LocationItem[];

  districts: LocationItem[];

  blocks: LocationItem[];

  panchayats: LocationItem[];

  loading?: boolean;

  /*
   * Optional callback whenever complete
   * location changes.
   */
  onLocationChange?: (location: {
    state: LocationItem | null;
    district: LocationItem | null;
    block: LocationItem | null;
    panchayat: LocationItem | null;
  }) => void;
}


/* ============================================================
   COMPONENT
============================================================ */

export default function LocationSelectionWorkspace({
  loginLevel,

  initialLocation,

  states,

  districts,

  blocks,

  panchayats,

  loading = false,

  onLocationChange,
}: LocationSelectionWorkspaceProps) {


  /* ==========================================================
     SELECTED LOCATION
  ========================================================== */

  const [selectedState, setSelectedState] =
    useState<LocationItem | null>(
      initialLocation?.state ?? null
    );

  const [selectedDistrict, setSelectedDistrict] =
    useState<LocationItem | null>(
      initialLocation?.district ?? null
    );

  const [selectedBlock, setSelectedBlock] =
    useState<LocationItem | null>(
      initialLocation?.block ?? null
    );

  const [selectedPanchayat, setSelectedPanchayat] =
    useState<LocationItem | null>(
      initialLocation?.panchayat ?? null
    );


  /* ==========================================================
     MODAL
  ========================================================== */

  const [modalOpen, setModalOpen] =
    useState(true);

  const [modalLevel, setModalLevel] =
    useState<LocationLevel>("state");


  /* ==========================================================
     INITIAL LOCATION / LOGIN LEVEL
  ========================================================== */

  useEffect(() => {

    setSelectedState(
      initialLocation?.state ?? null
    );

    setSelectedDistrict(
      initialLocation?.district ?? null
    );

    setSelectedBlock(
      initialLocation?.block ?? null
    );

    setSelectedPanchayat(
      initialLocation?.panchayat ?? null
    );


    /*
     * STATE LOGIN
     * State is already selected.
     * So directly open district.
     */

    if (loginLevel === "STATE") {

      setModalLevel("district");

      setModalOpen(true);

      return;
    }


    /*
     * DISTRICT LOGIN
     * State + District already selected.
     * Directly open block.
     */

    if (loginLevel === "DISTRICT") {

      setModalLevel("block");

      setModalOpen(true);

      return;
    }


    /*
     * BLOCK LOGIN
     * State + District + Block already selected.
     * Directly open panchayat.
     */

    if (loginLevel === "BLOCK") {

      setModalLevel("panchayat");

      setModalOpen(true);

      return;
    }


    /*
     * PANCHAYAT LOGIN
     * Everything already selected.
     * No selector needed.
     */

    if (loginLevel === "PANCHAYAT") {

      setModalLevel("panchayat");

      setModalOpen(false);

    }

  }, [
    loginLevel,
    initialLocation,
  ]);


  /* ==========================================================
     BREADCRUMB
  ========================================================== */

  const breadcrumb =
    useMemo<LocationBreadcrumb[]>(() => {

      const result: LocationBreadcrumb[] =
        [];

      if (selectedState) {

        result.push({
          level: "state",
          label: selectedState.name,
        });

      }

      if (selectedDistrict) {

        result.push({
          level: "district",
          label: selectedDistrict.name,
        });

      }

      if (selectedBlock) {

        result.push({
          level: "block",
          label: selectedBlock.name,
        });

      }

      if (selectedPanchayat) {

        result.push({
          level: "panchayat",
          label: selectedPanchayat.name,
        });

      }

      return result;

    }, [
      selectedState,
      selectedDistrict,
      selectedBlock,
      selectedPanchayat,
    ]);


  /* ==========================================================
     CURRENT ITEMS
  ========================================================== */

  const currentItems =
    useMemo<LocationItem[]>(() => {

      switch (modalLevel) {

        case "state":
          return states;

        case "district":
          return districts;

        case "block":
          return blocks;

        case "panchayat":
          return panchayats;

        default:
          return [];

      }

    }, [
      modalLevel,
      states,
      districts,
      blocks,
      panchayats,
    ]);


  /* ==========================================================
     LOCKED BREADCRUMBS
  ========================================================== */

  const lockedLevels =
    useMemo<LocationLevel[]>(() => {

      switch (loginLevel) {

        /*
         * State login:
         * State itself can be changed.
         */

        case "STATE":

          return [];


        /*
         * District login:
         * State + District are fixed.
         */

        case "DISTRICT":

          return [
            "state",
            "district",
          ];


        /*
         * Block login:
         * State + District + Block are fixed.
         */

        case "BLOCK":

          return [
            "state",
            "district",
            "block",
          ];


        /*
         * Panchayat login:
         * Everything fixed.
         */

        case "PANCHAYAT":

          return [
            "state",
            "district",
            "block",
            "panchayat",
          ];


        default:

          return [];

      }

    }, [loginLevel]);


  /* ==========================================================
     LOCATION CHANGE CALLBACK
  ========================================================== */

  useEffect(() => {

    onLocationChange?.({
      state: selectedState,
      district: selectedDistrict,
      block: selectedBlock,
      panchayat: selectedPanchayat,
    });

  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
    onLocationChange,
  ]);


  /* ==========================================================
     SELECT LOCATION
  ========================================================== */

  const handleSelect = (
    item: LocationItem
  ) => {

    switch (modalLevel) {

      /* ------------------------------------------------------
         STATE
      ------------------------------------------------------ */

      case "state":

        setSelectedState(item);

        /*
         * Reset children
         */

        setSelectedDistrict(null);

        setSelectedBlock(null);

        setSelectedPanchayat(null);

        /*
         * Next = district
         */

        setModalLevel("district");

        setModalOpen(true);

        break;


      /* ------------------------------------------------------
         DISTRICT
      ------------------------------------------------------ */

      case "district":

        setSelectedDistrict(item);

        /*
         * Reset children
         */

        setSelectedBlock(null);

        setSelectedPanchayat(null);

        /*
         * Next = block
         */

        setModalLevel("block");

        setModalOpen(true);

        break;


      /* ------------------------------------------------------
         BLOCK
      ------------------------------------------------------ */

      case "block":

        setSelectedBlock(item);

        /*
         * Reset panchayat
         */

        setSelectedPanchayat(null);

        /*
         * Next = panchayat
         */

        setModalLevel("panchayat");

        setModalOpen(true);

        break;


      /* ------------------------------------------------------
         PANCHAYAT
      ------------------------------------------------------ */

      case "panchayat":

        setSelectedPanchayat(item);

        /*
         * Selection completed
         */

        setModalOpen(false);

        break;

    }

  };


  /* ==========================================================
     BREADCRUMB CLICK
  ========================================================== */

  const handleBreadcrumbClick = (
    level: LocationLevel
  ) => {

    /*
     * Locked login-level location
     * cannot be changed.
     */

    if (
      lockedLevels.includes(level)
    ) {

      return;
    }


    switch (level) {

      case "state":

        setModalLevel("state");

        setModalOpen(true);

        break;


      case "district":

        /*
         * State must exist
         */

        if (!selectedState) {
          return;
        }

        setModalLevel("district");

        setModalOpen(true);

        break;


      case "block":

        if (!selectedDistrict) {
          return;
        }

        setModalLevel("block");

        setModalOpen(true);

        break;


      case "panchayat":

        if (!selectedBlock) {
          return;
        }

        setModalLevel("panchayat");

        setModalOpen(true);

        break;

    }

  };


  /* ==========================================================
     MAP LOCATION
  ========================================================== */

  const mapLocation = useMemo(() => {

    /*
     * Replace these fallback coordinates with
     * your actual location data if available.
     */

    if (selectedPanchayat) {

      return {
        latitude: 23.3441,
        longitude: 85.3096,
        zoom: 12,
        label: selectedPanchayat.name,
      };

    }

    if (selectedBlock) {

      return {
        latitude: 23.3441,
        longitude: 85.3096,
        zoom: 11,
        label: selectedBlock.name,
      };

    }

    if (selectedDistrict) {

      return {
        latitude: 23.3441,
        longitude: 85.3096,
        zoom: 9,
        label: selectedDistrict.name,
      };

    }

    if (selectedState) {

      return {
        latitude: 23.6102,
        longitude: 85.2799,
        zoom: 7,
        label: selectedState.name,
      };

    }

    return {
      latitude: 23.6102,
      longitude: 85.2799,
      zoom: 5,
      label: "India",
    };

  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
  ]);


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <div className="
      flex
      h-full
      min-h-0
      w-full
      flex-col
      overflow-hidden
      bg-[#eef3f6]
      lg:flex-row
    ">


      {/* ======================================================
          LEFT LOCATION PANEL
      ====================================================== */}

      <section className="
        flex
        h-[52%]
        min-h-0
        w-full
        flex-col
        overflow-hidden
        border-b
        border-[#d7e3ea]
        bg-[#f5f8fa]
        lg:h-full
        lg:w-[380px]
        lg:shrink-0
        lg:border-b-0
        lg:border-r
      ">

        <LocationSelectorModal

          open={modalOpen}

          level={modalLevel}

          items={currentItems}

          breadcrumb={breadcrumb}

          loading={loading}

          lockedLevels={lockedLevels}

          onSelect={handleSelect}

          onBreadcrumbClick={
            handleBreadcrumbClick
          }

          onClose={() =>
            setModalOpen(false)
          }

        />

      </section>


      {/* ======================================================
          MAP
      ====================================================== */}

      <section className="
        relative
        min-h-0
        min-w-0
        flex-1
        bg-[#eaf1f4]
      ">

        <LocationMap
          latitude={
            mapLocation.latitude
          }
          longitude={
            mapLocation.longitude
          }
          zoom={mapLocation.zoom}
          label={mapLocation.label}

          level={modalLevel}

          stateName={
            selectedState?.name
          }

          districtName={
            selectedDistrict?.name
          }

          blockName={
            selectedBlock?.name
          }

          panchayatName={
            selectedPanchayat?.name
          }

        />

      </section>

    </div>

  );
}