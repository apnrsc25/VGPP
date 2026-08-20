// "use client";

// import {
//   Search,
//   X,
//   MapPin,
//   ChevronRight,
// } from "lucide-react";

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// interface Item {
//   id: string;
//   name: string;
// }

// interface LocationSelectorModalProps {
//   open: boolean;
//   title: string;
//   items: Item[];
//   onSelect: (item: Item) => void;
//   onClose: () => void;
// }

// export default function LocationSelectorModal({
//   open,
//   title,
//   items,
//   onSelect,
//   onClose,
// }: LocationSelectorModalProps) {
//   const [search, setSearch] =
//     useState("");

//   useEffect(() => {
//     if (open) {
//       setSearch("");
//     }
//   }, [open, title]);

//   const filteredItems = useMemo(() => {
//     const query =
//       search.trim().toLowerCase();

//     if (!query) {
//       return items;
//     }

//     return items.filter(
//       (item) =>
//         item.name
//           .toLowerCase()
//           .includes(query)
//     );
//   }, [
//     items,
//     search,
//   ]);

//   if (!open) {
//     return null;
//   }

//   return (
//     <div
//       className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#003b63]/45 px-3 py-4 backdrop-blur-[3px]"
//       onClick={onClose}
//     >
//       <div
//         className="flex max-h-[82vh] w-full max-w-[440px] flex-col overflow-hidden rounded-[10px] border border-[#c7dce8] bg-white shadow-[0_20px_60px_rgba(0,59,99,0.28)]"
//         onClick={(event) =>
//           event.stopPropagation()
//         }
//       >
//         {/* ACCENT */}

//         <div className="h-[4px] shrink-0 bg-gradient-to-r from-[#075a91] via-[#0c6fa6] to-[#f58220]" />

//         {/* HEADER */}

//         <div className="flex shrink-0 items-center justify-between border-b border-[#dce8ef] bg-[#f6fafc] px-4 py-3">
//           <div className="flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#075a91] text-white">
//               <MapPin size={15} />
//             </div>

//             <div>
//               <div className="text-[12px] font-extrabold text-[#003b63]">
//                 Select {title}
//               </div>

//               <div className="text-[8px] text-slate-400">
//                 Choose your planning area
//               </div>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#f58220] hover:bg-[#fff7ed] hover:text-[#d86d0b]"
//           >
//             <X size={14} />
//           </button>
//         </div>

//         {/* SEARCH */}

//         <div className="shrink-0 border-b border-[#e5edf2] p-3">
//           <div className="relative">
//             <Search
//               size={14}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               autoFocus
//               value={search}
//               onChange={(event) =>
//                 setSearch(
//                   event.target.value
//                 )
//               }
//               placeholder={`Search ${title.toLowerCase()}...`}
//               className="h-9 w-full rounded-md border border-[#cbd9e2] bg-white pl-9 pr-3 text-[10px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
//             />
//           </div>
//         </div>

//         {/* LIST */}

//         <div className="min-h-0 flex-1 overflow-y-auto p-2">
//           {filteredItems.length > 0 ? (
//             filteredItems.map(
//               (item) => (
//                 <button
//                   key={item.id}
//                   type="button"
//                   onClick={() =>
//                     onSelect(item)
//                   }
//                   className="group flex min-h-[48px] w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 text-left transition hover:border-[#c8e0ed] hover:bg-[#f1f8fb]"
//                 >
//                   <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf6fd] text-[#075a91] transition group-hover:bg-[#075a91] group-hover:text-white">
//                     <MapPin size={12} />
//                   </div>

//                   <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#20354a]">
//                     {item.name}
//                   </span>

//                   <ChevronRight
//                     size={14}
//                     className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#075a91]"
//                   />
//                 </button>
//               )
//             )
//           ) : (
//             <div className="py-12 text-center">
//               <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f8] text-slate-400">
//                 <Search size={15} />
//               </div>

//               <div className="text-[10px] font-semibold text-slate-500">
//                 No {title.toLowerCase()} found
//               </div>

//               <div className="mt-1 text-[8px] text-slate-400">
//                 Try another search term.
//               </div>
//             </div>
//           )}
//         </div>

//         {/* FOOTER */}

