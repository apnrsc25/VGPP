// "use client";

// import { usePathname } from "next/navigation";

// import ProposalStepper from "@/components/common/ProposalStepper";

// interface ProposalLayoutContentProps {
//   children: React.ReactNode;
// }

// export default function ProposalLayoutContent({
//   children,
// }: ProposalLayoutContentProps) {
//   const pathname = usePathname();

//   const isCreatePage = pathname.endsWith(
//     "/availability/create"
//   );

//   const getCurrentStep = () => {

//     if (pathname.includes("/approval")) {
//       return 5;
//     }

//     if (pathname.includes("/requirements")) {
//       return 2;
//     }

//     if (pathname.includes("/availability")) {
//       return 1;
//     }

//     return 1;
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f6f9]">
//       {!isCreatePage && (
//         <ProposalStepper
//           currentStep={getCurrentStep()}
//         />
//       )}

//       <main
//         className={
//           isCreatePage
//             ? "min-h-screen"
//             : "px-4 py-4"
//         }
//       >
//         {children}
//       </main>
//     </div>
//   );
// }





"use client";

import React from "react";
import Header from "./Header";
import LocationBreadcrumb from "./LocationBreadcrumb";

interface ProposalLayoutContentProps {
  children: React.ReactNode;
}

export default function ProposalLayoutContent({
  children,
}: ProposalLayoutContentProps) {
  return (
    <div className="min-h-screen bg-[#f3f6f9]">
      <main className="h-full">
        <Header />
        <LocationBreadcrumb />
        {children}
      </main>
    </div>
  );
}