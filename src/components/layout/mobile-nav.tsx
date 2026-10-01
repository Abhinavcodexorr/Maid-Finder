"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/icon";

const GUEST_TABS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Search", href: "/providers", icon: "search" },
  { label: "Services", href: "/services", icon: "grid" },
  { label: "Log in", href: "/login", icon: "user" },
];

const AUTH_TABS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Search", href: "/providers", icon: "search" },
  { label: "Saved", href: "/dashboard/saved", icon: "heart" },
  { label: "Account", href: "/dashboard", icon: "user" },
];

// Pages where mobile nav should be hidden
const HIDDEN_ON = ["/login", "/signup", "/forgot-password", "/onboarding", "/checkout"];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const shouldHide = HIDDEN_ON.some((p) => pathname.startsWith(p));
  if (shouldHide) return null;

  const tabs = user ? AUTH_TABS : GUEST_TABS;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur-xl md:hidden"
      style={{ borderColor: "var(--line)" }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-md items-stretch">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2 pt-2.5 text-center transition-colors"
              style={{ color: active ? "var(--primary)" : "var(--faint)" }}
            >
              {active && (
                <span
                  className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
              )}
              <Icon name={tab.icon} className="h-5 w-5" strokeWidth={active ? 2.2 : 1.6} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
