"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  registerCustomer,
  loginCustomer,
  getCurrentCustomer,
  logoutCustomer,
  type LiveSignupInput,
} from "@/lib/services/live-customer-auth";
import { getActiveSubscription, getDaysRemaining, isSubscribed as checkSubscribed } from "@/lib/services/subscription";
import type { PublicUser } from "@/lib/services/auth";
import type { Subscription } from "@/types/marketplace";

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  subscription: Subscription | null;
  isSubscribed: boolean;
  daysRemaining: number;
  refresh: () => void;
  login: (identifier: string, password: string) => Promise<PublicUser>;
  signup: (input: LiveSignupInput) => Promise<PublicUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Starts null/loading on both server and first client paint — the server
  // has no localStorage to read, so seeding user state from it during the
  // initial render (even via a lazy useState initializer) would make the
  // client's first paint disagree with the SSR-ed HTML and trigger a
  // hydration mismatch. Synced from localStorage right after mount instead.
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const refresh = useCallback(() => {
    const current = getCurrentCustomer();
    setUser(current);
    setSubscription(current ? getActiveSubscription(current.id) : null);
  }, []);

  useEffect(() => {
    // Intentional one-time sync from an external source (localStorage) that
    // isn't available during SSR, not state derivable from props/state
    // during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setLoading(false);
  }, [refresh]);

  // Real backend only logs in by email (no phone-login support on the
  // customer side yet) — passed straight through either way.
  const login = useCallback(
    async (identifier: string, password: string) => {
      const next = await loginCustomer(identifier, password);
      refresh();
      return next;
    },
    [refresh],
  );

  const signup = useCallback(
    async (input: LiveSignupInput) => {
      const next = await registerCustomer(input);
      refresh();
      return next;
    },
    [refresh],
  );

  const logout = useCallback(() => {
    logoutCustomer();
    refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      subscription,
      isSubscribed: checkSubscribed(user?.id),
      daysRemaining: user ? getDaysRemaining(user.id) : 0,
      refresh,
      login,
      signup,
      logout,
    }),
    [user, loading, subscription, refresh, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
