"use client";

import {
  MapPin,
  ChevronRight,
  Check,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import LocationSelectorModal, {
  LocationLevel,
  LocationItem,
  LocationBreadcrumb,
} from "./LocationSelectorModal";

import {
  getAuthSession,
  updateAuthLocation,
} from "@/config/auth";

import {
  locationData,
  State,
  District,
  Block,
  Panchayat,
} from "@/data/locationData";

import Header from "../common/Header";
import { setLocationSession } from "@/utils/locationSession";

import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("./LocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#eaf1f4]">
        <div className="text-[10px] font-semibold text-[#075a91]">
          Loading map...
        </div>
      </div>
    ),
  }
);

/* =========================================================
   PROPS
========================================================= */

interface LocationSelectionWorkspaceProps {
  proposalId: string;
}

/* =========================================================
   ROLE TYPE
========================================================= */

type LoginRole =
  | "National Admin"
  | "State Admin"
  | "District Admin"
  | "Block Admin"
  | "Panchayat Admin"
  | "Planner"
  | "STATE"
  | "DISTRICT"
  | "BLOCK"
  | "PANCHAYAT"
  | "State"
  | "District"
  | "Block"
  | "Panchayat"
  | string;

/* =========================================================
   SESSION LOCATION SHAPE

   Different login implementations mein location
   alag shape mein aa sakti hai, isliye intentionally
   flexible rakha gaya hai.
========================================================= */

interface SessionLocationValue {
  id?: string;
  name?: string;
  gpcode?: string;
}

interface AuthSessionLike {
  role?: LoginRole;

  stateName?: string;
  districtName?: string;
  blockName?: string;
  panchayatName?: string;
  panchayatCode?: string;

  state?: SessionLocationValue;
  district?: SessionLocationValue;
  block?: SessionLocationValue;
  panchayat?: SessionLocationValue;

  location?: {
    state?: SessionLocationValue;
    district?: SessionLocationValue;
    block?: SessionLocationValue;
    panchayat?: SessionLocationValue;

    stateName?: string;
    districtName?: string;
    blockName?: string;
    panchayatName?: string;
    panchayatCode?: string;
  };
}

/* =========================================================
   HELPERS
========================================================= */

