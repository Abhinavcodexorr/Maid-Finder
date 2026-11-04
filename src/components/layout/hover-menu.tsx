"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  children,
}: {
  label: string;
  href: string;
  active: boolean;
  /** Called each time the panel opens — handy for loading its content lazily. */
  onOpen?: () => void;
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
  const lit = active || open;

  // No `relative` here on purpose: the panel is positioned against the (sticky) header, so it spans the full page width.
  return (
    <div className="flex h-[72px] items-center" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <Link
        href={href}
        onClick={close}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[15px] font-semibold transition-colors xl:px-3.5"
        style={{ color: lit ? "var(--primary)" : "var(--ink)" }}
      >
        {label}
        {lit && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full" style={{ background: "var(--primary)" }} />}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute inset-x-0 top-full z-50 border-b bg-white shadow-[0_24px_40px_-24px_rgba(15,23,42,0.25)]"
            style={{ borderColor: "var(--line)" }}
          >
            <div className="container-page max-h-[calc(100vh-9rem)] overflow-y-auto py-8">{children(close)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Small-caps column heading used inside the mega menus. */
export function MenuHeading({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted)" }}>
      {children}
    </p>
  );
}

/** A menu entry: bold title with a muted one-line description underneath. */
export function MenuItem({
  href,
  title,
  note,
  onClick,
}: {
  href: string;
  title: string;
  note?: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} role="menuitem" onClick={onClick} className="group block py-2.5">
      <span className="block text-[17px] font-semibold leading-snug transition-colors group-hover:text-[var(--primary)]" style={{ color: "var(--ink)" }}>
        {title}
      </span>
      {note && (
        <span className="mt-0.5 block text-[14.5px]" style={{ color: "var(--muted)" }}>
          {note}
        </span>
      )}
    </Link>
  );
}
