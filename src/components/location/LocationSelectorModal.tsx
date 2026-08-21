"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  ChevronRight,
  X,
} from "lucide-react";

export type LocationLevel =
  | "national"
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
  national: "SELECT INDIA",
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

      <div className="shrink-0 border-t border-[#d9e5ec] bg-[#f5f8fa] px-4 pt-4 sm:px-5">

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