//         <div className="shrink-0 border-t border-[#e1ebf1] bg-[#f9fbfc] px-4 py-2 text-right">
//           <span className="text-[8px] font-medium text-slate-400">
//             {filteredItems.length}{" "}
//             results
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { X, Search, MapPin } from "lucide-react";
// import { useEffect, useState } from "react";

// interface LocationItem {
//   id: string;
//   name: string;
// }

// interface LocationSelectorModalProps {
//   open: boolean;
//   title: string;
//   items: LocationItem[];
//   onSelect: (item: LocationItem) => void;
//   onClose: () => void;
//   anchorRef?: React.RefObject<HTMLElement | null>;
// }

// export default function LocationSelectorModal({
//   open,
//   title,
//   items,
//   onSelect,
//   onClose,
//   anchorRef,
// }: LocationSelectorModalProps) {
//   const [search, setSearch] = useState("");
//   const [position, setPosition] = useState({
//     top: 0,
//     left: 0,
//     width: 0,
//   });

//   useEffect(() => {
//     if (!open || !anchorRef?.current) {
//       return;
//     }

//     const updatePosition = () => {
//       const rect =
//         anchorRef.current?.getBoundingClientRect();

//       if (!rect) {
//         return;
//       }

//       const modalHeight = 320;
//       const gap = 6;

//       const spaceBelow =
//         window.innerHeight - rect.bottom;

//       const openAbove =
//         spaceBelow < modalHeight &&
//         rect.top > modalHeight;

//       setPosition({
//         top: openAbove
//           ? rect.top - modalHeight - gap
//           : rect.bottom + gap,

//         left: rect.left,

//         width: rect.width,
//       });
//     };

//     updatePosition();

//     window.addEventListener(
//       "resize",
//       updatePosition
//     );

//     window.addEventListener(
//       "scroll",
//       updatePosition,
//       true
//     );

//     return () => {
//       window.removeEventListener(
//         "resize",
//         updatePosition
//       );

//       window.removeEventListener(
//         "scroll",
//         updatePosition,
//         true
//       );
//     };
//   }, [open, anchorRef]);

//   useEffect(() => {
//     if (!open) {
//       setSearch("");
//     }
//   }, [open]);

//   if (!open) {
//     return null;
//   }

//   const filteredItems =
//     items.filter((item) =>
//       item.name
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     );

//   return (
//     <div
//       className="fixed z-[100]"
//       style={{
//         top: position.top,
//         left: position.left,
//         width: position.width,
//       }}
//     >
//       <div className="overflow-hidden rounded-[8px] border border-[#cbdde7] bg-white shadow-[0_12px_30px_rgba(0,59,99,0.18)]">

//         {/* HEADER */}

//         <div className="flex h-10 items-center justify-between border-b border-[#d7e5ed] bg-[#f7fbfd] px-3">

//           <div className="flex items-center gap-2">

//             <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#075a91] text-white">
//               <MapPin size={12} />
//             </div>

//             <div>
//               <p className="text-[9px] font-extrabold uppercase tracking-[0.4px] text-[#003b63]">
//                 Select {title}
//               </p>

//               <p className="text-[7px] text-slate-400">
//                 Choose from available locations
//               </p>
//             </div>

//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-[#edf5f9] hover:text-[#075a91]"
//           >
//             <X size={12} />
//           </button>

//         </div>


//         {/* SEARCH */}

//         <div className="border-b border-[#e4edf2] p-2">

//           <div className="relative">

//             <Search
//               size={11}
//               className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(event) =>
//                 setSearch(event.target.value)
//               }
//               placeholder={`Search ${title.toLowerCase()}...`}
//               className="h-8 w-full rounded-[5px] border border-[#cbdde7] bg-white pl-7 pr-2 text-[9px] text-[#263f52] outline-none focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
//             />

//           </div>

//         </div>


//         {/* LIST */}

//         <div className="max-h-[260px] overflow-y-auto p-1.5">

//           {filteredItems.length > 0 ? (
//             filteredItems.map((item) => (
//               <button
//                 key={item.id}
//                 type="button"
//                 onClick={() => onSelect(item)}
//                 className="flex w-full cursor-pointer items-center gap-2 rounded-[5px] px-2.5 py-2 text-left transition hover:bg-[#eef7fb]"
//               >

