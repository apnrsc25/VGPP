"use client";

interface RequirementsSourceTabsProps {
  activeTab: "ejal" | "permissible";
  onChange: (tab: "ejal" | "permissible") => void;
}

export default function RequirementsSourceTabs({
  activeTab,
  onChange,
}: RequirementsSourceTabsProps) {
  return (
    <div className="flex gap-2 border-b border-slate-200 px-3 py-2">
      <button
        type="button"
        onClick={() => onChange("ejal")}
        className={`h-7 flex-1 rounded-md border px-3 text-[11px] font-medium transition ${
          activeTab === "ejal"
            ? "border-[#46537d] bg-[#46537d] text-white shadow-sm"
            : "border-[#46537d] bg-white text-[#18315c]"
        }`}
      >
        E-JAL RECOMMENDATION
      </button>

      <button
        type="button"
        onClick={() => onChange("permissible")}
        className={`h-7 flex-1 rounded-md border px-3 text-[11px] font-medium transition ${
          activeTab === "permissible"
            ? "border-[#46537d] bg-[#46537d] text-white shadow-sm"
            : "border-[#46537d] bg-white text-[#18315c]"
        }`}
      >
        318 PERMISSIBLE WORKS
      </button>
    </div>
  );
}