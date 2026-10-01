import type { MockUser } from "@/types/marketplace";

// Demo accounts for the clickable prototype. Passwords are plain text because
// this is a frontend-only mock with no backend to hash against — never do
// this in a real build.
export const MOCK_USERS: MockUser[] = [
  {
    id: "user-demo",
    firstName: "Demo",
    lastName: "User",
    email: "demo@helpzone.in",
    phone: "+91 98765 43210",
    password: "Demo@1234",
    role: "user",
    lookingFor: ["cat-maid", "cat-cook"],
    preferredArea: "Dwarka",
    requirementType: "part-time",
    onboardingDismissed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "user-admin",
    firstName: "Help Zone",
    lastName: "Admin",
    email: "admin@helpzone.in",
    phone: "+91 90000 00000",
    password: "Admin@1234",
    role: "admin",
    lookingFor: [],
    onboardingDismissed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
  },
];