//                 <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#edf7fc] text-[#075a91]">
//                   <MapPin size={11} />
//                 </span>

//                 <span className="truncate text-[9px] font-semibold text-[#36566b]">
//                   {item.name}
//                 </span>

//               </button>
//             ))
//           ) : (
//             <div className="px-3 py-8 text-center">

//               <p className="text-[9px] font-bold text-slate-500">
//                 No {title.toLowerCase()} found
//               </p>

//               <p className="mt-1 text-[7px] text-slate-400">
//                 Try another search.
//               </p>

//             </div>
//           )}

//         </div>

//       </div>
//     </div>
//   );
// }



"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  ChevronRight,
  X,
} from "lucide-react";

export type LocationLevel =
  | "state"
  | "district"
  | "block"
  | "panchayat";

export interface LocationItem {
  id: string;
  name: string;
}

export interface LocationBreadcrumb {
  level: LocationLevel;
  label: string;
}

interface LocationSelectorModalProps {
  open: boolean;

  level: LocationLevel;

  items: LocationItem[];

  breadcrumb: LocationBreadcrumb[];

  loading?: boolean;

  onSelect: (item: LocationItem) => void;

  onBreadcrumbClick: (
    level: LocationLevel
  ) => void;

  onClose?: () => void;

  lockedLevels?: LocationLevel[];
}

const LEVEL_TITLES: Record<
  LocationLevel,
  string
> = {
  state: "CHOOSE STATE",
  district: "CHOOSE DISTRICT",
  block: "CHOOSE BLOCK",
  panchayat: "CHOOSE PANCHAYAT",
};

