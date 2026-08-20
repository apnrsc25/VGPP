export type UserRole =
  | "Planner"
  | "Approver"
  | "State Admin"
  | "District Admin"
  | "Block Admin";

export const CURRENT_USER_ROLE: UserRole = "Block Admin";

/**
 * Demo login credentials
 *
 * IMPORTANT:
 * Ye abhi frontend demo/mock authentication hai.
 * Production me credentials backend/API se validate hone chahiye.
 */

interface LoginUser {
  email: string;
  password: string;
  role: UserRole;
}

export const USERS: LoginUser[] = [
  {
    email: "panchayat@gmail.com",
    password: "123456",
    role: "Planner",
  },
  {
    email: "state@gmail.com",
    password: "123456",
    role: "State Admin",
  },
  {
    email: "district@gmail.com",
    password: "123456",
    role: "District Admin",
  },
  {
    email: "block@gmail.com",
    password: "123456",
    role: "Block Admin",
  },
];