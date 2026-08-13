"use client";

import dynamic from "next/dynamic";
import {
    ChevronRight,
    MapPin,
    RotateCcw,
    Check,
    CalendarDays,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    locationData,
    State,
    District,
    Block,
    Panchayat,
} from "@/data/locationData";

import LocationSelectorModal from "./LocationSelectorModal";

const LocationMap = dynamic(
    () => import("./LocationMap"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full w-full items-center justify-center bg-[#edf4f8]">
                <div className="text-[10px] font-semibold text-slate-500">
                    Loading GIS map...
                </div>
            </div>
        ),
    }
);

interface Props {
    proposalId: string;
}

type SelectionLevel =
    | "state"
    | "district"
    | "block"
    | "panchayat"
    | null;

export default function LocationSelectionWorkspace({
    proposalId,
}: Props) {
    const router = useRouter();

    const [selectedState, setSelectedState] =
        useState<State | null>(null);

    const [selectedDistrict, setSelectedDistrict] =
        useState<District | null>(null);

    const [selectedBlock, setSelectedBlock] =
        useState<Block | null>(null);

    const [selectedPanchayat, setSelectedPanchayat] =
        useState<Panchayat | null>(null);

    const [activeLevel, setActiveLevel] =
        useState<SelectionLevel>(null);

    const currentLocation = useMemo(() => {
        if (selectedPanchayat) {
            return {
                label: selectedPanchayat.name,
                latitude: selectedPanchayat.latitude,
                longitude: selectedPanchayat.longitude,
                zoom: 13,
            };
        }

        if (selectedBlock) {
            return {
                label: selectedBlock.name,
                latitude: selectedBlock.latitude,
                longitude: selectedBlock.longitude,
                zoom: 11,
            };
        }

        if (selectedDistrict) {
            return {
                label: selectedDistrict.name,
                latitude: selectedDistrict.latitude,
                longitude: selectedDistrict.longitude,
                zoom: 9,
            };
        }

        if (selectedState) {
            return {
                label: selectedState.name,
                latitude: selectedState.latitude,
                longitude: selectedState.longitude,
                zoom: selectedState.zoom,
            };
        }

        return {
            label: "India",
            latitude: 22.5937,
            longitude: 78.9629,
            zoom: 5,
        };
    }, [
        selectedState,
        selectedDistrict,
        selectedBlock,
        selectedPanchayat,
    ]);

    const handleStateSelect = (
        item: { id: string; name: string }
    ) => {
        const state = locationData.find(
            (state) => state.id === item.id
        );

        if (!state) {
            return;
        }

        setSelectedState(state);
        setSelectedDistrict(null);
        setSelectedBlock(null);
        setSelectedPanchayat(null);
        setActiveLevel(null);
    };

    const handleDistrictSelect = (
        item: { id: string; name: string }
    ) => {
        const district =
            selectedState?.districts.find(
                (district) =>
                    district.id === item.id
            );

        if (!district) {
            return;
        }

        setSelectedDistrict(district);
        setSelectedBlock(null);
        setSelectedPanchayat(null);
        setActiveLevel(null);
    };

    const handleBlockSelect = (
        item: { id: string; name: string }
    ) => {
        const block =
            selectedDistrict?.blocks.find(
                (block) => block.id === item.id
            );

        if (!block) {
            return;
        }

        setSelectedBlock(block);
        setSelectedPanchayat(null);
        setActiveLevel(null);
    };

    const handlePanchayatSelect = (
        item: { id: string; name: string }
    ) => {
        const panchayat =
            selectedBlock?.panchayats.find(
                (panchayat) =>
                    panchayat.id === item.id
            );

        if (!panchayat) {
            return;
        }

        setSelectedPanchayat(panchayat);
        setActiveLevel(null);
    };

    const handleReset = () => {
        setSelectedState(null);
        setSelectedDistrict(null);
        setSelectedBlock(null);
        setSelectedPanchayat(null);
    };

    const handleContinue = () => {
        if (!selectedPanchayat) {
            return;
        }

        router.push(
            `/proposal/${proposalId}/availability`
        );
    };

    return (
        <main className="relative flex h-[calc(100dvh-60px)] min-h-0 w-full flex-col overflow-hidden bg-[#eef5f8]">

            {/* BACKGROUND */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full border border-[#075a91]/10" />

                <div className="absolute -right-40 top-[15%] h-[500px] w-[500px] rounded-full border border-[#f58220]/10" />

                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#075a91 1px, transparent 1px), linear-gradient(90deg,#075a91 1px,transparent 1px)",
                        backgroundSize: "38px 38px",
                    }}
                />

            </div>

            {/* HEADER */}

            <div className="relative z-10 shrink-0 border-b border-[#c9dce8] bg-white/95 shadow-sm">

                <div className="flex min-h-[52px] items-center justify-between px-3 sm:px-5 lg:px-7">

                    <div>

                        <div className="flex items-center gap-2">

                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#075a91] text-white">
                                <MapPin size={14} />
                            </div>

                            <div>

                                <h1 className="text-[12px] font-extrabold tracking-wide text-[#003b63] sm:text-[14px]">
                                    PLANNING AREA SELECTION
                                </h1>

                                <p className="text-[7px] text-slate-400 sm:text-[8px]">
                                    Select the geographical area for
                                    planning
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="hidden items-center gap-2 sm:flex">

                        <span className="h-1.5 w-1.5 rounded-full bg-[#f58220]" />

                        <span className="text-[8px] font-bold uppercase tracking-[1px] text-[#64748b]">
                            VGPP • GIS PLANNING
                        </span>

                    </div>

                </div>

                <div className="flex h-[3px]">
                    <div className="w-[72%] bg-[#075a91]" />
                    <div className="w-[28%] bg-[#f58220]" />
                </div>

            </div>

            {/* CONTENT */}

            <div className="relative z-10 min-h-0 flex-1 p-2 sm:p-3 lg:p-4">

                <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-[380px_minmax(0,1fr)]">

                    {/* LEFT */}

                    <section className="flex min-h-0 flex-col overflow-hidden rounded-[9px] border border-[#c7dce8] bg-white shadow-[0_8px_28px_rgba(0,59,99,0.09)]">

                        {/* CARD HEADER */}

                        <div className="shrink-0 border-b border-[#dce8ef] bg-[#f6fafc] p-4">

                            <div className="text-[8px] font-bold uppercase tracking-[1.4px] text-[#f58220]">
                                Planning Hierarchy
                            </div>

                            <h2 className="mt-1 text-[16px] font-extrabold text-[#003b63]">
                                Select Location
                            </h2>

                            <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                                Select State, District, Block and
                                Panchayat to continue planning.
                            </p>

                        </div>

                        {/* LOCATION FIELDS */}

                        <div className="min-h-0 flex-1 overflow-y-auto p-3">

                            <LocationField
                                label="State"
                                required
                                value={selectedState?.name}
                                onClick={() =>
                                    setActiveLevel("state")
                                }
                            />

                            <LocationField
                                label="District"
                                required
                                value={selectedDistrict?.name}
                                disabled={!selectedState}
                                onClick={() =>
                                    setActiveLevel("district")
                                }
                            />

                            <LocationField
                                label="Block"
                                required
                                value={selectedBlock?.name}
                                disabled={!selectedDistrict}
                                onClick={() =>
                                    setActiveLevel("block")
                                }
                            />

                            <LocationField
                                label="Panchayat"
                                required
                                value={selectedPanchayat?.name}
                                disabled={!selectedBlock}
                                onClick={() =>
                                    setActiveLevel("panchayat")
                                }
                            />

                            {/* FINANCIAL YEAR */}

                            <div className="mt-3 rounded-lg border border-[#dce8ef] bg-[#f9fbfc] p-3">

                                <div className="mb-1.5 flex items-center gap-1.5">

                                    <CalendarDays
                                        size={11}
                                        className="text-[#075a91]"
                                    />

                                    <span className="text-[8px] font-bold uppercase tracking-wide text-[#475569]">
                                        Financial Year
                                    </span>

                                </div>

                                <div className="flex h-9 items-center justify-between rounded-md border border-[#cbd9e2] bg-white px-3">

                                    <span className="text-[9px] font-semibold text-[#20354a]">
                                        Current Financial Year
                                    </span>

                                    <span className="rounded-full bg-[#eaf6fd] px-2 py-1 text-[7px] font-bold text-[#075a91]">
                                        CURRENT
                                    </span>

                                </div>

                            </div>

                            {/* SELECTION SUMMARY */}

                            {selectedPanchayat && (
                                <div className="mt-3 rounded-lg border border-[#bce6d5] bg-[#effbf5] p-3">

                                    <div className="flex items-center gap-2">

                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00875a] text-white">
                                            <Check size={12} />
                                        </div>

                                        <div>

                                            <div className="text-[9px] font-bold text-[#00875a]">
                                                Location selected
                                            </div>

                                            <div className="text-[8px] text-[#526273]">
                                                Ready to continue planning
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>

                        {/* FOOTER */}

                        <div className="flex shrink-0 items-center gap-2 border-t border-[#dce8ef] bg-[#f9fbfc] p-3">

                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#cbd9e2] bg-white px-4 text-[9px] font-bold text-[#475569] transition hover:border-[#075a91] hover:text-[#075a91]"
                            >
                                <RotateCcw size={11} />
                                Reset
                            </button>

                            <button
                                type="button"
                                disabled={!selectedPanchayat}
                                onClick={handleContinue}
                                className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#075a91] px-4 text-[9px] font-bold text-white shadow-sm transition hover:bg-[#003b63] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Continue to Planning
                                <ChevronRight size={13} />
                            </button>

                        </div>

                    </section>

                    {/* RIGHT MAP */}

                    <section className="relative min-h-[360px] overflow-hidden rounded-[9px] border border-[#c7dce8] bg-white shadow-[0_8px_28px_rgba(0,59,99,0.09)]">

                        <LocationMap
                            latitude={currentLocation.latitude}
                            longitude={currentLocation.longitude}
                            zoom={currentLocation.zoom}
                            label={currentLocation.label}
                        />

                        {/* BREADCRUMB */}

                        <div className="absolute bottom-3 left-3 z-[1000] max-w-[75%] rounded-lg border border-white/70 bg-white/90 px-3 py-2 shadow-md backdrop-blur">

                            <div className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                                SELECTED HIERARCHY
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-1 text-[8px] font-semibold text-[#003b63]">

                                <span>
                                    {selectedState?.name ||
                                        "India"}
                                </span>

                                {selectedDistrict && (
                                    <>
                                        <ChevronRight size={9} />
                                        <span>
                                            {selectedDistrict.name}
                                        </span>
                                    </>
                                )}

                                {selectedBlock && (
                                    <>
                                        <ChevronRight size={9} />
                                        <span>
                                            {selectedBlock.name}
                                        </span>
                                    </>
                                )}

                                {selectedPanchayat && (
                                    <>
                                        <ChevronRight size={9} />
                                        <span className="text-[#075a91]">
                                            {selectedPanchayat.name}
                                        </span>
                                    </>
                                )}

                            </div>

                        </div>

                    </section>

                </div>

            </div>

            {/* MODALS */}

            <LocationSelectorModal
                open={activeLevel === "state"}
                title="State"
                items={locationData.map(
                    (state) => ({
                        id: state.id,
                        name: state.name,
                    })
                )}
                onSelect={handleStateSelect}
                onClose={() =>
                    setActiveLevel(null)
                }
            />

            <LocationSelectorModal
                open={activeLevel === "district"}
                title="District"
                items={
                    selectedState?.districts.map(
                        (district) => ({
                            id: district.id,
                            name: district.name,
                        })
                    ) ?? []
                }
                onSelect={handleDistrictSelect}
                onClose={() =>
                    setActiveLevel(null)
                }
            />

            <LocationSelectorModal
                open={activeLevel === "block"}
                title="Block"
                items={
                    selectedDistrict?.blocks.map(
                        (block) => ({
                            id: block.id,
                            name: block.name,
                        })
                    ) ?? []
                }
                onSelect={handleBlockSelect}
                onClose={() =>
                    setActiveLevel(null)
                }
            />

            <LocationSelectorModal
                open={activeLevel === "panchayat"}
                title="Panchayat"
                items={
                    selectedBlock?.panchayats.map(
                        (panchayat) => ({
                            id: panchayat.id,
                            name: panchayat.name,
                        })
                    ) ?? []
                }
                onSelect={handlePanchayatSelect}
                onClose={() =>
                    setActiveLevel(null)
                }
            />

        </main>
    );
}

/* =========================================================
   LOCATION FIELD
========================================================= */

function LocationField({
    label,
    value,
    required,
    disabled,
    onClick,
}: {
    label: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="mb-2.5 flex w-full cursor-pointer flex-col rounded-lg border border-[#dce8ef] bg-white p-3 text-left transition hover:border-[#8bbbd3] hover:bg-[#f8fcfe] disabled:cursor-not-allowed disabled:opacity-50"
        >

            <div className="mb-1.5 flex items-center gap-1">

                <span className="text-[8px] font-bold uppercase tracking-[1px] text-[#475569]">
                    {label}
                </span>

                {required && (
                    <span className="text-[9px] font-bold text-[#f58220]">
                        *
                    </span>
                )}

            </div>

            <div className="flex min-h-8 items-center justify-between rounded-md border border-[#cbd9e2] bg-[#f9fbfc] px-3">

                <span
                    className={
                        value
                            ? "truncate text-[9px] font-semibold text-[#20354a]"
                            : "text-[9px] text-slate-400"
                    }
                >
                    {value ||
                        `Select ${label.toLowerCase()}`}
                </span>

                <ChevronRight
                    size={13}
                    className="shrink-0 text-slate-400"
                />

            </div>

        </button>
    );
}