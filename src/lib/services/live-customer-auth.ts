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
