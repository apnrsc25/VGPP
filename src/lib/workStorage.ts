import { Work } from "@/types/work";

const STORAGE_KEY = "vgp-availability-works";

export function getStoredWorks(
  defaultWorks: Work[]
): Work[] {
  if (typeof window === "undefined") {
    return defaultWorks;
  }

  try {
    const stored = localStorage.getItem(
      STORAGE_KEY
    );

    if (!stored) {
      return defaultWorks;
    }

    const parsed: Work[] = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : defaultWorks;
  } catch (error) {
    console.error(
      "Failed to read works from storage:",
      error
    );

    return defaultWorks;
  }
}

export function saveWorks(
  works: Work[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(works)
  );
}