"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/icon";

const DASHBOARD_NAV = [
  { label: "Overview", href: "/dashboard", icon: "grid", exact: true },
  { label: "Saved Helpers", href: "/dashboard/saved", icon: "heart" },
  { label: "Recently Viewed", href: "/dashboard/recent", icon: "clock" },
  { label: "Membership & Plan", href: "/dashboard/membership", icon: "award" },
  { label: "Profile Details", href: "/dashboard/profile", icon: "user" },
  { label: "Account Settings", href: "/dashboard/settings", icon: "settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isSubscribed, daysRemaining, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" style={{ color: "var(--primary)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--surface-muted)] py-8 md:py-12">
      <div className="container-page">
        {/* Mobile Header / Quick Profile */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm border border-[var(--line)] md:hidden">
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
              style={{ background: "var(--gradient-primary)" }}
            >
              {user.firstName[0]}{user.lastName[0]}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-bold" style={{ color: "var(--ink)" }}>
                {user.firstName} {user.lastName}
              </h2>
              <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{user.email}</p>
            </div>
            {isSubscribed ? (
              <span className="pill pill-success text-xs font-semibold">
                <Icon name="check" className="h-3 w-3" /> {daysRemaining}d left
              </span>
            ) : (
              <Link href="/membership" className="btn btn-primary btn-sm text-xs">
                Upgrade
              </Link>
            )}
          </div>

          {/* Mobile horizontal scrolling nav */}
          <div className="no-scrollbar -mx-2 flex gap-1.5 overflow-x-auto px-2 pt-2 border-t border-[var(--line-light)]">
            {DASHBOARD_NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    active
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  <Icon name={item.icon} className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Layout: Sidebar + Main Content */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* User Profile Card */}
              <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-sm" style={{ color: "var(--ink)" }}>
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{user.email}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl p-3" style={{ background: isSubscribed ? "var(--success-soft)" : "var(--primary-soft)" }}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span style={{ color: isSubscribed ? "var(--success)" : "var(--primary)" }}>
                      {isSubscribed ? "Active Membership" : "Free Plan"}
                    </span>
                    {isSubscribed ? (
                      <span className="font-bold" style={{ color: "var(--success)" }}>
                        {daysRemaining} days left
                      </span>
                    ) : (
                      <Link href="/membership" className="underline font-bold" style={{ color: "var(--primary)" }}>
                        Unlock Access
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="rounded-2xl border border-[var(--line)] bg-white p-2.5 shadow-sm space-y-1">
                {DASHBOARD_NAV.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-[var(--primary)] text-white shadow-sm font-semibold"
                          : "text-[var(--ink-secondary)] hover:bg-[var(--line-light)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <Icon
                        name={item.icon}
                        className="h-4 w-4"
                        style={{ color: active ? "white" : "var(--muted)" }}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-2 mt-2 border-t border-[var(--line-light)]">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--error)] transition-colors hover:bg-[var(--error-soft)]"
                  >
                    <Icon name="log-out" className="h-4 w-4" style={{ color: "var(--error)" }} />
                    <span>Log Out</span>
                  </button>
                </div>
              </nav>

              {/* Upgrade Banner for unsubscribed users */}
              {!isSubscribed && (
                <div
                  className="rounded-2xl p-5 text-white shadow-sm relative overflow-hidden"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <div className="relative z-10 space-y-2.5">
                    <span className="inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase">
                      Direct Hiring
                    </span>
                    <h4 className="font-display font-bold text-base leading-snug">
                      Unlock Phone Numbers & WhatsApp
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Connect directly with all verified maids, cooks, and nannies. 0% commission.
                    </p>
                    <Link
                      href="/membership"
                      className="mt-2 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-bold text-[var(--primary)] transition-transform hover:scale-[1.02] shadow-sm"
                    >
                      View Plans from ₹499
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main content body */}
          <main className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
