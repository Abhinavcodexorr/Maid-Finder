"use client";

import { readJson, writeJson, STORAGE_KEYS } from "@/lib/services/storage";
import { getAllProviders } from "@/data/providers";
import type { Provider } from "@/types/marketplace";

type SavedMap = Record<string, string[]>; // userId -> providerIds

function getAll(): SavedMap {
  return readJson<SavedMap>(STORAGE_KEYS.saved, {});
}

function saveAll(map: SavedMap): void {
  writeJson(STORAGE_KEYS.saved, map);
}

export function isSaved(userId: string, providerId: string): boolean {
  return (getAll()[userId] ?? []).includes(providerId);
}

export function toggleSaved(userId: string, providerId: string): boolean {
  const map = getAll();
  const current = map[userId] ?? [];
  const next = current.includes(providerId) ? current.filter((id) => id !== providerId) : [...current, providerId];
  map[userId] = next;
  saveAll(map);
  return next.includes(providerId);
}

export function getSavedProviderIds(userId: string): string[] {
  return getAll()[userId] ?? [];
}

export function getSavedProviders(userId: string): Provider[] {
  const ids = new Set(getSavedProviderIds(userId));
  return getAllProviders().filter((p) => ids.has(p.id));
}
