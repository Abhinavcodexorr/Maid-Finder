"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordReset, resetPasswordWithOtp, isValidMockOtp } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { AuthShell } from "@/components/layout/auth-shell";
import { toast } from "@/components/ui/toaster";

type Step = "identify" | "otp" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identify");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError("Enter your email or mobile number.");
      return;
    }
    requestPasswordReset(identifier);
    // Always proceed to the OTP screen — never reveal whether an account exists.
    setStep("otp");
  };

  const onVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidMockOtp(otp)) {
      setError("Enter the 6-digit code we sent you.");
      return;
    }
    setStep("reset");
  };

  const onResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError("Password must be at least 8 characters with a letter and a number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      resetPasswordWithOtp(identifier, otp, password);
      setStep("done");
      toast({ title: "Password updated", variant: "success" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <AuthShell
      footer={
        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          <Link href="/login" className="font-semibold text-[var(--primary)]">
            Back to login
          </Link>
        </p>
      }
    >
      <div>
        {step === "identify" ? (
          <>
            <h1 className="font-display text-2xl font-semibold">Reset your password</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Enter the email or mobile number on your account.</p>
            <form className="mt-5" onSubmit={onIdentify}>
              <label className="mb-1 block text-sm font-semibold">Email or mobile number</label>
              <input className="field !rounded-full !py-3.5" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com or 98765 43210" />
              {error ? <p className="mt-2 text-sm text-[var(--cancel)]">{error}</p> : null}
              <button type="submit" className="btn btn-primary btn-lg mt-6 w-full">
                Send OTP
              </button>
            </form>
          </>
        ) : null}

        {step === "otp" ? (
          <>
            <button type="button" onClick={() => setStep("identify")} className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--muted)]">
              <Icon name="chevron-left" className="h-4 w-4" /> Back
            </button>
            <h1 className="font-display text-2xl font-semibold">Check your messages</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              We&apos;ve sent a 6-digit code to <b className="text-[var(--ink)]">{identifier}</b>. (Demo: any 6 digits work.)
            </p>
            <form className="mt-5" onSubmit={onVerifyOtp}>
              <label className="mb-1 block text-sm font-semibold">6-digit code</label>
              <input
                className="field !rounded-full !py-3.5 text-center text-lg tracking-[0.5em]"
                maxLength={6}
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
              {error ? <p className="mt-2 text-sm text-[var(--cancel)]">{error}</p> : null}
              <button type="submit" className="btn btn-primary btn-lg mt-6 w-full">
                Verify code
              </button>
            </form>
          </>
        ) : null}

        {step === "reset" ? (
          <>
            <h1 className="font-display text-2xl font-semibold">Set a new password</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">At least 8 characters, with a letter and a number.</p>
            <form className="mt-5" onSubmit={onResetPassword}>
              <label className="mb-1 block text-sm font-semibold">New password</label>
              <input className="field !rounded-full !py-3.5" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <label className="mb-1 mt-4 block text-sm font-semibold">Confirm new password</label>
              <input className="field !rounded-full !py-3.5" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {error ? <p className="mt-2 text-sm text-[var(--cancel)]">{error}</p> : null}
              <button type="submit" className="btn btn-primary btn-lg mt-6 w-full">
                Update password
              </button>
            </form>
          </>
        ) : null}

        {step === "done" ? (
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ background: "var(--confirmed)" }}>
              <Icon name="check" className="h-6 w-6" />
            </span>
            <h1 className="font-display mt-4 text-2xl font-semibold">Password updated</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">You can now log in with your new password.</p>
            <button type="button" onClick={() => router.push("/login")} className="btn btn-primary btn-lg mt-6 w-full">
              Back to login
            </button>
          </div>
        ) : null}
      </div>
    </AuthShell>
  );
}
