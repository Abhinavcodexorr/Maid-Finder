"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/lib/mock-data";
import clsx from "clsx";
import { getSession, logoutSession, syncSessionFromBackend } from "@/lib/auth-mock";
import { useEffect, useState } from "react";
import type { UserRole } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signedInRole, setSignedInRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = getSession();
      if (session?.role) {
        const ok = await syncSessionFromBackend();
        if (!ok) {
          setSignedInRole(null);
          return;
        }
        setSignedInRole(session.role);
        return;
      }
      setSignedInRole(null);
    };

    void checkSession();
  }, [pathname]);

  const onLogout = async () => {
    await logoutSession();
    setSignedInRole(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-extrabold text-brand">
          MaidFinder
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-semibold transition hover:text-brand",
                pathname === item.href ? "text-brand" : "text-slate-700",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {signedInRole ? (
          <div className="flex items-center gap-2">
            {signedInRole === "maid" ? (
              <Link href="/profile/edit" className="btn btn-soft">
                Edit Profile
              </Link>
            ) : (
              <Link href="/profile/dashboard" className="btn btn-soft">
                Dashboard
              </Link>
            )}
            <button className="btn btn-primary" type="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/maid-login" className="btn btn-soft">
              Maid Login
            </Link>
            <Link href="/login" className="btn btn-primary">
              Customer Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
