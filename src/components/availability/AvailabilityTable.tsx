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
    onNext,
    onSearchChange,
    visibleWorkIds,
    onToggleVisibility,
    onCreateAsset,
}: AvailabilityTableProps) {
    return (
        <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#dce4eb] bg-white shadow-sm">
            {/* HEADER */}
            <div className="flex items-center gap-3 border-b-2 border-[#182443] bg-[#eaf6fd] px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#2678d8]" />

                    <h2 className="whitespace-nowrap text-[15px] font-bold tracking-wide text-[#10203f]">
                        PANCHAYAT ASSETS
                    </h2>
                </div>

                {/* SEARCH */}
                <div className="relative min-w-0 flex-1 max-w-[350px]">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="Search works..."
                        className="h-7 w-full rounded-md border border-[#c9d5df] bg-white pl-8 pr-3 text-[12px] text-slate-700 outline-none transition focus:border-[#3d96d8] focus:ring-1 focus:ring-[#3d96d8]/20"
                    />
                </div>

                <button
                    type="button"
                    onClick={onFilterClick}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#172746] hover:bg-white cursor-pointer transition hover:text-[#1769ff]"
                    title="Filter"
                >
                    <SlidersHorizontal size={16} />
                </button>

                <div className="ml-auto whitespace-nowrap text-[15px] font-bold text-[#10203f]">
                    {works.length} WORKS
                </div>
            </div>

            {/* TABLE */}
            <div className="min-h-0 flex-1 overflow-auto">
                <table className="w-full min-w-[700px] table-fixed border-collapse">
                    <thead className="sticky top-0 z-10 bg-[#182443] text-white">
                        <tr className="h-7 text-[10px] uppercase tracking-wide">
                            <th className="w-[42px] px-2 text-left">#</th>

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
                                <Eye size={12} className="mx-auto" />
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {works.map((work, index) => {
                            const isVisible = visibleWorkIds.has(work.id);

                            return (
                                <tr
                                    key={work.id}
                                    className="h-10 border-b border-[#e1e7ed] text-[11px] text-[#10203f] hover:bg-[#f7fbfe]"
                                >
                                    <td className="px-2">
                                        {index + 1}
                                    </td>

                                    <td
                                        className="truncate px-2 font-medium"
                                        title={work.workName}
                                    >
                                        {work.workName}
                                    </td>

                                    <td
                                        className="truncate px-2"
                                        title={work.subTheme}
                                    >
                                        {work.subTheme}
                                    </td>

                                    <td
                                        className={`truncate px-2 font-semibold ${work.theme === "Rural Infrastructure"
                                                ? "text-red-500"
                                                : "text-orange-600"
                                            }`}
                                    >
                                        {work.theme}
                                    </td>

                                    <td className="px-2 text-center">
                                        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#dceaff] px-2 py-0.5 text-[10px] font-semibold text-[#3476d1]">
                                            {work.count}
                                        </span>
                                    </td>

                                    <td className="px-2 text-center">
                                        <span className="rounded bg-[#e6faf3] px-2 py-1 text-[9px] font-semibold text-[#00875a]">
                                            {work.type}
                                        </span>
                                    </td>

                                    <td className="px-1 text-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onToggleVisibility(work.id)
                                            }
                                            className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full transition ${isVisible
                                                    ? "text-[#1769ff]"
                                                    : "text-slate-400 hover:text-[#1769ff]"
                                                }`}
                                            title={
                                                isVisible
                                                    ? "Hide on map"
                                                    : "Show on map"
                                            }
                                        >
                                            {isVisible ? (
                                                <Eye size={16} />
                                            ) : (
                                                <EyeOff size={16} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {works.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-12 text-center text-sm text-slate-400"
                                >
                                    No works found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* CREATE BUTTON */}
            <div className="border-t border-[#e3e8ed] bg-white px-4 py-3 text-center">
                <button
                    type="button"
                    onClick={onCreateAsset}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#078dcc] px-5 py-2 text-[12px] font-semibold text-white shadow-md transition hover:bg-[#067db3] active:scale-[0.98] cursor-pointer"
                >
                    <Plus size={16} />
                    Would you like to add a new asset?
                </button>
            </div>
        </section>
    );
}