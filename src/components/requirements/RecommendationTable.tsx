"use client";

import {
  Filter,
  Search,
  X,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

import type { Work } from "@/types/work";
import SummaryTab from "@/components/common/SummaryTab";

interface RecommendationTableProps {
  works: Work[];
  selectedWorks: Record<string, number>;

  search: string;
  onSearchChange: (value: string) => void;

  themes: string[];
  subThemes: string[];
  types: string[];

  selectedThemes: string[];
  selectedSubThemes: string[];
  selectedTypes: string[];

  filterOpen: boolean;

  onFilterToggle: () => void;

  onThemeChange: (values: string[]) => void;
  onSubThemeChange: (values: string[]) => void;
  onTypeChange: (values: string[]) => void;

  onClearFilters: () => void;

  onAddWork: (work: Work) => void;
}

export default function RecommendationTable({
  works,
  selectedWorks,
  search,
  onSearchChange,
  themes,
  subThemes,
  types,
  selectedThemes,
  selectedSubThemes,
  selectedTypes,
  filterOpen,
  onFilterToggle,
  onThemeChange,
  onSubThemeChange,
  onTypeChange,
  onClearFilters,
  onAddWork,
}: RecommendationTableProps) {
  const activeFilterCount =
    selectedThemes.length +
    selectedSubThemes.length +
    selectedTypes.length;

  const toggle = (
    value: string,
    selected: string[],
    setter: (values: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setter(
        selected.filter(
          (item) => item !== value
        )
      );
    } else {
      setter([...selected, value]);
    }
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="shrink-0 border-b border-[#d7e5ed] bg-gradient-to-r from-[#f3faff] via-white to-[#fffaf5]">

        <div className="flex min-h-[62px] flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4">

          {/* TITLE */}

          <div className="flex min-w-0 items-center gap-2">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] bg-[#075a91] text-white shadow-sm">
              <Filter size={14} />
            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-1.5">

                <h2 className="truncate text-[11px] font-extrabold tracking-[0.5px] text-[#003b63] sm:text-[13px]">
                  E-JAL RECOMMENDATIONS
                </h2>

                <span className="hidden rounded-full bg-[#fff0e5] px-1.5 py-0.5 text-[7px] font-bold text-[#f58220] sm:inline-flex">
                  RECOMMENDED
                </span>

              </div>

              <p className="hidden text-[7px] text-slate-400 sm:block">
                Recommended works available for selection
              </p>

            </div>

          </div>


          {/* SEARCH */}

          <div className="relative order-3 w-full sm:order-none sm:min-w-[150px] sm:flex-1 sm:max-w-[330px]">

            <Search
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8aa1af]"
            />

            <input
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search works..."
              className="
                h-9
                w-full
                rounded-[5px]
                border
                border-[#c9dbe5]
                bg-white
                pl-9
                pr-3
                text-[10px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                hover:border-[#9dbdcc]
                focus:border-[#075a91]
                focus:ring-2
                focus:ring-[#075a91]/10
                sm:h-8
              "
            />

          </div>


          {/* FILTER */}

          <button
            type="button"
            onClick={onFilterToggle}
            title="Filter recommendations"
            className="
              relative
              flex
              h-9
              w-9
              cursor-pointer
              shrink-0
              items-center
              justify-center
              rounded-[5px]
              border
              border-[#c9dbe5]
              bg-white
              text-[#36566b]
              shadow-sm
              transition
              hover:border-[#8fb6c9]
              hover:bg-[#eef7fb]
              hover:text-[#075a91]
              active:scale-95
              sm:h-8
              sm:w-8
            "
          >
            <SlidersHorizontal size={14} />

            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f58220] px-1 text-[7px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>


          {/* COUNT */}

          <div className="ml-auto flex shrink-0 items-center gap-1.5">

            <span className="hidden text-[7px] font-semibold uppercase text-slate-400 sm:block">
              Showing
            </span>

            <span className="rounded-[4px] bg-[#075a91] px-2 py-1 text-[9px] font-extrabold text-white shadow-sm">
              {works.length}
            </span>

            <span className="hidden text-[8px] font-bold text-[#475569] sm:block">
              WORKS
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          FILTER PANEL
      ====================================================== */}

      {filterOpen && (
        <div
          className="
            absolute
            left-2
            right-2
            top-[62px]
            z-[2000]
            overflow-hidden
            rounded-[7px]
            border
            border-[#cddfe8]
            bg-white
            shadow-[0_12px_35px_rgba(0,59,99,0.16)]
            sm:left-3
            sm:right-auto
            sm:w-[330px]
          "
        >

          <div className="flex h-10 items-center justify-between border-b border-[#e0e9ee] bg-[#f5fafc] px-3">

            <div className="flex items-center gap-2">

              <Filter
                size={12}
                className="text-[#075a91]"
              />

              <span className="text-[10px] font-bold text-[#334155]">
                FILTER WORKS
              </span>

            </div>

            <button
              type="button"
              onClick={onFilterToggle}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-white hover:text-slate-700"
            >
              <X size={13} />
            </button>

          </div>


          <div className="max-h-[340px] overflow-y-auto px-3 py-2">

            <FilterGroup
              title="THEME"
              values={themes}
              selected={selectedThemes}
              onToggle={(value) =>
                toggle(
                  value,
                  selectedThemes,
                  onThemeChange
                )
              }
            />

            <FilterGroup
              title="SUB THEME"
              values={subThemes}
              selected={selectedSubThemes}
              onToggle={(value) =>
                toggle(
                  value,
                  selectedSubThemes,
                  onSubThemeChange
                )
              }
            />

            <FilterGroup
              title="TYPE"
              values={types}
              selected={selectedTypes}
              onToggle={(value) =>
                toggle(
                  value,
                  selectedTypes,
                  onTypeChange
                )
              }
            />

          </div>


          {activeFilterCount > 0 && (
            <div className="flex justify-end border-t border-[#e0e9ee] bg-[#fafcfd] px-3 py-2">

              <button
                type="button"
                onClick={onClearFilters}
                className="cursor-pointer text-[9px] font-bold text-[#075a91] hover:text-[#f58220]"
              >
                Clear all filters
              </button>

            </div>
          )}

        </div>
      )}


      {/* =====================================================
          CATEGORY SUMMARY
      ====================================================== */}

      <div className="grid h-14 shrink-0 grid-cols-3 border-b border-[#dce7ed] bg-white">

        <SummaryTab
          value={works.length}
          label="E-JAL"
          active
          valueColor="#f58220"
        />

        <SummaryTab
          value={0}
          label="OTHER"
        />

        <SummaryTab
          value={0}
          label="OTHER"
        />

      </div>


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="min-h-0 flex-1 overflow-auto">

        <div className="min-w-[650px]">

          <div className="grid grid-cols-[38px_minmax(0,1.5fr)_minmax(0,1fr)_60px_50px] items-center bg-[#003b63] px-2 py-2 text-[8px] font-bold uppercase tracking-[0.5px] text-white sm:text-[9px]">

            <span>#</span>

            <span>WORK NAME</span>

            <span>SUB THEME</span>

            <span>QTY</span>

            <span className="text-center">
              ADD
            </span>

          </div>


          {works.map((work, index) => {

            const selected = selectedWorks[work.id] ?? 0;

            const remaining = Math.max(work?.count - selected,0);

            const disabled =
              remaining === 0;


            return (
              <div
                key={work.id}
                className="
                  group
                  grid
                  min-h-[42px]
                  grid-cols-[38px_minmax(0,1.5fr)_minmax(0,1fr)_60px_50px]
                  items-center
                  border-b
                  border-[#e4edf2]
                  px-2
                  py-1.5
                  text-[9px]
                  text-[#334155]
                  transition
                  hover:bg-[#f3f9fc]
                  sm:min-h-[44px]
                  sm:text-[10px]
                "
              >

                <span className="font-mono text-[8px] font-semibold text-slate-400 group-hover:text-[#075a91]">
                  {String(index + 1).padStart(2, "0")}
                </span>


                <span
                  className="truncate pr-2 font-semibold text-[#263f52]"
                  title={work.workName}
                >
                  {work.workName}
                </span>


                <span
                  className="truncate pr-2 text-slate-500"
                  title={work.subTheme}
                >
                  {work.subTheme}
                </span>


                <span>
                  <span className="inline-flex min-w-7 justify-center rounded-[4px] bg-[#edf7fc] px-1.5 py-1 text-[8px] font-bold text-[#075a91]">
                    {remaining}
                  </span>
                </span>


                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onAddWork(work)}
                  className={`
                    mx-auto
                    flex
                    h-7
                    w-7
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    border
                    transition-all
                    active:scale-90
                    ${
                      disabled
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
                        : "border-[#9ed1b8] bg-[#f0fbf5] text-[#00875a] hover:border-[#00875a] hover:bg-[#00875a] hover:text-white"
                    }
                  `}
                >
                  <Plus size={13} />
                </button>

              </div>
            );
          })}


          {works.length === 0 && (
            <div className="flex min-h-[220px] flex-col items-center justify-center">

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7fc] text-[#075a91]">
                <Search size={17} />
              </div>

              <p className="text-[10px] font-bold text-slate-500">
                No recommendations found
              </p>

              <p className="mt-1 text-[8px] text-slate-400">
                Try changing your search or filters.
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}


function FilterGroup({
  title,
  values,
  selected,
  onToggle,
}: {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="border-b border-[#edf2f5] py-2.5 last:border-b-0">

      <div className="mb-2 text-[8px] font-bold uppercase tracking-[0.6px] text-slate-400">
        {title}
      </div>

      <div className="flex flex-wrap gap-1.5">

        {values.map((value) => {

          const active =
            selected.includes(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className={`
                cursor-pointer
                rounded-full
                border
                px-2.5
                py-1
                text-[8px]
                font-medium
                transition
                ${
                  active
                    ? "border-[#075a91] bg-[#075a91] font-bold text-white shadow-sm"
                    : "border-[#cbdde7] bg-white text-slate-600 hover:border-[#8db5c9] hover:bg-[#f1f8fb]"
                }
              `}
            >
              {value}
            </button>
          );
        })}

      </div>

    </div>
  );
}