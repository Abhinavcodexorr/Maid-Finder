"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";

const MESSAGES = [
  { text: "100% ID-verified professionals", href: "/how-it-works", cta: "How it works" },
  { text: "0% commission — no agency fees", href: "/membership", cta: "See membership" },
  { text: "Free to browse — register in a minute", href: "/signup", cta: "Register free" },
  { text: "Maid, cook or skilled pro? Join free", href: "/register-provider", cta: "Join as professional" },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4500);
    return () => clearInterval(id);
  }, []);

  const msg = MESSAGES[index];

  return (
    <div className="text-white" style={{ background: "var(--gradient-dark)" }}>
      <div className="container-page flex h-9 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex min-w-0 items-center gap-3 text-[12.5px] font-medium"
          >
            <Icon name="check" className="hidden h-3.5 w-3.5 shrink-0 sm:block" style={{ color: "#93b4ff" }} />
            <span className="truncate text-white/90">{msg.text}</span>
            <Link
              href={msg.href}
              className="hidden shrink-0 font-semibold underline underline-offset-2 transition-colors hover:text-[#93b4ff] md:inline"
            >
              {msg.cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
