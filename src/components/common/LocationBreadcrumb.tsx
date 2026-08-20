"use client";

import React, { useEffect, useState } from "react";
import {
  MapPin,
  ChevronRight,
} from "lucide-react";

import {
  DEFAULT_LOCATION,
  getLocationSession,
  SessionLocation,
} from "@/utils/locationSession";

const LocationBreadcrumb = () => {
  const [location, setLocation] =
    useState<SessionLocation>(DEFAULT_LOCATION);

  useEffect(() => {
    const loadLocation = () => {
      setLocation(getLocationSession());
    };

    loadLocation();

    const handleLocationChange = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<SessionLocation>;

      if (customEvent.detail) {
        setLocation(customEvent.detail);
      } else {
        loadLocation();
      }
    };

    window.addEventListener(
      "vgpp-location-change",
      handleLocationChange
    );

    return () => {
      window.removeEventListener(
        "vgpp-location-change",
        handleLocationChange
      );
    };
  }, []);

  const items = [
    {
      label: "State",
      value: location.state,
    },
    {
      label: "District",
      value: location.district,
    },
    {
      label: "Block",
      value: location.block,
    },
    {
      label: "Panchayat",
      value: location.panchayat,
    },
  ];

  return (
    <div className="w-full border-b border-[#d9e5ec] bg-white">
      <div className="mx-auto flex w-full max-w-full items-center px-4 py-1 sm:px-6 lg:px-8">
        
        <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-none">

          {/* Location icon */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#075a91]/10 text-[#075a91]">
            <MapPin size={14} strokeWidth={2.2} />
          </div>

          {items.map((item, index) => (
            <React.Fragment key={item.label}>

              {index > 0 && (
                <ChevronRight
                  size={13}
                  className="shrink-0 text-[#94a3b8]"
                />
              )}

              <div
                className={`
                  flex shrink-0 items-center gap-1.5
                  rounded-full border px-2.5 py-1
                  ${
                    index === 3
                      ? "border-[#075a91] bg-[#075a91] text-white"
                      : "border-[#d5e2eb] bg-[#f8fbfd] text-[#075a91]"
                  }
                `}
              >
                <span className="text-[10px] font-bold whitespace-nowrap">
                  {item.value}
                </span>
              </div>

            </React.Fragment>
          ))}

        </div>
      </div>
    </div>
  );
};

export default LocationBreadcrumb;