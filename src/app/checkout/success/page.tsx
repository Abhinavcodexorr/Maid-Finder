"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";

function SuccessContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/providers";

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-white"
          style={{ background: "var(--gradient-success)" }}
        >
          <Icon name="check" className="h-10 w-10" strokeWidth={2.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display text-h1">🎉 Payment Successful!</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Your membership is now active. You have full access to contact details for every professional on Help Zone.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href={redirect} className="btn btn-primary btn-lg">
              <Icon name="arrow-right" className="h-4 w-4" />
              Continue Browsing
            </Link>
            <Link href="/dashboard" className="btn btn-outline btn-lg">
              My Dashboard
            </Link>
          </div>

          <div className="mt-8 card text-left">
            <h3 className="text-sm font-semibold mb-3">What you can do now:</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--ink-light)" }}>
              <li className="flex items-center gap-2"><Icon name="phone" className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} /> View phone numbers</li>
              <li className="flex items-center gap-2"><Icon name="mail" className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} /> Access email addresses</li>
              <li className="flex items-center gap-2"><Icon name="chat" className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} /> Contact via WhatsApp</li>
              <li className="flex items-center gap-2"><Icon name="tag" className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} /> See exact pricing</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
