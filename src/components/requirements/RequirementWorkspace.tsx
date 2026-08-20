"use client";

import {
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import { useMemo, useState } from "react";

import type { Work } from "@/types/work";

import RequirementTable from "./RequirementTable";
import RequirementsSourceTabs from "./RequirementsSourceTabs";
import { WORK_TYPES } from "@/lib/api/works";

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

type WorkWithOptionalFields = Work & {
    unit?: string;
    count?: number;
};

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

    const [permissibleCounts, setPermissibleCounts] =
        useState<Map<string, number>>(new Map());

    const [activeCategory, setActiveCategory] =
        useState<string | null>(null);

    const [showFilters, setShowFilters] =
        useState(false);

    const [selectedThemes, setSelectedThemes] =
        useState<string[]>([]);

    const [selectedSubThemes, setSelectedSubThemes] =
        useState<string[]>([]);

    const [selectedTypes, setSelectedTypes] =
        useState<("New" | "Repair")[]>([]);

    /*
     * ---------------------------------------------------------
     * SOURCE WORKS
     * ---------------------------------------------------------
     */

    const sourceWorks = useMemo(() => {
        if (activeTab === "ejal") {
            return works;
        }

        return permissibleWorks;
    }, [
        works,
        permissibleWorks,
        activeTab,
    ]);

    /*
     * ---------------------------------------------------------
     * THEME OPTIONS
     * ---------------------------------------------------------
     */

    const themeOptions = useMemo(() => {
        return Array.from(
            new Set(
                sourceWorks
                    .map((work) => work.theme?.trim())
                    .filter(Boolean)
            )
        ).sort((a, b) =>
            String(a).localeCompare(
                String(b),
                undefined,
                {
                    sensitivity: "base",
                }
            )
        );
    }, [sourceWorks]);

    /*
     * ---------------------------------------------------------
     * SUB CATEGORY OPTIONS
     *
     * Selected theme ke according sub categories dikhenge.
     * ---------------------------------------------------------
     */

    const subThemeOptions = useMemo(() => {
        return Array.from(
            new Set(
                sourceWorks
                    .filter(
                        (work) =>
                            selectedThemes.length === 0 ||
                            selectedThemes.includes(
                                work.theme
                            )
                    )
                    .map((work) =>
                        work.subTheme?.trim()
                    )
                    .filter(Boolean)
            )
        ).sort((a, b) =>
            String(a).localeCompare(
                String(b),
                undefined,
                {
                    sensitivity: "base",
                }
            )
        );
    }, [
        sourceWorks,
        selectedThemes,
    ]);

    /*
     * ---------------------------------------------------------
     * QUANTITY
     * ---------------------------------------------------------
     */

    const getQuantity = (work: Work) => {
        const item =
            work as WorkWithOptionalFields;

        return (
            item.quantity ??
            item.count ??
            0
        );
    };

    /*
     * ---------------------------------------------------------
     * FILTERED WORKS
     * ---------------------------------------------------------
     */

    const filteredWorks = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return sourceWorks.filter((work) => {
            const workName =
                work.workName?.toLowerCase() ?? "";

            const vgpId =
                work.vgpId?.toLowerCase() ?? "";

            const subTheme =
                work.subTheme?.toLowerCase() ?? "";

            const theme =
                work.theme?.toLowerCase() ?? "";

            const matchesSearch =
                !query ||
                workName.includes(query) ||
                vgpId.includes(query) ||
                subTheme.includes(query) ||
                theme.includes(query);

            const matchesCategory =
                !activeCategory ||
                work.theme === activeCategory;

            const matchesTheme =
                selectedThemes.length === 0 ||
                selectedThemes.includes(
                    work.theme
                );

            const matchesSubTheme =
                selectedSubThemes.length === 0 ||
                selectedSubThemes.includes(
                    work.subTheme
                );

            const matchesType =
                selectedTypes.length === 0 ||
                selectedTypes.includes(
                    work.type
                );

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
    ]);

    /*
     * ---------------------------------------------------------
     * SELECTED WORKS
     * ---------------------------------------------------------
     */

    const selectedWorks = useMemo(() => {
        const allWorks = [
            ...works,
            ...permissibleWorks,
        ];

        const uniqueWorks =
            Array.from(
                new Map(
                    allWorks.map((work) => [
                        work.id,
                        work,
                    ])
                ).values()
            );

        return uniqueWorks
            .filter((work) =>
                selectedIds.has(work.id)
            )
            .map((work) => ({
                ...work,
                count:
                    ejalCounts.has(work.id)
                        ? ejalCounts.get(
                            work.id
                        ) ?? 0
                        : getQuantity(work),
            }));
    }, [
        works,
        permissibleWorks,
        selectedIds,
        ejalCounts,
    ]);

    /*
     * ---------------------------------------------------------
     * ADD WORK
     * ---------------------------------------------------------
     */

    const handleAdd = (work: Work) => {
        if (activeTab === "ejal") {
            setEjalCounts((current) => {
                const next = new Map(current);

                const currentCount =
                    next.get(work.id) ?? 0;

                const maxCount =
                    getQuantity(work);

                if (
                    maxCount > 0 &&
                    currentCount >= maxCount
                ) {
                    return current;
                }

                next.set(
                    work.id,
                    currentCount + 1
                );

                return next;
            });

            setSelectedIds((current) => {
                const next = new Set(current);

                next.add(work.id);

                return next;
            });

            return;
        }

        // PERMISSIBLE WORKS — multiple times allowed
        setPermissibleCounts((current) => {
            const next = new Map(current);
            const currentCount = next.get(work.id) ?? 0;

            next.set(work.id, currentCount + 1);

            return next;
        });

        setSelectedIds((current) => {
            if (current.has(work.id)) {
                return current;
            }

            const next = new Set(current);

            next.add(work.id);

            return next;
        });
    };

    /*
     * ---------------------------------------------------------
     * REMOVE WORK
     * ---------------------------------------------------------
     */

    const handleRemove = (id: string) => {
        if (ejalCounts.has(id)) {
            setEjalCounts((current) => {
                const next = new Map(current);

                const currentCount =
                    next.get(id) ?? 0;

                if (currentCount <= 1) {
                    next.delete(id);

                    setSelectedIds((ids) => {
                        const updated =
                            new Set(ids);

                        updated.delete(id);

                        return updated;
                    });
                } else {
                    next.set(
                        id,
                        currentCount - 1
                    );
                }

                return next;
            });

            return;
        }

        setSelectedIds((current) => {
            const next = new Set(current);

            next.delete(id);

            return next;
        });
    };

    /*
     * ---------------------------------------------------------
     * CATEGORY COUNTS
     * ---------------------------------------------------------
     */

    const categoryCounts = useMemo(() => {
        return categories.map(
            (category) => ({
                ...category,
                count: sourceWorks.filter(
                    (work) =>
                        work.theme ===
                        category.key
                ).length,
            })
        );
    }, [sourceWorks]);

    /*
     * ---------------------------------------------------------
     * ACTIVE FILTER COUNT
     * ---------------------------------------------------------
     */

    const activeFilterCount =
        selectedThemes.length +
        selectedSubThemes.length +
        selectedTypes.length;

    /*
     * ---------------------------------------------------------
     * FILTER HANDLERS
     * ---------------------------------------------------------
     */

    const toggleTheme = (
        theme: string
    ) => {
        setSelectedThemes((current) =>
            current.includes(theme)
                ? current.filter(
                    (item) =>
                        item !== theme
                )
                : [
                    ...current,
                    theme,
                ]
        );
    };

    const toggleSubTheme = (
        subTheme: string
    ) => {
        setSelectedSubThemes(
            (current) =>
                current.includes(subTheme)
                    ? current.filter(
                        (item) =>
                            item !== subTheme
                    )
                    : [
                        ...current,
                        subTheme,
                    ]
        );
    };

    const toggleType = (
        type: WorkType
    ) => {
        setSelectedTypes((current) =>
            current.includes(type)
                ? current.filter(
                    (item) =>
                        item !== type
                )
                : [
                    ...current,
                    type,
                ]
        );
    };

    const clearFilters = () => {
        setSearch("");
        setActiveCategory(null);
        setSelectedThemes([]);
        setSelectedSubThemes([]);
        setSelectedTypes([]);
    };

    /*
     * ---------------------------------------------------------
     * RENDER
     * ---------------------------------------------------------
     */

    return (
        <div className="relative min-h-0 w-full">
            <div className="grid min-h-[calc(100vh-130px)] grid-cols-1 gap-3 px-2 pb-2 sm:gap-4 sm:pb-1 lg:grid-cols-2 lg:pb-2">

                {/* =====================================================
            LEFT - WORK CATALOGUE
        ===================================================== */}

                <section className="relative flex min-h-[560px] min-w-0 flex-col overflow-hidden rounded-[8px] border border-[#c7dce8] bg-white shadow-[0_8px_28px_rgba(0,59,99,0.09)] lg:min-h-0">

                    {/* TOP ACCENT */}
                    <div className="absolute left-0 right-0 top-0 z-30 flex h-[4px]">
                        <div className="flex-1 bg-[#075a91]" />
                        <div className="w-16 bg-[#f58220]" />
                    </div>


                    <div className="shrink-0 border-b border-[#d7e5ed] bg-gradient-to-r from-[#f3faff] via-white to-[#fffaf5] pt-[4px]">

                        <div className="relative grid min-h-[58px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 py-2 sm:px-4">

                            {/* LEFT - TITLE */}

                            <div className="flex min-w-0 items-center gap-2">

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


                            {/* CENTER - SEARCH + FILTER */}

                            <div className="flex w-[min(42vw,430px)] min-w-[280px] items-center gap-2">

                                <div className="relative min-w-0 flex-1">

                                    <Search
                                        size={12}
                                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search works..."
                                        className="h-8 w-full rounded-[5px] border border-[#c8dbe5] bg-white pl-8 pr-8 text-[9px] text-[#263f52] outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
                                    />

                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch("")}
                                            title="Clear search"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-[#075a91]"
                                        >
                                            <X size={11} />
                                        </button>
                                    )}

                                </div>


                                {/* FILTER */}

                                <button
                                    type="button"
                                    onClick={() => setShowFilters((current) => !current)}
                                    title="Filter works"
                                    className={`relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border transition ${showFilters || activeFilterCount > 0
                                        ? "border-[#075a91] bg-[#075a91] text-white"
                                        : "border-[#c8dbe5] bg-white text-[#075a91] hover:bg-[#eef7fb]"
                                        }`}
                                >
                                    <SlidersHorizontal size={13} />

                                    {activeFilterCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#f58220] px-1 text-[7px] font-extrabold text-white">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                            </div>


                            {/* RIGHT - WORK COUNT */}

                            <div className="flex shrink-0 items-center justify-end gap-1 whitespace-nowrap">

                                <span className="text-[12px] font-extrabold leading-none text-[#003b63] sm:text-[14px]">
                                    {filteredWorks.length}
                                </span>

                                <span className="text-[9px] font-bold uppercase leading-none text-slate-400 sm:text-[11px] pt-0.5">
                                    WORKS
                                </span>

                            </div>

                        </div>


                        <div className="px-3 pb-2 sm:hidden">
                            <div className="relative">

                                <Search
                                    size={12}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search works..."
                                    className="h-8 w-full rounded-[5px] border border-[#c8dbe5] bg-white pl-8 pr-8 text-[9px] text-[#263f52] outline-none focus:border-[#075a91]"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        <X size={11} />
                                    </button>
                                )}

                            </div>
                        </div>

