"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ProposalStepper from "@/components/common/ProposalStepper";

const ASHOKA_IMG =
    "https://bhuvan-app2.nrsc.gov.in/planner_v3/img/Ashoka.png";

const LOGO_IMG =
    "https://bhuvan-app2.nrsc.gov.in/planner_v3/img/LOGO.png";

const workflowSteps = [
    "availability",
    "requirements",
    "familiarization",
    "vgpp",
    "approval",
];

const Header = () => {
    const pathname = usePathname();

    const proposalMatch = pathname.match(
        /^\/proposal\/[^/]+\/([^/]+)/
    );

    const currentPage = proposalMatch?.[1];

    const isStepperPage =
        !!currentPage &&
        workflowSteps.includes(currentPage);

    const currentStep = isStepperPage
        ? workflowSteps.indexOf(currentPage) + 1
        : 0;

    return (
        <header className="relative z-30 shrink-0 border-b border-[#c9dce8] bg-white/95 shadow-[0_3px_14px_rgba(0,59,99,0.08)] backdrop-blur">

            <div className="mx-auto flex h-[58px] w-full max-w-[1500px] items-center px-3 sm:h-[85px] sm:px-6 lg:px-8">

                {/* LEFT LOGO */}

                <div className="flex w-[80px] shrink-0 items-center justify-start sm:w-[110px] lg:w-[140px]">
                    <img
                        src={ASHOKA_IMG}
                        alt="Ashoka Emblem"
                        className="h-[34px] w-auto shrink-0 object-contain sm:h-[42px] lg:h-[46px]"
                    />
                </div>


                {/* CENTER */}

                <div className="relative min-w-0 flex-1">

                    {isStepperPage ? (
                        <div className="flex h-full w-full items-center justify-center overflow-hidden">
                            <ProposalStepper
                                currentStep={currentStep}
                                compact
                            />
                        </div>
                    ) : (
                        <div className="flex min-w-0 flex-col items-center justify-center text-center">

                            <div className="flex min-w-0 items-center gap-2">

                                <span className="hidden h-[1px] w-5 shrink-0 bg-[#f58220] sm:block" />

                                <h1 className="truncate text-[12px] font-bold tracking-[0.2px] text-[#075a91] sm:text-[16px] lg:text-[19px]">
                                    Viksit Gram Panchayat Planning
                                </h1>

                                <span className="hidden h-[1px] w-5 shrink-0 bg-[#f58220] sm:block" />

                            </div>

                            <div className="mt-0.5 flex items-center gap-1.5 text-[6px] font-semibold uppercase tracking-[1px] text-[#64748b] sm:text-[8px]">
                                <span>Bhuvan Geoportal</span>
                                <span className="text-[#f58220]">•</span>
                                <span>NRSC</span>
                                <span className="text-[#f58220]">•</span>
                                <span>ISRO</span>
                            </div>

                        </div>
                    )}

                </div>


                {/* RIGHT LOGO */}

                <div className="flex w-[80px] shrink-0 items-center justify-end sm:w-[110px] lg:w-[140px]">
                    <img
                        src={LOGO_IMG}
                        alt="NRSC / Bhuvan Logo"
                        className="h-[34px] w-auto shrink-0 object-contain sm:h-[42px] lg:h-[46px]"
                    />
                </div>

            </div>


            {/* BRAND STRIPE */}

            <div className="flex h-[3px] w-full">

                <div className="w-[72%] bg-[#075a91]" />

                <div className="w-[28%] bg-[#f58220]" />

            </div>

        </header>
    );
};

export default Header;