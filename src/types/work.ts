export type WorkType = "New" | "Repair";
export type Functionality = "Functional" | "Non-Functional";

export interface WorkLocation {
  lat: number;
  lng: number;
}

export interface Work {
  id: string;
  vgpId: string;
  workName: string;
  count?: number;
  subTheme: string;
  theme: string;
  type: WorkType;
  location?: WorkLocation;
  visibleOnMap?: boolean;
  functionality?: Functionality;
  localWorkName?: string;
}