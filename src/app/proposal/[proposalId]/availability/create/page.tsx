"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CreateAssetForm from "@/components/availability/CreateAssetForm";
import { mockAssets } from "@/data/mockAssets";
import { getStoredWorks, saveWorks } from "@/lib/workStorage";
import {
  Functionality,
  Work,
} from "@/types/work";

const AvailabilityMap = dynamic(
  () => import("@/components/availability/AvailabilityMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[360px] w-full items-center justify-center rounded-[6px] bg-[#edf4f8] text-[10px] text-slate-500 sm:min-h-[420px]">
        Loading map...
      </div>
    ),
  }
);

export default function CreateAssetPage() {
  const router = useRouter();

  const [works, setWorks] = useState<Work[]>(mockAssets);

  const [selectedWorkId, setSelectedWorkId] =
    useState("");

  const [localWorkName, setLocalWorkName] =
    useState("");

  const [functionality, setFunctionality] =
    useState<Functionality>("Functional");

  const [selectedPosition, setSelectedPosition] =
    useState<{
      latitude: number;
      longitude: number;
    } | null>(null);

  const [unit, setUnit] = useState(0);
  const [unitType, setUnitType] = useState<
    "Nits" | "cm" | "m" | "km"
  >("Nits");
  const [scheme, setScheme] = useState("");

  const [financialYear, setFinancialYear] = useState("");

  useEffect(() => {
    setWorks(getStoredWorks(mockAssets));
  }, []);

  const handleMapClick = (
    latitude: number,
    longitude: number
  ) => {
    setSelectedPosition({
      latitude,
      longitude,
    });
  };

  const handleSaveWork = () => {
    const selectedWork = works.find(
      (work) => work.id === selectedWorkId
    );

    if (!selectedWork) {
      return;
    }

    if (!selectedPosition) {
      return;
    }

    const timestamp = Date.now();

    const newWork: Work = {
      ...selectedWork,

      id: `LOCAL-${timestamp}`,

      vgpId: `LOCAL-${timestamp}`,

      quantity: 1,

      location: {
        lat: selectedPosition.latitude,
        lng: selectedPosition.longitude,
      },

      visibleOnMap: true,

      functionality,

      localWorkName:
        localWorkName.trim() || undefined,
    };

    const updatedWorks = [
      ...works,
      newWork,
    ];

    setWorks(updatedWorks);

    saveWorks(updatedWorks);

    router.push("../");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="flex h-[calc(100dvh-120px)] min-h-0 w-full flex-col overflow-hidden bg-[#eef5f8] p-2 sm:p-2 lg:p-2">

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden sm:gap-2 xl:grid-cols-[395px_minmax(0,1fr)]">

        {/* =====================================================
            LEFT - FORM
        ====================================================== */}

        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[6px] border border-[#cbdde8] bg-white shadow-[0_4px_16px_rgba(0,59,99,0.08)]">
          <CreateAssetForm
            works={works}
            selectedWorkId={selectedWorkId}
            localWorkName={localWorkName}
            functionality={functionality}
            selectedPosition={selectedPosition}
            onWorkChange={setSelectedWorkId}
            onLocalWorkNameChange={
              setLocalWorkName
            }
            onFunctionalityChange={
              setFunctionality
            }
            onSave={handleSaveWork}
            onCancel={handleCancel}
            scheme={scheme}
            financialYear={financialYear}
            onSchemeChange={setScheme}
            onFinancialYearChange={setFinancialYear}
            unit={unit}
            unitType={unitType}
            onUnitChange={setUnit}
            onUnitTypeChange={setUnitType}
          />
        </section>


        {/* =====================================================
            RIGHT - MAP
        ====================================================== */}

        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[6px] border border-[#cbdde8] bg-white shadow-[0_4px_16px_rgba(0,59,99,0.08)]">

          {/* MAP HEADER */}

          <div className="shrink-0 border-b border-[#cbdde8] bg-white">

            <div className="flex h-[3px]">

              <div className="flex-1 bg-[#075a91]" />

              <div className="w-[70px] bg-[#f58220]" />

            </div>

            <div className="flex min-h-[45px] items-center px-3 sm:px-4">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#075a91]" />

                <h2 className="text-[10px] font-bold uppercase tracking-[0.7px] text-[#003b63] sm:text-[11px]">
                  Asset Location
                </h2>

              </div>

              <span className="ml-auto text-[8px] font-medium text-slate-400 sm:text-[9px]">
                Click on map to pin location
              </span>

            </div>

          </div>


          {/* MAP */}

          <div className="relative min-h-0 flex-1">

            <AvailabilityMap
              works={works}
              mode="pin"
              selectedPosition={selectedPosition}
              onMapClick={handleMapClick}
            />

          </div>

        </section>

      </div>

    </main>
  );
}