"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { fetchCatalogServices } from "@/lib/services";
import type { CatalogService } from "@/lib/services";
import { emojiForService } from "@/lib/service-emoji";

/** How long the menu stays open after the pointer leaves, so moving onto it never closes it. */
const CLOSE_DELAY_MS = 150;

/**
 * "Services" nav item: clicking it goes to the services page, and hovering
 * (or keyboard focus) opens a panel listing every service from the catalog —
 * each one links to that service's professionals.
 */
export function ServicesMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<CatalogService[] | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCatalogServices()
      .then((list) => { if (!cancelled) setServices(list); })
      .catch(() => { if (!cancelled) setServices([]); });
    return () => { cancelled = true; };
  }, []);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <Link
        href="/services"
        onClick={() => setOpen(false)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        style={{ color: active || open ? "var(--primary)" : "var(--ink-light)" }}
      >
        Services
        <Icon name="chevron-down" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-50 w-[min(560px,90vw)] pt-3"
          >
            <div className="rounded-3xl border bg-white p-3 shadow-2xl" style={{ borderColor: "var(--line)" }}>
              {services === null && <p className="p-4 text-sm" style={{ color: "var(--muted)" }}>Loading services…</p>}
              {services !== null && services.length === 0 && (
                <p className="p-4 text-sm" style={{ color: "var(--muted)" }}>Services are unavailable right now.</p>
              )}

              <div className="grid max-h-[22rem] grid-cols-2 gap-1 overflow-y-auto">
                {(services ?? []).map((svc) => (
                  <Link
                    key={svc.key}
                    href={`/providers?category=${svc.key}`}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-2xl p-2.5 text-sm font-semibold transition-colors hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--line-light)] text-lg">
                      {svc.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={svc.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        emojiForService(svc.name)
                      )}
                    </span>
                    {svc.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/services"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
              >
                View all services
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
