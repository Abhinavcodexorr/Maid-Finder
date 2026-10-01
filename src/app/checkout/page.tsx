"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPlanById, processPayment } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { LogoMark } from "@/components/ui/logo";
import { toast } from "@/components/ui/toaster";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "";
  const redirect = searchParams.get("redirect") || "/providers";
  const { user } = useAuth();

  const plan = getPlanById(planId);
  const [processing, setProcessing] = useState(false);

  if (!user) {
    router.push(`/login?redirect=${encodeURIComponent(`/checkout?plan=${planId}&redirect=${encodeURIComponent(redirect)}`)}`);
    return null;
  }

  if (!plan) {
    return (
      <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <Icon name="alert-circle" className="h-12 w-12" style={{ color: "var(--warning)" }} />
        <h1 className="font-display text-h2 mt-4">Plan not found</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>The plan you&apos;re looking for doesn&apos;t exist.</p>
        <button type="button" onClick={() => router.push("/membership")} className="btn btn-primary mt-6">
          View Plans
        </button>
      </section>
    );
  }

  const gst = Math.round(plan.price * 0.18);
  const total = plan.price + gst;

  const onPay = async () => {
    setProcessing(true);
    try {
      // Simulate payment delay
      await new Promise((r) => setTimeout(r, 1200));
      processPayment(user.id, plan.id, "Card");
      toast({ title: "Payment successful!", variant: "success" });
      router.push(`/checkout/success?redirect=${encodeURIComponent(redirect)}`);
    } catch (err) {
      toast({ title: "Payment failed", description: err instanceof Error ? err.message : undefined, variant: "error" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <LogoMark size={36} />
        <h1 className="font-display text-h2 mt-4">Complete Your Purchase</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          You&apos;re subscribing to the <b>{plan.name}</b> plan.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Payment Form */}
        <div className="card">
          <h2 className="font-display text-h3 mb-4">Payment Details</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="card-name">Name on card</label>
              <input id="card-name" className="field" defaultValue={`${user.firstName} ${user.lastName}`} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="card-number">Card number</label>
              <div className="relative">
                <input id="card-number" className="field pr-12" placeholder="4242 4242 4242 4242" inputMode="numeric" />
                <Icon name="credit-card" className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "var(--faint)" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="expiry">Expiry</label>
                <input id="expiry" className="field" placeholder="MM / YY" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="cvc">CVC</label>
                <input id="cvc" className="field" placeholder="123" inputMode="numeric" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onPay}
            disabled={processing}
            className="btn btn-primary btn-lg mt-6 w-full"
          >
            {processing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </>
            ) : (
              <>Pay ₹{total.toLocaleString("en-IN")}</>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
            <span className="flex items-center gap-1"><Icon name="shield" className="h-3 w-3" /> Secure Payment</span>
            <span className="flex items-center gap-1"><Icon name="lock" className="h-3 w-3" /> SSL Encrypted</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card h-fit">
          <h3 className="font-display text-sm font-semibold mb-4">Order Summary</h3>

          <div className="rounded-xl p-4" style={{ background: "var(--primary-soft)" }}>
            <p className="font-display text-base font-semibold">{plan.name}</p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>{plan.durationDays} days access</p>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Plan price</span>
              <span className="font-medium">₹{plan.price.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>GST (18%)</span>
              <span className="font-medium">₹{gst.toLocaleString("en-IN")}</span>
            </div>
            {plan.originalPrice && (
              <div className="flex justify-between" style={{ color: "var(--success)" }}>
                <span>Savings</span>
                <span className="font-semibold">-₹{(plan.originalPrice - plan.price).toLocaleString("en-IN")}</span>
              </div>
            )}
            <hr className="divider" />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
            <p className="flex items-center gap-1.5"><Icon name="check" className="h-3 w-3" style={{ color: "var(--success)" }} /> Instant activation</p>
            <p className="flex items-center gap-1.5"><Icon name="check" className="h-3 w-3" style={{ color: "var(--success)" }} /> Unlock all providers</p>
            <p className="flex items-center gap-1.5"><Icon name="check" className="h-3 w-3" style={{ color: "var(--success)" }} /> 7-day money-back guarantee</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs" style={{ color: "var(--faint)" }}>
        This is a demo checkout. No real payment will be processed.
      </p>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
