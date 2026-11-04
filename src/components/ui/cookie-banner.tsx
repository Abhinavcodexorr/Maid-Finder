"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "helpzone-cookie-consent";

/** Small consent card: "Accept all" or "Essential only". The choice is remembered in this browser. */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (!localStorage.getItem(KEY)) setVisible(true);
      } catch {
        setVisible(true);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const choose = (value: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, value);
    } catch { /* storage blocked — the banner simply returns next visit */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-20 left-4 right-4 z-[55] rounded-3xl border bg-white p-5 shadow-2xl sm:left-6 sm:right-auto sm:max-w-sm lg:bottom-6"
      style={{ borderColor: "var(--line)" }}
    >
      <p className="font-display text-base font-extrabold">We use cookies</p>
      <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
        Essential cookies keep you signed in and your shortlist working. Others help us improve the site. See our{" "}
        <Link href="/privacy" className="font-semibold underline" style={{ color: "var(--primary)" }}>Privacy Policy</Link>.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button type="button" onClick={() => choose("essential")} className="btn btn-outline btn-sm !rounded-full">Essential only</button>
        <button type="button" onClick={() => choose("all")} className="btn btn-primary btn-sm !rounded-full">Accept all</button>
      </div>
    </div>
  );
}
