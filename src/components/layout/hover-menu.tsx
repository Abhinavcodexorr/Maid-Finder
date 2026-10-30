"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";

/** How long the menu stays open after the pointer leaves, so moving onto it never closes it. */
const CLOSE_DELAY_MS = 150;

/**
 * A nav item that is a normal link, but also opens a panel on hover or
 * keyboard focus. `children` renders the panel and gets a `close` function
 * to call when something inside is chosen.
 */
export function HoverMenu({
  label,
  href,
  active,
  onOpen,
  width = "min(560px,90vw)",
  align = "left",
  children,
}: {
  label: string;
  href: string;
  active: boolean;
  /** Called each time the panel opens — handy for loading its content lazily. */
  onOpen?: () => void;
  /** CSS width of the panel; wider menus pass their own. */
  width?: string;
  /** Which edge of the nav item the panel lines up with. */
  align?: "left" | "right";
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!open) onOpen?.();
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
  const close = () => setOpen(false);

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <Link
        href={href}
        onClick={close}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium transition-colors xl:px-3"
        style={{ color: active || open ? "var(--primary)" : "var(--ink-light)" }}
      >
        {label}
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
            className={`absolute top-full z-50 pt-3 ${align === "right" ? "right-0" : "left-0"}`}
            style={{ width }}
          >
            <div className="rounded-3xl border bg-white p-3 shadow-2xl" style={{ borderColor: "var(--line)" }}>
              {children(close)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
