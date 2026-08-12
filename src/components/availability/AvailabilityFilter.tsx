"use client";

interface AvailabilityFilters {
  themes: string[];
  types: string[];
}

interface AvailabilityFilterProps {
  filters: AvailabilityFilters;
  onChange: (filters: AvailabilityFilters) => void;
  onClose: () => void;
}

const THEMES = [
  "Water Security",
  "Rural Infrastructure",
];

const TYPES = [
  "New",
  "Repair",
];

function toggleValue(
  values: string[],
  value: string
) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function AvailabilityFilter({
  filters,
  onChange,
  onClose,
}: AvailabilityFilterProps) {
  return (
    <div
      className="
        absolute
        left-3
        top-[44px]
        z-[2000]
        w-[255px]
        overflow-hidden
        rounded-lg
        border
        border-slate-200
        bg-white
        shadow-lg
      "
    >
      {/* HEADER */}

      <div className="flex h-9 items-center justify-between border-b border-slate-200 px-3">
        <span className="text-[11px] font-semibold text-slate-700">
          Filter by
        </span>

        <button
          type="button"
          onClick={onClose}
          className="text-[15px] leading-none text-slate-400 hover:text-slate-700"
        >
          ×
        </button>
      </div>

      {/* BODY */}

      <div className="px-3 py-3">

        {/* THEME */}

        <div className="mb-4">
          <div className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
            Theme
          </div>

          <div className="flex flex-wrap gap-1.5">
            {THEMES.map((theme) => {
              const selected =
                filters.themes.includes(theme);

              return (
                <button
                  key={theme}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      themes: toggleValue(
                        filters.themes,
                        theme
                      ),
                    })
                  }
                  className={`
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[9px]
                    font-medium
                    whitespace-nowrap
                    cursor-pointer
                    ${
                      selected
                        ? "border-[#168dcc] bg-[#eaf7ff] text-[#0874b5]"
                        : "border-slate-300 bg-white text-slate-600"
                    }
                  `}
                >
                  {theme}
                </button>
              );
            })}
          </div>
        </div>

        {/* TYPE */}

        <div>
          <div className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
            Type
          </div>

          <div className="flex gap-1.5">
            {TYPES.map((type) => {
              const selected =
                filters.types.includes(type);

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      types: toggleValue(
                        filters.types,
                        type
                      ),
                    })
                  }
                  className={`
                    rounded-full
                    border
                    px-3
                    py-1
                    text-[9px]
                    font-medium
                    cursor-pointer
                    ${
                      selected
                        ? "border-[#168dcc] bg-[#eaf7ff] text-[#0874b5]"
                        : "border-slate-300 bg-white text-slate-600"
                    }
                  `}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="flex justify-end border-t border-slate-200 px-3 py-2">
        <button
          type="button"
          onClick={() =>
            onChange({
              themes: [],
              types: [],
            })
          }
          className="text-[10px] font-medium text-[#168dcc] hover:underline cursor-pointer"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}