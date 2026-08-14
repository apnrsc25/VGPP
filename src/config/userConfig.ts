export type UserRole =
  | "Planner"
  | "Approver"
  | "State Admin"
  | "District Admin"
  | "Block Admin";

export const CURRENT_USER_ROLE: UserRole =
  "Block Admin";