"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { toast } from "@/components/ui/toaster";

const BENEFITS = [
  { icon: "unlock", text: "Unlock phone numbers and WhatsApp for every profile" },
  { icon: "heart", text: "Save professionals and shortlist them for later" },
  { icon: "shield", text: "Hire directly — 0% commission, no agency in between" },
];

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
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[1.05fr_0.95fr]">
      {/* Left panel — brand, photo and benefits (desktop only) */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex" style={{ background: "var(--gradient-primary)" }}>
        <div aria-hidden className="blob-drift pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="blob-drift pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />

        <Link href="/" className="relative z-10 inline-flex w-fit items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-md transition-colors hover:bg-white/20">
          <Logo size={26} theme="dark" />
        </Link>

        <div className="relative z-10 grid items-center gap-10 xl:grid-cols-[1fr_0.9fr]">
          <motion.div {...enter(0.1)}>
            <p className="eyebrow !text-white/80">Welcome back</p>
            <h2 className="font-display mt-4 text-4xl font-extrabold leading-[1.1]">
              Pick up right where you left off.
            </h2>
            <ul className="mt-8 space-y-4">
              {BENEFITS.map((b) => (
                <li key={b.text} className="flex items-start gap-3 text-sm text-white/90">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Icon name={b.icon} className="h-4 w-4" />
                  </span>
                  <span className="pt-1">{b.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...enter(0.2)} className="relative mx-auto w-full max-w-[280px]">
            <div className="overflow-hidden rounded-[2rem] border-4 border-white/90 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/auth-service-hero.jpg"
                alt="A smiling home-help professional in a bright kitchen"
                className="h-[360px] w-full object-cover object-top"
              />
            </div>
            <div className="float-depth absolute -left-6 bottom-10 flex items-center gap-2.5 rounded-2xl bg-white p-3 text-[var(--ink)] shadow-xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--success-soft)", color: "var(--success)" }}>
                <Icon name="shield" className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold">Identity verified</p>
                <p className="text-[11px]" style={{ color: "var(--muted)" }}>Aadhaar &amp; PAN checked</p>
              </div>
            </div>
          </motion.div>
        </div>

        <p className="relative z-10 text-xs text-white/60">© {new Date().getFullYear()} Help Zone</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col justify-center bg-white px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          {/* Phones have no left panel, so they get the logo here */}
          <Link href="/" className="mb-8 flex items-center justify-center lg:hidden">
            <Logo size={30} />
          </Link>

          <motion.div {...enter(0)}>
            <h1 className="font-display text-h1">Log in to your account</h1>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Enter your details to unlock contact details and pricing.
            </p>
          </motion.div>

          <motion.form {...enter(0.1)} className="mt-8" onSubmit={onSubmit}>
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

            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm" style={{ color: "var(--ink-light)" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--primary)" }} className="h-4 w-4 rounded" />
              Keep me logged in
            </label>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-2xl p-3.5 text-sm" style={{ background: "var(--error-soft)", color: "var(--error)" }}>
                <Icon name="alert-circle" className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg mt-6 w-full">
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
          </motion.form>

          <motion.div {...enter(0.2)}>
            <div className="my-7 flex items-center gap-4 text-xs font-medium" style={{ color: "var(--faint)" }}>
              <span className="h-px flex-1" style={{ background: "var(--line)" }} />
              NEW HERE?
              <span className="h-px flex-1" style={{ background: "var(--line)" }} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="btn btn-outline w-full">
                Create an account
              </Link>
              <Link href="/register-helper" className="btn btn-outline w-full">
                Register as helper
              </Link>
            </div>
          </motion.div>
        </div>
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
