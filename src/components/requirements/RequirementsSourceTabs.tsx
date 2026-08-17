"use client";

import { Droplets, LibraryBig } from "lucide-react";

interface RequirementsSourceTabsProps {
  activeTab: "ejal" | "permissible";
  onChange: (tab: "ejal" | "permissible") => void;
}

export default function RequirementsSourceTabs({
  activeTab,
  onChange,
}: RequirementsSourceTabsProps) {
  return (
    <div className="shrink-0 border-b border-[#d7e5ed] bg-[#f7fbfd] p-2">
      <div className="grid grid-cols-2 gap-2">

        {/* E-JAL */}

        <button type="button" onClick={() => onChange("ejal")} className={`group flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-[5px] border px-3 py-2 text-[9px] font-bold tracking-[0.25px] transition-all active:scale-[0.98] sm:min-h-10 sm:text-[10px] ${activeTab === "ejal" ? "border-[#075a91] bg-[#075a91] text-white shadow-[0_3px_8px_rgba(7,90,145,0.18)]" : "border-[#c8dbe5] bg-white text-[#36566b] hover:border-[#8eb7cb] hover:bg-[#eef7fb]"}`}>
          <span className={`flex h-5 w-5 items-center justify-center rounded-full ${activeTab === "ejal" ? "bg-white/15" : "bg-[#eaf6fc] text-[#075a91]"}`}>
            <Droplets size={12} />
          </span>

          <span className="truncate">
            E-JAL RECOMMENDATION
          </span>

          {activeTab === "ejal" && (
            <span className="hidden h-1.5 w-1.5 rounded-full bg-[#f58220] sm:block" />
          )}
        </button>


        {/* PERMISSIBLE */}

        <button type="button" onClick={() => onChange("permissible")} className={`group flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-[5px] border px-3 py-2 text-[9px] font-bold tracking-[0.25px] transition-all active:scale-[0.98] sm:min-h-10 sm:text-[10px] ${activeTab === "permissible" ? "border-[#075a91] bg-[#075a91] text-white shadow-[0_3px_8px_rgba(7,90,145,0.18)]" : "border-[#c8dbe5] bg-white text-[#36566b] hover:border-[#8eb7cb] hover:bg-[#eef7fb]"}`}>
          <span className={`flex h-5 w-5 items-center justify-center rounded-full ${activeTab === "permissible" ? "bg-white/15" : "bg-[#eaf6fc] text-[#075a91]"}`}>
            <LibraryBig size={12} />
          </span>

          <span className="truncate">
            318 PERMISSIBLE WORKS
          </span>

          {activeTab === "permissible" && (
            <span className="hidden h-1.5 w-1.5 rounded-full bg-[#f58220] sm:block" />
          )}
        </button>

      </div>
    </div>
  );
}