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