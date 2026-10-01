"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/lib/services/auth";
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
  login: (identifier: string, password: string) => PublicUser;
  signup: (input: authService.SignupInput) => PublicUser;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const refresh = useCallback(() => {
    const current = authService.getCurrentUser();
    setUser(current);
    setSubscription(current ? getActiveSubscription(current.id) : null);
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const login = useCallback(
    (identifier: string, password: string) => {
      const next = authService.login(identifier, password);
      refresh();
      return next;
    },
    [refresh],
  );

  const signup = useCallback(
    (input: authService.SignupInput) => {
      const next = authService.signup(input);
      refresh();
      return next;
    },
    [refresh],
  );

  const logout = useCallback(() => {
    authService.logout();
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
