"use client";

import ApprovalMap from "@/components/approval/ApprovalMap";
import ApprovalRightPanel from "@/components/approval/ApprovalRightPanel";
import {
  Check,
  CheckCircle2,
  Plus,
  Printer,
  GripVertical,
} from "lucide-react";
import { useMemo, useState, type DragEvent } from "react";
import { FINANCIAL_YEARS } from "@/constants/financialYear";

export interface SelectedWork {
  id: string;
  workName: string;
  theme: string;
  subTheme: string;
  type: string;
  geotagged: boolean;
  latitude?: number;
  longitude?: number;
  financialYear?: string;
  vgpId?: string;
  quantity?: number;
  location?: {
    lat: number;
    lng: number;
  };
}

interface ApprovalWorkspaceProps {
  proposalId: string;
  selectedWorks?: SelectedWork[];
}

export default function ApprovalWorkspace({
  proposalId,
  selectedWorks = [],
}: ApprovalWorkspaceProps) {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  const availableWorks = useMemo(
    () => selectedWorks.slice(0, 30),
    [selectedWorks],
  );

  const defaultFinancialYear =
    FINANCIAL_YEARS.length > 0
      ? FINANCIAL_YEARS[FINANCIAL_YEARS.length - 1]
      : "";

  const [selectedFinancialYear, setSelectedFinancialYear] =
    useState(defaultFinancialYear);

  const [selectedWorkIds, setSelectedWorkIds] = useState<Set<string>>(
    new Set(),
  );

  /*
   * IMPORTANT:
   * This state maintains the actual order/priority of selected works.
   */
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string[]>([]);

  const [draggedWorkId, setDraggedWorkId] = useState<string | null>(null);

  const [dragOverWorkId, setDragOverWorkId] = useState<string | null>(null);

  /*
   * ---------------------------------------------------------
   * DISPLAYED WORKS
   * ---------------------------------------------------------
   */

  const displayedWorks = useMemo(() => {
    const hasFinancialYearData = availableWorks.some(
      (work) =>
        typeof work.financialYear === "string" &&
        work.financialYear.trim() !== "",
    );

    if (!hasFinancialYearData) {
      return availableWorks;
    }

    return availableWorks.filter(
      (work) => work.financialYear === selectedFinancialYear,
    );
  }, [availableWorks, selectedFinancialYear]);

  /*
   * ---------------------------------------------------------
   * FINAL WORKS
   *
   * selectedWorkOrder decides the priority/order.
   * ---------------------------------------------------------
   */

  const finalWorks = useMemo(() => {
    const workMap = new Map(availableWorks.map((work) => [work.id, work]));

    return selectedWorkOrder
      .filter((id) => selectedWorkIds.has(id))
      .map((id) => workMap.get(id))
      .filter((work): work is SelectedWork => Boolean(work));
  }, [availableWorks, selectedWorkIds, selectedWorkOrder]);

  /*
   * ---------------------------------------------------------
   * SELECT ALL CHECK
   * ---------------------------------------------------------
   */

  const allDisplayedSelected =
    displayedWorks.length > 0 &&
    displayedWorks.every((work) => selectedWorkIds.has(work.id));

  /*
   * ---------------------------------------------------------
   * ADD / REMOVE WORK
   * ---------------------------------------------------------
   */

  const handleAdd = (workId: string) => {
    setSelectedWorkIds((current) => {
      const next = new Set(current);
      next.add(workId);
      return next;
    });

    /*
     * New work always goes to the bottom.
     * Therefore its initial priority is last.
     */
    setSelectedWorkOrder((current) => {
      if (current.includes(workId)) {
        return current;
      }

      return [...current, workId];
    });
  };

  const handleRemove = (workId: string) => {
    setSelectedWorkIds((current) => {
      const next = new Set(current);
      next.delete(workId);
      return next;
    });

    setSelectedWorkOrder((current) => current.filter((id) => id !== workId));

    if (draggedWorkId === workId) {
      setDraggedWorkId(null);
    }

    if (dragOverWorkId === workId) {
      setDragOverWorkId(null);
    }
  };

  /*
   * ---------------------------------------------------------
   * SELECT / UNSELECT ALL DISPLAYED WORKS
   * ---------------------------------------------------------
   */

  const toggleSelectAll = () => {
    if (allDisplayedSelected) {
      const displayedIds = new Set(displayedWorks.map((work) => work.id));

      setSelectedWorkIds((current) => {
        const next = new Set(current);

        displayedIds.forEach((id) => {
          next.delete(id);
        });

        return next;
      });

      setSelectedWorkOrder((current) =>
        current.filter((id) => !displayedIds.has(id)),
      );

      return;
    }

    setSelectedWorkIds((current) => {
      const next = new Set(current);

      displayedWorks.forEach((work) => {
        next.add(work.id);
      });

      return next;
    });

    /*
     * Select all works and append only new IDs.
     */
    setSelectedWorkOrder((current) => {
      const currentIds = new Set(current);

      const newIds = displayedWorks
        .map((work) => work.id)
        .filter((id) => !currentIds.has(id));

      return [...current, ...newIds];
    });
  };

  /*
   * ---------------------------------------------------------
   * DRAG START
   * ---------------------------------------------------------
   */

  const handleDragStart = (
    e: DragEvent<HTMLTableRowElement>,
    workId: string,
  ) => {
    setDraggedWorkId(workId);
    setDragOverWorkId(null);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", workId);
  };

  /*
   * ---------------------------------------------------------
   * DRAG OVER
   * ---------------------------------------------------------
   */

  const handleDragOver = (
    e: DragEvent<HTMLTableRowElement>,
    workId: string,
  ) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = "move";

    if (workId !== draggedWorkId) {
      setDragOverWorkId(workId);
    }
  };

  /*
   * ---------------------------------------------------------
   * DROP
   *
   * Drop above/below target row depending on mouse position.
   * This allows moving a work to ANY position.
   * ---------------------------------------------------------
   */

  const handleDrop = (
    e: DragEvent<HTMLTableRowElement>,
    targetWorkId: string,
  ) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("text/plain");

    if (!draggedId || draggedId === targetWorkId) {
      setDraggedWorkId(null);
      setDragOverWorkId(null);
      return;
    }

    // IMPORTANT: currentTarget ko state updater ke bahar read karo
    const row = e.currentTarget;
    const rect = row.getBoundingClientRect();
    const dropBelow = e.clientY > rect.top + rect.height / 2;

    setSelectedWorkOrder((currentOrder) => {
      const order = [...currentOrder];

      const draggedIndex = order.indexOf(draggedId);
      const targetIndex = order.indexOf(targetWorkId);

      if (draggedIndex === -1 || targetIndex === -1) {
        return currentOrder;
      }

      // Remove dragged item
      const [draggedItem] = order.splice(draggedIndex, 1);

      // Find target again because array changed
      let insertIndex = order.indexOf(targetWorkId);

      if (insertIndex === -1) {
        return currentOrder;
      }

      // Drop in lower half = place after target
      if (dropBelow) {
        insertIndex += 1;
      }

      order.splice(insertIndex, 0, draggedItem);

      return order;
    });

    setDraggedWorkId(null);
    setDragOverWorkId(null);
  };

  /*
   * ---------------------------------------------------------
   * DRAG END
   * ---------------------------------------------------------
   */

  const handleDragEnd = () => {
    setDraggedWorkId(null);
    setDragOverWorkId(null);
  };

  /*
   * ---------------------------------------------------------
   * PRINT
   * ---------------------------------------------------------
   */

  const handlePrint = () => {
    if (finalWorks.length === 0) {
      return;
    }

    window.print();
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */

  const handleSubmit = () => {
    if (finalWorks.length === 0) {
      return;
    }

    /*
     * Priority is generated from the current order.
     */
    const worksWithPriority = finalWorks.map((work, index) => ({
      ...work,
      priority: index + 1,
    }));

    console.log("Submitting works with priority:", worksWithPriority);
  };

  return (
    <div className="relative flex h-[calc(100dvh-128px)] min-h-0 w-full flex-col overflow-hidden bg-[#f3f7fa]">
      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* ===================================================
            LEFT MAIN TABLE
        ==================================================== */}

        <div className="absolute inset-y-0 left-0 w-1/2 p-2">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[10px] border border-[#d5e2ea] bg-white shadow-[0_4px_18px_rgba(0,59,99,0.08)]">
            {/* HEADER */}

            <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#d7e5ed] bg-gradient-to-r from-[#f1f8fc] via-white to-[#fffaf5] px-3">
              <div className="min-w-0">
                <h2 className="text-[12px] font-extrabold uppercase tracking-[0.5px] text-[#183b56]">
                  Perspective VGPP Works
                </h2>

                <p className="text-[9px] text-slate-400">Shelf of Works</p>
              </div>

              <span className="shrink-0 rounded-full bg-[#edf7fc] px-2.5 py-1 text-[8px] font-extrabold text-[#075a91]">
                {displayedWorks.length} WORKS
              </span>
            </div>

            {/* LEFT TABLE */}

            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead className="sticky top-0 z-20 bg-[#003b63] text-white">
                  <tr className="h-9">
                    <th className="px-2 text-left text-[9px]">#</th>

                    <th className="px-2 text-left text-[9px]">
                      FINANCIAL YEAR
                    </th>

                    <th className="px-2 text-left text-[9px]">WORK NAME</th>

                    <th className="px-2 text-left text-[9px]">THEME</th>

                    <th className="px-2 text-center text-[9px]">TYPE</th>

                    <th className="px-2 text-center text-[9px]">GEOTAGGED</th>

                    <th className="w-[8%] px-2 text-center text-[9px]">ADD</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedWorks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center text-[10px] text-slate-400"
                      >
                        No permissible works available for{" "}
                        {selectedFinancialYear}.
                      </td>
                    </tr>
                  ) : (
                    displayedWorks.map((work, index) => {
                      const isSelected = selectedWorkIds.has(work.id);

                      return (
                        <tr
                          key={work.id}
                          className="h-10 border-b border-[#e6eef3] hover:bg-[#f5fafc]"
                        >
                          <td className="px-2 text-[8px] text-slate-400">
                            {String(index + 1).padStart(2, "0")}
                          </td>

                          <td className="px-2">
                            <span className="rounded-full bg-[#f1f8fc] px-2 py-1 text-[8px] font-bold text-[#075a91]">
                              {work.financialYear ?? selectedFinancialYear}
                            </span>
                          </td>

                          <td
                            className="max-w-[300px] truncate px-2 text-[8px] font-bold text-[#263f52]"
                            title={work.workName}
                          >
                            {work.workName}
                          </td>

                          <td className="px-2 text-[8px] font-semibold text-[#36566b]">
                            {work.theme}
                          </td>

                          <td className="px-2 text-center text-[8px]">
                            {work.type}
                          </td>

                          <td className="px-2 text-center">
                            {work.geotagged ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#effbf5] px-2 py-1 text-[8px] font-extrabold text-[#00875a]">
                                <CheckCircle2 size={8} />
                                YES
                              </span>
                            ) : (
                              <span className="rounded-full bg-[#fff8ed] px-2 py-1 text-[8px] font-extrabold text-[#b45309]">
                                PENDING
                              </span>
                            )}
                          </td>

                          <td className="px-2 text-center">
                            <button
                              type="button"
                              disabled={isSelected}
                              onClick={() => handleAdd(work.id)}
                              title={
                                isSelected ? "Already Selected" : "Select work"
                              }
                              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border transition-all active:scale-90 ${
                                isSelected
                                  ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
                                  : "cursor-pointer border-[#9ed1b8] bg-[#f0fbf5] text-[#00875a] hover:border-[#00875a] hover:bg-[#00875a] hover:text-white"
                              }`}
                            >
                              {isSelected ? (
                                <Check size={12} />
                              ) : (
                                <Plus size={13} />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT MAIN TABLE
        ==================================================== */}

        <div className="absolute inset-y-0 right-0 w-1/2 p-2">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[10px] border border-[#d5e2ea] bg-white shadow-[0_4px_18px_rgba(0,59,99,0.08)]">
            {/* HEADER */}

            <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#d7e5ed] bg-gradient-to-r from-[#f1f8fc] via-white to-[#fffaf5] px-3">
              <div>
                <h2 className="text-[12px] font-extrabold uppercase tracking-[0.5px] text-[#183b56]">
                  AAP 2027-2028
                </h2>

                <p className="text-[9px] text-slate-400">Annual Action Plan</p>
              </div>

              <span className="rounded-full bg-[#effbf5] px-2.5 py-1 text-[9px] font-extrabold text-[#00875a]">
                {finalWorks.length} / {displayedWorks.length}
              </span>
            </div>

            {/* RIGHT TABLE */}

            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[620px] border-collapse">
                <thead className="sticky top-0 z-20 bg-[#003b63] text-white">
                  <tr className="h-9">
                    <th className="w-[6%] px-2 text-center text-[9px]">DRAG</th>

                    <th className="w-[7%] px-2 text-center text-[9px]">
                      REMOVE
                    </th>

                    <th className="w-[8%] px-2 text-center text-[9px]">
                      PRIORITY
                    </th>

                    <th className="px-2 text-left text-[9px]">WORK NAME</th>

                    <th className="px-2 text-left text-[9px]">THEME</th>

                    <th className="px-2 text-center text-[9px]">TYPE</th>

                    <th className="px-2 text-center text-[9px]">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {finalWorks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-16 text-center text-[10px] text-slate-400"
                      >
                        Select permissible works from the left table.
                      </td>
                    </tr>
                  ) : (
                    finalWorks.map((work, index) => {
                      const isDragging = draggedWorkId === work.id;

                      const isDragTarget =
                        dragOverWorkId === work.id && draggedWorkId !== work.id;

                      return (
                        <tr
                          key={`final-${work.id}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, work.id)}
                          onDragOver={(e) => handleDragOver(e, work.id)}
                          onDrop={(e) => handleDrop(e, work.id)}
                          onDragEnd={handleDragEnd}
                          className={`h-10 border-b border-[#e6eef3] transition-all ${draggedWorkId === work.id ? "bg-[#fff4e8] opacity-50" : dragOverWorkId === work.id ? "bg-[#eef6fb] shadow-[inset_0_2px_0_#f58220]" : "hover:bg-[#f5fafc]"}`}
                        >
                          {/* DRAG HANDLE */}

                          <td className="w-[6%] px-2 text-center">
                            <div
                              title="Drag to change priority"
                              className="inline-flex cursor-grab touch-none select-none items-center justify-center rounded-md p-1 text-[#94a3b8] transition hover:bg-[#eef6fb] hover:text-[#075a91] active:cursor-grabbing"
                            >
                              <GripVertical size={18} strokeWidth={2.5} />
                            </div>
                          </td>

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

                          {/* PRIORITY */}

                          <td className="px-2 text-center">
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-[#f58220] bg-[#fff4e8] px-2 text-[8px] font-extrabold text-[#d65f00] shadow-[0_1px_3px_rgba(245,130,32,0.15)]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </td>

                          {/* WORK NAME */}

                          <td
                            className="max-w-[250px] truncate px-2 text-[8px] font-bold text-[#263f52]"
                            title={work.workName}
                          >
                            {work.workName}
                          </td>

                          {/* THEME */}

                          <td className="px-2 text-[8px] font-semibold text-[#36566b]">
                            {work.theme}
                          </td>

                          {/* TYPE */}

                          <td className="px-2 text-center text-[8px]">
                            {work.type}
                          </td>

                          {/* STATUS */}

                          <td className="px-2 text-center">
                            {work.geotagged ? (
                              <span className="rounded-full bg-[#effbf5] px-2 py-1 text-[8px] font-extrabold text-[#00875a]">
                                READY
                              </span>
                            ) : (
                              <span className="rounded-full bg-[#fff8ed] px-2 py-1 text-[8px] font-extrabold text-[#b45309]">
                                PENDING
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===================================================
            LEFT MAP DRAWER
        ==================================================== */}

        <div
          className={`absolute inset-y-0 left-0 z-[1000] w-1/2 p-2 transition-transform duration-300 ease-out ${
            leftDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-hidden rounded-[10px] border border-[#d5e2ea] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
            <ApprovalMap proposalId={proposalId} selectedWorks={finalWorks} />
          </div>
        </div>

        {/* ===================================================
            RIGHT CERTIFICATE DRAWER
        ==================================================== */}

        <div
          className={`absolute inset-y-0 right-0 z-[1000] w-1/2 p-2 transition-transform duration-300 ease-out ${
            rightDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[10px] border border-[#d5e2ea] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
            <div className="min-h-0 flex-1 overflow-auto">
              <ApprovalRightPanel
                proposalId={proposalId}
                finalWorks={finalWorks}
                displayedWorks={displayedWorks}
              />
            </div>

            <div className="flex h-[52px] shrink-0 items-center justify-end border-t border-[#d5e2ea] bg-white px-3">
              <button
                type="button"
                onClick={handlePrint}
                disabled={finalWorks.length === 0}
                className={`inline-flex h-8 items-center gap-1.5 rounded-[5px] px-4 text-[8px] font-extrabold transition ${
                  finalWorks.length === 0
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : "cursor-pointer bg-[#075a91] text-white hover:bg-[#003b63]"
                }`}
              >
                <Printer size={11} />
                PRINT
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================
            LEFT DRAWER BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={() => setLeftDrawerOpen((value) => !value)}
          className={`group absolute left-0 top-1/2 z-[1100] flex h-16 w-3.5 -translate-y-1/2 cursor-pointer items-center justify-center bg-[#075a91] text-white shadow-lg transition-all duration-300 hover:bg-[#f58220] ${leftDrawerOpen ? "translate-x-[calc(50vw-24px)] before:absolute before:left-[-7px] before:top-1/2 before:-translate-y-1/2 before:border-y-[7px] before:border-r-[7px] before:border-y-transparent before:border-r-[#075a91] before:content-[''] hover:before:border-r-[#f58220] rounded-l-[5px]" : "rounded-r-[5px] translate-x-0 after:absolute after:right-[-7px] after:top-1/2 after:-translate-y-1/2 after:border-y-[7px] after:border-l-[7px] after:border-y-transparent after:border-l-[#075a91] after:content-[''] hover:after:border-l-[#f58220]"}`}
          aria-label="Toggle map drawer"
        >
          <span
            className={`text-[11px] font-semibold leading-none ${leftDrawerOpen ? "[writing-mode:vertical-lr]" : "[writing-mode:vertical-rl] rotate-180"}`}
          >
            MapView
          </span>
        </button>

        {/* ===================================================
            RIGHT DRAWER BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={() => setRightDrawerOpen((value) => !value)}
          className={`group absolute right-0 top-1/2 z-[1100] flex h-24 w-3.5 -translate-y-1/2 cursor-pointer items-center justify-center bg-[#075a91] text-white shadow-lg transition-all duration-300 hover:bg-[#f58220] ${rightDrawerOpen ? "-translate-x-[calc(50vw-24px)] before:absolute before:right-[-7px] before:top-1/2 before:-translate-y-1/2 before:border-y-[7px] before:border-l-[7px] before:border-y-transparent before:border-l-[#075a91] before:content-[''] hover:before:border-l-[#f58220] rounded-r-[5px]" : "rounded-l-[5px] translate-x-0 after:absolute after:left-[-7px] after:top-1/2 after:-translate-y-1/2 after:border-y-[7px] after:border-r-[7px] after:border-y-transparent after:border-r-[#075a91] after:content-[''] hover:after:border-r-[#f58220]"}`}
          aria-label="Toggle certificate drawer"
        >
          <span
            className={`text-[11px] font-semibold leading-none ${rightDrawerOpen ? "[writing-mode:vertical-rl] rotate-180" : "[writing-mode:vertical-lr] rotate-0"}`}
          >
            Certificate View
          </span>
        </button>
      </div>

      {/* =====================================================
          BOTTOM ACTION BAR
      ====================================================== */}

      <div className="z-[1200] flex h-[52px] shrink-0 items-center justify-between border-t border-[#d5e2ea] bg-white px-3 shadow-[0_-3px_12px_rgba(0,59,99,0.08)] sm:h-[56px] sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              finalWorks.length > 0 ? "bg-[#008f6a]" : "bg-[#f58220]"
            }`}
          />

          <div className="min-w-0">
            <p className="truncate text-[8px] font-bold text-[#36566b]">
              {finalWorks.length > 0
                ? "Approval review completed"
                : "No works selected"}
            </p>

            <p className="hidden text-[6px] text-slate-400 sm:block">
              {finalWorks.length > 0
                ? `${finalWorks.length} work${
                    finalWorks.length > 1 ? "s" : ""
                  } ready for approval`
                : "Select works before submitting"}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={finalWorks.length === 0}
          onClick={handleSubmit}
          className={`flex h-8 shrink-0 items-center gap-1.5 rounded-[6px] px-4 text-[8px] font-extrabold transition sm:h-9 sm:px-5 sm:text-[9px] ${
            finalWorks.length === 0
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "cursor-pointer bg-[#008f6a] text-white hover:bg-[#007b5c]"
          }`}
        >
          <CheckCircle2 size={12} />
          SUBMIT FOR APPROVAL
        </button>
      </div>

      {/* =====================================================
          PRINT AREA
      ====================================================== */}

      <div id="approval-print-area" className="approval-print-only">
        <ApprovalRightPanel
          proposalId={proposalId}
          finalWorks={finalWorks}
          displayedWorks={displayedWorks}
        />
      </div>
    </div>
  );
}
