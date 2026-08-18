"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Search,
  MapPin,
  CheckCircle2,
  Languages,
  BriefcaseBusiness,
  Activity,
  Ruler,
  Hash,
} from "lucide-react";

import { Functionality, Work } from "@/types/work";

interface CreateAssetFormProps {
  works: Work[];
  selectedWorkId: string;
  localWorkName: string;
  functionality: Functionality;
  scheme: string;
  financialYear: string;

  selectedPosition: {
    latitude: number;
    longitude: number;
  } | null;

  unit: number;
  onUnitChange: (value: number) => void;

  unitType: "Nits" | "cm" | "m" | "km";
  onUnitTypeChange: (
    value: "Nits" | "cm" | "m" | "km"
  ) => void;

  onWorkChange: (workId: string) => void;
  onLocalWorkNameChange: (value: string) => void;
  onFunctionalityChange: (
    value: Functionality
  ) => void;
  onSchemeChange: (value: string) => void;
  onFinancialYearChange: (value: string) => void;

  onSave: () => void;
  onCancel: () => void;
}

export default function CreateAssetForm({
  works,
  selectedWorkId,
  localWorkName,
  functionality,
  scheme,
  financialYear,
  selectedPosition,
  unit,
  unitType,
  onUnitChange,
  onUnitTypeChange,
  onWorkChange,
  onLocalWorkNameChange,
  onFunctionalityChange,
  onSchemeChange,
  onFinancialYearChange,
  onSave,
  onCancel,
}: CreateAssetFormProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedWork = works.find(
    (work) => work.id === selectedWorkId
  );

  const filteredWorks = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return works;
    }

    return works.filter((work) =>
      work.workName.toLowerCase().includes(value)
    );
  }, [works, search]);

  const handleSelectWork = (work: Work) => {
    onWorkChange(work.id);
    setSearch(work.workName);
    setIsOpen(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#eef5f8]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="shrink-0 border-b border-[#cbdde8] bg-white shadow-[0_2px_8px_rgba(0,59,99,0.07)]">

        <div className="h-[4px] bg-gradient-to-r from-[#075a91] via-[#0c78ad] to-[#f58220]" />

        <div className="px-4 py-3 sm:px-5">

          <div className="flex items-start gap-2">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#075a91] text-white shadow-sm">
              <BriefcaseBusiness size={17} />
            </div>

            <div className="min-w-0">

              <h2 className="text-[14px] font-bold text-[#003b63] sm:text-[16px]">
                Add Available Asset
              </h2>

              <p className="mt-1 text-[10px] leading-relaxed text-slate-500 sm:text-[12px]">
                Add a permissible work to the availability list
                and pin its location on the map.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FORM
      ====================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">

        <div className="space-y-2">

          {/* LANGUAGE */}

          <div className="rounded-[5px] border border-[#d8e5ec] bg-white p-2 shadow-[0_2px_8px_rgba(0,59,99,0.04)] sm:p-3">

            <div className="mb-2 flex items-center gap-2">

              <Languages
                size={14}
                className="text-[#075a91]"
              />

              <label className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#475569]">
                Input Language
              </label>

              <span className="text-[9px] text-slate-400">
                Manual typing
              </span>

            </div>

            <div className="relative">

              <select
                className="h-9 w-full appearance-none rounded-[4px] border border-[#cbd8e1] bg-white px-3 pr-9 text-[11px] text-[#334155] outline-none transition focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
              >
                <option>English</option>
                <option>Kannada</option>
                <option>Hindi</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

            </div>

          </div>


          {/* WORK */}

          <div className="rounded-[5px] border border-[#d8e5ec] bg-white p-2 shadow-[0_2px_8px_rgba(0,59,99,0.04)] sm:p-3">

            <div className="mb-2 flex items-center gap-2">

              <BriefcaseBusiness
                size={14}
                className="text-[#075a91]"
              />

              <label className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#475569]">
                Work Name
              </label>

              <span className="text-[9px] font-bold text-[#f58220]">
                *
              </span>

            </div>

            <p className="mb-2 text-[9px] text-slate-400">
              Select from permissible works
            </p>

            <div className="relative">

              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={
                  isOpen
                    ? search
                    : selectedWork?.workName ?? ""
                }
                onChange={(event) => {
                  setSearch(event.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search permissible works..."
                className="h-10 w-full rounded-[4px] border border-[#cbd8e1] bg-white pl-9 pr-3 text-[11px] text-[#334155] outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
              />

              {isOpen && (
                <div className="absolute left-0 right-0 top-[43px] z-50 max-h-56 overflow-y-auto rounded-[4px] border border-[#cbdde8] bg-white shadow-[0_8px_25px_rgba(0,59,99,0.16)]">

                  <div className="sticky top-0 border-b border-[#e5edf2] bg-[#f7fafc] px-3 py-2 text-[8px] font-bold uppercase tracking-wide text-[#64748b]">
                    Permissible Works
                  </div>

                  {filteredWorks.length === 0 ? (
                    <div className="px-3 py-5 text-center text-[10px] text-slate-400">
                      No works found
                    </div>
                  ) : (
                    filteredWorks.map((work) => (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() =>
                          handleSelectWork(work)
                        }
                        className="block w-full border-b border-slate-100 px-3 py-2.5 text-left text-[10px] text-slate-700 transition hover:bg-[#eef7fb] hover:text-[#075a91]"
                      >
                        <div className="font-medium">
                          {work.workName}
                        </div>

                        <div className="mt-0.5 text-[8px] text-slate-400">
                          {work.vgpId}
                        </div>
                      </button>
                    ))
                  )}

                </div>
              )}

            </div>

            {selectedWork && (
              <div className="mt-2 flex items-center gap-2 rounded-[3px] bg-[#edf7fb] px-2.5 py-1.5 text-[9px] text-[#075a91]">

                <CheckCircle2 size={12} />

                <span className="truncate font-medium">
                  {selectedWork.workName}
                </span>

              </div>
            )}

          </div>

          {/* SCHEME */}

          <div className="rounded-[5px] border border-[#d8e5ec] bg-white p-2 shadow-[0_2px_8px_rgba(0,59,99,0.04)] sm:p-3">

            <div className="mb-2 flex items-center gap-2">

              <BriefcaseBusiness
                size={14}
                className="text-[#075a91]"
              />

              <label className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#475569]">
                Scheme
              </label>

            </div>

            <input
              type="text"
              value={scheme}
              onChange={(event) =>
                onSchemeChange(event.target.value)
              }
              placeholder="Enter scheme name"
              className="h-9 w-full rounded-[4px] border border-[#cbd8e1] px-3 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
            />

          </div>

          {/* UNIT */}

          {/* <div className="rounded-[5px] border border-[#d8e5ec] bg-white p-2 shadow-[0_2px_8px_rgba(0,59,99,0.04)] sm:p-3">

            <div className="mb-3 flex items-center justify-between gap-3">

              <div className="flex items-center gap-2">

                <Activity
                  size={14}
                  className="text-[#075a91]"
                />

                <label className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#475569]">
                  Unit
                </label>

                <span className="text-[9px] font-bold text-[#f58220]">
                  *
                </span>

              </div>

  

              <div className="flex items-center gap-1.5">

         

                <input
                  type="number"
                  min={0}
                  max={100}
                  value={unit}
                  onChange={(event) => {
                    const rawValue = event.target.value;

                    if (rawValue === "") {
                      onUnitChange(0);
                      return;
                    }

                    const value = Number(rawValue);

                    onUnitChange(
                      Math.min(100, Math.max(0, value))
                    );
                  }}
                  className="h-8 w-16 rounded-[4px] border border-[#cbd8e1] bg-white px-2 text-center text-[11px] font-bold text-[#075a91] outline-none transition focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
                />

          

                <div className="relative">

                  <select
                    value={unitType}
                    onChange={(event) =>
                      onUnitTypeChange(
                        event.target.value as
                        | "Nits"
                        | "cm"
                        | "m"
                        | "km"
                      )
                    }
                    className="h-8 w-[70px] appearance-none rounded-[4px] border border-[#cbd8e1] bg-white px-2 pr-6 text-[10px] font-semibold text-[#475569] outline-none transition focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
                  >
                    <option value="Nits">Nits</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="km">km</option>
                  </select>

                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

              </div>

            </div>


            <div className="px-1">

              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={unit}
                onChange={(event) =>
                  onUnitChange(Number(event.target.value))
                }
                className="h-1.5 w-full cursor-pointer accent-[#075a91]"
              />

              <div className="mt-2 flex items-center justify-between text-[8px] font-medium text-slate-400">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>

            </div>

            <p className="mt-2 text-[9px] text-slate-400">
              Enter the value and select the appropriate unit.
            </p>

          </div> */}


          {/* FINANCIAL YEAR */}

          <div className="rounded-[5px] border border-[#d8e5ec] bg-white p-2 shadow-[0_2px_8px_rgba(0,59,99,0.04)] sm:p-3">

            <div className="mb-2 flex items-center gap-2">

              <BriefcaseBusiness
                size={14}
                className="text-[#075a91]"
              />

              <label className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#475569]">
                Financial Year
              </label>

            </div>

            <input
              type="text"
              value={financialYear}
              onChange={(event) =>
                onFinancialYearChange(event.target.value)
              }
              placeholder="Enter financial year (e.g. 2026-27)"
              className="h-9 w-full rounded-[4px] border border-[#cbd8e1] px-3 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
            />

          </div>


          {/* LOCAL WORK */}

          <div className="rounded-[5px] border border-[#d8e5ec] bg-white p-2 shadow-[0_2px_8px_rgba(0,59,99,0.04)] sm:p-3">

            <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.8px] text-[#475569]">
              Local Work
              <span className="ml-1 font-normal normal-case text-slate-400">
                Optional
              </span>
            </label>

            <input
              value={localWorkName}
              onChange={(event) =>
                onLocalWorkNameChange(
                  event.target.value
                )
              }
              placeholder="Type a local name for this work"
              className="h-9 w-full rounded-[4px] border border-[#cbd8e1] px-3 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:ring-2 focus:ring-[#075a91]/10"
            />

          </div>


          {/* FUNCTIONALITY */}

          <div className="rounded-[5px] border border-[#d8e5ec] bg-white p-2 shadow-[0_2px_8px_rgba(0,59,99,0.04)] sm:p-3">

            <div className="mb-3 flex items-center gap-2">

              <Activity
                size={14}
                className="text-[#075a91]"
              />

              <label className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#475569]">
                Functionality
              </label>

              <span className="text-[9px] font-bold text-[#f58220]">
                *
              </span>

            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  onFunctionalityChange(
                    "Functional"
                  )
                }
                className={`flex min-h-10 items-center justify-center gap-2 rounded-[4px] border text-[10px] font-semibold transition ${functionality === "Functional"
                  ? "border-[#075a91] bg-[#edf7fb] text-[#075a91] shadow-sm"
                  : "border-[#cbd8e1] bg-white text-slate-600 hover:border-[#9db9ca] hover:bg-slate-50"
                  }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${functionality === "Functional"
                    ? "bg-[#075a91]"
                    : "border border-slate-400"
                    }`}
                />

                Functional
              </button>

              <button
                type="button"
                onClick={() =>
                  onFunctionalityChange(
                    "Non-Functional"
                  )
                }
                className={`flex min-h-10 items-center justify-center gap-2 rounded-[4px] border text-[10px] font-semibold transition ${functionality === "Non-Functional"
                  ? "border-[#f58220] bg-[#fff6ed] text-[#c96712] shadow-sm"
                  : "border-[#cbd8e1] bg-white text-slate-600 hover:border-[#9db9ca] hover:bg-slate-50"
                  }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${functionality === "Non-Functional"
                    ? "bg-[#f58220]"
                    : "border border-slate-400"
                    }`}
                />

                Non-Functional
              </button>

            </div>

          </div>


          {/* LOCATION */}

          <div className="rounded-[5px] border border-[#d8e5ec] bg-white p-3 shadow-[0_2px_8px_rgba(0,59,99,0.04)] sm:p-4">

            <div className="mb-2 flex items-center gap-2">

              <MapPin
                size={14}
                className="text-[#075a91]"
              />

              <label className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#475569]">
                Location
              </label>

              <span className="text-[9px] font-bold text-[#f58220]">
                *
              </span>

            </div>

            {selectedPosition ? (
              <div className="rounded-[4px] border border-emerald-200 bg-emerald-50 p-3">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={14}
                    className="text-emerald-600"
                  />

                  <p className="text-[10px] font-bold text-emerald-700">
                    Location pinned successfully
                  </p>

                </div>

                <div className="mt-2 grid grid-cols-1 gap-1 text-[9px] text-emerald-700 sm:grid-cols-2">

                  <span>
                    Lat:{" "}
                    {selectedPosition.latitude.toFixed(6)}
                  </span>

                  <span>
                    Lng:{" "}
                    {selectedPosition.longitude.toFixed(6)}
                  </span>

                </div>

              </div>
            ) : (
              <div className="rounded-[4px] border border-dashed border-[#b8ccd8] bg-[#f7fafc] px-3 py-4 text-center">

                <MapPin
                  size={20}
                  className="mx-auto mb-2 text-[#9db5c4]"
                />

                <p className="text-[9px] font-medium text-slate-500">
                  Click on the map to pin work location
                </p>

                <p className="mt-1 text-[8px] text-slate-400">
                  Location is required before saving
                </p>

              </div>
            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <div className="shrink-0 border-t border-[#cbdde8] bg-white p-3 shadow-[0_-2px_8px_rgba(0,59,99,0.06)] sm:p-4">

        <div className="grid grid-cols-2 gap-2">

          {/* CANCEL */}

          <button type="button" onClick={onCancel} className="flex min-h-10 w-full cursor-pointer items-center justify-center rounded-[4px] border border-[#cbd8e1] bg-white px-3 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]">
            Cancel
          </button>


          {/* SAVE */}

          <button type="button" disabled={!selectedWorkId || !selectedPosition} onClick={onSave} className="flex min-h-10 w-full cursor-pointer items-center justify-center rounded-[4px] bg-[#075a91] px-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#003b63] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45">
            Save Work
          </button>

        </div>

      </div>

    </div>
  );
}