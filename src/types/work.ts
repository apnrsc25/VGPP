export type WorkType =
  | "New"
  | "Repair"
  | "Canals"
  | "Flood/Diversion Channels"
  | "Check Dams"
  | "Gully Plug"
  | "Underground Dyke"
  | "Rejuvenation of Ponds"
  | "Percolation tanks"
  | "Recharge Pits"
  | "Recharge Shafts"
  | "Injection Wells"
  | "Ponds"
  | "Irrigation Well"
  | "Field Water Distribution System"
  | "Reclamation of Comm Waterlogged Land"
  | "Afforestation"
  | "Plantation"
  | "Soil Moisture Conservation"
  | "Rain Water Harvesting Structure"
  | "Roads"
  | "Culverts"
  | "Cross Drainage Structures"
  | "Other Village Connectivity Faciltiies"
  | "GP Bhawan"
  | "Anganwadi Center Building"
  | "Rural Library"
  | "Other Public Buildings"
  | "School Infrastructure"
  | "Kitchen Shed"
  | "Additional Class Rooms"
  | "Laboratories"
  | "Govt. School Compound wall"
  | "Play Ground"
  | "Crematorium"
  | "SLWM"
  | "Toilets"
  | "Stabilising Ponds"
  | "Community Sanitory Complexes"
  | "Waste Segregation and Collection Centres"
  | "Solar Lighting System"
  | "Other Renewable Rural Enegry infrastructure"
  | "Village Parking Areas"
  | "Transport Sheds"
  | "Other Common Rural Amenities"
  | "PMAY House"
  | "State Scheme Houses"
  | "Jal Jeevan Mission"
  | "Skill Development Centres"
  | "Work shed/building for SHG"
  | "Village/Rural Haat"
  | "Food Grain Storage Structure"
  | "Agri Produce Storage Structure"
  | "Cold Storage Unit"
  | "Other Agri-value Chain Infrastructure"
  | "Federation Level Institution"
  | "Compost Structures"
  | "Silvipasture Grasslands"
  | "Dairy Infrastructure"
  | "Livestock shelter"
  | "Fish drying yard"
  | "fisheries-related infrastructure"
  | "Nursery/Plantation"
  | "Building Material"
  | "Processing Unit"
  | "Cyclone Shelter"
  | "Flood Shelters"
  | "Embankment"
  | "Other Disaster-mitigation Works"
  | "Retaining Wal"
  | "Post Disaster Restoration Works"
  | "Windbreak/Shelter Belt Plantation"
  | "Forest Fire Management Works"
  | "Allied Measures - Forest";


export type Functionality = "Functional" | "Non-Functional";

export interface WorkLocation {
  lat: number;
  lng: number;
}

export interface Work {
  id: string;
  vgpId: string;
  workName: string;
  quantity?: number;
  subTheme: string;
  theme: string;
  type: WorkType;
  location?: WorkLocation;
  visibleOnMap?: boolean;
  functionality?: Functionality;
  localWorkName?: string;
  geotagged: boolean;
}