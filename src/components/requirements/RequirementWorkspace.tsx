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
        <div className="relative min-h-[calc(100vh-120px)] pb-10">
            {/* LEFT + RIGHT WORKSPACE */}
            <div className="grid min-h-[calc(100vh-130px)] grid-cols-1 gap-4 lg:grid-cols-2">

                {/* LEFT */}
                <section className="relative flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
                    {/* HEADER */}
                    <div className="flex h-10 shrink-0 items-center gap-3 border-b-2 border-[#26345d] bg-[#eef8ff] px-3">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="h-2 w-2 rounded-full bg-[#2563eb]" />

                            <h2 className="text-[16px] font-bold text-[#10234a]">
                                PERMISSIBLE WORKS
                            </h2>
                        </div>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search works..."
                            className="h-7 w-[55%] rounded-md border border-slate-300 bg-white px-3 text-[11px] outline-none focus:border-[#4b9bd6]"
                        />

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowFilters((value) => !value)}
                                className="relative flex h-7 w-7 items-center justify-center rounded-md text-[#18315c] hover:bg-slate-100"
                                title="Filter"
                            >
                                {/* Filter / Sliders Icon */}
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                >
                                    <line x1="4" y1="6" x2="20" y2="6" />
                                    <circle cx="9" cy="6" r="2" fill="white" />

                                    <line x1="4" y1="12" x2="20" y2="12" />
                                    <circle cx="15" cy="12" r="2" fill="white" />

                                    <line x1="4" y1="18" x2="20" y2="18" />
                                    <circle cx="11" cy="18" r="2" fill="white" />
                                </svg>

                                {(selectedThemes.length > 0 ||
                                    selectedSubThemes.length > 0 ||
                                    selectedTypes.length > 0) && (
                                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4b9bd6] px-1 text-[8px] font-bold text-white">
                                            {selectedThemes.length +
                                                selectedSubThemes.length +
                                                selectedTypes.length}
                                        </span>
                                    )}
                            </button>


                        </div>

                        <span className="ml-auto whitespace-nowrap text-[15px] font-bold text-[#10234a]">
                            {filteredWorks.length} WORKS
                        </span>

                        {/* ================= FILTER PANEL ================= */}

                        {showFilters && (
                            <div className="absolute left-0 top-9 z-[2000] w-full max-w-[calc(100vw-40px)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">

                                {/* FILTER HEADER */}
                                <div className="flex h-8 items-center justify-between border-b border-slate-200 bg-white px-3">
                                    <span className="text-[12px] font-semibold text-slate-700">
                                        Filter by
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(false)}
                                        className="text-[16px] font-semibold text-slate-400 hover:text-slate-700"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* FILTER CONTENT */}
                                <div className="max-h-[320px] overflow-y-auto px-3 py-1">

                                    {/* THEME */}
                                    <div className="mb-2">
                                        <div className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                                            THEME
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                {
                                                    label: "Water",
                                                    value: "Water Security",
                                                },
                                                {
                                                    label: "Rural",
                                                    value: "Rural Infrastructure",
                                                },
                                                {
                                                    label: "Livelihood",
                                                    value: "Livelihood Infrastructure",
                                                },
                                                {
                                                    label: "Climate",
                                                    value: "Climate Resilience",
                                                },
                                            ].map((theme) => {
                                                const active = selectedThemes.includes(theme.value);

                                                return (
                                                    <button
                                                        key={theme.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedThemes((current) =>
                                                                active
                                                                    ? current.filter(
                                                                        (item) => item !== theme.value
                                                                    )
                                                                    : [...current, theme.value]
                                                            );
                                                        }}
                                                        className={`rounded-full border px-3 py-1 text-[10px] transition ${active
                                                            ? "border-[#4b9bd6] bg-[#4b9bd6] font-semibold text-white"
                                                            : "border-slate-300 bg-white text-slate-600 hover:border-[#4b9bd6]"
                                                            }`}
                                                    >
                                                        {theme.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* TYPE */}
                                    <div className="mb-2">
                                        <div className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                                            TYPE
                                        </div>

                                        <div className="flex gap-2">
                                            {(["New", "Repair"] as const).map((type) => {
                                                const active = selectedTypes.includes(type);

                                                return (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedTypes((current) =>
                                                                active
                                                                    ? current.filter(
                                                                        (item) => item !== type
                                                                    )
                                                                    : [...current, type]
                                                            );
                                                        }}
                                                        className={`rounded-full border px-4 py-1 text-[10px] transition ${active
                                                            ? "border-[#4b9bd6] bg-[#4b9bd6] font-semibold text-white"
                                                            : "border-slate-300 bg-white text-slate-600 hover:border-[#4b9bd6]"
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* SUB CATEGORY */}
                                    <div className="mb-2">
                                        <div className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                                            SUB CATEGORY
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {subThemeOptions.map((subTheme) => {
                                                const active =
                                                    selectedSubThemes.includes(subTheme);

                                                return (
                                                    <button
                                                        key={subTheme}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedSubThemes((current) =>
                                                                active
                                                                    ? current.filter(
                                                                        (item) => item !== subTheme
                                                                    )
                                                                    : [...current, subTheme]
                                                            );
                                                        }}
                                                        className={`rounded-full border px-3 py-1 text-[10px] transition ${active
                                                            ? "border-[#4b9bd6] bg-[#4b9bd6] font-semibold text-white"
                                                            : "border-slate-300 bg-white text-slate-600 hover:border-[#4b9bd6]"
                                                            }`}
                                                    >
                                                        {subTheme}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* CLUSTER */}
                                    <div className="mb-2">
                                        <div className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                                            CLUSTER
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "Agriculture",
                                                "NRM",
                                                "Infrastructure",
                                            ].map((cluster) => (
                                                <button
                                                    key={cluster}
                                                    type="button"
                                                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] text-slate-600 hover:border-[#4b9bd6]"
                                                >
                                                    {cluster}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* RIDGE */}
                                    <div>
                                        <div className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                                            RIDGE
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "Upper Ridge",
                                                "Lower Ridge",
                                                "Middle Ridge",
                                            ].map((ridge) => (
                                                <button
                                                    key={ridge}
                                                    type="button"
                                                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] text-slate-600 hover:border-[#4b9bd6]"
                                                >
                                                    {ridge}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="flex justify-end border-t border-slate-200 px-3 py-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedThemes([]);
                                            setSelectedSubThemes([]);
                                            setSelectedTypes([]);
                                            setActiveCategory(null);
                                        }}
                                        className="text-[10px] font-medium text-[#078aca] hover:underline"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TABS */}
                    <RequirementsSourceTabs
                        activeTab={activeTab}
                        onChange={(tab) => {
                            setActiveTab(tab);
                            setActiveCategory(null);
                        }}
                    />

                    {/* CATEGORY SUMMARY */}
                    <div className="grid h-14 shrink-0 grid-cols-4 border-b border-slate-200">
                        {categoryCounts.map((category) => {
                            const active = activeCategory === category.key;

                            return (
                                <button
                                    key={category.key}
                                    type="button"
                                    onClick={() =>
                                        setActiveCategory(active ? null : category.key)
                                    }
                                    className={`flex flex-col items-center justify-center border-r border-slate-200 transition ${active ? "bg-slate-50" : "bg-white"
                                        }`}
                                >
                                    <span
                                        className={`text-[18px] font-bold ${category.color}`}
                                    >
                                        {category.count}
                                    </span>

                                    <span className="text-[9px] font-medium text-[#18315c]">
                                        {category.label}
                                    </span>
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

                {/* RIGHT */}
                <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    {/* HEADER */}
                    <div className="flex h-10 shrink-0 items-center border-b-2 border-[#26345d] bg-[#eef8ff] px-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#2563eb]" />

                            <h2 className="text-[16px] font-bold text-[#10234a]">
                                VGP REQUIREMENTS
                            </h2>
                        </div>

                        <span className="ml-auto text-[15px] font-bold text-[#10234a]">
                            {selectedWorks.length} WORKS
                        </span>
                    </div>

                    {/* INFO */}
                    <div className="mx-3 mt-2 shrink-0 rounded border border-dashed border-slate-300 bg-white py-2 text-center text-[10px] text-[#18315c]">
                        ⇄ &nbsp; Works are gathered here from the 318
                        Permissible Works & E-Jal Recommendation catalogues on
                        the left panel
                    </div>

                    {/* CATEGORY COUNTS */}
                    <div className="mt-2 grid h-14 shrink-0 grid-cols-4 border-b border-slate-200">
                        {categories.map((category) => {
                            const count = selectedWorks.filter(
                                (work) => work.theme === category.key
                            ).length;

                            return (
                                <div
                                    key={category.key}
                                    className="flex flex-col items-center justify-center border-r border-slate-200"
                                >
                                    <span
                                        className={`text-[18px] font-bold ${category.color}`}
                                    >
                                        {count}
                                    </span>

                                    <span className="text-[9px] font-medium text-[#18315c]">
                                        {category.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* SELECTED TABLE */}
                    <div className="min-h-0 flex-1 overflow-auto">
                        <table className="w-full table-fixed border-collapse text-[11px]">
                            <thead className="sticky top-0 z-10 bg-[#111d43] text-white">
                                <tr className="h-7">
                                    <th className="w-[5%] px-2 text-center">◉</th>
                                    <th className="w-[6%] px-2 text-left">#</th>
                                    <th className="w-[30%] px-2 text-left">
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
                                    <th className="w-[12%] px-2 text-center">
                                        COUNT
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {selectedWorks.map((work, index) => (
                                    <tr
                                        key={work.id}
                                        className="h-7 border-b border-slate-200"
                                    >
                                        <td className="px-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(work.id)}
                                                className="mx-auto flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-[13px] leading-none text-red-500 hover:bg-red-50"
                                            >
                                                −
                                            </button>
                                        </td>

                                        <td className="px-2">
                                            {index + 1}
                                        </td>

                                        <td className="truncate px-2">
                                            {work.workName}
                                        </td>

                                        <td className="truncate px-2">
                                            {work.subTheme}
                                        </td>

                                        <td
                                            className={`truncate px-2 font-medium ${work.theme === "Rural Infrastructure"
                                                ? "text-purple-700"
                                                : work.theme === "Livelihood Infrastructure"
                                                    ? "text-emerald-700"
                                                    : work.theme === "Climate Resilience"
                                                        ? "text-sky-700"
                                                        : "text-orange-600"
                                                }`}
                                        >
                                            {work.theme}
                                        </td>

                                        <td
                                            className={
                                                work.type === "Repair"
                                                    ? "text-red-600"
                                                    : "text-emerald-700"
                                            }
                                        >
                                            {work.type}
                                        </td>

                                        <td className="px-2 text-center">
                                            {work.count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {selectedWorks.length === 0 && (
                            <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
                                No works selected
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* NEXT BUTTON - PAGE LEVEL */}
            <div className="absolute bottom-0 right-0">
                <button
                    type="button"
                    className="rounded-md border border-[#46537d] bg-white px-5 py-1 text-[11px] font-semibold text-[#18315c] shadow-sm transition hover:bg-slate-50"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}