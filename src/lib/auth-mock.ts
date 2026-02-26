"use client";

import { UserRole } from "@/types";

const KEY = "maidfinder_user";

export function saveSession(name: string, email: string, role: UserRole) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    KEY,
    JSON.stringify({
      name,
      email,
      role,
    }),
  );
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
