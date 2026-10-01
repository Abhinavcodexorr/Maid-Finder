"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { getCategories, emailExists, phoneExists, updateLookingFor, getDistinctAreas } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { LogoMark } from "@/components/ui/logo";
import { toast } from "@/components/ui/toaster";
import type { AvailabilityType } from "@/types/marketplace";

/* ================================================================
   SCHEMAS
   ================================================================ */
const accountSchema = z
  .object({
    firstName: z.string().min(2, "Enter your first name"),
    lastName: z.string().min(1, "Enter your last name"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    password: z.string().min(8, "At least 8 characters").regex(/[A-Za-z]/, "Must include a letter").regex(/\d/, "Must include a number"),
    confirmPassword: z.string(),
    agree: z.literal(true, { error: "You must agree to the Terms & Privacy Policy" }),
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] })
  .refine((v) => !emailExists(v.email), { message: "An account with this email already exists", path: ["email"] })
  .refine((v) => !phoneExists(v.phone), { message: "An account with this phone number already exists", path: ["phone"] });

type AccountValues = z.infer<typeof accountSchema>;

const SERVICE_EMOJIS: Record<string, string> = {
  "cat-cook": "🍳", "cat-maid": "🧹", "cat-plumber": "🔧", "cat-electrician": "⚡",
  "cat-carpenter": "🛠", "cat-driver": "🚗", "cat-babysitter": "👶", "cat-elderly-care": "👴", "cat-painter": "🎨",
};

const REQ_TYPES: { id: AvailabilityType; label: string }[] = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "one-time", label: "One-time" },
  { id: "live-in", label: "Live-in" },
];

/* ================================================================
   COMPONENT
   ================================================================ */
function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { signup } = useAuth();
  const categories = getCategories();
  const areas = getDistinctAreas();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [newUserId, setNewUserId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [preferredArea, setPreferredArea] = useState("");
  const [requirementType, setRequirementType] = useState<AvailabilityType | "">("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountValues>({ resolver: zodResolver(accountSchema) });

  const onStep1 = (values: AccountValues) => {
    try {
      const user = signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      setNewUserId(user.id);
      setStep(2);
    } catch (err) {
      toast({ title: "Couldn't create account", description: err instanceof Error ? err.message : undefined, variant: "error" });
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const onStep2 = () => setStep(3);

  const finishOnboarding = (skipped: boolean) => {
    if (!newUserId) return;
    updateLookingFor(newUserId, {
      lookingFor: skipped ? [] : selectedCategories,
      preferredArea: skipped ? undefined : preferredArea || undefined,
      requirementType: skipped ? undefined : (requirementType as AvailabilityType) || undefined,
      onboardingDismissed: true,
    });
    toast({ title: "Welcome to Help Zone! 🎉", description: "Your account is ready.", variant: "success" });
    router.push(redirect);
  };

  const stepLabels = ["Account", "Services", "Location"];

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-center gap-2.5">
        <LogoMark size={28} />
        <span className="font-display text-lg font-semibold">Help Zone</span>
      </div>

      {/* Step indicator */}
      <div className="card">
        <div className="mb-6 flex items-center gap-2">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            const active = step >= s;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: active ? "var(--primary)" : "var(--line)",
                    color: active ? "white" : "var(--muted)",
                  }}
                >
                  {step > s ? <Icon name="check" className="h-3.5 w-3.5" /> : s}
                </span>
                <span className="hidden text-xs font-medium sm:block" style={{ color: active ? "var(--ink)" : "var(--muted)" }}>
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <div className="h-px flex-1" style={{ background: step > s ? "var(--primary)" : "var(--line)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Account */}
        {step === 1 && (
          <>
            <h1 className="font-display text-h2">Create your account</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Free to browse. Only pay when you&apos;re ready to connect.
            </p>
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onStep1)}>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="fn">First name</label>
                <input id="fn" className={`field ${errors.firstName ? "field-error" : ""}`} {...register("firstName")} />
                {errors.firstName && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="ln">Last name</label>
                <input id="ln" className={`field ${errors.lastName ? "field-error" : ""}`} {...register("lastName")} />
                {errors.lastName && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.lastName.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">Email address</label>
                <input id="email" className={`field ${errors.email ? "field-error" : ""}`} type="email" {...register("email")} />
                {errors.email && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.email.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="phone">Mobile number</label>
                <div className="flex overflow-hidden rounded-xl border" style={{ borderColor: errors.phone ? "var(--error)" : "var(--line)" }}>
                  <span className="flex items-center border-r px-3.5 text-sm font-semibold" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>+91</span>
                  <input id="phone" className="w-full px-3.5 py-2.5 text-sm outline-none" inputMode="numeric" {...register("phone")} />
                </div>
                {errors.phone && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.phone.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="pw">Password</label>
                <div className="relative">
                  <input id="pw" className={`field pr-12 ${errors.password ? "field-error" : ""}`} type={showPassword ? "text" : "password"} {...register("password")} />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name={showPassword ? "eye-off" : "eye"} className="h-4 w-4" style={{ color: "var(--muted)" }} />
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.password.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="cpw">Confirm password</label>
                <input id="cpw" className={`field ${errors.confirmPassword ? "field-error" : ""}`} type={showPassword ? "text" : "password"} {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.confirmPassword.message}</p>}
              </div>
              <label className="flex items-start gap-2 text-sm sm:col-span-2">
                <input type="checkbox" className="mt-1" {...register("agree")} />
                <span>I agree to the <Link href="/faqs" className="underline">Terms</Link> and <Link href="/faqs" className="underline">Privacy Policy</Link>.</span>
              </label>
              {errors.agree && <p className="-mt-2 text-xs sm:col-span-2" style={{ color: "var(--error)" }}>{errors.agree.message}</p>}
              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg sm:col-span-2">
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
            <p className="mt-5 text-center text-sm" style={{ color: "var(--muted)" }}>
              Already have an account?{" "}
              <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-semibold" style={{ color: "var(--primary)" }}>
                Log in
              </Link>
            </p>
          </>
        )}

        {/* Step 2: Service Preferences */}
        {step === 2 && (
          <>
            <h1 className="font-display text-h2">What are you looking for?</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Choose the services you&apos;re interested in. You can change these later.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat.id);
                const emoji = SERVICE_EMOJIS[cat.id] || "📋";
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="rounded-xl border-2 p-3 text-left transition-all"
                    style={{
                      borderColor: active ? "var(--primary)" : "var(--line)",
                      background: active ? "var(--primary-soft)" : "var(--surface)",
                      transform: active ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <p className="mt-2 text-sm font-semibold">{cat.name}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => finishOnboarding(true)} className="btn btn-outline">Skip for now</button>
              <button type="button" onClick={onStep2} className="btn btn-primary" disabled={selectedCategories.length === 0}>Continue</button>
            </div>
          </>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <>
            <h1 className="font-display text-h2">Where do you need the service?</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              This helps us show you professionals near you.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Preferred area</label>
                <select className="field" value={preferredArea} onChange={(e) => setPreferredArea(e.target.value)}>
                  <option value="">Select area</option>
                  {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Service type</label>
                <select className="field" value={requirementType} onChange={(e) => setRequirementType(e.target.value as AvailabilityType)}>
                  <option value="">Any type</option>
                  {REQ_TYPES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => finishOnboarding(true)} className="btn btn-outline">Skip for now</button>
              <button type="button" onClick={() => finishOnboarding(false)} className="btn btn-primary">Complete Setup</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}
