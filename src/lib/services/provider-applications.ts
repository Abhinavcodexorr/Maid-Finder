"use client";

import { readJson, writeJson, STORAGE_KEYS } from "@/lib/services/storage";
import type { ProviderApplication } from "@/types/marketplace";

export type ProviderApplicationInput = Omit<ProviderApplication, "id" | "status" | "submittedAt">;

function getAll(): ProviderApplication[] {
  return readJson<ProviderApplication[]>(STORAGE_KEYS.providerApplications, []);
}

function saveAll(applications: ProviderApplication[]): void {
  writeJson(STORAGE_KEYS.providerApplications, applications);
}

export function providerApplicationEmailExists(email: string): boolean {
  return getAll().some((a) => a.email.toLowerCase() === email.trim().toLowerCase());
}

export function submitProviderApplication(input: ProviderApplicationInput): ProviderApplication {
  if (providerApplicationEmailExists(input.email)) {
    throw new Error("An application with this email already exists.");
  }

  const application: ProviderApplication = {
    ...input,
    id: `provider-app-${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  saveAll([...getAll(), application]);
  return application;
}