export default function LocationSelectorModal({
  open,
  level,
  items,
  breadcrumb,
  loading = false,
  onSelect,
  onBreadcrumbClick,
  onClose,
  lockedLevels = [],
}: LocationSelectorModalProps) {
  const [search, setSearch] = useState("");

  /*
   * Reset search whenever level changes
   */
  useEffect(() => {
    setSearch("");
  }, [level]);

  /*
   * Filter list
   */
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [items, search]);

  if (!open) {
    return null;
  }

  const isBreadcrumbLocked = (
    breadcrumbLevel: LocationLevel
  ) => {
    return lockedLevels.includes(
      breadcrumbLevel
    );
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f5f8fa]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="shrink-0 border-b border-[#d9e5ec] bg-[#f5f8fa] px-4 pt-4 sm:px-5">

        {/* TITLE */}

        <div className="flex items-center justify-between">

          <div>
            <div className="text-[9px] font-bold uppercase tracking-[1px] text-[#64748b]">
              Location Selection
            </div>

            <div className="mt-0.5 text-[13px] font-bold text-[#003b63]">
              {LEVEL_TITLES[level]}
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                text-[#64748b]
                transition
                hover:bg-white
                hover:text-[#003b63]
              "
            >
              <X size={15} />
            </button>
          )}

        </div>


        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="mt-3 overflow-x-auto pb-1">

          <div className="flex min-w-max items-center gap-1.5">

            {breadcrumb.length === 0 ? (

              <div
                className="
                  rounded-full
                  border
                  border-[#16375b]
                  bg-[#16375b]
                  px-3
                  py-1.5
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.3px]
                  text-white
                "
              >
                {LEVEL_TITLES[level]}
              </div>

            ) : (

              <>
                {breadcrumb.map(
                  (crumb, index) => {

                    const isLast =
                      index ===
                      breadcrumb.length - 1;

                    const locked =
                      isBreadcrumbLocked(
                        crumb.level
                      );

                    return (
                      <React.Fragment
                        key={`${crumb.level}-${crumb.label}`}
                      >

                        <button
                          type="button"
                          disabled={locked}
                          onClick={() => {
                            if (!locked) {
                              onBreadcrumbClick(
                                crumb.level
                              );
                            }
                          }}
                          className={`
                            shrink-0
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.3px]
                            transition

                            ${
                              isLast
                                ? `
                                  border-[#16375b]
                                  bg-[#16375b]
                                  text-white
                                  shadow-sm
                                `
                                : locked
                                  ? `
                                    cursor-not-allowed
                                    border-[#d8e2e9]
                                    bg-[#edf2f5]
                                    text-[#94a3b8]
                                  `
                                  : `
                                    border-[#cfdee8]
                                    bg-[#edf4f8]
                                    text-[#16375b]
                                    hover:border-[#075a91]
                                    hover:bg-white
                                  `
                            }
                          `}
                        >
                          {crumb.label}
                        </button>

                        {!isLast && (
                          <ChevronRight
                            size={12}
                            className="shrink-0 text-[#94a3b8]"
                          />
                        )}

                      </React.Fragment>
                    );
                  }
                )}

                {/* CURRENT LEVEL */}

                {breadcrumb[
                  breadcrumb.length - 1
                ]?.level !== level && (
                  <>
                    <ChevronRight
                      size={12}
                      className="shrink-0 text-[#94a3b8]"
                    />

                    <div
                      className="
                        shrink-0
                        rounded-full
                        border
                        border-[#16375b]
                        bg-[#16375b]
                        px-3
                        py-1.5
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.3px]
                        text-white
                      "
                    >
                      {LEVEL_TITLES[level]}
                    </div>
                  </>
                )}
              </>
            )}

          </div>

        </div>


        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="mt-3 flex gap-2">

          <div className="relative min-w-0 flex-1">

            <Search
              size={14}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#94a3b8]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search..."
              className="
                h-9
                w-full
                rounded-[9px]
                border
                border-[#cfdeea]
                bg-white
                pl-9
                pr-3
                text-[11px]
                text-[#16375b]
                outline-none
                placeholder:text-[#94a3b8]
                focus:border-[#075a91]
                focus:ring-2
                focus:ring-[#075a91]/10
              "
            />

          </div>


          <button
            type="button"
            onClick={() => setSearch("")}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-[9px]
              border
              border-[#cfdeea]
              bg-white
              text-[#075a91]
              transition
              hover:bg-[#f0f7fb]
            "
            title="Clear search"
          >
            <RotateCcw size={16} />
          </button>

        </div>


        {/* COUNT */}

        <div className="mt-3 pb-3">

          <span className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.5px]
            text-[#003b63]
          ">
            {LEVEL_TITLES[level]}
          </span>

          <span className="
            ml-2
            text-[8px]
            text-[#94a3b8]
          ">
            {filteredItems.length}{" "}
            {filteredItems.length === 1
              ? "result"
              : "results"}
          </span>

        </div>

      </div>


      {/* =====================================================
          LIST
      ===================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">

        <div className="
          overflow-hidden
          rounded-[12px]
          border
          border-[#d7e4eb]
          bg-white
        ">

          {/* LOADING */}

          {loading && (
            <div className="
              flex
              min-h-[180px]
              items-center
              justify-center
            ">
              <div className="
                text-[10px]
                font-semibold
                text-[#64748b]
              ">
                Loading...
              </div>
            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            filteredItems.length === 0 && (
              <div className="
                flex
                min-h-[180px]
                flex-col
                items-center
                justify-center
                px-5
                text-center
              ">

                <Search
                  size={28}
                  className="text-[#cbd5e1]"
                />

                <div className="
                  mt-2
                  text-[11px]
                  font-bold
                  text-[#475569]
                ">
                  No location found
                </div>

                <div className="
                  mt-1
                  text-[9px]
                  text-[#94a3b8]
                ">
                  Try another search term.
                </div>

              </div>
            )}


          {/* DATA */}

          {!loading &&
            filteredItems.map((item) => (

              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onSelect(item)
                }
                className="
                  group
                  flex
                  min-h-[47px]
                  w-full
                  items-center
                  border-b
                  border-[#e5edf2]
                  px-4
                  text-left
                  transition
                  last:border-b-0
                  hover:bg-[#f4f9fc]
                "
              >

                <span className="
                  min-w-0
                  flex-1
                  truncate
                  text-[11px]
                  font-medium
                  uppercase
                  text-[#0b3154]
                  transition
                  group-hover:text-[#075a91]
                  sm:text-[12px]
                ">
                  {item.name}
                </span>

                <ChevronRight
                  size={15}
                  className="
                    ml-2
                    shrink-0
                    text-[#cbd5e1]
                    transition
                    group-hover:text-[#075a91]
                  "
                />

              </button>

            ))}

        </div>

      </div>

    </div>
  );
}