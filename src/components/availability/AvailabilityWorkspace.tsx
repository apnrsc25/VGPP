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
      <div className="flex h-full min-h-0 w-full items-center justify-center rounded-[6px] border border-[#cbdde8] bg-[#edf4f8] text-[10px] text-slate-500">
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

  const [showFilter, setShowFilter] =
    useState(false);

  const [filters, setFilters] = useState({
    themes: [] as string[],
    types: [] as string[],
  });

  const [visibleWorkIds, setVisibleWorkIds] =
    useState<Set<string>>(new Set());

  /*
   * =====================================================
   * SEARCH + FILTER
   * =====================================================
   */

  const filteredWorks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return works.filter((work) => {
      const matchesSearch =
        !query ||
        work.workName
          .toLowerCase()
          .includes(query) ||
        work.vgpId
          .toLowerCase()
          .includes(query) ||
        work.subTheme
          .toLowerCase()
          .includes(query) ||
        work.theme
          .toLowerCase()
          .includes(query);

      const matchesTheme =
        filters.themes.length === 0 ||
        filters.themes.includes(work.theme);

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
   * =====================================================
   * MAP VISIBILITY
   * =====================================================
   */

  const toggleWorkVisibility = (
    workId: string
  ) => {
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
   * =====================================================
   * CREATE WORK
   * =====================================================
   */

  const handleCreateAsset = () => {
    router.push(
      `/proposal/${proposalId}/availability/create`
    );
  };

  /*
   * =====================================================
   * NEXT
   * =====================================================
   */

  const handleNext = () => {
    router.push(
      `/proposal/${proposalId}/requirements`
    );
  };

  return (
    <div className="flex h-[calc(100dvh-128px)] min-h-0 w-full flex-col overflow-hidden">

      {/* MAIN CONTENT */}
      <div className="grid min-h-0 h-full flex-1 grid-cols-1 gap-2 overflow-hidden px-2 p-2 sm:gap-2 lg:grid-cols-2">

        {/* LEFT */}
        <div className="relative flex min-h-0 min-w-0 flex-col overflow-hidden">

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
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">

          <div className="min-h-0 flex-1">
            <AvailabilityMap works={visibleWorks} />
          </div>

        </div>

      </div>

      {/* NEXT BUTTON */}
      <div className="flex h-[50px] shrink-0 items-center justify-end border-t border-[#d4e2eb] bg-white px-3 py-2 sm:px-4">

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex min-h-8 cursor-pointer items-center gap-2 rounded-[4px] bg-[#075a91] px-4 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#003b63] active:scale-[0.98] sm:px-5"
        >
          Next

          <span className="text-[13px]">
            →
          </span>
        </button>

      </div>

    </div>
  );
}