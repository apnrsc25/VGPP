"use client";

import { useMemo, useState } from "react";

import type { Work } from "@/types/work";

import RequirementTable from "./RequirementTable";
import RequirementsSourceTabs from "./RequirementsSourceTabs";

interface RequirementsWorkspaceProps {
    works: Work[];
    permissibleWorks: Work[];
    proposalId: string;
}

type SourceTab = "ejal" | "permissible";

const categories = [
    {
        key: "Water Security",
        label: "WATER",
        color: "text-orange-600",
    },
    {
        key: "Rural Infrastructure",
        label: "RURAL",
        color: "text-purple-700",
    },
    {
        key: "Livelihood Infrastructure",
        label: "LIVELIHOOD",
        color: "text-emerald-700",
    },
    {
        key: "Climate Resilience",
        label: "CLIMATE",
        color: "text-sky-700",
    },
] as const;

export default function RequirementsWorkspace({
    works,
    permissibleWorks,
}: RequirementsWorkspaceProps) {
    const [activeTab, setActiveTab] =
        useState<SourceTab>("ejal");

    const [search, setSearch] = useState("");

    const [selectedIds, setSelectedIds] =
        useState<Set<string>>(new Set());

    const [ejalCounts, setEjalCounts] =
        useState<Map<string, number>>(new Map());

    const [activeCategory, setActiveCategory] =
        useState<string | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

    const [selectedSubThemes, setSelectedSubThemes] = useState<string[]>([]);

    const [selectedTypes, setSelectedTypes] = useState<
        ("New" | "Repair")[]
    >([]);

    const sourceWorks = useMemo(() => {
        if (activeTab === "ejal") {
            return works.filter((work) => work.type === "New");
        }

        return permissibleWorks;
    }, [works, permissibleWorks, activeTab]);


    const themeOptions = useMemo(() => {
        return Array.from(
            new Set(sourceWorks.map((work) => work.theme))
        ).sort();
    }, [sourceWorks]);

    const subThemeOptions = useMemo(() => {
        return Array.from(
            new Set(
                sourceWorks
                    .filter(
                        (work) =>
                            selectedThemes.length === 0 ||
                            selectedThemes.includes(work.theme)
                    )
                    .map((work) => work.subTheme)
            )
        ).sort();
    }, [sourceWorks, selectedThemes]);





    const filteredWorks = useMemo(() => {
        const query = search.trim().toLowerCase();

        return sourceWorks.filter((work) => {

            // ONLY E-Jal:
            // quantity 0 hone par row hide hogi
            if (activeTab === "ejal") {
                const selectedCount =
                    ejalCounts.get(work.id) ?? 0;

                const availableCount =
                    work.count ?? 0;

                if (selectedCount >= availableCount) {
                    return false;
                }
            }

            const matchesSearch =
                !query ||
                work.workName.toLowerCase().includes(query) ||
                work.vgpId.toLowerCase().includes(query) ||
                work.subTheme.toLowerCase().includes(query) ||
                work.theme.toLowerCase().includes(query);

            const matchesCategory =
                !activeCategory ||
                work.theme === activeCategory;

            const matchesTheme =
                selectedThemes.length === 0 ||
                selectedThemes.includes(work.theme);

            const matchesSubTheme =
                selectedSubThemes.length === 0 ||
                selectedSubThemes.includes(work.subTheme);

            const matchesType =
                selectedTypes.length === 0 ||
                selectedTypes.includes(work.type);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesTheme &&
                matchesSubTheme &&
                matchesType
            );
        });
    }, [
        sourceWorks,
        search,
        activeCategory,
        selectedThemes,
        selectedSubThemes,
        selectedTypes,
        ejalCounts,
        activeTab,
    ]);

    const selectedWorks = useMemo(() => {
        return works
            .filter((work) => selectedIds.has(work.id))
            .map((work) => ({
                ...work,
                count:
                    activeTab === "ejal"
                        ? ejalCounts.get(work.id) ?? 0
                        : work.count ?? 1,
            }));
    }, [
        works,
        selectedIds,
        activeTab,
        ejalCounts,
    ]);

    const handleAdd = (work: Work) => {
        // E-Jal = quantity based
        if (activeTab === "ejal") {
            setEjalCounts((current) => {
                const next = new Map(current);

                const currentCount =
                    next.get(work.id) ?? 0;

                const maxCount =
                    work.count ?? 0;

                if (currentCount >= maxCount) {
                    return current;
                }

                next.set(work.id, currentCount + 1);

                return next;
            });

            setSelectedIds((current) => {
                const next = new Set(current);
                next.add(work.id);
                return next;
            });

            return;
        }

        // Permissible Works = simple add
        setSelectedIds((current) => {
            if (current.has(work.id)) {
                return current;
            }

            const next = new Set(current);
            next.add(work.id);

            return next;
        });
    };

    const handleRemove = (id: string) => {
        if (activeTab === "ejal") {
            setEjalCounts((current) => {
                const next = new Map(current);

                const currentCount =
                    next.get(id) ?? 0;

                if (currentCount <= 1) {
                    next.delete(id);

                    setSelectedIds((ids) => {
                        const updated = new Set(ids);
                        updated.delete(id);
                        return updated;
                    });
                } else {
                    next.set(id, currentCount - 1);
                }

                return next;
            });

            return;
        }

        // Permissible = binary remove
        setSelectedIds((current) => {
            const next = new Set(current);
            next.delete(id);
            return next;
        });
    };

    const categoryCounts = useMemo(() => {
        return categories.map((category) => ({
            ...category,
            count: sourceWorks.filter(
                (work) => work.theme === category.key
            ).length,
        }));
    }, [sourceWorks]);

    return (
        <div className="relative min-h-0 w-full pb-12">
            <div className="grid min-h-[calc(100vh-130px)] grid-cols-1 gap-3 p-2 sm:gap-4 sm:p-3 lg:grid-cols-2 lg:p-4">
                <section
                    className="relative flex min-h-[560px] min-w-0 flex-col overflow-hidden rounded-[8px] border border-[#c7dce8] bg-white shadow-[0_8px_28px_rgba(0,59,99,0.09)] lg:min-h-0"
                >
                    {/* TOP ACCENT */}

                    <div className="absolute left-0 right-0 top-0 z-30 flex h-[4px]">
                        <div className="flex-1 bg-[#075a91]" />
                        <div className="w-16 bg-[#f58220]" />
                    </div>


                    {/* HEADER */}

                    <div className="shrink-0 border-b border-[#d7e5ed] bg-gradient-to-r from-[#f3faff] via-white to-[#fffaf5] pt-[4px]">

                        <div className="flex min-h-[58px] items-center gap-2 px-3 py-2 sm:px-4">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] bg-[#075a91] text-white shadow-sm">
                                <span className="text-[9px] font-extrabold">
                                    GP
                                </span>
                            </div>

                            <div className="min-w-0">

                                <h2 className="truncate text-[12px] font-extrabold tracking-[0.6px] text-[#003b63] sm:text-[14px]">
                                    PERMISSIBLE WORKS
                                </h2>

                                <p className="hidden text-[7px] text-slate-400 sm:block">
                                    Select works for VGP requirements
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* SOURCE TABS */}

                    <RequirementsSourceTabs
                        activeTab={activeTab}
                        onChange={(tab) => {
                            setActiveTab(tab);
                            setActiveCategory(null);
                        }}
                    />


                    {/* CATEGORY SUMMARY */}

                    <div className="grid h-16 shrink-0 grid-cols-4 border-b border-[#dce7ed] bg-white">

                        {categoryCounts.map((category) => {

                            const active =
                                activeCategory === category.key;

                            return (
                                <button
                                    key={category.key}
                                    type="button"
                                    onClick={() =>
                                        setActiveCategory(
                                            active ? null : category.key
                                        )
                                    }
                                    className={`group flex cursor-pointer flex-col items-center justify-center border-r border-[#e2ebf0] transition last:border-r-0 ${active
                                        ? "bg-[#eef7fb]"
                                        : "bg-white hover:bg-[#f7fbfd]"
                                        }`}
                                >

                                    <span
                                        className={`text-[17px] font-extrabold transition-transform group-hover:scale-105 sm:text-[19px] ${category.color}`}
                                    >
                                        {category.count}
                                    </span>

                                    <span className="mt-0.5 text-[7px] font-bold tracking-[0.5px] text-[#36566b] sm:text-[8px]">
                                        {category.label}
                                    </span>

                                    {active && (
                                        <span className="mt-1 h-0.5 w-5 rounded-full bg-[#f58220]" />
                                    )}

                                </button>
                            );
                        })}

                    </div>

                    {/* TABLE */}
                    <RequirementTable
                        works={filteredWorks}
                        selectedIds={selectedIds}
                        ejalCounts={ejalCounts}
                        activeTab={activeTab}
                        onAdd={handleAdd}
                    />

                </section>

                <section
                    className="relative flex min-h-[500px] min-w-0 flex-col overflow-hidden rounded-[8px] border border-[#c7dce8] bg-white shadow-[0_8px_28px_rgba(0,59,99,0.09)] lg:min-h-0"
                >
                    {/* TOP ACCENT */}

                    <div className="flex h-[4px] shrink-0">
                        <div className="flex-1 bg-[#075a91]" />
                        <div className="w-16 bg-[#f58220]" />
                    </div>


                    {/* HEADER */}

                    <div className="flex min-h-[58px] shrink-0 items-center gap-2 border-b border-[#d7e5ed] bg-gradient-to-r from-[#f3faff] to-white px-3 py-2.5 sm:px-4">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] bg-[#003b63] text-white shadow-sm">
                            <span className="text-[10px] font-extrabold">
                                V
                            </span>
                        </div>

                        <div className="min-w-0">

                            <h2 className="truncate text-[12px] font-extrabold tracking-[0.6px] text-[#003b63] sm:text-[14px]">
                                VGP REQUIREMENTS
                            </h2>

                            <p className="hidden text-[7px] text-slate-400 sm:block">
                                Selected works for proposal preparation
                            </p>

                        </div>


                        <div className="ml-auto flex items-center gap-1.5">

                            <span className="hidden text-[7px] font-semibold uppercase text-slate-400 sm:block">
                                Selected
                            </span>

                            <span className="rounded-[4px] bg-[#075a91] px-2 py-1 text-[9px] font-extrabold text-white shadow-sm">
                                {selectedWorks.length}
                            </span>

                            <span className="hidden text-[8px] font-bold text-[#475569] sm:block">
                                WORKS
                            </span>

                        </div>

                    </div>


                    {/* INFO */}

                    <div className="mx-3 mt-3 shrink-0 rounded-[6px] border border-dashed border-[#bcd5e2] bg-[#f5fafc] px-3 py-2.5 text-center">

                        <div className="text-[9px] font-semibold text-[#36566b] sm:text-[10px]">
                            Works selected from the catalogue
                        </div>

                        <div className="mt-0.5 text-[7px] text-slate-400 sm:text-[8px]">
                            E-Jal recommendations & permissible works
                        </div>

                    </div>


                    {/* CATEGORY COUNTS */}

                    <div className="mx-3 mt-3 grid h-16 shrink-0 grid-cols-4 overflow-hidden rounded-[6px] border border-[#dce7ed]">

                        {categories.map((category) => {

                            const count =
                                selectedWorks.filter(
                                    (work) =>
                                        work.theme === category.key
                                ).length;

                            return (
                                <div
                                    key={category.key}
                                    className="flex flex-col items-center justify-center border-r border-[#e2ebf0] bg-white last:border-r-0"
                                >
                                    <span
                                        className={`text-[17px] font-extrabold sm:text-[19px] ${category.color}`}
                                    >
                                        {count}
                                    </span>

                                    <span className="text-[7px] font-bold tracking-[0.4px] text-[#36566b] sm:text-[8px]">
                                        {category.label}
                                    </span>

                                </div>
                            );
                        })}

                    </div>


                    {/* SELECTED TABLE */}

                    <div className="min-h-0 flex-1 overflow-auto overscroll-contain">

                        <table className="w-full min-w-[680px] table-fixed border-collapse text-[10px] sm:text-[11px]">

                            <thead className="sticky top-0 z-20 bg-[#003b63] text-white shadow-sm">

                                <tr className="h-9 text-[8px] uppercase tracking-[0.5px] sm:text-[9px]">

                                    <th className="w-[7%] px-2 text-center">
                                        REMOVE
                                    </th>

                                    <th className="w-[6%] px-2 text-left">
                                        #
                                    </th>

                                    <th className="w-[29%] px-2 text-left">
                                        WORK NAME
                                    </th>

                                    <th className="w-[20%] px-2 text-left">
                                        SUB THEME
                                    </th>

                                    <th className="w-[17%] px-2 text-left">
                                        THEME
                                    </th>

                                    <th className="w-[10%] px-2 text-left">
                                        TYPE
                                    </th>

                                    <th className="w-[11%] px-2 text-center">
                                        COUNT
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {selectedWorks.map(
                                    (work, index) => {

                                        const themeClass =
                                            work.theme ===
                                                "Rural Infrastructure"
                                                ? "text-[#7c3aed]"
                                                : work.theme ===
                                                    "Livelihood Infrastructure"
                                                    ? "text-[#00875a]"
                                                    : work.theme ===
                                                        "Climate Resilience"
                                                        ? "text-[#0879b1]"
                                                        : "text-[#d97706]";


                                        return (
                                            <tr
                                                key={work.id}
                                                className="group h-10 border-b border-[#e4edf2] transition hover:bg-[#fff8f4] sm:h-11"
                                            >

                                                {/* REMOVE */}

                                                <td className="px-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove(work.id)}
                                                        title="Remove work"
                                                        className="mx-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#fecaca] bg-[#fff5f5] text-[13px] font-bold text-[#dc2626] transition hover:bg-[#dc2626] hover:text-white active:scale-90"
                                                    >
                                                        −
                                                    </button>

                                                </td>


                                                {/* INDEX */}

                                                <td className="px-2 font-mono text-[8px] text-slate-400">
                                                    {String(index + 1).padStart(2, "0")}
                                                </td>


                                                {/* WORK */}

                                                <td
                                                    className="truncate px-2 font-semibold text-[#263f52]"
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
                                                    className={`truncate px-2 font-semibold ${themeClass}`}
                                                    title={work.theme}
                                                >
                                                    {work.theme}
                                                </td>


                                                {/* TYPE */}

                                                <td className="px-2">

                                                    <span
                                                        className={`inline-flex rounded-full border px-2 py-1 text-[7px] font-bold ${work.type === "Repair"
                                                            ? "border-[#fecaca] bg-[#fff5f5] text-[#dc2626]"
                                                            : "border-[#bce6d5] bg-[#effbf5] text-[#00875a]"
                                                            }`}
                                                    >
                                                        {work.type}
                                                    </span>

                                                </td>


                                                {/* COUNT */}

                                                <td className="px-2 text-center">

                                                    <span className="inline-flex min-w-8 items-center justify-center rounded-[4px] bg-[#edf7fc] px-2 py-1 text-[8px] font-extrabold text-[#075a91]">
                                                        {work.count}
                                                    </span>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>


                        {/* EMPTY */}

                        {selectedWorks.length === 0 && (
                            <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">

                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#cfe2ec] bg-[#eef7fb] text-[#075a91]">
                                    <span className="text-[17px] font-bold">
                                        +
                                    </span>
                                </div>

                                <p className="text-[11px] font-bold text-[#475569]">
                                    No works selected
                                </p>

                                <p className="mt-1 max-w-[260px] text-[8px] leading-relaxed text-slate-400">
                                    Select works from the catalogue on the
                                    left panel to build your VGP requirements.
                                </p>

                            </div>
                        )}

                    </div>

                </section>

            </div>

            <div className="fixed bottom-3 right-3 z-40 sm:absolute sm:bottom-0 sm:right-0">

                <button
                    type="button"
                    className="flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#075a91] px-5 text-[9px] font-bold text-white shadow-[0_5px_14px_rgba(0,59,99,0.22)] transition hover:bg-[#003b63] hover:shadow-[0_7px_18px_rgba(0,59,99,0.28)] active:scale-[0.97] sm:min-h-8 sm:px-6"
                >
                    Next
                    <span className="text-[12px]">
                        →
                    </span>
                </button>

            </div>

        </div>
    );
}