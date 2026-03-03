"use client";

import { MaidProfile, UserRole } from "@/types";
import { api, apiRoutes } from "@/lib/api-client";

const KEY = "maidfinder_user";
const TOKEN_KEY = "maidfinder_token";

export type AppSession = {
  name: string;
  email: string;
  role: UserRole;
  token?: string;
  maidProfile?: Partial<MaidProfile> & {
    phone?: string;
    whatsapp?: string;
    bio?: string;
  };
};

export function saveSession(
  name: string,
  email: string,
  role: UserRole,
  extras?: {
    token?: string;
    maidProfile?: AppSession["maidProfile"];
  },
) {
  if (typeof window === "undefined") return;
  const payload: AppSession = {
    name,
    email,
    role,
    token: extras?.token,
    maidProfile: extras?.maidProfile,
  };

  localStorage.setItem(KEY, JSON.stringify(payload));
  if (extras?.token) {
    localStorage.setItem(TOKEN_KEY, extras.token);
  }
}

export function getSession(): AppSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AppSession;
    const token = parsed.token || localStorage.getItem(TOKEN_KEY) || undefined;
    return {
      ...parsed,
      token,
    };
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const session = getSession();
  return session?.token || localStorage.getItem(TOKEN_KEY);
}

export function updateSession(patch: Partial<AppSession>) {
  const current = getSession();
  if (!current || typeof window === "undefined") return;
  const next: AppSession = {
    ...current,
    ...patch,
    maidProfile: {
      ...current.maidProfile,
      ...patch.maidProfile,
    },
  };
  localStorage.setItem(
    KEY,
    JSON.stringify(next),
  );
  if (next.token) {
    localStorage.setItem(TOKEN_KEY, next.token);
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export async function syncUserSessionFromBackend(): Promise<boolean> {
  const session = getSession();
  const token = getAuthToken();
  if (!session || session.role !== "customer" || !token) return false;

  try {
    const result = await api.get<{
      success: boolean;
      user?: {
        fullName?: string;
        name?: string;
        email?: string;
      };
      data?: {
        fullName?: string;
        name?: string;
        email?: string;
      };
    }>(apiRoutes.user.me, {
      Authorization: `Bearer ${token}`,
    });

    const user = result?.user || result?.data;
    if (!user) return false;

    updateSession({
      token,
      name: user.fullName || user.name || session.name,
      email: user.email || session.email,
    });
    return true;
  } catch {
    return false;
  }
}

export async function syncMaidSessionFromBackend(): Promise<boolean> {
  const session = getSession();
  const token = getAuthToken();
  if (!session || session.role !== "maid" || !token) return false;

  try {
    const result = await api.get<{
      success: boolean;
      maid?: {
        id?: string;
        _id?: string;
        email?: string;
        fullName?: string;
        nationality?: string;
        emirate?: string;
        visaStatus?: string;
        experienceYears?: number;
        monthlySalaryAed?: number;
        skills?: string[];
        imageUrl?: string;
        phone?: string;
        whatsapp?: string;
        bio?: string;
      };
    }>(apiRoutes.maid.me, {
      Authorization: `Bearer ${token}`,
    });
    const maid = result?.maid || null;
    if (!maid) {
      return false;
    }

    updateSession({
      token,
      name: maid.fullName ?? session.name,
      email: maid.email ?? session.email,
      maidProfile: {
        ...session.maidProfile,
        ...maid,
        id: maid.id ?? maid._id ?? session.maidProfile?.id,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function syncSessionFromBackend(): Promise<boolean> {
  const session = getSession();
  if (!session) return false;
  if (session.role === "maid") return syncMaidSessionFromBackend();
  return syncUserSessionFromBackend();
}

export async function logoutSession(): Promise<void> {
  const token = getAuthToken();
  try {
    if (token) {
      await api.post<{ success: boolean; message: string }>(
        apiRoutes.auth.logout,
        undefined,
        { Authorization: `Bearer ${token}` },
      );
    }
  } catch {
    // Always clear local session even if API logout fails.
  } finally {
    clearSession();
  }
}
