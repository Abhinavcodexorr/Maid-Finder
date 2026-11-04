"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/icon";
import { AuthShell } from "@/components/layout/auth-shell";
import { toast } from "@/components/ui/toaster";

const enter = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(identifier.trim())) {
      setError("Enter the email address you signed up with.");
      return;
    }
    setSubmitting(true);
    try {
      await login(identifier, password);
      toast({ title: "Welcome back!", variant: "success" });
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      footer={
        <p className="mt-5 text-center text-xs" style={{ color: "var(--muted)" }}>
          Are you a provider?{" "}
          <Link href="/register-provider" className="font-semibold" style={{ color: "var(--primary)" }}>
            Register here
          </Link>
        </p>
      }
    >
      <motion.div {...enter(0)}>
          <h1 className="font-display text-h1">Log in</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Log in to unlock contact details and start your search.
          </p>

          <form className="mt-8" onSubmit={onSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="login-id">
                Email address
              </label>
              <div className="relative">
                <Icon name="mail" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--faint)" }} />
                <input
                  id="login-id"
                  className="field !rounded-full !py-4 !text-base !pl-11"
                  placeholder="you@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="email"
                  type="email"
                  inputMode="email"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-semibold" htmlFor="login-pw">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Icon name="lock" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--faint)" }} />
                <input
                  id="login-pw"
                  className="field !rounded-full !py-4 !text-base !pl-11 !pr-12"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors hover:bg-[var(--line-light)]"
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} className="h-4 w-4" style={{ color: "var(--muted)" }} />
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-2xl p-3.5 text-sm" style={{ background: "var(--error-soft)", color: "var(--error)" }}>
                <Icon name="alert-circle" className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg mt-7 w-full">
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Logging in...
                </>
              ) : (
                <>
                  Log in
                  <Icon name="arrow-right" className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm" style={{ color: "var(--muted)" }}>
            New to Help Zone?{" "}
            <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="font-semibold" style={{ color: "var(--primary)" }}>
              Create an account
            </Link>
          </p>
      </motion.div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
