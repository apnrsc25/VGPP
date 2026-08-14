// "use client";

// import {
//   Search,
//   X,
//   MapPin,
//   ChevronRight,
// } from "lucide-react";

// import { useMemo, useState } from "react";

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

//   const filteredItems = useMemo(() => {
//     const query =
//       search.trim().toLowerCase();

//     if (!query) {
//       return items;
//     }

//     return items.filter((item) =>
//       item.name
//         .toLowerCase()
//         .includes(query)
//     );
//   }, [items, search]);

//   if (!open) {
//     return null;
//   }

//   return (
//     <div
//       className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#003b63]/40 px-3 py-4 backdrop-blur-[3px]"
//       onClick={onClose}
//     >
//       <div
//         className="flex max-h-[82vh] w-full max-w-[440px] flex-col overflow-hidden rounded-[10px] border border-[#c7dce8] bg-white shadow-[0_20px_60px_rgba(0,59,99,0.25)]"
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
//             filteredItems.map((item) => (
//               <button
//                 key={item.id}
//                 type="button"
//                 onClick={() =>
//                   onSelect(item)
//                 }
//                 className="group flex min-h-[48px] w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 text-left transition hover:border-[#c8e0ed] hover:bg-[#f1f8fb]"
//               >

//                 <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf6fd] text-[#075a91] transition group-hover:bg-[#075a91] group-hover:text-white">
//                   <MapPin size={12} />
//                 </div>

//                 <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#20354a]">
//                   {item.name}
//                 </span>

//                 <ChevronRight
//                   size={14}
//                   className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#075a91]"
//                 />

//               </button>
//             ))
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
//             {filteredItems.length} results
//           </span>

//         </div>

//       </div>
//     </div>
//   );
// }





"use client";

import {
  Search,
  X,
  MapPin,
  ChevronRight,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

interface Item {
  id: string;
  name: string;
}

interface LocationSelectorModalProps {
  open: boolean;
  title: string;
  items: Item[];
  onSelect: (item: Item) => void;
  onClose: () => void;
}

export default function LocationSelectorModal({
  open,
  title,
  items,
  onSelect,
  onClose,
}: LocationSelectorModalProps) {
  const [search, setSearch] =
    useState("");

  useEffect(() => {
    if (open) {
      setSearch("");
    }
  }, [open, title]);

  const filteredItems = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(query)
    );
  }, [
    items,
    search,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#003b63]/45 px-3 py-4 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="flex max-h-[82vh] w-full max-w-[440px] flex-col overflow-hidden rounded-[10px] border border-[#c7dce8] bg-white shadow-[0_20px_60px_rgba(0,59,99,0.28)]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* ACCENT */}

        <div className="h-[4px] shrink-0 bg-gradient-to-r from-[#075a91] via-[#0c6fa6] to-[#f58220]" />

        {/* HEADER */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#dce8ef] bg-[#f6fafc] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#075a91] text-white">
              <MapPin size={15} />
            </div>

            <div>
              <div className="text-[12px] font-extrabold text-[#003b63]">
                Select {title}
              </div>

              <div className="text-[8px] text-slate-400">
                Choose your planning area
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#f58220] hover:bg-[#fff7ed] hover:text-[#d86d0b]"
          >
            <X size={14} />
          </button>
        </div>

        {/* SEARCH */}

        <div className="shrink-0 border-b border-[#e5edf2] p-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              autoFocus
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={`Search ${title.toLowerCase()}...`}
              className="h-9 w-full rounded-md border border-[#cbd9e2] bg-white pl-9 pr-3 text-[10px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
            />
          </div>
        </div>

        {/* LIST */}

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {filteredItems.length > 0 ? (
            filteredItems.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onSelect(item)
                  }
                  className="group flex min-h-[48px] w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 text-left transition hover:border-[#c8e0ed] hover:bg-[#f1f8fb]"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf6fd] text-[#075a91] transition group-hover:bg-[#075a91] group-hover:text-white">
                    <MapPin size={12} />
                  </div>

                  <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#20354a]">
                    {item.name}
                  </span>

                  <ChevronRight
                    size={14}
                    className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#075a91]"
                  />
                </button>
              )
            )
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f8] text-slate-400">
                <Search size={15} />
              </div>

              <div className="text-[10px] font-semibold text-slate-500">
                No {title.toLowerCase()} found
              </div>

              <div className="mt-1 text-[8px] text-slate-400">
                Try another search term.
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="shrink-0 border-t border-[#e1ebf1] bg-[#f9fbfc] px-4 py-2 text-right">
          <span className="text-[8px] font-medium text-slate-400">
            {filteredItems.length}{" "}
            results
          </span>
        </div>
      </div>
    </div>
  );
}