=\

                        {showFilters && (
                            <>
                                {/* BACKDROP */}

                                <div
                                    className="absolute inset-x-0 top-[62px] bottom-0 z-40 bg-[#003b63]/10 backdrop-blur-[1px]"
                                    onClick={() => setShowFilters(false)}
                                />

                                {/* MEGA FILTER */}

                                <div className="absolute left-0 right-0 top-[62px] z-50 overflow-hidden border-b border-[#c7dce8] bg-white shadow-[0_12px_28px_rgba(0,59,99,0.18)]">

                                    {/* FILTER HEADER */}

                                    <div className="flex h-9 items-center justify-between border-b border-[#e4edf2] bg-[#f7f7f7] px-3 sm:px-4">

                                        <span className="text-[10px] font-bold text-[#475569]">
                                            Filter by
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => setShowFilters(false)}
                                            title="Close filters"
                                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                        >
                                            <X size={13} />
                                        </button>

                                    </div>


                                    {/* FILTER BODY */}

                                    <div className="max-h-[250px] overflow-y-auto px-3 py-3 sm:px-4">

                                        {/* THEME */}

                                        <div className="mb-4">

                                            <div className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.6px] text-slate-400">
                                                Theme
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">

                                                {themeOptions.map((theme) => {
                                                    const active =
                                                        selectedThemes.includes(theme);

                                                    return (
                                                        <button
                                                            key={theme}
                                                            type="button"
                                                            onClick={() =>
                                                                toggleTheme(theme)
                                                            }
                                                            className={`cursor-pointer rounded-full border px-3 py-1 text-[8px] font-semibold transition ${active
                                                                ? "border-[#075a91] bg-[#075a91] text-white"
                                                                : "border-[#c5c5c5] bg-[#f8f8f8] text-[#555] hover:border-[#075a91] hover:bg-[#eef7fb] hover:text-[#075a91]"
                                                                }`}
                                                        >
                                                            {theme === "Water Security"
                                                                ? "Water"
                                                                : theme ===
                                                                    "Rural Infrastructure"
                                                                    ? "Rural"
                                                                    : theme ===
                                                                        "Livelihood Infrastructure"
                                                                        ? "Livelihood"
                                                                        : theme ===
                                                                            "Climate Resilience"
                                                                            ? "Climate"
                                                                            : theme}
                                                        </button>
                                                    );
                                                })}

                                            </div>

                                        </div>


                                        {/* TYPE */}

                                        <div className="mb-4">

                                            <div className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.6px] text-slate-400">
                                                Type
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">

                                                {WORK_TYPES.map((type) => {
                                                    const active = selectedTypes.includes(type);

                                                    return (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() =>
                                                                toggleType(type)
                                                            }
                                                            className={`cursor-pointer rounded-full border px-3 py-1 text-[8px] font-semibold transition ${active
                                                                ? "border-[#075a91] bg-[#075a91] text-white"
                                                                : "border-[#c5c5c5] bg-[#f8f8f8] text-[#555] hover:border-[#075a91] hover:bg-[#eef7fb] hover:text-[#075a91]"
                                                                }`}
                                                        >
                                                            {type}
                                                        </button>
                                                    );
                                                }
                                                )}

                                            </div>

                                        </div>


                                        {/* SUB CATEGORY */}

                                        <div>

                                            <div className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.6px] text-slate-400">
                                                Sub Category
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">

                                                {subThemeOptions.length > 0 ? (
                                                    subThemeOptions.map(
                                                        (subTheme) => {
                                                            const active =
                                                                selectedSubThemes.includes(
                                                                    subTheme
                                                                );

                                                            return (
                                                                <button
                                                                    key={subTheme}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        toggleSubTheme(
                                                                            subTheme
                                                                        )
                                                                    }
                                                                    className={`cursor-pointer rounded-full border px-3 py-1 text-[8px] font-semibold transition ${active
                                                                        ? "border-[#075a91] bg-[#075a91] text-white"
                                                                        : "border-[#c5c5c5] bg-[#f8f8f8] text-[#555] hover:border-[#075a91] hover:bg-[#eef7fb] hover:text-[#075a91]"
                                                                        }`}
                                                                >
                                                                    {subTheme}
                                                                </button>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <span className="text-[8px] text-slate-400">
                                                        No sub categories available
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                    </div>


                                    {/* FILTER FOOTER */}

                                    {activeFilterCount > 0 && (
                                        <div className="flex h-8 items-center justify-between border-t border-[#e4edf2] bg-[#fafcfd] px-3 sm:px-4">

                                            <span className="text-[7px] font-semibold text-slate-400">
                                                {activeFilterCount} filter
                                                {activeFilterCount > 1
                                                    ? "s"
                                                    : ""}{" "}
                                                applied
                                            </span>

                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="cursor-pointer text-[8px] font-bold text-[#075a91] hover:text-[#f58220]"
                                            >
                                                Clear all
                                            </button>

                                        </div>
                                    )}

                                </div>
                            </>
                        )}

                    </div>

                    {/* =================================================
              SOURCE TABS
          ================================================= */}

                    <RequirementsSourceTabs
                        activeTab={activeTab}
                        onChange={(tab) => {
                            setActiveTab(tab);
                            setActiveCategory(null);
                            setSearch("");
                            setSelectedThemes([]);
                            setSelectedSubThemes([]);
                            setSelectedTypes([]);
                            setShowFilters(false);
                        }}
                    />

                    {/* =================================================
              CATEGORY SUMMARY
          ================================================= */}

                    <div className="grid h-16 shrink-0 grid-cols-4 border-b border-[#dce7ed] bg-white">

                        {categoryCounts.map(
                            (category) => {
                                const active =
                                    activeCategory ===
                                    category.key;

                                return (
                                    <button
                                        key={category.key}
                                        type="button"
                                        onClick={() =>
                                            setActiveCategory(
                                                active
                                                    ? null
                                                    : category.key
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
                            }
                        )}

                    </div>

                    {/* =================================================
              LEFT TABLE
          ================================================= */}

                    <RequirementTable
                        works={filteredWorks}
                        selectedIds={selectedIds}
                        ejalCounts={ejalCounts}
                        activeTab={activeTab}
                        onAdd={handleAdd}
                    />

                </section>

                <section className="relative flex min-h-[500px] min-w-0 flex-col overflow-hidden rounded-[8px] border border-[#c7dce8] bg-white shadow-[0_8px_28px_rgba(0,59,99,0.09)] lg:min-h-0">

                    <div className="flex h-[4px] shrink-0">
                        <div className="flex-1 bg-[#075a91]" />
                        <div className="w-16 bg-[#f58220]" />
                    </div>

                    {/* RIGHT HEADER */}

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

                    {/* SELECTED CATEGORY COUNTS */}

                    <div className="mx-3 mt-3 grid h-16 shrink-0 grid-cols-4 overflow-hidden rounded-[6px] border border-[#dce7ed]">

                        {categories.map(
                            (category) => {
                                const count =
                                    selectedWorks.filter(
                                        (work) =>
                                            work.theme ===
                                            category.key
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
                            }
                        )}

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
                                                key={`selected-${work.id}`}
                                                className="group h-10 border-b border-[#e4edf2] transition hover:bg-[#fff8f4] sm:h-11"
                                            >

                                                <td className="px-2 text-center">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemove(
                                                                work.id
                                                            )
                                                        }
                                                        title="Remove work"
                                                        className="mx-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#fecaca] bg-[#fff5f5] text-[13px] font-bold text-[#dc2626] transition hover:bg-[#dc2626] hover:text-white active:scale-90"
                                                    >
                                                        −
                                                    </button>

                                                </td>

                                                <td className="px-2 font-mono text-[8px] text-slate-400">
                                                    {String(
                                                        index + 1
                                                    ).padStart(2, "0")}
                                                </td>

                                                <td
                                                    className="truncate px-2 font-semibold text-[#263f52]"
                                                    title={
                                                        work.workName
                                                    }
                                                >
                                                    {work.workName}
                                                </td>

                                                <td
                                                    className="truncate px-2 text-slate-500"
                                                    title={
                                                        work.subTheme
                                                    }
                                                >
                                                    {work.subTheme}
                                                </td>

                                                <td
                                                    className={`truncate px-2 font-semibold ${themeClass}`}
                                                    title={
                                                        work.theme
                                                    }
                                                >
                                                    {work.theme}
                                                </td>

                                                <td className="px-2">

                                                    <span
                                                        className={`inline-flex rounded-full border px-2 py-1 text-[7px] font-bold ${work.type ===
                                                            "Repair"
                                                            ? "border-[#fecaca] bg-[#fff5f5] text-[#dc2626]"
                                                            : "border-[#bce6d5] bg-[#effbf5] text-[#00875a]"
                                                            }`}
                                                    >
                                                        {work.type}
                                                    </span>

                                                </td>

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

                        {selectedWorks.length ===
                            0 && (
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
                                        Select works from the catalogue on the left panel to build your VGP requirements.
                                    </p>

                                </div>
                            )}

                    </div>

                </section>

            </div>

            {/* NEXT */}

            <div className="absolute right-3 z-40">

                <button
                    type="button"
                    className="inline-flex min-h-8 items-center gap-2 rounded-[4px] bg-[#075a91] px-4 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#003b63] active:scale-[0.98] sm:px-5 cursor-pointer"
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