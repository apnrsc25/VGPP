"use client";

import {
    Search,
    SlidersHorizontal,
    X,
    Pencil,
} from "lucide-react";

import { useMemo, useState } from "react";

import type { Work, WorkType } from "@/types/work";

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

type WorkUnit = "meter" | "meter_square" | "meter_cube";

type PendingWork = {
    work: Work;
    localWorkName: string;
    unit: WorkUnit;
    value: string;
    length: string;
    width: string;
    depth: string;
};

type RequirementEntry = {
    entryId: string;
    workId: string;
    source: SourceTab;
    localWorkName: string;
    unit: WorkUnit;
    value: string;
    length: string;
    width: string;
    depth: string;
    quantity: number;
};

export default function RequirementsWorkspace({
    works,
    permissibleWorks,
}: RequirementsWorkspaceProps) {
    const [activeTab, setActiveTab] =
        useState<SourceTab>("ejal");

    const [search, setSearch] = useState("");

    const [pendingWork, setPendingWork] =
        useState<PendingWork | null>(null);

    const [editingEntryId, setEditingEntryId] =
        useState<string | null>(null);

    // Every configured work is a separate requirement entry.
    // The same catalogue work can therefore be added multiple times
    // with different Local Name / Unit / dimensions.
    const [requirements, setRequirements] =
        useState<RequirementEntry[]>([]);

    const [activeCategory, setActiveCategory] =
        useState<string | null>(null);

    const [showFilters, setShowFilters] =
        useState(false);

    const [selectedThemes, setSelectedThemes] =
        useState<string[]>([]);

    const [selectedSubThemes, setSelectedSubThemes] =
        useState<string[]>([]);

    const [selectedTypes, setSelectedTypes] =
        useState<WorkType[]>([]);

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
        const allWorks = [...works, ...permissibleWorks];

        const uniqueWorks = Array.from(
            new Map(allWorks.map((work) => [work.id, work])).values()
        );

        const selectedWorkIds = new Set(
            requirements.map((entry) => entry.workId)
        );

        return uniqueWorks
            .filter((work) => selectedWorkIds.has(work.id))
            .map((work) => ({
                ...work,
                count: requirements.filter(
                    (entry) => entry.workId === work.id
                ).length,
            }));
    }, [works, permissibleWorks, requirements]);

    /*
     * ---------------------------------------------------------
     * ADD / EDIT WORK CONFIGURATION
     * ---------------------------------------------------------
     */

    const handleAdd = (work: Work) => {
        setPendingWork({
            work,
            localWorkName: "",
            unit: "meter",
            value: "",
            length: "",
            width: "",
            depth: "",
        });
    };

    const handleEdit = (entry: RequirementEntry) => {
        const work = [...works, ...permissibleWorks].find(
            (item) => item.id === entry.workId
        );

        if (!work) return;

        setPendingWork({
            work,
            localWorkName: entry.localWorkName,
            unit: entry.unit,
            value: entry.value,
            length: entry.length,
            width: entry.width,
            depth: entry.depth,
        });

        setEditingEntryId(entry.entryId);
    };

    const updatePending = (patch: Partial<PendingWork>) => {
        setPendingWork((current) =>
            current ? { ...current, ...patch } : current
        );
    };

    const calculatedQuantity = pendingWork
        ? pendingWork.unit === "meter"
            ? Number(pendingWork.value || 0)
            : pendingWork.unit === "meter_square"
                ? Number(pendingWork.length || 0) *
                  Number(pendingWork.width || 0)
                : Number(pendingWork.length || 0) *
                  Number(pendingWork.width || 0) *
                  Number(pendingWork.depth || 0)
        : 0;

    const pendingFormValid = Boolean(
        pendingWork &&
        pendingWork.localWorkName.trim() &&
        (pendingWork.unit === "meter"
            ? Number(pendingWork.value) > 0
            : pendingWork.unit === "meter_square"
                ? Number(pendingWork.length) > 0 &&
                  Number(pendingWork.width) > 0
                : Number(pendingWork.length) > 0 &&
                  Number(pendingWork.width) > 0 &&
                  Number(pendingWork.depth) > 0)
    );

    const submitPendingWork = () => {
        if (!pendingWork || !pendingFormValid) return;

        const workId = pendingWork.work.id;
        const source = activeTab;

        // E-Jal: each catalogue work may be configured only up to
        // its source quantity. Permissible: no entry limit.
        const existingForWork = requirements.filter(
            (entry) =>
                entry.workId === workId &&
                entry.source === source
        ).length;

        const maxCount =
            source === "ejal"
                ? getQuantity(pendingWork.work)
                : Infinity;

        if (
            editingEntryId === null &&
            existingForWork >= maxCount
        ) {
            return;
        }

        const entry: RequirementEntry = {
            entryId:
                editingEntryId ??
                `${workId}-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,
            workId,
            source,
            localWorkName:
                pendingWork.localWorkName.trim(),
            unit: pendingWork.unit,
            value: pendingWork.value,
            length: pendingWork.length,
            width: pendingWork.width,
            depth: pendingWork.depth,
            quantity: calculatedQuantity,
        };

        setRequirements((current) => {
            if (editingEntryId) {
                return current.map((item) =>
                    item.entryId === editingEntryId
                        ? entry
                        : item
                );
            }

            return [...current, entry];
        });

        setEditingEntryId(null);
        setPendingWork(null);
    };

    const cancelPendingWork = () => {
        setEditingEntryId(null);
        setPendingWork(null);
    };

    /*
     * ---------------------------------------------------------
     * REMOVE WORK
     * ---------------------------------------------------------
     */

    const handleRemove = (entryId: string) => {
        setRequirements((current) =>
            current.filter(
                (entry) => entry.entryId !== entryId
            )
        );
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
        <div className="flex h-[calc(100dvh-128px)] min-h-0 w-full flex-col overflow-hidden">
            <div className="grid min-h-0 h-full flex-1 grid-cols-1 gap-2 overflow-hidden px-2 p-2 sm:gap-2 lg:grid-cols-2">

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

                    <div className="grid h-[72px] shrink-0 grid-cols-4 gap-2 border-b border-[#dce7ed] bg-[#f8fafc] p-2">
                        {categoryCounts.map((category) => {
                            const active = activeCategory === category.key;

                            return (
                                <button key={category.key} type="button" onClick={() => setActiveCategory(active ? null : category.key)} aria-pressed={active} className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border transition-all duration-200 outline-none ${active ? "border-[#f58220] bg-white shadow-md" : "border-transparent bg-[#eef8f3] shadow-[0_2px_6px_rgba(0,63,99,0.20)] hover:border-[#b9d8e6] hover:bg-[#f0f8fc] hover:shadow-sm"}`}>
                                    <span className={`text-[17px] font-extrabold transition-transform duration-200 sm:text-[19px] ${category.color} ${active ? "scale-105" : "group-hover:scale-105"}`}>{category.count}</span>

                                    <span className={`mt-0.5 text-[8px] font-bold uppercase tracking-[0.6px] sm:text-[9px] ${active ? "text-[#173f56]" : "text-[#36566b]"}`}>{category.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <RequirementTable
                        works={filteredWorks}
                        selectedIds={new Set(requirements.map((entry) => entry.workId))}
                        ejalCounts={new Map(
                            works.map((work) => [
                                work.id,
                                requirements.filter(
                                    (entry) =>
                                        entry.workId === work.id &&
                                        entry.source === "ejal"
                                ).length,
                            ])
                        )}
                        activeTab={activeTab}
                        onAdd={handleAdd}
                        pendingWorkId={pendingWork?.work.id ?? null}
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
                                {requirements.length}
                            </span>

                            <span className="hidden text-[8px] font-bold text-[#475569] sm:block">
                                WORKS
                            </span>

                        </div>

                    </div>

                    {pendingWork ? (
                        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                            <div className="rounded-[8px] border border-[#c7dce8] bg-[#f8fbfd] shadow-sm">
                                <div className="border-b border-[#dce7ed] bg-[#eef7fb] px-3 py-2.5">
                                    <div className="text-[8px] font-extrabold uppercase tracking-[0.6px] text-[#075a91]">Configure Work</div>
                                    <div className="mt-0.5 text-[11px] font-bold leading-snug text-[#263f52] sm:text-[12px]">{pendingWork.work.workName}</div>
                                </div>
                                <div className="space-y-3 p-3">
                                    <div>
                                        <label className="mb-1 block text-[8px] font-bold uppercase tracking-[0.4px] text-[#526b7b]">Local Work Name <span className="text-[#dc2626]">*</span></label>
                                        <input type="text" value={pendingWork.localWorkName} onChange={(event) => updatePending({ localWorkName: event.target.value })} placeholder="Enter local work name" className="h-9 w-full rounded-[5px] border border-[#c8dbe5] bg-white px-2.5 text-[10px] text-[#263f52] outline-none focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[8px] font-bold uppercase tracking-[0.4px] text-[#526b7b]">Unit <span className="text-[#dc2626]">*</span></label>
                                        <select value={pendingWork.unit} onChange={(event) => updatePending({ unit: event.target.value as WorkUnit, value: "", length: "", width: "", depth: "" })} className="h-9 w-full rounded-[5px] border border-[#c8dbe5] bg-white px-2.5 text-[10px] font-semibold text-[#263f52] outline-none focus:border-[#075a91]">
                                            <option value="meter">Meter (m)</option>
                                            <option value="meter_square">Meter Square (m²)</option>
                                            <option value="meter_cube">Meter Cube (m³)</option>
                                        </select>
                                    </div>
                                    {pendingWork.unit === "meter" && (
                                        <div>
                                            <label className="mb-1 block text-[8px] font-bold uppercase tracking-[0.4px] text-[#526b7b]">Value (m) <span className="text-[#dc2626]">*</span></label>
                                            <input type="number" min="0" step="any" value={pendingWork.value} onChange={(event) => updatePending({ value: event.target.value })} placeholder="Enter value" className="h-9 w-full rounded-[5px] border border-[#c8dbe5] bg-white px-2.5 text-[10px] text-[#263f52] outline-none focus:border-[#075a91]" />
                                        </div>
                                    )}
                                    {pendingWork.unit === "meter_square" && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div><label className="mb-1 block text-[8px] font-bold uppercase text-[#526b7b]">Length (m) *</label><input type="number" min="0" step="any" value={pendingWork.length} onChange={(event) => updatePending({ length: event.target.value })} className="h-9 w-full rounded-[5px] border border-[#c8dbe5] bg-white px-2 text-[10px] outline-none focus:border-[#075a91]" /></div>
                                            <div><label className="mb-1 block text-[8px] font-bold uppercase text-[#526b7b]">Width (m) *</label><input type="number" min="0" step="any" value={pendingWork.width} onChange={(event) => updatePending({ width: event.target.value })} className="h-9 w-full rounded-[5px] border border-[#c8dbe5] bg-white px-2 text-[10px] outline-none focus:border-[#075a91]" /></div>
                                        </div>
                                    )}
                                    {pendingWork.unit === "meter_cube" && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <div><label className="mb-1 block text-[8px] font-bold uppercase text-[#526b7b]">Length *</label><input type="number" min="0" step="any" value={pendingWork.length} onChange={(event) => updatePending({ length: event.target.value })} className="h-9 w-full rounded-[5px] border border-[#c8dbe5] bg-white px-2 text-[10px] outline-none focus:border-[#075a91]" /></div>
                                            <div><label className="mb-1 block text-[8px] font-bold uppercase text-[#526b7b]">Width *</label><input type="number" min="0" step="any" value={pendingWork.width} onChange={(event) => updatePending({ width: event.target.value })} className="h-9 w-full rounded-[5px] border border-[#c8dbe5] bg-white px-2 text-[10px] outline-none focus:border-[#075a91]" /></div>
                                            <div><label className="mb-1 block text-[8px] font-bold uppercase text-[#526b7b]">Depth *</label><input type="number" min="0" step="any" value={pendingWork.depth} onChange={(event) => updatePending({ depth: event.target.value })} className="h-9 w-full rounded-[5px] border border-[#c8dbe5] bg-white px-2 text-[10px] outline-none focus:border-[#075a91]" /></div>
                                        </div>
                                    )}
                                    <div className="rounded-[6px] border border-[#bcd5e2] bg-white px-3 py-2.5">
                                        <div className="text-[8px] font-bold uppercase tracking-[0.4px] text-slate-400">Calculated Quantity</div>
                                        <div className="mt-1 flex items-baseline justify-between"><span className="text-[18px] font-extrabold text-[#075a91]">{calculatedQuantity || 0}</span><span className="text-[9px] font-bold text-[#526b7b]">{pendingWork.unit === "meter" ? "m" : pendingWork.unit === "meter_square" ? "m²" : "m³"}</span></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button type="button" onClick={cancelPendingWork} className="flex h-9 items-center justify-center rounded-[5px] border border-[#c8dbe5] bg-white text-[10px] font-extrabold text-[#526b7b] transition hover:bg-[#f5fafc] cursor-pointer">Cancel</button>
                                        <button type="button" disabled={!pendingFormValid} onClick={submitPendingWork} className={`flex h-9 items-center justify-center gap-2 rounded-[5px] text-[10px] font-extrabold text-white transition ${pendingFormValid ? "cursor-pointer bg-[#00875a] hover:bg-[#006f4a]" : "cursor-not-allowed bg-slate-300"}`}>Submit <span className="text-[13px]">→</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* INFO */}
                            <div className="mx-2 mt-2 shrink-0 rounded-[6px] border border-dashed border-[#bcd5e2] bg-[#f5fafc] px-2 py-1.5 text-center">
                                <div className="text-[9px] font-semibold text-[#36566b] sm:text-[10px]">Works selected from the catalogue</div>
                                <div className="mt-0.5 text-[7px] text-slate-400 sm:text-[8px]">E-Jal recommendations & permissible works</div>
                            </div>
                            <div className="m-2 grid h-16 shrink-0 grid-cols-4 overflow-hidden rounded-[6px] border border-[#dce7ed] shadow-[0_2px_6px_rgba(0,63,99,0.20)]">
                                {categories.map((category) => { const count = selectedWorks.filter((work) => work.theme === category.key).length; return <div key={category.key} className="flex flex-col items-center justify-center border-r-2 border-[#e2ebf0] last:border-r-0 bg-[#eef8f3]"><span className={`text-[17px] font-extrabold sm:text-[19px] ${category.color}`}>{count}</span><span className="text-[7px] font-bold tracking-[0.4px] text-[#36566b] sm:text-[8px]">{category.label}</span></div>; })}
                            </div>
                            <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
                                <table className="w-full min-w-[980px] table-fixed border-collapse text-[10px] sm:text-[11px]">
                                    <thead className="sticky top-0 z-20 bg-[#003b63] text-white shadow-sm">
                                        <tr className="h-9 text-[8px] uppercase tracking-[0.5px] sm:text-[9px]">
                                            <th className="w-[6%] px-2 text-center">REMOVE</th>
                                            <th className="w-[4%] px-2 text-left">#</th>
                                            <th className="w-[18%] px-2 text-left">LOCAL NAME</th>
                                            <th className="w-[17%] px-2 text-left">WORK NAME</th>
                                            <th className="w-[9%] px-2 text-left">UNIT</th>
                                            <th className="w-[15%] px-2 text-left">DETAIL / QTY</th>
                                            <th className="w-[14%] px-2 text-left">SUB THEME</th>
                                            <th className="w-[10%] px-2 text-left">THEME</th>
                                            <th className="w-[4%] px-2 text-center">COUNT</th>
                                            <th className="w-[6%] px-2 text-center">EDIT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requirements.map((entry, index) => {
                                            const work = [...works, ...permissibleWorks].find(
                                                (item) => item.id === entry.workId
                                            );

                                            if (!work) return null;

                                            const themeClass = work.theme === "Rural Infrastructure"
                                                ? "text-[#7c3aed]"
                                                : work.theme === "Livelihood Infrastructure"
                                                    ? "text-[#00875a]"
                                                    : work.theme === "Climate Resilience"
                                                        ? "text-[#0879b1]"
                                                        : "text-[#d97706]";

                                            const unitLabel = entry.unit === "meter_square"
                                                ? "m²"
                                                : entry.unit === "meter_cube"
                                                    ? "m³"
                                                    : "m";

                                            const detailText = entry.unit === "meter"
                                                ? `${entry.value || 0} ${unitLabel}`
                                                : entry.unit === "meter_square"
                                                    ? `${entry.length || 0} × ${entry.width || 0} = ${entry.quantity} ${unitLabel}`
                                                    : `${entry.length || 0} × ${entry.width || 0} × ${entry.depth || 0} = ${entry.quantity} ${unitLabel}`;

                                            return (
                                                <tr key={`selected-${entry.entryId}`} className="group min-h-10 border-b border-[#e4edf2] transition hover:bg-[#fff8f4]">
                                                    <td className="px-2 text-center">
                                                        <button type="button" onClick={() => handleRemove(entry.entryId)} title="Remove work" className="mx-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#fecaca] bg-[#fff5f5] text-[13px] font-bold text-[#dc2626] transition hover:bg-[#dc2626] hover:text-white active:scale-90">−</button>
                                                    </td>
                                                    <td className="px-2 font-mono text-[8px] text-slate-400">{String(index + 1).padStart(2, "0")}</td>
                                                    <td className="px-2 font-bold text-[#075a91]" title={entry.localWorkName}>{entry.localWorkName}</td>
                                                    <td className="px-2 font-semibold text-[#263f52]" title={work.workName}>{work.workName}</td>
                                                    <td className="px-2 font-bold text-[#36566b]">{unitLabel}</td>
                                                    <td className="px-2 font-semibold text-[#00875a]" title={detailText}>{detailText}</td>
                                                    <td className="px-2 text-slate-500" title={work.subTheme}>{work.subTheme}</td>
                                                    <td className={`px-2 font-semibold ${themeClass}`} title={work.theme}>{work.theme}</td>
                                                    <td className="px-2 text-center"><span className="inline-flex min-w-8 items-center justify-center rounded-[4px] bg-[#edf7fc] px-2 py-1 text-[8px] font-extrabold text-[#075a91]">{requirements.filter((item) => item.workId === entry.workId && item.source === entry.source).indexOf(entry) + 1}</span></td>
                                                    <td className="px-2 text-center">
                                                        <button type="button" onClick={() => handleEdit(entry)} title="Edit work details" className="mx-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-[5px] border border-[#c6dce8] bg-[#f4faff] text-[#075a91] transition hover:border-[#075a91] hover:bg-[#075a91] hover:text-white active:scale-90">
                                                            <Pencil size={12} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {requirements.length === 0 && <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#cfe2ec] bg-[#eef7fb] text-[#075a91]"><span className="text-[17px] font-bold">+</span></div><p className="text-[11px] font-bold text-[#475569]">No works selected</p><p className="mt-1 max-w-[260px] text-[8px] leading-relaxed text-slate-400">Select works from the catalogue on the left panel to build your VGP requirements.</p></div>}
                            </div>
                        </>
                    )}
                </section>

            </div>

            {/* NEXT */}

            <div className="z-20 flex h-[52px] shrink-0 items-center justify-end border-t border-[#d5e2ea] bg-white px-3 shadow-[0_-3px_12px_rgba(0,59,99,0.08)] sm:h-[56px] sm:px-4">


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