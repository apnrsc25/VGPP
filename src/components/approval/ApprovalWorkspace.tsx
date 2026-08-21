"use client";

import ApprovalMap from "@/components/approval/ApprovalMap";
import ApprovalRightPanel from "@/components/approval/ApprovalRightPanel";
import { getAuthSession } from "@/config/auth";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProposalLocation } from "@/types/proposalLocation";

export interface SelectedWork {
  id: string;
  workName: string;
  theme: string;
  subTheme: string;
  type: string;
  geotagged: boolean;
  latitude?: number;
  longitude?: number;
}

interface ApprovalWorkspaceProps {
  proposalId: string;
  selectedWorks?: SelectedWork[];
}

interface ApprovalLocation {
  stateName?: string;
  districtName?: string;
  blockName?: string;
  panchayatName?: string;
  panchayatCode?: string;
}

export default function ApprovalWorkspace({
  proposalId,
  selectedWorks = [],
}: ApprovalWorkspaceProps) {

  const [location, setLocation] =
    useState<ProposalLocation | null>(null);

  useEffect(() => {
    const storedLocation =
      sessionStorage.getItem(
        `proposal_location_${proposalId}`
      );

    if (!storedLocation) {
      return;
    }

    try {
      const parsedLocation =
        JSON.parse(storedLocation) as ProposalLocation;

      setLocation(parsedLocation);
    } catch {
      setLocation(null);
    }
  }, [proposalId]);

  const locationHierarchy = location
    ? [
      location.state.name,
      location.district.name,
      location.block.name,
      location.panchayat.name,
    ].join(" > ")
    : "";


  return (
    <div className="flex h-[calc(100dvh-128px)] min-h-0 w-full flex-col overflow-hidden bg-[#f3f7fa]">

      {/* =====================================================
          MAIN APPROVAL AREA
      ====================================================== */}



      <div  className="grid min-h-0 h-full flex-1 grid-cols-1 gap-2 overflow-hidden px-2 p-2 sm:gap-2 lg:grid-cols-2">

        {/* =================================================
              LEFT — MAP
          ================================================== */}

        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">

          <div className="min-h-0 flex-1">

            <ApprovalMap
              proposalId={proposalId}
              selectedWorks={selectedWorks}
            />

          </div>

        </div>


        {/* =================================================
              RIGHT — APPROVAL
          ================================================== */}

        <div className="relative flex min-h-0 min-w-0 flex-col overflow-hidden">

          <ApprovalRightPanel
            proposalId={proposalId}
            selectedWorks={selectedWorks}
          />

        </div>

      </div>


      {/* =====================================================
          FINAL ACTION BAR
      ====================================================== */}

      <div className="z-20 flex h-[52px] shrink-0 items-center justify-between border-t border-[#d5e2ea] bg-white px-3 shadow-[0_-3px_12px_rgba(0,59,99,0.08)] sm:h-[56px] sm:px-4">

        {/* STATUS */}

        <div className="flex min-w-0 items-center gap-2">

          <span
            className={`h-2 w-2 shrink-0 rounded-full ${selectedWorks.length > 0
              ? "bg-[#008f6a]"
              : "bg-[#f58220]"
              }`}
          />

          <div className="min-w-0">

            <p className="truncate text-[8px] font-bold text-[#36566b] sm:text-[9px]">
              {selectedWorks.length > 0
                ? "Approval review completed"
                : "No works selected"}
            </p>

            <p className="hidden text-[6px] text-slate-400 sm:block">
              {selectedWorks.length > 0
                ? `${selectedWorks.length} work${selectedWorks.length > 1 ? "s" : ""} ready for approval`
                : "Select works before submitting"}
            </p>

          </div>

        </div>


        {/* SUBMIT */}

        <button
          type="button"
          disabled={selectedWorks.length === 0}
          className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-[6px] px-4 text-[8px] font-extrabold tracking-[0.25px] transition-all active:scale-[0.98] sm:h-9 sm:px-5 sm:text-[9px] ${selectedWorks.length === 0
            ? "cursor-not-allowed bg-slate-200 text-slate-400"
            : "bg-[#008f6a] text-white shadow-[0_4px_10px_rgba(0,143,106,0.18)] hover:bg-[#007b5c] hover:shadow-[0_5px_14px_rgba(0,143,106,0.24)]"
            }`}
        >

          <CheckCircle2 size={12} />

          <span>
            SUBMIT FOR APPROVAL
          </span>

        </button>

      </div>

    </div>
  );
}