const normalize = (value?: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getRoleLevel = (
  role?: LoginRole
): LocationLevel => {
  const value = normalize(role);

  if (
    value === "national" ||
    value === "national admin" ||
    value === "nationaladmin"
  ) {
    return "national";
  }

  if (
    value === "state" ||
    value === "state admin" ||
    value === "stateadmin"
  ) {
    return "state";
  }

  if (
    value === "district" ||
    value === "district admin" ||
    value === "districtadmin"
  ) {
    return "district";
  }

  if (
    value === "block" ||
    value === "block admin" ||
    value === "blockadmin"
  ) {
    return "block";
  }

  if (
    value === "panchayat" ||
    value === "panchayat admin" ||
    value === "panchayatadmin" ||
    value === "gram panchayat" ||
    value === "planner"
  ) {
    return "panchayat";
  }

  // Safe default
  return "national";
};

/* =========================================================
   LOCATION SEARCH HELPERS
========================================================= */

function findState(
  value?: SessionLocationValue | string,
): State | null {
  if (!value) {
    return null;
  }

  const id =
    typeof value === "string"
      ? value
      : value.id;

  const name =
    typeof value === "string"
      ? value
      : value.name;

  return (
    locationData.find(
      (state) =>
        normalize(state.id) === normalize(id) ||
        normalize(state.name) === normalize(name) ||
        normalize(state.gisName) === normalize(name)
    ) ?? null
  );
}

function findDistrict(
  state: State | null,
  value?: SessionLocationValue | string,
): District | null {
  if (!state || !value) {
    return null;
  }

  const id =
    typeof value === "string"
      ? value
      : value.id;

  const name =
    typeof value === "string"
      ? value
      : value.name;

  return (
    state.districts.find(
      (district) =>
        normalize(district.id) === normalize(id) ||
        normalize(district.name) === normalize(name)
    ) ?? null
  );
}

function findBlock(
  district: District | null,
  value?: SessionLocationValue | string,
): Block | null {
  if (!district || !value) {
    return null;
  }

  const id =
    typeof value === "string"
      ? value
      : value.id;

  const name =
    typeof value === "string"
      ? value
      : value.name;

  return (
    district.blocks.find(
      (block) =>
        normalize(block.id) === normalize(id) ||
        normalize(block.name) === normalize(name)
    ) ?? null
  );
}

function findPanchayat(
  block: Block | null,
  value?: SessionLocationValue | string,
): Panchayat | null {
  if (!block || !value) {
    return null;
  }

  const id =
    typeof value === "string"
      ? value
      : value.id;

  const name =
    typeof value === "string"
      ? value
      : value.name;

  return (
    block.panchayats.find(
      (panchayat) =>
        normalize(panchayat.id) === normalize(id) ||
        normalize(panchayat.name) === normalize(name) ||
        normalize(panchayat.gpcode) === normalize(id)
    ) ?? null
  );
}

/* =========================================================
   DEFAULT DEMO LOCATION

   Agar login session mein location nahi mili to
   blank screen ki jagah ye default data show hoga.
========================================================= */

function getDefaultLocation() {
  const state =
    locationData.find(
      (item) => item.id === "chhattisgarh"
    ) ?? locationData[0] ?? null;

  if (!state) {
    return {
      state: null,
      district: null,
      block: null,
      panchayat: null,
    };
  }

  const district =
    state.districts.find(
      (item) => item.id === "kanker"
    ) ??
    state.districts[0] ??
    null;

  const block =
    district?.blocks.find(
      (item) => item.id === "kanker-block"
    ) ??
    district?.blocks[0] ??
    null;

  const panchayat =
    block?.panchayats[0] ??
    null;

  return {
    state,
    district,
    block,
    panchayat,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function LocationSelectionWorkspace({
  proposalId,
}: LocationSelectionWorkspaceProps) {
  const router = useRouter();

  /* =======================================================
     SELECTED LOCATION
  ======================================================= */

  const [selectedState, setSelectedState] =
    useState<State | null>(null);

  const [selectedDistrict, setSelectedDistrict] =
    useState<District | null>(null);

  const [selectedBlock, setSelectedBlock] =
    useState<Block | null>(null);

  const [selectedPanchayat, setSelectedPanchayat] =
    useState<Panchayat | null>(null);

  /* =======================================================
     MODAL LEVEL
  ======================================================= */

  const [modalLevel, setModalLevel] =
    useState<LocationLevel>("state");

  const [modalOpen, setModalOpen] =
    useState(true);

  /* =======================================================
     LOGIN ROLE
  ======================================================= */

  const [loginRole, setLoginRole] =
    useState<LoginRole | undefined>(undefined);

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     REFS

     Modal left panel mein hi render ho raha hai,
     refs future positioning / compatibility ke liye.
  ======================================================= */

  const stateFieldRef =
    useRef<HTMLDivElement>(null);

  const districtFieldRef =
    useRef<HTMLDivElement>(null);

  const blockFieldRef =
    useRef<HTMLDivElement>(null);

  const panchayatFieldRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     INITIALIZE FROM LOGIN SESSION
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const initialize = () => {
      try {
        const rawSession =
          getAuthSession() as AuthSessionLike | null;

        if (!rawSession) {
          router.replace(
            `/login?proposalId=${encodeURIComponent(
              proposalId
            )}`
          );

          return;
        }

        if (!mounted) {
          return;
        }

        setLoginRole(rawSession.role);

        /*
         * ---------------------------------------------------
         * SESSION LOCATION
         * ---------------------------------------------------
         */

        const location =
          rawSession.location;

        const stateValue =
          location?.state ??
          (rawSession.stateName
            ? {
              name: rawSession.stateName,
            }
            : undefined);

        const districtValue =
          location?.district ??
          (rawSession.districtName
            ? {
              name: rawSession.districtName,
            }
            : undefined);

        const blockValue =
          location?.block ??
          (rawSession.blockName
            ? {
              name: rawSession.blockName,
            }
            : undefined);

        const panchayatValue =
          location?.panchayat ??
          (rawSession.panchayatName
            ? {
              name: rawSession.panchayatName,
              gpcode:
                rawSession.panchayatCode,
            }
            : undefined);

        /*
         * ---------------------------------------------------
         * FIND LOCATION FROM MASTER DATA
         * ---------------------------------------------------
         */

        let state =
          findState(stateValue);

        let district: District | null =
          null;

        let block: Block | null =
          null;

        let panchayat: Panchayat | null =
          null;

        if (state) {
          district =
            findDistrict(
              state,
              districtValue
            );
        }

        if (district) {
          block =
            findBlock(
              district,
              blockValue
            );
        }

        if (block) {
          panchayat =
            findPanchayat(
              block,
              panchayatValue
            );
        }

        /*
         * ---------------------------------------------------
         * DEFAULT FALLBACK
         *
         * Login session mein data nahi hai to
         * Jharkhand → Ranchi → Kanke use karo.
         * ---------------------------------------------------
         */

        const fallback =
          getDefaultLocation();

        if (!state) {
          state = fallback.state;
        }

        if (!district && state) {
          /*
           * Agar state session se mil gaya lekin district
           * nahi mila to usi state ka default district.
           */

          district =
            state.districts.find(
              (item) =>
                item.id === "ranchi"
            ) ??
            state.districts[0] ??
            null;
        }

        if (!block && district) {
          block =
            district.blocks.find(
              (item) =>
                item.id === "kanke"
            ) ??
            district.blocks[0] ??
            null;
        }

        if (!panchayat && block) {
          panchayat =
            block.panchayats[0] ??
            null;
        }

        /*
         * ---------------------------------------------------
         * ROLE BASED SELECTION
         * ---------------------------------------------------
         */

        const roleLevel =
          getRoleLevel(rawSession.role);

        /*
         * Planner:
         * Location page par aane ki zaroorat nahi.
         */

        if (
          normalize(rawSession.role) ===
          "planner"
        ) {
          router.replace(
            `/proposal/${proposalId}/availability`
          );

          return;
        }



        if (roleLevel === "national") {
          setSelectedState(null);
          setSelectedDistrict(null);
          setSelectedBlock(null);
          setSelectedPanchayat(null);

          setModalLevel("state");
          setModalOpen(true);

          return;
        }

        /*
         * STATE LOGIN
         *
         * State fixed.
         * District choose karega.
         */

        if (roleLevel === "state") {
          setSelectedState(state);

          setSelectedDistrict(null);
          setSelectedBlock(null);
          setSelectedPanchayat(null);

          setModalLevel("district");
          setModalOpen(true);

          return;
        }

        /*
         * DISTRICT LOGIN
         *
         * State + District fixed.
         * Block choose karega.
         */

        if (roleLevel === "district") {
          setSelectedState(state);
          setSelectedDistrict(district);

          setSelectedBlock(null);
          setSelectedPanchayat(null);

          setModalLevel("block");
          setModalOpen(true);

          return;
        }

        /*
         * BLOCK LOGIN
         *
         * State + District + Block fixed.
         * Panchayat choose karega.
         */

        if (roleLevel === "block") {
          setSelectedState(state);
          setSelectedDistrict(district);
          setSelectedBlock(block);

          setSelectedPanchayat(null);

          setModalLevel("panchayat");
          setModalOpen(true);

          return;
        }

        /*
         * PANCHAYAT LOGIN
         *
         * Complete location fixed.
         */

        setSelectedState(state);
        setSelectedDistrict(district);
        setSelectedBlock(block);
        setSelectedPanchayat(panchayat);

        /*
         * Panchayat login mein selection complete hai,
         * isliye modal initially close.
         */

        setModalOpen(false);
      } catch (error) {
        console.error(
          "Location initialization failed:",
          error
        );

        /*
         * Error hone par bhi blank screen nahi.
         * Default data show karo.
         */

        const fallback =
          getDefaultLocation();

        setSelectedState(
          fallback.state
        );

        setSelectedDistrict(
          fallback.district
        );

        setSelectedBlock(
          fallback.block
        );

        setSelectedPanchayat(
          fallback.panchayat
        );

        setModalLevel("district");
        setModalOpen(true);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [proposalId, router]);

  /* =======================================================
     LOCKED LEVELS

     Login jis level ka hai us level aur uske parents
     ko change nahi kar sakta.
  ======================================================= */

  const lockedLevels =
    useMemo<LocationLevel[]>(() => {
      const roleLevel =
        getRoleLevel(loginRole);

      switch (roleLevel) {

        case "national":
          return [];

        case "state":
          return ["state"];

        case "district":
          return [
            "state",
            "district",
          ];

        case "block":
          return [
            "state",
            "district",
            "block",
          ];

        case "panchayat":
          return [
            "state",
            "district",
            "block",
            "panchayat",
          ];

        default:
          return [];
      }
    }, [loginRole]);

  /* =======================================================
     CURRENT MODAL ITEMS
  ======================================================= */

  const currentItems =
    useMemo<LocationItem[]>(() => {
      switch (modalLevel) {
        case "state":
          return locationData;

        case "district":
          return (
            selectedState?.districts ??
            []
          );

        case "block":
          return (
            selectedDistrict?.blocks ??
            []
          );

        case "panchayat":
          return (
            selectedBlock?.panchayats ??
            []
          );

        default:
          return [];
      }
    }, [
      modalLevel,
      selectedState,
      selectedDistrict,
      selectedBlock,
    ]);

  /* =======================================================
     BREADCRUMB
  ======================================================= */

  const breadcrumb =
    useMemo<LocationBreadcrumb[]>(() => {
      const result: LocationBreadcrumb[] =
        [];

      if (selectedState) {
        result.push({
          level: "state",
          label: selectedState.name,
        });
      }

      if (selectedDistrict) {
        result.push({
          level: "district",
          label: selectedDistrict.name,
        });
      }

      if (selectedBlock) {
        result.push({
          level: "block",
          label: selectedBlock.name,
        });
      }

      if (selectedPanchayat) {
        result.push({
          level: "panchayat",
          label: selectedPanchayat.name,
        });
      }

      return result;
    }, [
      selectedState,
      selectedDistrict,
      selectedBlock,
      selectedPanchayat,
    ]);

  /* =======================================================
     HANDLE STATE
  ======================================================= */

  const handleStateSelect = (
    item: LocationItem
  ) => {
    /*
     * Locked state ko change nahi karna.
     */

    if (
      lockedLevels.includes("state")
    ) {
      return;
    }

    const state =
      locationData.find(
        (value) =>
          value.id === item.id
      );

    if (!state) {
      return;
    }

    setSelectedState(state);

    /*
     * State change hone par complete child
     * hierarchy reset.
     */

    setSelectedDistrict(null);
    setSelectedBlock(null);
    setSelectedPanchayat(null);

    setModalLevel("district");
    setModalOpen(true);
  };

  /* =======================================================
     HANDLE DISTRICT
  ======================================================= */

  const handleDistrictSelect = (
    item: LocationItem
  ) => {
    if (
      lockedLevels.includes("district")
    ) {
      return;
    }

    if (!selectedState) {
      return;
    }

    const district =
      selectedState.districts.find(
        (value) =>
          value.id === item.id
      );

    if (!district) {
      return;
    }

    setSelectedDistrict(district);

    /*
     * District change:
     * Block + Panchayat reset.
     */

    setSelectedBlock(null);
    setSelectedPanchayat(null);

    setModalLevel("block");
    setModalOpen(true);
  };

  /* =======================================================
     HANDLE BLOCK
  ======================================================= */

  const handleBlockSelect = (
    item: LocationItem
  ) => {
    if (
      lockedLevels.includes("block")
    ) {
      return;
    }

    if (!selectedDistrict) {
      return;
    }

    const block =
      selectedDistrict.blocks.find(
        (value) =>
          value.id === item.id
      );

    if (!block) {
      return;
    }

    setSelectedBlock(block);

    /*
     * Block change:
     * Panchayat reset.
     */

    setSelectedPanchayat(null);

    setModalLevel("panchayat");
    setModalOpen(true);
  };

  /* =======================================================
     HANDLE PANCHAYAT
  ======================================================= */

  const handlePanchayatSelect = (
    item: LocationItem
  ) => {
    if (
      lockedLevels.includes("panchayat")
    ) {
      return;
    }

    if (!selectedBlock) {
      return;
    }

    const panchayat =
      selectedBlock.panchayats.find(
        (value) =>
          value.id === item.id
      );

    if (!panchayat) {
      return;
    }

    setSelectedPanchayat(
      panchayat
    );

    /*
     * Final selection complete.
     */

    setModalOpen(false);
  };

  /* =======================================================
     GENERIC SELECT
  ======================================================= */

  const handleSelect = (
    item: LocationItem
  ) => {
    switch (modalLevel) {
      case "state":
        handleStateSelect(item);
        break;

      case "district":
        handleDistrictSelect(item);
        break;

      case "block":
        handleBlockSelect(item);
        break;

      case "panchayat":
        handlePanchayatSelect(item);
        break;
    }
  };

  /* =======================================================
     BREADCRUMB CLICK
  ======================================================= */

  const handleBreadcrumbClick = (
    level: LocationLevel
  ) => {
    /*
     * Login fixed location cannot be changed.
     */

    if (
      lockedLevels.includes(level)
    ) {
      return;
    }

    switch (level) {
      case "state":
        setModalLevel("state");
        setModalOpen(true);
        break;

      case "district":
        if (!selectedState) {
          return;
        }

        setModalLevel("district");
        setModalOpen(true);
        break;

      case "block":
        if (!selectedDistrict) {
          return;
        }

        setModalLevel("block");
        setModalOpen(true);
        break;

      case "panchayat":
        if (!selectedBlock) {
          return;
        }

        setModalLevel("panchayat");
        setModalOpen(true);
        break;
    }
  };

  /* =======================================================
     MAP LEVEL
  ======================================================= */

  const mapLevel: LocationLevel =
    selectedPanchayat
      ? "panchayat"
      : selectedBlock
        ? "block"
        : selectedDistrict
          ? "district"
          : selectedState
            ? "state"
            : "national";

  /* =======================================================
     MAP LOCATION
  ======================================================= */

  const mapLocation =
    useMemo(() => {
      if (selectedPanchayat) {
        return {
          latitude:
            selectedPanchayat.latitude,
          longitude:
            selectedPanchayat.longitude,
          zoom: 14,
          label:
            selectedPanchayat.name,
        };
      }

      if (selectedBlock) {
        return {
          latitude:
            selectedBlock.latitude,
          longitude:
            selectedBlock.longitude,
          zoom: 11,
          label:
            selectedBlock.name,
        };
      }

      if (selectedDistrict) {
        return {
          latitude:
            selectedDistrict.latitude,
          longitude:
            selectedDistrict.longitude,
          zoom: 10,
          label:
            selectedDistrict.name,
        };
      }

      if (selectedState) {
        return {
          latitude:
            selectedState.latitude,
          longitude:
            selectedState.longitude,
          zoom: selectedState.zoom,
          label:
            selectedState.name,
        };
      }

      /*
       * India fallback
       */

      return {
        latitude: 22.5937,
        longitude: 78.9629,
        zoom: 5,
        label: "India",
      };
    }, [
      selectedState,
      selectedDistrict,
      selectedBlock,
      selectedPanchayat,
    ]);

  /* =======================================================
     COMPLETE
  ======================================================= */

  const isComplete =
    Boolean(
      selectedState &&
      selectedDistrict &&
      selectedBlock &&
      selectedPanchayat
    );

  /* =======================================================
     SAVE LOCATION
  ======================================================= */

  const handleContinue = () => {
    if (
      !selectedState ||
      !selectedDistrict ||
      !selectedBlock ||
      !selectedPanchayat
    ) {
      return;
    }


    setLocationSession({
      state: selectedState.name,
      district: selectedDistrict.name,
      block: selectedBlock.name,
      panchayat: selectedPanchayat.name,
    });

    /*
     * -----------------------------------------------------
     * AUTH SESSION LOCATION
     * -----------------------------------------------------
     */

    updateAuthLocation({
      stateName:
        selectedState.name,

      districtName:
        selectedDistrict.name,

      blockName:
        selectedBlock.name,

      panchayatName:
        selectedPanchayat.name,

      panchayatCode:
        selectedPanchayat.gpcode,
    });

    /*
     * -----------------------------------------------------
     * PROPOSAL LOCATION SESSION
     * -----------------------------------------------------
     */

    const proposalLocation = {
      proposalId,

      state: {
        id: selectedState.id,
        name: selectedState.name,
      },

      district: {
        id: selectedDistrict.id,
        name: selectedDistrict.name,
      },

      block: {
        id: selectedBlock.id,
        name: selectedBlock.name,
      },

      panchayat: {
        id: selectedPanchayat.id,
        name: selectedPanchayat.name,
        gpcode:
          selectedPanchayat.gpcode,
      },

      updatedAt:
        new Date().toISOString(),
    };

    sessionStorage.setItem(
      `proposal_location_${proposalId}`,
      JSON.stringify(
        proposalLocation
      )
    );

    /*
     * Common key bhi rakho.
     *
     * Stepper ke baaki pages agar proposalId
     * available na hone ki situation mein location
     * read karna chahen to useful rahega.
     */

    sessionStorage.setItem(
      "current_proposal_location",
      JSON.stringify(
        proposalLocation
      )
    );

    /*
     * Continue to Availability.
     */

    router.push(
      `/proposal/${proposalId}/availability`
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="h-screen overflow-hidden bg-[#eef5f8]">
      <Header />

      <div className="flex h-[calc(100vh-88px)] min-h-0 flex-col p-2 sm:p-3 lg:p-4">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[#c7dce8] bg-white shadow-[0_10px_35px_rgba(0,59,99,0.10)]">

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)]">

            {/* =================================================
                LEFT
            ================================================= */}

            <section className="flex min-h-0 flex-col border-b border-[#dce8ef] bg-[#f8fbfd] lg:border-b-0 lg:border-r">


              <header className="relative shrink-0 border-b border-[#dce8ef] bg-white">

                <div className="h-[4px] bg-gradient-to-r from-[#075a91] via-[#087fb8] to-[#f58220]" />

                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">

                  <div>
                    <div className="mb-0.5 text-[7px] font-extrabold uppercase tracking-[1.5px] text-[#f58220]">
                      VGPP GIS PLANNING
                    </div>

                    <h1 className="text-[17px] font-extrabold text-[#003b63] sm:text-[20px]">
                      Select Planning Location
                    </h1>

                    <p className="mt-0.5 text-[8px] text-slate-500 sm:text-[9px]">
                      Select State, District,
                      Block and Gram
                      Panchayat to continue
                      planning.
                    </p>
                  </div>

                  <div className="hidden items-center gap-2 rounded-full border border-[#c9dfea] bg-[#f5fafc] px-3 py-1.5 sm:flex">

                    <MapPin
                      size={12}
                      className="text-[#075a91]"
                    />

                    <span className="text-[7px] font-bold uppercase tracking-wide text-[#075a91]">
                      GIS Location
                      Selection
                    </span>

                  </div>
                </div>
              </header>

              {/* LEFT HEADER */}

              <div className="shrink-0 border-b border-[#dce8ef] bg-white px-4 py-3">

                <div className="text-[7px] font-extrabold uppercase tracking-[1.2px] text-[#f58220]">
                  Planning Hierarchy
                </div>

                <h2 className="mt-0.5 text-[14px] font-extrabold text-[#003b63]">
                  Select Administrative
                  Area
                </h2>

                {/* MAIN BREADCRUMB */}

                <div className="mt-3 overflow-x-auto pb-1">

                  <div className="flex min-w-max items-center gap-1.5">

                    {breadcrumb.length ===
                      0 ? (
                      <div className="rounded-full border border-[#16375b] bg-[#16375b] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.3px] text-white">
                        SELECT LOCATION
                      </div>
                    ) : (
                      breadcrumb.map(
                        (
                          crumb,
                          index
                        ) => {
                          const isLast =
                            index ===
                            breadcrumb.length -
                            1;

                          const locked =
                            lockedLevels.includes(
                              crumb.level
                            );

                          return (
                            <div
                              key={`${crumb.level}-${crumb.label}`}
                              className="flex shrink-0 items-center gap-1.5"
                            >
                              <button
                                type="button"
                                disabled={
                                  locked
                                }
                                onClick={() =>
                                  handleBreadcrumbClick(
                                    crumb.level
                                  )
                                }
                                className={`
                                  rounded-full
                                  border
                                  px-3
                                  py-1.5
                                  text-[8px]
                                  font-bold
                                  uppercase
                                  tracking-[0.3px]
                                  transition
                                  ${isLast
                                    ? "border-[#16375b] bg-[#16375b] text-white shadow-sm"
                                    : locked
                                      ? "cursor-not-allowed border-[#d8e2e9] bg-[#edf2f5] text-[#94a3b8]"
                                      : "border-[#cfdee8] bg-[#edf4f8] text-[#16375b] hover:border-[#075a91] hover:bg-white"
                                  }
                                `}
                              >
                                {
                                  crumb.label
                                }
                              </button>

                              {!isLast && (
                                <ChevronRight
                                  size={
                                    12
                                  }
                                  className="text-[#94a3b8]"
                                />
                              )}
                            </div>
                          );
                        }
                      )
                    )}

                  </div>
                </div>
              </div>

              {/* =================================================
                  LOCATION MODAL / SELECTOR
              ================================================= */}

              <div className="min-h-0 flex-1 overflow-hidden">

                <LocationSelectorModal
                  open={modalOpen}
                  level={modalLevel}
                  items={
                    currentItems
                  }
                  breadcrumb={
                    breadcrumb
                  }
                  loading={
                    loading
                  }
                  lockedLevels={
                    lockedLevels
                  }
                  onSelect={
                    handleSelect
                  }
                  onBreadcrumbClick={
                    handleBreadcrumbClick
                  }
                  onClose={() => {
                    /*
                     * Complete selection ke baad
                     * close allowed.
                     *
                     * Incomplete selection mein bhi
                     * close kar sakte ho.
                     */
                    setModalOpen(
                      false
                    );
                  }}
                />

                {/* =================================================
                    WHEN MODAL CLOSED
                ================================================= */}

                {!modalOpen && (
                  <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f8fa]">

                    {/* Current selection summary */}

                    <div className="shrink-0 border-b border-[#d9e5ec] bg-white px-4 py-3">

                      <div className="text-[8px] font-extrabold uppercase tracking-[1px] text-[#64748b]">
                        Selected Location
                      </div>

                      <div className="mt-1 text-[12px] font-extrabold text-[#003b63]">
                        {selectedPanchayat?.name ||
                          selectedBlock?.name ||
                          selectedDistrict?.name ||
                          selectedState?.name ||
                          "No location selected"}
                      </div>

                    </div>

                    {/* Change location */}

                    <div className="min-h-0 flex-1 overflow-y-auto p-3">

                      <button
                        type="button"
                        onClick={() => {
                          /*
                           * Open the first editable
                           * level.
                           */

                          const firstEditable =
                            lockedLevels.includes(
                              "state"
                            )
                              ? lockedLevels.includes(
                                "district"
                              )
                                ? lockedLevels.includes(
                                  "block"
                                )
                                  ? "panchayat"
                                  : "block"
                                : "district"
                              : "state";

                          setModalLevel(
                            firstEditable
                          );

                          setModalOpen(
                            true
                          );
                        }}
                        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-[6px] border border-[#075a91] bg-white px-4 text-[9px] font-bold text-[#075a91] transition hover:bg-[#f0f7fb]"
                      >
                        <MapPin
                          size={12}
                        />

                        Change Location

                        <ChevronRight
                          size={12}
                        />
                      </button>

                    </div>

                  </div>
                )}

              </div>

              {/* =================================================
                  SELECTED LOCATION
              ================================================= */}

              {selectedState && (
                <div className="shrink-0 border-t border-[#dce8ef] bg-white px-3 py-2">

                  <div className="flex items-center gap-2">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf6fd] text-[#075a91]">
                      <MapPin
                        size={13}
                      />
                    </div>

                    <div className="min-w-0">

                      <div className="truncate text-[9px] font-extrabold text-[#003b63]">
                        {selectedPanchayat?.name ||
                          selectedBlock?.name ||
                          selectedDistrict?.name ||
                          selectedState.name}
                      </div>

                      <div className="truncate text-[7px] text-slate-400">
                        {[
                          selectedState?.name,
                          selectedDistrict?.name,
                          selectedBlock?.name,
                          selectedPanchayat?.name,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(
                            " • "
                          )}
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  CONTINUE
              ================================================= */}

              <div className="shrink-0 border-t border-[#dce8ef] bg-white p-3">

                <button
                  type="button"
                  disabled={
                    !isComplete
                  }
                  onClick={
                    handleContinue
                  }
                  className="flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#075a91] px-4 text-[9px] font-bold text-white shadow-[0_5px_14px_rgba(0,59,99,0.18)] transition hover:bg-[#003b63] disabled:cursor-not-allowed disabled:opacity-40"
                >

                  <Check
                    size={13}
                  />

                  <span>
                    Continue
                    Planning
                  </span>

                  <ChevronRight
                    size={13}
                  />

                </button>

              </div>

            </section>

            {/* =================================================
                RIGHT MAP
            ================================================= */}

            <section className="relative min-h-[360px] min-w-0 flex-1 bg-[#eaf1f4] lg:min-h-0">

              <LocationMap
                latitude={
                  mapLocation.latitude
                }
                longitude={
                  mapLocation.longitude
                }
                zoom={
                  mapLocation.zoom
                }
                label={
                  mapLocation.label
                }
                level={
                  mapLevel
                }
                stateName={
                  selectedState?.name
                }
                districtName={
                  selectedDistrict?.name
                }
                blockName={
                  selectedBlock?.name
                }
                panchayatName={
                  selectedPanchayat?.name
                }
                panchayatCode={
                  selectedPanchayat?.gpcode
                }
              />

              {/* =================================================
                  MAP LEGEND
              ================================================= */}

              <div className="absolute bottom-3 left-3 z-[1000] hidden rounded-lg border border-white/80 bg-white/95 p-2.5 shadow-lg backdrop-blur sm:block">

                <div className="mb-1.5 text-[7px] font-extrabold uppercase tracking-wide text-[#003b63]">
                  Boundaries
                </div>

                <div className="flex items-center gap-2 text-[7px] text-slate-600">
                  <span className="h-2.5 w-5 rounded-sm border-2 border-[#075a91]" />
                  State
                </div>

                <div className="mt-1 flex items-center gap-2 text-[7px] text-slate-600">
                  <span className="h-2.5 w-5 rounded-sm border-2 border-[#f58220]" />
                  District
                </div>

                <div className="mt-1 flex items-center gap-2 text-[7px] text-slate-600">
                  <span className="h-2.5 w-5 rounded-sm border-2 border-[#7c3aed]" />
                  Block
                </div>

                <div className="mt-1 flex items-center gap-2 text-[7px] text-slate-600">
                  <span className="h-2.5 w-5 rounded-sm border-2 border-[#00875a]" />
                  Gram Panchayat
                </div>

              </div>

            </section>

          </div>

        </section>
      </div>
    </main>
  );
}