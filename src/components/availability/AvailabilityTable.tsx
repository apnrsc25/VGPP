"use client";

import {
  Eye,
  EyeOff,
  Plus,
  SlidersHorizontal,
  Search,
} from "lucide-react";

import type { Work } from "@/types/work";

interface AvailabilityTableProps {
  works: Work[];
  onFilterClick: () => void;
  onNext: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  visibleWorkIds: Set<string>;
  onToggleVisibility: (workId: string) => void;
  onCreateAsset: () => void;
}

export default function AvailabilityTable({
  works,
  search,
  onFilterClick,
  onSearchChange,
  visibleWorkIds,
  onToggleVisibility,
  onCreateAsset,
}: AvailabilityTableProps) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[6px] border border-[#cbdde8] bg-white shadow-[0_4px_16px_rgba(0,59,99,0.08)]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="shrink-0 border-b border-[#c9dce8] bg-[#f3f9fc]">

        {/* Accent */}

        <div className="flex h-[3px]">

          <div className="flex-1 bg-[#075a91]" />

          <div className="w-[70px] bg-[#f58220]" />

        </div>


        <div className="flex min-h-[48px] flex-wrap items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">

          {/* TITLE */}

          <div className="flex min-w-0 items-center gap-2">

            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] bg-[#075a91] text-white">

              <span className="text-[9px] font-bold">
                GP
              </span>

            </div>

            <div className="min-w-0">

              <h2 className="truncate text-[11px] font-extrabold tracking-[0.6px] text-[#003b63] sm:text-[13px]">
                PANCHAYAT ASSETS
              </h2>

              <div className="hidden text-[7px] font-medium text-slate-400 sm:block">
                Available works
              </div>

            </div>

          </div>


          {/* SEARCH */}

          <div className="relative order-3 w-full sm:order-none sm:min-w-[150px] sm:flex-1 sm:max-w-[330px]">

            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value
                )
              }
              placeholder="Search works..."
              className="h-8 w-full rounded-[4px] border border-[#cbd8e1] bg-white pl-8 pr-3 text-[10px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10 sm:h-7"
            />

          </div>


          {/* FILTER */}

          <button
            type="button"
            onClick={onFilterClick}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-transparent text-[#475569] transition hover:border-[#b8cfdd] hover:bg-white hover:text-[#075a91]"
            title="Filter"
          >
            <SlidersHorizontal size={15} />
          </button>


          {/* COUNT */}

          <div className="ml-auto flex shrink-0 items-center gap-1.5">

            <span className="hidden text-[7px] font-semibold uppercase tracking-wide text-slate-400 sm:block">
              Showing
            </span>

            <span className="rounded-full bg-[#075a91] px-2.5 py-1 text-[9px] font-bold text-white">
              {works.length}
            </span>

            <span className="hidden text-[8px] font-bold text-[#475569] sm:block">
              WORKS
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="min-h-0 flex-1 overflow-auto">

        <table className="w-full min-w-[700px] table-fixed border-collapse">

          <thead className="sticky top-0 z-10 bg-[#003b63] text-white">

            <tr className="h-8 text-[8px] uppercase tracking-[0.5px] sm:text-[9px]">

              <th className="w-[42px] px-2 text-left">
                #
              </th>

              <th className="w-[28%] px-2 text-left">
                WORK NAME
              </th>

              <th className="w-[24%] px-2 text-left">
                SUB THEME
              </th>

              <th className="w-[19%] px-2 text-left">
                THEME
              </th>

              <th className="w-[12%] px-2 text-center">
                COUNT
              </th>

              <th className="w-[11%] px-2 text-center">
                TYPE
              </th>

              <th className="w-[42px] px-1 text-center">
                <Eye
                  size={12}
                  className="mx-auto"
                />
              </th>

            </tr>

          </thead>


          <tbody>

            {works.map((work, index) => {

              const isVisible =
                visibleWorkIds.has(
                  work.id
                );

              return (
                <tr
                  key={work.id}
                  className="h-9 border-b border-[#e4ebef] text-[9px] text-[#20354a] transition hover:bg-[#f2f9fc] sm:h-10 sm:text-[10px]"
                >

                  {/* INDEX */}

                  <td className="px-2 font-semibold text-slate-400">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </td>


                  {/* WORK */}

                  <td
                    className="truncate px-2 font-semibold text-[#334155]"
                    title={work.workName}
                  >
                    {work.workName}
                  </td>


                  {/* SUB THEME */}

                  <td
                    className="truncate px-2 text-slate-500"
                    title={work.subTheme}
                  >
                    {work.subTheme}
                  </td>


                  {/* THEME */}

                  <td
                    className={`truncate px-2 font-semibold ${
                      work.theme ===
                      "Rural Infrastructure"
                        ? "text-[#7c3aed]"
                        : work.theme ===
                            "Livelihood Infrastructure"
                          ? "text-[#00875a]"
                          : work.theme ===
                              "Climate Resilience"
                            ? "text-[#0879b1]"
                            : "text-[#d97706]"
                    }`}
                  >
                    {work.theme}
                  </td>


                  {/* COUNT */}

                  <td className="px-2 text-center">

                    <span className="inline-flex min-w-7 items-center justify-center rounded-full border border-[#c9def0] bg-[#edf6fc] px-2 py-1 text-[8px] font-bold text-[#075a91]">
                      {work.count}
                    </span>

                  </td>


                  {/* TYPE */}

                  <td className="px-2 text-center">

                    <span
                      className={`inline-flex rounded-[3px] px-2 py-1 text-[7px] font-bold ${
                        work.type === "Repair"
                          ? "bg-[#fff1f0] text-[#dc2626]"
                          : "bg-[#edf9f4] text-[#00875a]"
                      }`}
                    >
                      {work.type}
                    </span>

                  </td>


                  {/* MAP VISIBILITY */}

                  <td className="px-1 text-center">

                    <button
                      type="button"
                      onClick={() =>
                        onToggleVisibility(
                          work.id
                        )
                      }
                      className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full border transition ${
                        isVisible
                          ? "border-[#9fc8df] bg-[#eaf6fd] text-[#075a91]"
                          : "border-transparent text-slate-300 hover:border-[#cbdde8] hover:bg-slate-50 hover:text-[#075a91]"
                      }`}
                      title={
                        isVisible
                          ? "Hide on map"
                          : "Show on map"
                      }
                    >
                      {isVisible ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </button>

                  </td>

                </tr>
              );
            })}


            {/* EMPTY */}

            {works.length === 0 && (
              <tr>

                <td
                  colSpan={7}
                  className="py-14 text-center"
                >

                  <div className="mx-auto flex max-w-[220px] flex-col items-center">

                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#edf6fa] text-[#075a91]">
                      <Search size={16} />
                    </div>

                    <p className="text-[10px] font-semibold text-slate-500">
                      No works found
                    </p>

                    <p className="mt-1 text-[8px] text-slate-400">
                      Try changing your search or filters.
                    </p>

                  </div>

                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          CREATE ASSET
      ====================================================== */}

      <div className="shrink-0 border-t border-[#dbe7ed] bg-[#f9fbfc] px-3 py-2.5 sm:px-4 sm:py-3">

        <button
          type="button"
          onClick={onCreateAsset}
          className="group mx-auto flex min-h-9 w-full items-center justify-center gap-2 rounded-[4px] bg-[#075a91] px-4 py-2 text-[9px] font-bold tracking-[0.2px] text-white shadow-[0_3px_8px_rgba(7,90,145,0.18)] transition hover:bg-[#003b63] hover:shadow-[0_5px_12px_rgba(7,90,145,0.24)] active:scale-[0.99] sm:w-auto sm:min-w-[260px] cursor-pointer"
        >

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
            <Plus
              size={13}
              className="transition-transform group-hover:rotate-90"
            />
          </span>

          <span>
            Would you like to add a new asset?
          </span>

        </button>

      </div>

    </section>
  );
}