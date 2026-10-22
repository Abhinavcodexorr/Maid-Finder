"use client";

// Bridges the real Maid Finder BE customer (user) API into the frontend's
// existing PublicUser shape, so AuthContext and every page that already
// reads `user` from useAuth() keep working unchanged.

import { ApiError } from "@/lib/api-client";
import { readJson, writeJson, removeKey, STORAGE_KEYS } from "@/lib/services/storage";
import type { PublicUser } from "@/lib/services/auth";

interface ApiCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  emirate?: string;
  address?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: ApiCustomer;
}

function mapApiCustomerToPublicUser(raw: ApiCustomer): PublicUser {
  const [firstName, ...rest] = (raw.name || "Customer").trim().split(/\s+/);
  return {
    id: raw.id,
    firstName: firstName || "Customer",
    lastName: rest.join(" "),
    email: raw.email,
    phone: raw.phone || "",
    role: "user",
    lookingFor: [],
    preferredArea: raw.emirate || raw.address || undefined,
    onboardingDismissed: false,
    createdAt: new Date().toISOString(),
  };
}

async function postJson(path: string, body: unknown): Promise<AuthResponse> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(data?.message || `Request failed with status ${response.status}`, response.status, data);
  }
  return data as AuthResponse;
}

function persist(result: AuthResponse): PublicUser {
  const user = mapApiCustomerToPublicUser(result.user);
  writeJson(STORAGE_KEYS.customerToken, result.token);
  writeJson(STORAGE_KEYS.customerUser, user);
  return user;
}

export interface LiveSignupInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export async function registerCustomer(input: LiveSignupInput): Promise<PublicUser> {
  const result = await postJson("/api/customers/register", {
    name: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    password: input.password,
  });
  return persist(result);
}

/** Saves the customer's location and interests on the real backend (shown in the admin panel). Best effort. */
export async function saveLiveCustomerProfile(profile: {
  city?: string;
  state?: string;
  lookingFor?: string[];
  requirementType?: string;
}): Promise<void> {
  const token = getCustomerToken();
  if (!token) return;
  await fetch("/api/customers/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(profile),
  }).catch(() => undefined);
}

export async function loginCustomer(email: string, password: string): Promise<PublicUser> {
  const result = await postJson("/api/customers/login", {
    email: email.trim().toLowerCase(),
    password,
  });
  return persist(result);
}

export function getCurrentCustomer(): PublicUser | null {
  return readJson<PublicUser | null>(STORAGE_KEYS.customerUser, null);
}

export function getCustomerToken(): string | null {
  return readJson<string | null>(STORAGE_KEYS.customerToken, null);
}

export function logoutCustomer(): void {
  removeKey(STORAGE_KEYS.customerToken);
  removeKey(STORAGE_KEYS.customerUser);
}

/**
 * Checks the stored session against the real backend (GET /api/v1/user/me).
 * Returns false — and clears the stale session — only on an explicit 401
 * (invalid/expired token, or the account was deleted/deactivated: the
 * backend returns 401 for all of these). Anything else — a network
 * failure, a 404/502 from a backend route that isn't deployed yet, a
 * transient 500 — is treated as "can't tell", not as a reason to log
 * someone out: that distinction also matters structurally, since the
 * caller reacts to `false` by refreshing user state, and a route that's
 * simply unreachable would never stop returning `false`, so treating it
 * the same as a real 401 would retry forever instead of giving up once.
 */
export async function verifyCustomerSession(): Promise<boolean> {
  const token = getCustomerToken();
  if (!token) return false;
  try {
    const response = await fetch("/api/customers/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (response.status === 401) {
      logoutCustomer();
      return false;
    }
    return true;
  } catch {
    return true;
  }
}
