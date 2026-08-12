"use client";

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
      {/* HEADER */}

      <div className="flex h-11 shrink-0 items-center border-b border-slate-200 bg-[#eaf6fd] px-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#287bd1]" />

          <span className="whitespace-nowrap text-[13px] font-bold text-[#10234a]">
            E-JAL RECOMMENDATIONS
          </span>
        </div>

        <input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search works..."
          className="mr-2 h-7 w-[240px] rounded-md border border-slate-300 bg-white px-3 text-[10px] outline-none placeholder:text-slate-400 focus:border-[#168dcc]"
        />

        <button
          type="button"
          onClick={onFilterToggle}
          className="relative mr-2 flex h-7 w-7 items-center justify-center rounded-md text-[#10234a] hover:bg-white"
        >
          <span className="text-[16px]">
            ☷
          </span>

          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#078aca] px-1 text-[8px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <span className="whitespace-nowrap text-[12px] font-bold text-[#10234a]">
          {works.length} WORKS
        </span>
      </div>

      {/* FILTER */}

      {filterOpen && (
        <div className="absolute left-3 top-[45px] z-[2000] w-[280px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="flex h-8 items-center justify-between border-b px-3">
            <span className="text-[10px] font-semibold text-slate-700">
              Filter by
            </span>

            <button
              type="button"
              onClick={onFilterToggle}
              className="text-[14px] text-slate-400"
            >
              ×
            </button>
          </div>

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

          {activeFilterCount > 0 && (
            <div className="border-t px-3 py-2 text-right">
              <button
                type="button"
                onClick={onClearFilters}
                className="text-[9px] font-semibold text-[#078aca]"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* CATEGORY TABS */}

      <div className="grid h-12 shrink-0 grid-cols-3 border-b border-slate-300">
        <SummaryTab
          value={works.length}
          label="E-JAL"
          active
          valueColor="#e66a00"
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

      {/* TABLE HEADER */}

      <div className="grid shrink-0 grid-cols-[38px_minmax(0,1.5fr)_minmax(0,1fr)_55px_45px] items-center bg-[#111d42] px-2 py-2 text-[9px] font-bold text-white">
        <span>#</span>
        <span>WORK NAME</span>
        <span>SUB THEME</span>
        <span>QTY</span>
        <span className="text-center">+</span>
      </div>

      {/* ROWS */}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {works.map((work, index) => {
          const selected =
            selectedWorks[work.id] ?? 0;

          const remaining =
            Math.max(
              work.count - selected,
              0
            );

          return (
            <div
              key={work.id}
              className="grid min-h-[38px] grid-cols-[38px_minmax(0,1.5fr)_minmax(0,1fr)_55px_45px] items-center border-b border-slate-200 px-2 py-1.5 text-[10px]"
            >
              <span>{index + 1}</span>

              <span
                className="truncate pr-2 font-semibold text-[#10234a]"
                title={work.workName}
              >
                {work.workName}
              </span>

              <span
                className="truncate pr-2 text-[#193c67]"
                title={work.subTheme}
              >
                {work.subTheme}
              </span>

              <span className="font-semibold text-[#10234a]">
                {remaining}
              </span>

              <button
                type="button"
                disabled={remaining === 0}
                onClick={() =>
                  onAddWork(work)
                }
                className="mx-auto flex h-6 w-6 items-center justify-center rounded-full border border-green-600 text-[15px] font-bold leading-none text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                +
              </button>
            </div>
          );
        })}
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
    <div className="border-b border-slate-100 px-3 py-2">
      <div className="mb-1.5 text-[8px] font-semibold tracking-wide text-slate-500">
        {title}
      </div>

      <div className="flex flex-wrap gap-1">
        {values.map((value) => {
          const active =
            selected.includes(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() =>
                onToggle(value)
              }
              className={`rounded-full border px-2 py-1 text-[8px] ${
                active
                  ? "border-[#078aca] bg-[#eaf6fd] font-semibold text-[#078aca]"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}