"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { Functionality, Work } from "@/types/work";

interface CreateAssetFormProps {
  works: Work[];
  selectedWorkId: string;
  localWorkName: string;
  functionality: Functionality;
  selectedPosition: {
    latitude: number;
    longitude: number;
  } | null;
  onWorkChange: (workId: string) => void;
  onLocalWorkNameChange: (value: string) => void;
  onFunctionalityChange: (
    value: Functionality
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function CreateAssetForm({
  works,
  selectedWorkId,
  localWorkName,
  functionality,
  selectedPosition,
  onWorkChange,
  onLocalWorkNameChange,
  onFunctionalityChange,
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
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-[16px] font-bold text-[#08669c]">
          Add Available Assets
        </h2>

        <p className="mt-1 text-[11px] text-slate-500">
          Fill in the details below to add a work to the
          availability list
        </p>
      </div>

      <div className="flex-1 overflow-auto px-5 py-4">
        {/* Language */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Input Language (For Manual Typing)
          </label>

          <div className="relative">
            <select className="h-9 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#078aca]">
              <option>English</option>
              <option>Kannada</option>
              <option>Hindi</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Work */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Work Name * (Select from Permissible Works)
          </label>

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
              className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-[#078aca]"
            />

            {isOpen && (
              <div className="absolute left-0 right-0 top-10 z-50 max-h-52 overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
                {filteredWorks.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-slate-500">
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
                      className="block w-full border-b border-slate-100 px-3 py-2 text-left text-xs text-slate-700 hover:bg-blue-50"
                    >
                      {work.workName}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Local Work */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Local Work (Optional)
          </label>

          <input
            value={localWorkName}
            onChange={(event) =>
              onLocalWorkNameChange(event.target.value)
            }
            placeholder="Type a local name for this work (optional)"
            className="h-9 w-full rounded-md border border-slate-300 px-3 text-xs outline-none focus:border-[#078aca]"
          />
        </div>

        {/* Functionality */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Functionality *
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                onFunctionalityChange("Functional")
              }
              className={`h-9 rounded-md border text-xs font-semibold transition ${functionality === "Functional"
                  ? "border-[#078aca] bg-blue-50 text-[#0879b1]"
                  : "border-slate-300 text-slate-600"
                }`}
            >
              <span className="mr-2">◉</span>
              Functional
            </button>

            <button
              type="button"
              onClick={() =>
                onFunctionalityChange("Non-Functional")
              }
              className={`h-9 rounded-md border text-xs font-semibold transition ${functionality === "Non-Functional"
                  ? "border-[#078aca] bg-blue-50 text-[#0879b1]"
                  : "border-slate-300 text-slate-600"
                }`}
            >
              <span className="mr-2">◉</span>
              Non-Functional
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="mb-5">
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Location *
          </label>

          {selectedPosition ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
              <p className="text-[11px] font-semibold text-emerald-700">
                Location pinned
              </p>

              <p className="mt-1 text-[10px] text-emerald-600">
                Lat: {selectedPosition.latitude.toFixed(6)}
                {" · "}
                Lng: {selectedPosition.longitude.toFixed(6)}
              </p>
            </div>
          ) : (
            <p className="text-[10px] text-slate-400">
              Click on the map (right) to pin work location.
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 flex-1 rounded-md border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              !selectedWorkId || !selectedPosition
            }
            onClick={onSave}
            className="h-9 flex-1 rounded-md bg-[#078aca] text-xs font-semibold text-white transition hover:bg-[#0579b2] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Save Work
          </button>
        </div>
      </div>
    </div>
  );
}