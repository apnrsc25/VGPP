"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Check,
  Map,
  ClipboardList,
  MapPinned,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

interface ProposalStepperProps {
  compact?: boolean;
  currentStep: number;
}

const steps = [
  {
    label: "AVAILABILITY",
    shortLabel: "Availability",
    path: "availability",
    icon: Map,
  },
  {
    label: "REQUIREMENTS",
    shortLabel: "Requirements",
    path: "requirements",
    icon: ClipboardList,
  },
  {
    label: "FAMILIARIZATION",
    shortLabel: "Familiarization",
    path: null,
    icon: MapPinned,
  },
  {
    label: "VGPP",
    shortLabel: "VGPP",
    path: null,
    icon: FileCheck2,
  },
  {
    label: "APPROVAL",
    shortLabel: "Approval",
    path: "approval",
    icon: ShieldCheck,
  },
];

export default function ProposalStepper({
  compact,
  currentStep,
}: ProposalStepperProps) {
  const pathname = usePathname();

  const proposalBasePath = pathname
    .split("/")
    .slice(0, 3)
    .join("/");

  return (
    <div
      className={
        compact
          ? "w-full min-w-0"
          : "relative z-30 w-full border-b border-[#cbdde8] bg-white shadow-[0_3px_14px_rgba(0,59,99,0.10)]"
      }
    >

      {/* =====================================================
          TOP BRAND ACCENT
      ====================================================== */}

      {/* <div className="flex h-[3px] w-full">
        <div className="flex-1 bg-[#075a91]" />
        <div className="w-[90px] bg-[#f58220]" />
      </div> */}


      {/* =====================================================
          STEPPER SCROLL AREA
      ====================================================== */}

      <div className={compact ? "w-full min-w-0 overflow-hidden" : "overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#cbd5e1]"}>

        <div
          className={
            compact
              ? "mx-auto flex w-full max-w-[650px] min-w-0 items-start justify-between px-2 py-1"
              : "mx-auto flex min-w-[620px] max-w-[900px] items-start justify-between px-5 py-4 sm:px-8 sm:py-2 lg:px-10"
          }
        >

          {steps.map((step, index) => {
            const stepNumber = index + 1;

            const isCurrent =
              stepNumber === currentStep;

            const isCompleted =
              stepNumber < currentStep;

            const isActive =
              stepNumber <= currentStep;

            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className={`relative flex flex-1 flex-col items-center ${compact ? "min-w-0" : "min-w-[110px]"}`}
              >

                {/* =================================================
                    CONNECTING LINE
                ================================================== */}

                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-[18px] h-[3px] w-full overflow-hidden rounded-full ${isCompleted
                      ? "bg-[#075a91]"
                      : "bg-[#d8e3e9]"
                      }`}
                  >
                    {isCompleted && (
                      <div className="h-full w-full bg-gradient-to-r from-[#075a91] to-[#3d9bc9]" />
                    )}
                  </div>
                )}


                {/* =================================================
                    STEP CONTENT
                ================================================== */}

                {step.path ? (
                  <Link
                    href={`${proposalBasePath}/${step.path}`}
                    aria-current={
                      isCurrent
                        ? "step"
                        : undefined
                    }
                    className={`relative z-10 flex flex-col items-center rounded-[6px] px-1 py-1 transition-all hover:bg-[#f4f9fc] ${compact ? "min-w-0" : "min-w-[100px]"}`}
                  >

                    {/* STEP CIRCLE */}

                    <div
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full border-[2px] transition-all duration-200 ${isCurrent
                        ? "border-[#075a91] bg-[#075a91] text-white shadow-[0_0_0_4px_rgba(7,90,145,0.10),0_4px_12px_rgba(7,90,145,0.25)]"
                        : isCompleted
                          ? "border-[#075a91] bg-[#075a91] text-white shadow-sm"
                          : "border-[#b8cbd7] bg-white text-[#64748b]"
                        }`}
                    >

                      {isCompleted ? (
                        <Check
                          size={16}
                          strokeWidth={2.8}
                        />
                      ) : (
                        <Icon
                          size={14}
                          strokeWidth={
                            isCurrent
                              ? 2.4
                              : 1.9
                          }
                        />
                      )}

                      {/* CURRENT INDICATOR */}

                      {isCurrent && (
                        <span className="absolute -right-[3px] -top-[3px] h-2.5 w-2.5 rounded-full border-2 border-white bg-[#f58220]" />
                      )}

                    </div>


                    {/* LABEL */}

                    <span
                      className={`mt-2 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.5px] transition-colors sm:text-[9px] ${isCurrent
                        ? "text-[#075a91]"
                        : isCompleted
                          ? "text-[#397fa6]"
                          : "text-[#64748b]"
                        }`}
                    >
                      {step.label}
                    </span>


                    {/* CURRENT UNDERLINE */}

                    {isCurrent && (
                      <span className="mt-1 h-[2px] w-6 rounded-full bg-[#f58220]" />
                    )}

                  </Link>
                ) : (
                  <div
                    className={`relative z-10 flex cursor-default flex-col items-center rounded-[6px] px-1 py-1 ${compact ? "min-w-0" : "min-w-[100px]"
                      } ${isCurrent
                        ? "bg-[#f8fbfd]"
                        : ""
                      }`}
                  >

                    {/* STEP CIRCLE */}

                    <div
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full border-[2px] transition-all duration-200 ${isCurrent
                        ? "border-[#075a91] bg-[#075a91] text-white shadow-[0_0_0_4px_rgba(7,90,145,0.10),0_4px_12px_rgba(7,90,145,0.25)]"
                        : isCompleted
                          ? "border-[#075a91] bg-[#075a91] text-white shadow-sm"
                          : "border-[#b8cbd7] bg-white text-[#64748b]"
                        }`}
                    >

                      {isCompleted ? (
                        <Check
                          size={16}
                          strokeWidth={2.8}
                        />
                      ) : (
                        <Icon
                          size={14}
                          strokeWidth={
                            isCurrent
                              ? 2.4
                              : 1.9
                          }
                        />
                      )}

                      {isCurrent && (
                        <span className="absolute -right-[3px] -top-[3px] h-2.5 w-2.5 rounded-full border-2 border-white bg-[#f58220]" />
                      )}

                    </div>


                    {/* LABEL */}

                    <span
                      className={`mt-2 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.5px] sm:text-[9px] ${isCurrent
                        ? "text-[#075a91]"
                        : isCompleted
                          ? "text-[#397fa6]"
                          : "text-[#64748b]"
                        }`}
                    >
                      {step.label}
                    </span>


                    {isCurrent && (
                      <span className="mt-1 h-[2px] w-6 rounded-full bg-[#f58220]" />
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}