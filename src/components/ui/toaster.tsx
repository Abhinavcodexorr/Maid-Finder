"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";

type ToastVariant = "success" | "error" | "info";
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

let listeners: ((toasts: ToastItem[]) => void)[] = [];
let toasts: ToastItem[] = [];
let nextId = 1;

function emit() {
  listeners.forEach((l) => l(toasts));
}

export function toast(params: { title: string; description?: string; variant?: ToastVariant }) {
  const item: ToastItem = { id: nextId++, title: params.title, description: params.description, variant: params.variant ?? "info" };
  toasts = [...toasts, item];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== item.id);
    emit();
  }, 3800);
}

const VARIANT_STYLE: Record<ToastVariant, { bg: string; fg: string; icon: string }> = {
  success: { bg: "var(--confirmed-soft)", fg: "var(--confirmed)", icon: "check" },
  error: { bg: "var(--cancel-soft)", fg: "var(--cancel)", icon: "lock" },
  info: { bg: "var(--accent-soft)", fg: "var(--accent-dark)", icon: "shield" },
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((l) => l !== setItems);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
      <AnimatePresence>
        {items.map((t) => {
          const style = VARIANT_STYLE[t.variant];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-[var(--line)] bg-white p-4 shadow-lg"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: style.bg, color: style.fg }}>
                <Icon name={style.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--ink)]">{t.title}</p>
                {t.description ? <p className="mt-0.5 text-xs text-[var(--muted)]">{t.description}</p> : null}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
