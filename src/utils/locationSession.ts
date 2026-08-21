export interface SessionLocation {
  state: string;
  district: string;
  block: string;
  panchayat: string;
}

export const DEFAULT_LOCATION: SessionLocation = {
  state: "Chhattisgarh",
  district: "Uttar Bastar",
  block: "Kanker",
  panchayat: "Sureli",
};

const STORAGE_KEY = "vgpp_location";

export function getLocationSession(): SessionLocation {
  if (typeof window === "undefined") {
    return DEFAULT_LOCATION;
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_LOCATION)
      );

      return DEFAULT_LOCATION;
    }

    return {
      ...DEFAULT_LOCATION,
      ...JSON.parse(stored),
    };
  } catch {
    return DEFAULT_LOCATION;
  }
}

export function setLocationSession(
  location: Partial<SessionLocation>
) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getLocationSession();

  const updated: SessionLocation = {
    ...current,
    ...location,
  };

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  // Same-tab components ko update karne ke liye
  window.dispatchEvent(
    new CustomEvent("vgpp-location-change", {
      detail: updated,
    })
  );
}

export function clearLocationSession() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(
    new CustomEvent("vgpp-location-change", {
      detail: DEFAULT_LOCATION,
    })
  );
}