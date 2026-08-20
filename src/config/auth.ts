import type { UserRole } from "./userConfig";

export const AUTH_STORAGE_KEY = "vgpp_auth";

export interface AuthLocation {
  stateName?: string;
  districtName?: string;
  blockName?: string;
  panchayatName?: string;
  panchayatCode?: string;
}

export interface AuthSession {
  email: string;
  role: UserRole;
  location?: AuthLocation;
}

export const setAuthSession = (
  session: AuthSession
): void => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(session)
  );
};

export const getAuthSession = (): AuthSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = sessionStorage.getItem(
    AUTH_STORAGE_KEY
  );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    return null;
  }
};

export const updateAuthLocation = (
  location: AuthLocation
): void => {
  const session = getAuthSession();

  if (!session) {
    return;
  }

  setAuthSession({
    ...session,
    location,
  });
};

export const clearAuthSession = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(
    AUTH_STORAGE_KEY
  );
};