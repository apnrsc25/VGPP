
"use client";

import {
  Check,
  FileCheck2,
  Printer,
  Upload,
  ShieldCheck,
} from "lucide-react";

interface ConclusionStepperProps {
  compact?: boolean;
  currentStep: number;
}

const steps = [
  {
    label: "FINALISE",
    shortLabel: "Finalise",
    icon: FileCheck2,
  },
  {
    label: "PRINT",
    shortLabel: "Print",
    icon: Printer,
  },
  {
    label: "UPLOAD",
    shortLabel: "Upload",
    icon: Upload,
  },
  {
    label: "VERIFICATION",
    shortLabel: "Verification",
    icon: ShieldCheck,
  },
];

export default function ConclusionStepper({
  compact = false,
  currentStep,
}: ConclusionStepperProps) {
  return (
    <div
      className={
        compact
          ? "w-full min-w-0"
          : "relative z-30 w-full border-b border-[#cbdde8] bg-white shadow-[0_3px_14px_rgba(0,59,99,0.10)]"
      }
    >
      <div
        className={
          compact
            ? "w-full min-w-0 overflow-hidden"
            : "overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#cbd5e1]"
        }
      >
        <div
          className={
            compact
              ? "mx-auto flex w-full max-w-[650px] min-w-0 items-start justify-between px-2 py-1"
              : "mx-auto flex min-w-[480px] max-w-[800px] items-start justify-between px-5 py-3 sm:px-8 sm:py-4"
          }
        >
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCurrent = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className={`relative flex flex-1 flex-col items-center ${
                  compact ? "min-w-0" : "min-w-[100px]"
                }`}
              >
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-[18px] h-[3px] w-full overflow-hidden rounded-full ${
                      isCompleted
                        ? "bg-[#075a91]"
                        : "bg-[#d8e3e9]"
                    }`}
                  >
                    {isCompleted && (
                      <div className="h-full w-full bg-gradient-to-r from-[#075a91] to-[#3d9bc9]" />
                    )}
                  </div>
                )}

                {/* Step content */}
                <div
                  aria-current={isCurrent ? "step" : undefined}
                  className={`relative z-10 flex flex-col items-center rounded-[6px] px-1 py-1 ${
                    compact ? "min-w-0" : "min-w-[90px]"
                  } ${isCurrent ? "bg-[#f8fbfd]" : ""}`}
                >
                  {/* Circle */}
                  <div
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full border-[2px] transition-all duration-200 ${
                      isCurrent
                        ? "border-[#075a91] bg-[#075a91] text-white shadow-[0_0_0_4px_rgba(7,90,145,0.10),0_4px_12px_rgba(7,90,145,0.25)]"
                        : isCompleted
                          ? "border-[#075a91] bg-[#075a91] text-white shadow-sm"
                          : "border-[#b8cbd7] bg-white text-[#64748b]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={16} strokeWidth={2.8} />
                    ) : (
                      <Icon
                        size={14}
                        strokeWidth={isCurrent ? 2.4 : 1.9}
                      />
                    )}

                    {isCurrent && (
                      <span className="absolute -right-[3px] -top-[3px] h-2.5 w-2.5 rounded-full border-2 border-white bg-[#f58220]" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`mt-2 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.5px] transition-colors sm:text-[9px] ${
                      isCurrent
                        ? "text-[#075a91]"
                        : isCompleted
                          ? "text-[#397fa6]"
                          : "text-[#64748b]"
                    }`}
                  >
                    {step.label}
                  </span>

                  {/* Active underline */}
                  {isCurrent && (
                    <span className="mt-1 h-[2px] w-6 rounded-full bg-[#f58220]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
