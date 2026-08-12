"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProposalStepperProps {
  currentStep: number;
}

const steps = [
  {
    label: "AVAILABILITY",
    path: "availability",
  },
  {
    label: "REQUIREMENTS",
    path: "requirements",
  },
  {
    label: "FAMILIARIZATION",
    path: null,
  },
  {
    label: "VGPP",
    path: null,
  },
  {
    label: "APPROVAL",
    path: null,
  },
];

export default function ProposalStepper({
  currentStep,
}: ProposalStepperProps) {
  const pathname = usePathname();

  const proposalBasePath = pathname
    .split("/")
    .slice(0, 3)
    .join("/");

  return (
    <div className="w-full border-b border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex w-[680px] items-start justify-between py-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;

          const isActive =
            stepNumber <= currentStep;

          const isCurrent =
            stepNumber === currentStep;

          const isCompleted =
            stepNumber < currentStep;

          return (
            <div
              key={step.label}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* CONNECTING LINE */}
              {index < steps.length - 1 && (
                <div
                  className="absolute left-1/2 top-[10px] h-[3px] w-full"
                  style={{
                    backgroundColor: isCompleted
                      ? "#4b9bd6"
                      : "#cbd5e1",
                  }}
                />
              )}

              {/* STEP */}
              {step.path ? (
                <Link
                  href={`${proposalBasePath}/${step.path}`}
                  className="relative z-10 flex flex-col items-center"
                  aria-current={
                    isCurrent ? "step" : undefined
                  }
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white ${
                      isActive
                        ? "bg-[#4b9bd6]"
                        : "bg-[#64748b]"
                    }`}
                  >
                    {stepNumber}
                  </div>

                  <span
                    className={`mt-1 whitespace-nowrap text-[10px] ${
                      isActive
                        ? "font-semibold text-[#358fd1]"
                        : "text-[#666]"
                    }`}
                  >
                    {step.label}
                  </span>
                </Link>
              ) : (
                <div className="relative z-10 flex cursor-default flex-col items-center">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white ${
                      isActive
                        ? "bg-[#4b9bd6]"
                        : "bg-[#64748b]"
                    }`}
                  >
                    {stepNumber}
                  </div>

                  <span
                    className={`mt-1 whitespace-nowrap text-[10px] ${
                      isActive
                        ? "font-semibold text-[#358fd1]"
                        : "text-[#666]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}