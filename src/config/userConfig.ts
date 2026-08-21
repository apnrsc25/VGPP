export type UserRole =
  | "National Admin"
  | "Planner"
  | "Approver"
  | "State Admin"
  | "District Admin"
  | "Block Admin"
  | "Panchayat Admin";

export const CURRENT_USER_ROLE: UserRole = "National Admin";

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
  // ============================================
  // NATIONAL ADMIN
  // India → State → District → Block → Panchayat
  // ============================================
  {
    email: "national@gmail.com",
    password: "123456",
    role: "National Admin",
  },

  // ============================================
  // PLANNER
  // ============================================
  {
    email: "panchayat@gmail.com",
    password: "123456",
    role: "Planner",
  },

  // ============================================
  // APPROVER
  // ============================================
  {
    email: "approver@gmail.com",
    password: "123456",
    role: "Approver",
  },

  // ============================================
  // STATE ADMIN
  // Jharkhand → District → Block → Panchayat
  // ============================================
  {
    email: "state@gmail.com",
    password: "123456",
    role: "State Admin",
  },

  // ============================================
  // DISTRICT ADMIN
  // Jharkhand → Ranchi → Block → Panchayat
  // ============================================
  {
    email: "district@gmail.com",
    password: "123456",
    role: "District Admin",
  },

  // ============================================
  // BLOCK ADMIN
  // Jharkhand → Ranchi → Kanke → Panchayat
  // ============================================
  {
    email: "block@gmail.com",
    password: "123456",
    role: "Block Admin",
  },

  // ============================================
  // PANCHAYAT ADMIN
  // Jharkhand → Ranchi → Kanke → Panchayat
  // ============================================
  {
    email: "panchayat-admin@gmail.com",
    password: "123456",
    role: "Panchayat Admin",
  },
];