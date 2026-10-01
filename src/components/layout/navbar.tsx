"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Find Professionals", href: "/providers" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Membership", href: "/membership" },
];

const AUTH_NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Find Professionals", href: "/providers" },
  { label: "Saved", href: "/dashboard/saved" },
];

const PROFILE_LINKS = [
  { label: "My Dashboard", href: "/dashboard", icon: "grid" },
  { label: "My Profile", href: "/dashboard/profile", icon: "user" },
  { label: "Saved Professionals", href: "/dashboard/saved", icon: "heart" },
  { label: "Membership", href: "/dashboard/membership", icon: "award" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSubscribed, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const onLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  const navLinks = user ? AUTH_NAV_LINKS : NAV_LINKS;

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-xl"
        style={{ borderColor: "var(--line)" }}
      >
        <nav className="container-page flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo size={32} wordmarkClassName="text-lg" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    color: active ? "var(--primary)" : "var(--ink-light)",
                  }}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full"
                      style={{ background: "var(--primary)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Subscription badge */}
            {isSubscribed && (
              <span className="pill pill-success hidden sm:inline-flex">
                <Icon name="check" className="h-3 w-3" /> Active
              </span>
            )}

            {user ? (
              <>
                {/* Notifications bell */}
                <button
                  type="button"
                  className="relative hidden rounded-lg p-2 transition-colors hover:bg-[var(--line-light)] md:block"
                  aria-label="Notifications"
                >
                  <Icon name="bell" className="h-5 w-5" style={{ color: "var(--muted)" }} />
                </button>

                {/* Profile dropdown */}
                <div className="relative hidden md:block" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 transition-colors hover:bg-[var(--line-light)]"
                    aria-label="Profile menu"
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                    <Icon
                      name="chevron-down"
                      className="h-3.5 w-3.5 transition-transform"
                      style={{
                        color: "var(--muted)",
                        transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-lg"
                        style={{ borderColor: "var(--line)" }}
                      >
                        <div className="border-b px-4 py-3" style={{ borderColor: "var(--line)" }}>
                          <p className="truncate text-sm font-semibold">{user.firstName} {user.lastName}</p>
                          <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{user.email}</p>
                        </div>
                        {PROFILE_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--line-light)]"
                          >
                            <Icon name={link.icon} className="h-4 w-4" style={{ color: "var(--muted)" }} />
                            {link.label}
                          </Link>
                        ))}
                        <div className="border-t" style={{ borderColor: "var(--line)" }}>
                          <button
                            type="button"
                            onClick={onLogout}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--error-soft)]"
                            style={{ color: "var(--error)" }}
                          >
                            <Icon name="log-out" className="h-4 w-4" />
                            Log out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login" className="btn btn-ghost text-sm">
                  Log in
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 transition-colors hover:bg-[var(--line-light)] md:hidden"
              aria-label="Open menu"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-[300px] max-w-[85vw] flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--line)" }}>
                <Logo size={28} wordmarkClassName="text-base" />
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <Icon name="x" className="h-5 w-5" style={{ color: "var(--muted)" }} />
                </button>
              </div>

              {user && (
                <div className="border-b px-5 py-4" style={{ borderColor: "var(--line)", background: "var(--line-light)" }}>
                  <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{user.email}</p>
                  {isSubscribed && (
                    <span className="pill pill-success mt-2">
                      <Icon name="check" className="h-3 w-3" /> Membership Active
                    </span>
                  )}
                </div>
              )}

              <nav className="flex-1 overflow-y-auto py-2">
                {navLinks.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-5 py-3 text-sm font-medium transition-colors"
                      style={{
                        color: active ? "var(--primary)" : "var(--ink)",
                        background: active ? "var(--primary-soft)" : "transparent",
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {user && (
                  <>
                    <hr className="my-2" style={{ borderColor: "var(--line)" }} />
                    {PROFILE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-[var(--line-light)]"
                      >
                        <Icon name={link.icon} className="h-4 w-4" style={{ color: "var(--muted)" }} />
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}
              </nav>

              <div className="border-t p-4" style={{ borderColor: "var(--line)" }}>
                {user ? (
                  <button type="button" onClick={onLogout} className="btn btn-outline w-full" style={{ color: "var(--error)", borderColor: "var(--error)" }}>
                    <Icon name="log-out" className="h-4 w-4" /> Log out
                  </button>
                ) : (
                  <div className="grid gap-2">
                    <Link href="/signup" className="btn btn-primary w-full">Get Started</Link>
                    <Link href="/login" className="btn btn-outline w-full">Log in</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
