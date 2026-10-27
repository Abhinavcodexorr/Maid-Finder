"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
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
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-12" style={{ background: "var(--gradient-hero)" }}>
      <div aria-hidden className="blob-drift pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)" }} />
      <div aria-hidden className="blob-drift pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full opacity-50 blur-3xl" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.25), transparent 70%)" }} />

      <div className="relative w-full max-w-md">
        <motion.div {...enter(0)} className="rounded-[2rem] border bg-white p-8 shadow-2xl sm:p-10" style={{ borderColor: "var(--line)" }}>
          <Link href="/" className="mb-8 flex justify-center">
            <Logo size={34} />
          </Link>

          <h1 className="font-display text-center text-h1">Welcome back</h1>
          <p className="mt-2 text-center text-sm" style={{ color: "var(--muted)" }}>
            Log in to unlock contact details and pricing.
          </p>

          <form className="mt-8" onSubmit={onSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="login-id">
                Email or mobile number
              </label>
              <div className="relative">
                <Icon name="mail" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--faint)" }} />
                <input
                  id="login-id"
                  className="field !rounded-full !py-3.5 !pl-11"
                  placeholder="you@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="email"
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
                  className="field !rounded-full !py-3.5 !pl-11 !pr-12"
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

        <motion.ul {...enter(0.15)} className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium" style={{ color: "var(--ink-light)" }}>
          {["100% ID verified", "0% commission", "Direct contact"].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <Icon name="check-circle" className="h-4 w-4" style={{ color: "var(--success)" }} />
              {item}
            </li>
          ))}
        </motion.ul>

        <p className="mt-4 text-center text-xs" style={{ color: "var(--muted)" }}>
          Are you a helper?{" "}
          <Link href="/register-helper" className="font-semibold" style={{ color: "var(--primary)" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
