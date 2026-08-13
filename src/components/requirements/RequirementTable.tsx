"use client";

import {
  Check,
  Plus,
} from "lucide-react";

import type { Work } from "@/types/work";

interface RequirementTableProps {
  works: Work[];
  selectedIds: Set<string>;
  onAdd: (work: Work) => void;
  ejalCounts: Map<string, number>;
  activeTab: "ejal" | "permissible";
}

export default function RequirementTable({
  works,
  selectedIds,
  onAdd,
  ejalCounts,
  activeTab,
}: RequirementTableProps) {
  return (
    <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
      <table className="w-full min-w-[720px] table-fixed border-collapse text-[10px] sm:text-[11px]">

        {/* HEADER */}

        <thead className="sticky top-0 z-20 bg-[#003b63] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
          <tr className="h-9 text-[8px] uppercase tracking-[0.5px] sm:h-10 sm:text-[9px]">

            <th className="w-[5%] px-2 text-left">
              #
            </th>

            <th className="w-[10%] px-2 text-left">
              VGP ID
            </th>

            <th className="w-[29%] px-2 text-left">
              WORK NAME
            </th>

            <th className="w-[19%] px-2 text-left">
              SUB THEME
            </th>

            <th className="w-[17%] px-2 text-left">
              THEME
            </th>

            <th className="w-[7%] px-2 text-center">
              QTY
            </th>

            <th className="w-[8%] px-2 text-left">
              TYPE
            </th>

            <th className="w-[5%] px-2 text-center">
              ADD
            </th>

          </tr>
        </thead>


        <tbody>

          {works.map((work, index) => {

            const selectedCount =
              ejalCounts.get(work.id) ?? 0;

            const originalCount =
              work.count ?? 0;

            const remainingCount =
              activeTab === "ejal"
                ? Math.max(
                    0,
                    originalCount - selectedCount
                  )
                : null;

            const isSelected =
              selectedIds.has(work.id);

            const isDisabled =
              activeTab === "ejal"
                ? remainingCount === 0
                : isSelected;


            const themeClass =
              work.theme === "Rural Infrastructure"
                ? "text-[#7c3aed]"
                : work.theme ===
                    "Livelihood Infrastructure"
                  ? "text-[#00875a]"
                  : work.theme ===
                      "Climate Resilience"
                    ? "text-[#0879b1]"
                    : "text-[#d97706]";


            const themeDot =
              work.theme === "Rural Infrastructure"
                ? "bg-[#7c3aed]"
                : work.theme ===
                    "Livelihood Infrastructure"
                  ? "bg-[#00875a]"
                  : work.theme ===
                      "Climate Resilience"
                    ? "bg-[#0879b1]"
                    : "bg-[#d97706]";


            return (
              <tr
                key={work.id}
                className="
                  group
                  h-10
                  border-b
                  border-[#e4edf2]
                  bg-white
                  text-[#334155]
                  transition
                  hover:bg-[#f3f9fc]
                  sm:h-11
                "
              >

                {/* # */}

                <td className="px-2">
                  <span className="font-mono text-[8px] font-semibold text-slate-400 group-hover:text-[#075a91]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </td>


                {/* VGP ID */}

                <td className="truncate px-2">
                  <span className="rounded-[3px] bg-[#f1f7fa] px-1.5 py-1 text-[8px] font-semibold text-[#526b7b]">
                    {work.vgpId}
                  </span>
                </td>


                {/* WORK */}

                <td
                  className="truncate px-2 font-semibold text-[#263f52]"
                  title={work.workName}
                >
                  <div className="flex min-w-0 items-center gap-1.5">

                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#075a91] opacity-50 group-hover:opacity-100" />

                    <span className="truncate">
                      {work.workName}
                    </span>

                  </div>
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
                  className={`truncate px-2 font-semibold ${themeClass}`}
                  title={work.theme}
                >
                  <div className="flex items-center gap-1.5">

                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${themeDot}`}
                    />

                    <span className="truncate">
                      {work.theme}
                    </span>

                  </div>
                </td>


                {/* QTY */}

                <td className="px-2 text-center">

                  {activeTab === "ejal" ? (
                    <span className="inline-flex min-w-7 items-center justify-center rounded-[4px] border border-[#c7dfed] bg-[#edf7fc] px-1.5 py-1 text-[8px] font-extrabold text-[#075a91]">
                      {remainingCount}
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      —
                    </span>
                  )}

                </td>


                {/* TYPE */}

                <td className="px-2">

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      border
                      px-2
                      py-1
                      text-[7px]
                      font-bold
                      ${
                        work.type === "Repair"
                          ? "border-[#fecaca] bg-[#fff5f5] text-[#dc2626]"
                          : "border-[#bce6d5] bg-[#effbf5] text-[#00875a]"
                      }
                    `}
                  >
                    {work.type}
                  </span>

                </td>


                {/* ADD */}

                <td className="px-2 text-center">

                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onAdd(work)}
                    title={
                      isDisabled
                        ? "Already selected"
                        : "Add work"
                    }
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
                        isDisabled
                          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
                          : "border-[#9ed1b8] bg-[#f0fbf5] text-[#00875a] hover:border-[#00875a] hover:bg-[#00875a] hover:text-white"
                      }
                    `}
                  >
                    {isSelected && activeTab === "permissible" ? (
                      <Check size={12} />
                    ) : (
                      <Plus size={13} />
                    )}
                  </button>

                </td>

              </tr>
            );
          })}


          {works.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="py-16 text-center"
              >
                <div className="mx-auto max-w-[250px]">

                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7fc] text-[#075a91]">
                    <Plus size={17} />
                  </div>

                  <p className="text-[10px] font-bold text-slate-500">
                    No works available
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
  );
}