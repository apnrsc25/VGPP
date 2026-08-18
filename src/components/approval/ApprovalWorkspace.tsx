// "use client";

// import ApprovalMap from "@/components/approval/ApprovalMap";
// import ApprovalRightPanel from "@/components/approval/ApprovalRightPanel";
// import { CheckCircle2 } from "lucide-react";

// export interface SelectedWork {
//   id: string;
//   workName: string;
//   theme: string;
//   subTheme: string;
//   type: string;
//   geotagged: boolean;
// }

// interface ApprovalWorkspaceProps {
//   proposalId: string;
//   selectedWorks?: SelectedWork[];
// }

// export default function ApprovalWorkspace({
//   proposalId,
//   selectedWorks = [],
// }: ApprovalWorkspaceProps) {
//   return (
//     <div className="flex min-h-0 flex-1 flex-col bg-[#f3f7fa]">

//       {/* WORKSPACE */}

//       <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-2">

//         <div className="grid min-h-full grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr]">

//           {/* LEFT MAP */}

//           <ApprovalMap
//             proposalId={proposalId}
//             selectedWorks={selectedWorks}
//           />


//           {/* RIGHT APPROVAL */}

//           <ApprovalRightPanel
//             proposalId={proposalId}
//             selectedWorks={selectedWorks}
//           />

//         </div>

//       </div>


//       {/* FINAL ACTION BAR */}

//       <div className="flex shrink-0 items-center justify-between border-t border-[#d5e2ea] bg-white px-4 py-2.5 shadow-[0_-3px_12px_rgba(0,59,99,0.06)]">

//         <div className="hidden items-center gap-2 sm:flex">

//           <span className="h-2 w-2 rounded-full bg-[#008f6a]" />

//           <span className="text-[8px] font-semibold text-slate-500">
//             Approval review completed
//           </span>

//         </div>


//         <button
//           type="button"
//           disabled={selectedWorks.length === 0}
//           className={`flex h-9 items-center gap-2 rounded-[6px] px-5 text-[9px] font-extrabold transition-all active:scale-[0.98] ${
//             selectedWorks.length === 0
//               ? "cursor-not-allowed bg-slate-200 text-slate-400"
//               : "cursor-pointer bg-[#008f6a] text-white shadow-[0_4px_10px_rgba(0,143,106,0.18)] hover:bg-[#007b5c]"
//           }`}
//         >
//           <CheckCircle2 size={12} />
//           SUBMIT FOR APPROVAL
//         </button>

//       </div>

//     </div>
//   );
// }



"use client";

import ApprovalMap from "@/components/approval/ApprovalMap";
import ApprovalRightPanel from "@/components/approval/ApprovalRightPanel";
import { CheckCircle2 } from "lucide-react";

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

export default function ApprovalWorkspace({
  proposalId,
  selectedWorks = [],
}: ApprovalWorkspaceProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#f3f7fa]">

      {/* =====================================================
          MAIN APPROVAL AREA
      ====================================================== */}

      <div className="min-h-0 flex-1 overflow-hidden p-2 sm:p-2.5">

        <div className="grid h-full min-h-0 grid-cols-1 gap-2.5 xl:grid-cols-[1fr_1fr]">

          {/* =================================================
              LEFT — MAP
          ================================================== */}

          <div className="min-h-0 overflow-hidden">

            <ApprovalMap
              proposalId={proposalId}
              selectedWorks={selectedWorks}
            />

          </div>


          {/* =================================================
              RIGHT — APPROVAL
          ================================================== */}

          <div className="min-h-0 overflow-hidden">

            <ApprovalRightPanel
              proposalId={proposalId}
              selectedWorks={selectedWorks}
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          FINAL ACTION BAR
      ====================================================== */}

      <div className="z-20 flex h-[52px] shrink-0 items-center justify-between border-t border-[#d5e2ea] bg-white px-3 shadow-[0_-3px_12px_rgba(0,59,99,0.08)] sm:h-[56px] sm:px-4">

        {/* STATUS */}

        <div className="flex min-w-0 items-center gap-2">

          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              selectedWorks.length > 0
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
          className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-[6px] px-4 text-[8px] font-extrabold tracking-[0.25px] transition-all active:scale-[0.98] sm:h-9 sm:px-5 sm:text-[9px] ${
            selectedWorks.length === 0
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