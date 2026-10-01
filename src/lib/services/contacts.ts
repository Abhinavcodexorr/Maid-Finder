"use client";

import { readJson, writeJson, STORAGE_KEYS } from "@/lib/services/storage";
import { getAllProviders } from "@/data/providers";
import type { ContactViewRecord, Provider } from "@/types/marketplace";

function getAll(): ContactViewRecord[] {
  return readJson<ContactViewRecord[]>(STORAGE_KEYS.contactViews, []);
}

function saveAll(records: ContactViewRecord[]): void {
  writeJson(STORAGE_KEYS.contactViews, records);
}

export function recordContactView(userId: string, providerId: string): void {
  const all = getAll().filter((r) => !(r.userId === userId && r.providerId === providerId));
  all.push({ userId, providerId, viewedAt: new Date().toISOString() });
  saveAll(all);
}

export function getRecentlyViewed(userId: string, limit = 10): (Provider & { viewedAt: string })[] {
  const providers = getAllProviders();
  return getAll()
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
    .slice(0, limit)
    .map((r) => {
      const provider = providers.find((p) => p.id === r.providerId);
      return provider ? { ...provider, viewedAt: r.viewedAt } : null;
    })
    .filter((p): p is Provider & { viewedAt: string } => p !== null);
}
