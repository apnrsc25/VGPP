interface SummaryTabProps {
  value: number;
  label: string;
  active?: boolean;
  valueColor?: string;
}

export default function SummaryTab({
  value,
  label,
  active = false,
  valueColor = "#008b67",
}: SummaryTabProps) {
  return (
    <div
      className={`
        relative flex h-[48px] items-center justify-center
        border-r border-slate-200
        bg-white
        last:border-r-0
        ${
          active
            ? "z-10 -mb-px border-2 border-[#26365f]"
            : ""
        }
      `}
    >
      <div className="flex flex-col items-center justify-center leading-none">
        <span
          className="text-[14px] font-bold"
          style={{ color: valueColor }}
        >
          {value}
        </span>

        <span className="mt-[3px] text-[8px] font-semibold tracking-wide text-[#34466d]">
          {label}
        </span>
      </div>
    </div>
  );
}