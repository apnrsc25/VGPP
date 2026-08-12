"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AvailabilityTable from "./AvailabilityTable";
import AvailabilityFilter from "./AvailabilityFilter";

import type { Work } from "@/types/work";

const AvailabilityMap = dynamic(
    () => import("./AvailabilityMap"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full min-h-[500px] items-center justify-center rounded-xl bg-[#f5f2ec] text-sm text-slate-500">
                Loading map...
            </div>
        ),
    }
);

interface AvailabilityWorkspaceProps {
    works: Work[];
    proposalId: string;
}

export default function AvailabilityWorkspace({
    works,
    proposalId,
}: AvailabilityWorkspaceProps) {
    const router = useRouter();

    const [search, setSearch] = useState("");

    const [showFilter, setShowFilter] = useState(false);

    const [filters, setFilters] = useState({
        themes: [] as string[],
        types: [] as string[],
    });

    const [visibleWorkIds, setVisibleWorkIds] =
        useState<Set<string>>(new Set());

    /*
     * SEARCH + FILTER
     */
    const filteredWorks = useMemo(() => {
        const query = search.trim().toLowerCase();

        return works.filter((work) => {
            // Search
            const matchesSearch =
                !query ||
                work.workName.toLowerCase().includes(query) ||
                work.vgpId.toLowerCase().includes(query) ||
                work.subTheme.toLowerCase().includes(query) ||
                work.theme.toLowerCase().includes(query);

            // Theme filter
            const matchesTheme =
                filters.themes.length === 0 ||
                filters.themes.includes(work.theme);

            // Type filter
            const matchesType =
                filters.types.length === 0 ||
                filters.types.includes(work.type);

            return (
                matchesSearch &&
                matchesTheme &&
                matchesType
            );
        });
    }, [works, search, filters]);

    /*
     * MAP VISIBILITY
     */
    const toggleWorkVisibility = (workId: string) => {
        setVisibleWorkIds((current) => {
            const next = new Set(current);

            if (next.has(workId)) {
                next.delete(workId);
            } else {
                next.add(workId);
            }

            return next;
        });
    };

    const visibleWorks = useMemo(() => {
        return filteredWorks.filter((work) =>
            visibleWorkIds.has(work.id)
        );
    }, [filteredWorks, visibleWorkIds]);

    /*
     * CREATE WORK
     */
    const handleCreateAsset = () => {
        router.push(
            `/proposal/${proposalId}/availability/create`
        );
    };

    const handleNext = () => {
        router.push(
            `/proposal/${proposalId}/requirements`
        );
    };

    return (
        <div className="relative">
            <div className="grid h-[calc(100vh-120px)] min-h-0 grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
                {/* LEFT */}
                <div className="h-full min-h-0">
                    <AvailabilityTable
                        works={filteredWorks}
                        search={search}
                        onSearchChange={setSearch}
                        visibleWorkIds={visibleWorkIds}
                        onToggleVisibility={toggleWorkVisibility}
                        onCreateAsset={handleCreateAsset}
                        onFilterClick={() =>
                            setShowFilter((current) => !current)
                        }
                        onNext={handleNext}
                    />

                    {showFilter && (
                        <AvailabilityFilter
                            filters={filters}
                            onChange={setFilters}
                            onClose={() => setShowFilter(false)}
                        />
                    )}
                </div>

                {/* RIGHT */}
                <div className="h-full min-h-0">
                    <AvailabilityMap works={visibleWorks} />

                    {/* NEXT BUTTON */}
                    <div className="flex justify-end pt-1">
                        <button
                            type="button"
                            onClick={handleNext}
                            className="rounded-md border border-[#172b4d] bg-white px-4 py-1 text-[11px] font-semibold text-[#172b4d] shadow-sm hover:bg-slate-50 cursor-pointer"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}