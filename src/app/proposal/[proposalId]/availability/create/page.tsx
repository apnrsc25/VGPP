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
  () =>
    import("@/components/availability/AvailabilityMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#f5f1e9]">
        <span className="text-sm text-slate-500">
          Loading map...
        </span>
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

      count: 1,

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
    <main className="h-screen overflow-hidden bg-[#f4f7fa] p-4">
      <div className="grid h-full min-h-0 grid-cols-[395px_minmax(0,1fr)] gap-4">
        {/* ================= LEFT FORM ================= */}
        <section className="min-h-0 overflow-hidden rounded-xl border border-[#dce4eb] bg-white shadow-sm">
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
          />
        </section>

        {/* ================= RIGHT MAP ================= */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#dce4eb] bg-white shadow-sm">
          {/* MAP HEADER */}
          <div className="flex h-9 shrink-0 items-center border-b border-[#d4e2eb] bg-[#eaf6fd] px-3">
            <h2 className="text-[12px] font-semibold text-[#08669c]">
              Click on the map to pin the work location
            </h2>
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