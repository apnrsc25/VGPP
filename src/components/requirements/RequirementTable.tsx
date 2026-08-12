"use client";

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
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="w-full table-fixed border-collapse text-[11px]">
        <thead className="sticky top-0 z-10 bg-[#111d43] text-white">
          <tr className="h-7">
            <th className="w-[5%] px-2 text-left">#</th>

            <th className="w-[9%] px-2 text-left">
              VGP ID
            </th>

            <th className="w-[30%] px-2 text-left">
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
              →
            </th>
          </tr>
        </thead>

        <tbody>
          {works.map((work, index) => {
            const selectedCount =
              ejalCounts.get(work.id) ?? 0;

            const originalCount =
              work.count ?? 0;

            /*
             * E-Jal:
             * Original count - selected count
             *
             * Example:
             * Original = 4
             * Selected = 1
             * Remaining = 3
             */
            const remainingCount =
              activeTab === "ejal"
                ? Math.max(
                    0,
                    originalCount - selectedCount
                  )
                : null;

            /*
             * E-Jal me + tab tak enabled rahega
             * jab tak remaining count > 0 hai.
             *
             * Permissible me selected hone ke baad
             * + disable rahega.
             */
            const isSelected =
              selectedIds.has(work.id);

            const isDisabled =
              activeTab === "ejal"
                ? remainingCount === 0
                : isSelected;

            return (
              <tr
                key={work.id}
                className="h-7 border-b border-slate-200 bg-white hover:bg-slate-50"
              >
                {/* # */}
                <td className="px-2 text-slate-700">
                  {index + 1}
                </td>

                {/* VGP ID */}
                <td className="truncate px-2 text-slate-800">
                  {work.vgpId}
                </td>

                {/* WORK NAME */}
                <td
                  className="truncate px-2 text-slate-900"
                  title={work.workName}
                >
                  {work.workName}
                </td>

                {/* SUB THEME */}
                <td
                  className="truncate px-2 text-slate-800"
                  title={work.subTheme}
                >
                  {work.subTheme}
                </td>

                {/* THEME */}
                <td
                  className={`truncate px-2 font-medium ${
                    work.theme ===
                    "Rural Infrastructure"
                      ? "text-purple-700"
                      : work.theme ===
                        "Livelihood Infrastructure"
                      ? "text-emerald-700"
                      : work.theme ===
                        "Climate Resilience"
                      ? "text-sky-700"
                      : "text-orange-600"
                  }`}
                >
                  {work.theme}
                </td>

                {/* QTY */}
                <td className="px-2 text-center text-slate-700">
                  {activeTab === "ejal"
                    ? remainingCount
                    : "—"}
                </td>

                {/* TYPE */}
                <td
                  className={`px-2 ${
                    work.type === "Repair"
                      ? "text-red-600"
                      : "text-emerald-700"
                  }`}
                >
                  {work.type}
                </td>

                {/* ADD */}
                <td className="px-2 text-center">
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onAdd(work)}
                    className={`mx-auto flex h-5 w-5 items-center justify-center rounded-full border text-[14px] leading-none transition ${
                      isDisabled
                        ? "cursor-not-allowed border-slate-300 text-slate-400"
                        : "border-green-600 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    +
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}