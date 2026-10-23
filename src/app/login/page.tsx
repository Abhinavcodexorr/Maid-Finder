"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { toast } from "@/components/ui/toaster";

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

  const [heroImgLoaded, setHeroImgLoaded] = useState(false);

  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
      {/* Left panel — Desktop only with relatable service imagery */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
        {/* Background Image with radiant shimmer fallback */}
        {!heroImgLoaded && (
          <div className="absolute inset-0 shimmer bg-slate-900" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/auth-service-hero.jpg"
          alt="Trusted professional housemaid and domestic staff"
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
            heroImgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setHeroImgLoaded(true)}
        />

        {/* Sophisticated dark gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.45) 45%, rgba(15, 23, 42, 0.95) 100%)",
          }}
        />

        {/* Top Header Badge */}
        <div className="relative z-20 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-slate-950/40 px-3.5 py-1.5 backdrop-blur-md transition-all hover:bg-slate-950/60"
          >
            <Logo size={24} theme="dark" />
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Marketplace • All India
          </span>
        </div>

        {/* Bottom Content & Metrics */}
        <div className="relative z-20 mt-auto pt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md mb-3">
            <Icon name="shield-check" className="h-3.5 w-3.5 text-emerald-400" />
            <span>100% Verified Domestic Staff</span>
          </div>

          <h2 className="font-display text-3xl font-extrabold leading-tight text-white drop-shadow-sm">
            Connecting Indian Families with Verified Helpers You Can Trust.
          </h2>

          <p className="mt-3 max-w-md text-sm text-white/80 leading-relaxed drop-shadow-sm">
            Browse maid, cook, babysitter, and driver profiles for free. Subscribe once to contact candidates directly with 0% brokerage.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid max-w-md grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/15 bg-slate-950/50 p-3.5 text-center backdrop-blur-md">
              <p className="font-display text-xl font-bold text-white">40+</p>
              <p className="mt-0.5 text-[11px] text-white/70">Verified Helpers</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-slate-950/50 p-3.5 text-center backdrop-blur-md">
              <p className="font-display text-xl font-bold text-white">9</p>
              <p className="mt-0.5 text-[11px] text-white/70">Categories</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-slate-950/50 p-3.5 text-center backdrop-blur-md">
              <p className="font-display text-xl font-bold text-emerald-400">0%</p>
              <p className="mt-0.5 text-[11px] text-white/70">Commission</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-4">
            <span>© {new Date().getFullYear()} Help Zone Technologies</span>
            <span className="flex items-center gap-1.5">
              <Icon name="check-circle" className="h-3.5 w-3.5 text-emerald-400" />
              Aadhaar & Police Verified
            </span>
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div
        className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16"
        style={{ background: "linear-gradient(180deg, var(--surface) 0%, var(--line-light) 100%)" }}
      >
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile-only branding — the hero panel with the logo is lg:flex only, so phones had none at all */}
          <Link href="/" className="mb-8 flex items-center justify-center lg:hidden">
            <Logo size={30} />
          </Link>

          <div className="card border-0 shadow-xl" style={{ boxShadow: "var(--shadow-xl)" }}>
            <span
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Icon name="lock" className="h-5 w-5 text-white" />
            </span>
            <h1 className="font-display text-h1">Welcome back</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Log in to unlock contact details and pricing.
            </p>

            <form className="mt-7" onSubmit={onSubmit}>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="login-id">
                  Email or mobile number
                </label>
                <div className="relative">
                  <Icon name="mail" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--faint)" }} />
                  <input
                    id="login-id"
                    className="field pl-10"
                    placeholder="you@example.com or 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="login-pw">
                  Password
                </label>
                <div className="relative">
                  <Icon name="lock" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--faint)" }} />
                  <input
                    id="login-pw"
                    className="field pl-10 pr-11"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors hover:bg-[var(--surface-muted)]"
                  >
                    <Icon name={showPassword ? "eye-off" : "eye"} className="h-4 w-4" style={{ color: "var(--muted)" }} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2" style={{ color: "var(--ink-light)" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--primary)" }} className="h-4 w-4 rounded" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="font-semibold" style={{ color: "var(--primary)" }}>
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: "var(--error-soft)", color: "var(--error)" }}>
                  <Icon name="alert-circle" className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn btn-primary mt-6 w-full btn-lg">
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--muted)" }}>
            New to Help Zone?{" "}
            <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="font-semibold" style={{ color: "var(--primary)" }}>
              Create an account
            </Link>
          </p>
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
