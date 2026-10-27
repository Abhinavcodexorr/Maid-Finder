"use client";

import { Icon } from "@/components/ui/icon";
import { ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";
import type { Plan } from "@/types/marketplace";

/** What every plan includes — the plans differ only in length and price. */
const INCLUDED = [
  "Unlimited provider contact access",
  "View phone numbers & pricing",
  "WhatsApp integration",
  "Save unlimited professionals",
  "Priority customer support",
  "Access across all categories",
];

function durationLabel(days: number): string {
  if (days % 30 === 0) {
    const months = days / 30;
    return `${months} ${months === 1 ? "MONTH" : "MONTHS"}`;
  }
  return `${days} DAYS`;
}

/**
 * Pricing cards: a big price, a short checklist and a pill button, with the
 * popular plan shown as the dark centre card carrying a "BEST SELLER" tag.
 */
export function PlanCards({
  plans,
  onSelect,
  disabled = false,
  ctaLabel = "Choose plan",
}: {
  plans: Plan[];
  onSelect: (planId: string) => void;
  disabled?: boolean;
  ctaLabel?: string;
}) {
  return (
    <ScrollStagger className="mx-auto grid max-w-5xl items-stretch gap-6 lg:grid-cols-3">
      {plans.map((plan) => {
        const popular = Boolean(plan.isPopular);
        return (
          <ScrollStaggerItem key={plan.id} className="h-full">
            <div
              className={`relative flex h-full flex-col rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1 ${popular ? "text-white lg:scale-[1.04]" : ""}`}
              style={
                popular
                  ? { background: "var(--gradient-dark)", boxShadow: "var(--shadow-xl)" }
                  : { background: "var(--surface)", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }
              }
            >
              {popular && (
                <span
                  className="absolute right-5 top-0 -translate-y-1/2 rounded-lg px-3 py-1 text-[11px] font-bold tracking-wider text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  BEST SELLER
                </span>
              )}

              <p className="text-xs font-bold tracking-[0.14em]" style={{ color: popular ? "rgba(255,255,255,0.7)" : "var(--muted)" }}>
                {durationLabel(plan.durationDays)}
              </p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-sm font-semibold" style={{ color: popular ? "rgba(255,255,255,0.7)" : "var(--muted)" }}>₹</span>
                <span className="font-display text-5xl font-extrabold tracking-tight">{plan.price.toLocaleString("en-IN")}</span>
                {plan.originalPrice ? (
                  <span className="text-sm line-through" style={{ color: popular ? "rgba(255,255,255,0.45)" : "var(--faint)" }}>
                    ₹{plan.originalPrice.toLocaleString("en-IN")}
                  </span>
                ) : null}
              </p>
              <h3 className="mt-3 text-base font-bold">{plan.name}</h3>
              <p className="mt-1 min-h-[2.5rem] text-sm leading-relaxed" style={{ color: popular ? "rgba(255,255,255,0.7)" : "var(--muted)" }}>
                {plan.description}
              </p>

              <hr className="my-5" style={{ borderColor: popular ? "rgba(255,255,255,0.15)" : "var(--line)" }} />

              <ul className="flex-1 space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: popular ? "rgba(255,255,255,0.15)" : "var(--primary-soft)", color: popular ? "white" : "var(--primary)" }}
                    >
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onSelect(plan.id)}
                disabled={disabled}
                className={`btn btn-lg mt-7 w-full ${popular ? "btn-primary" : "btn-dark"}`}
              >
                {disabled ? "Already active" : ctaLabel}
                {!disabled && <Icon name="arrow-right" className="h-4 w-4" />}
              </button>
            </div>
          </ScrollStaggerItem>
        );
      })}
    </ScrollStagger>
  );
}
