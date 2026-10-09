"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitProviderApplication, getDistinctCities } from "@/lib/services";
import { ApiError } from "@/lib/api-client";
import { Icon } from "@/components/ui/icon";
import { LogoMark } from "@/components/ui/logo";
import { toast } from "@/components/ui/toaster";
import { colorForIndex } from "@/lib/category-colors";

/* ================================================================
   OPTIONS
   ================================================================ */
const SERVICES = [
  { id: "Cooking", emoji: "🍲", categoryId: "cat-cook" },
  { id: "House Cleaning", emoji: "🧹", categoryId: "cat-maid" },
  { id: "Baby Sitting", emoji: "👶", categoryId: "cat-babysitter" },
  { id: "Elderly Care", emoji: "🧓", categoryId: "cat-elderly-care" },
  { id: "Laundry", emoji: "🧺", categoryId: "cat-maid" },
  { id: "Dish Washing", emoji: "🍽️", categoryId: "cat-maid" },
  { id: "Ironing", emoji: "👕", categoryId: "cat-maid" },
  { id: "Deep Cleaning", emoji: "✨", categoryId: "cat-maid" },
  { id: "Patient Care", emoji: "🏥", categoryId: "cat-elderly-care" },
  { id: "Pet Care", emoji: "🐾", categoryId: "cat-maid" },
  { id: "Gardening", emoji: "🌱", categoryId: "cat-carpenter" },
  { id: "Grocery Runs", emoji: "🛒", categoryId: "cat-driver" },
];

const EXPERIENCE_OPTIONS = ["< 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"];

const ID_TYPES = [
  { id: "Aadhaar Card", emoji: "🪪" },
  { id: "PAN Card", emoji: "💳" },
  { id: "Voter ID", emoji: "🗳️" },
  { id: "Driving License", emoji: "🚗" },
  { id: "Passport", emoji: "📘" },
];

const TALKING_POINTS = [
  { emoji: "👋", text: "Say your name and where you live" },
  { emoji: "💼", text: "Share your work experience and past homes" },
  { emoji: "🛠️", text: "Talk about the services you are best at" },
  { emoji: "❤️", text: "Tell families why they can trust you" },
];

const STEP_LABELS = ["Basic", "Services", "KYC", "Video"];

/* ================================================================
   SCHEMA — Step 1
   ================================================================ */
const basicSchema = z
  .object({
    firstName: z.string().min(2, "Enter your first name"),
    lastName: z.string().min(1, "Enter your last name"),
    gender: z.enum(["Male", "Female"], { error: "Select your gender" }),
    mobileNumber: z.string().regex(/^[0-9]{7,10}$/, "Enter a valid mobile number"),
    email: z.string().email("Enter a valid email address"),
    city: z.string().min(1, "Select your city"),
    password: z.string().min(8, "At least 8 characters").regex(/[A-Za-z]/, "Must include a letter").regex(/\d/, "Must include a number"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

type BasicValues = z.infer<typeof basicSchema>;

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Good", "Strong", "Strong"];
  const colors = ["var(--error)", "var(--warning)", "var(--primary)", "var(--success)", "var(--success)"];
  return { score, label: pw ? labels[score] : "", color: colors[score] };
}

/* ================================================================
   COMPONENT
   ================================================================ */
export default function RegisterHelperPage() {
  const cities = getDistinctCities();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [basic, setBasic] = useState<BasicValues | null>(null);

  // Step 2: Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [servicesError, setServicesError] = useState("");

  // Step 3: KYC
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [kycError, setKycError] = useState("");

  // Step 4: Video
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BasicValues>({ resolver: zodResolver(basicSchema) });

  const pw = watch("password") || "";
  const strength = useMemo(() => passwordStrength(pw), [pw]);
  const isAadhaar = idType === "Aadhaar Card";

  const onStep1 = (values: BasicValues) => {
    setBasic(values);
    setStep(2);
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const onStep2 = () => {
    if (selectedServices.length === 0) return setServicesError("Pick at least one service.");
    if (!experience) return setServicesError("Select your years of experience.");
    setServicesError("");
    setStep(3);
  };

  const onStep3 = () => {
    if (!idType) return setKycError("Select a government ID type.");
    if (!idNumber.trim()) return setKycError("Enter your ID number.");
    if (isAadhaar && idNumber.replace(/\s/g, "").length !== 12) return setKycError("Aadhaar number must be 12 digits.");
    if (!idDocumentFile) return setKycError(`Upload a photo of your ${idType}.`);
    if (!selfieFile) return setKycError("Take a clear selfie.");
    if (!consent) return setKycError("Please confirm the consent checkbox.");
    setKycError("");
    setStep(4);
  };

  const onFinalSubmit = async () => {
    if (!basic || !idDocumentFile || !selfieFile || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const primaryCategoryId = SERVICES.find((s) => s.id === selectedServices[0])?.categoryId ?? "cat-maid";
      await submitProviderApplication({
        fullName: `${basic.firstName.trim()} ${basic.lastName.trim()}`,
        gender: basic.gender,
        nationality: "Indian",
        categoryId: primaryCategoryId,
        area: basic.city.trim(),
        city: basic.city.trim(),
        mobileNumber: basic.mobileNumber,
        whatsappNumber: basic.mobileNumber,
        email: basic.email.trim().toLowerCase(),
        password: basic.password,
        kyc: {
          idType,
          idNumber: idNumber.trim(),
          idDocumentFile,
          photoFile: selfieFile,
        },
      });
      setSubmitted(true);
      toast({ title: "Profile submitted!", description: "We'll verify your documents and notify you once you're live.", variant: "success" });
    } catch (err) {
      const description = err instanceof ApiError ? err.message : err instanceof Error ? err.message : undefined;
      toast({ title: "Couldn't submit profile", description, variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <div className="card">
          <span
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "var(--success-soft)", color: "var(--success)" }}
          >
            <Icon name="check-circle" className="h-8 w-8" />
          </span>
          <h1 className="font-display text-h2">Profile submitted!</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
            Thanks for joining Help Zone. We&apos;ll verify your documents and let you know on WhatsApp once you&apos;re approved to start getting job requests.
          </p>
          <Link href="/" className="btn btn-primary btn-lg mt-6">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-center gap-2.5">
        <LogoMark size={28} />
        <span className="font-display text-lg font-semibold">Help Zone</span>
        <span className="pill pill-primary">Helper</span>
      </div>

      <div className="card">
        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1;
            const active = step >= s;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: active ? "var(--primary)" : "var(--line)", color: active ? "white" : "var(--muted)" }}
                >
                  {step > s ? <Icon name="check" className="h-3.5 w-3.5" /> : s}
                </span>
                <span className="hidden text-xs font-medium sm:block" style={{ color: active ? "var(--ink)" : "var(--muted)" }}>
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div className="h-px flex-1" style={{ background: step > s ? "var(--primary)" : "var(--line)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ===== Step 1: Basic ===== */}
        {step === 1 && (
          <>
            <h1 className="font-display text-h2">Tell us about you</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Families will see your name and city on your profile.
            </p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onStep1)}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input placeholder="First name" className={`field ${errors.firstName ? "field-error" : ""}`} {...register("firstName")} />
                  {errors.firstName && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.firstName.message}</p>}
                </div>
                <div>
                  <input placeholder="Last name" className={`field ${errors.lastName ? "field-error" : ""}`} {...register("lastName")} />
                  {errors.lastName && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <select defaultValue="" className={`field ${errors.gender ? "field-error" : ""}`} {...register("gender")}>
                  <option value="" disabled>Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                {errors.gender && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.gender.message}</p>}
              </div>

              <div>
                <input placeholder="Mobile number" inputMode="numeric" className={`field ${errors.mobileNumber ? "field-error" : ""}`} {...register("mobileNumber")} />
                {errors.mobileNumber && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.mobileNumber.message}</p>}
              </div>

              <div>
                <input placeholder="Email address" type="email" className={`field ${errors.email ? "field-error" : ""}`} {...register("email")} />
                {errors.email && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.email.message}</p>}
              </div>

              <div>
                <select defaultValue="" className={`field ${errors.city ? "field-error" : ""}`} {...register("city")}>
                  <option value="" disabled>City</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.city.message}</p>}
              </div>

              <p className="mt-2 text-sm font-semibold">Create login password</p>

              <div>
                <div className="relative">
                  <input
                    placeholder="Password"
                    className={`field pr-11 ${errors.password ? "field-error" : ""}`}
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <Icon name={showPassword ? "eye-off" : "eye"} className="h-4 w-4" style={{ color: "var(--muted)" }} />
                  </button>
                </div>
                {pw && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="h-1 flex-1 rounded-full"
                          style={{ background: i < strength.score ? strength.color : "var(--line)" }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.password.message}</p>}
              </div>

              <div>
                <input
                  placeholder="Confirm password"
                  className={`field ${errors.confirmPassword ? "field-error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.confirmPassword.message}</p>}
              </div>
            </form>
          </>
        )}

        {/* ===== Step 2: Services ===== */}
        {step === 2 && (
          <>
            <h1 className="font-display text-h2">What can you do?</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Pick every service you are comfortable with. More skills means more job requests.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm font-semibold">Services</p>
              <span className="pill pill-primary">{selectedServices.length} selected</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {SERVICES.map((svc, i) => {
                const active = selectedServices.includes(svc.id);
                const swatch = colorForIndex(i);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => toggleService(svc.id)}
                    className="flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all"
                    style={{
                      borderColor: active ? "var(--primary)" : "var(--line)",
                      background: active ? "var(--primary-soft)" : "var(--surface)",
                    }}
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                      style={{ background: active ? "white" : swatch.soft }}
                    >
                      {svc.emoji}
                    </span>
                    <span className="text-xs font-semibold leading-tight">{svc.id}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-sm font-semibold">Years of experience</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setExperience(opt)}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: experience === opt ? "var(--primary)" : "var(--surface)",
                    color: experience === opt ? "white" : "var(--ink)",
                    border: experience === opt ? "none" : "1.5px solid var(--line)",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {servicesError && <p className="mt-4 text-xs" style={{ color: "var(--error)" }}>{servicesError}</p>}
          </>
        )}

        {/* ===== Step 3: KYC ===== */}
        {step === 3 && (
          <>
            <h1 className="font-display text-h2">Verify your identity</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Verified helpers get up to 3× more requests. Families trust a verified badge.
            </p>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl p-3.5 text-sm" style={{ background: "var(--success-soft)", color: "var(--success)" }}>
              <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0" />
              Your documents are encrypted and only used for verification. They are never shown to families.
            </div>

            <p className="mt-5 text-sm font-semibold">Government ID</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ID_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIdType(t.id)}
                  className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: idType === t.id ? "var(--primary-soft)" : "var(--surface)",
                    color: idType === t.id ? "var(--primary)" : "var(--ink)",
                    border: idType === t.id ? "1.5px solid var(--primary)" : "1.5px solid var(--line)",
                  }}
                >
                  <span>{t.emoji}</span>
                  {t.id}
                </button>
              ))}
            </div>

            {idType && (
              <>
                <div className="mt-5">
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="idNumber">
                    {isAadhaar ? "Aadhaar Number" : `${idType} Number`}
                  </label>
                  <input
                    id="idNumber"
                    placeholder={isAadhaar ? "XXXX XXXX XXXX" : "Enter your ID number"}
                    inputMode={isAadhaar ? "numeric" : "text"}
                    maxLength={isAadhaar ? 14 : undefined}
                    value={idNumber}
                    onChange={(e) => {
                      if (!isAadhaar) return setIdNumber(e.target.value);
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
                      setIdNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
                    }}
                    className="field"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="idDocument"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 transition-colors hover:border-[var(--primary)]"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                      <Icon name="upload" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{idDocumentFile ? idDocumentFile.name : `Upload your ${idType}`}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>JPG, PNG or PDF</p>
                    </div>
                    <input id="idDocument" type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setIdDocumentFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </>
            )}

            <p className="mt-5 text-sm font-semibold">Live selfie</p>
            <label
              htmlFor="selfie"
              className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl p-4 transition-colors"
              style={{ background: "var(--surface)", border: "1.5px solid var(--line)" }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                <Icon name="user" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{selfieFile ? selfieFile.name : "Take a clear selfie"}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Good lighting, no sunglasses or mask</p>
              </div>
              <input id="selfie" type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)} />
            </label>

            <label className="mt-5 flex items-start gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
              <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              I confirm these documents are mine and I consent to HelpZone verifying them, including a background check.
            </label>

            {kycError && <p className="mt-3 text-xs" style={{ color: "var(--error)" }}>{kycError}</p>}
          </>
        )}

        {/* ===== Step 4: Video ===== */}
        {step === 4 && (
          <>
            <h1 className="font-display text-h2">Introduce yourself</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Record a short video (30 sec – 5 min). Families love seeing who they are hiring.
            </p>

            <div className="mt-5 flex flex-col items-center gap-4 rounded-xl p-8" style={{ background: "var(--line-light)" }}>
              <label
                htmlFor="videoRecord"
                className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full text-white"
                style={{ background: "var(--error)" }}
              >
                <Icon name="video" className="h-7 w-7" />
                <input id="videoRecord" type="file" accept="video/*" capture="user" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />
              </label>
              <div className="text-center">
                <p className="font-semibold">{videoFile ? videoFile.name : "Tap to record"}</p>
                <div className="mt-2 flex justify-center gap-2">
                  <span className="pill pill-neutral">Max 5 min</span>
                  <span className="pill pill-neutral">Front camera</span>
                </div>
              </div>
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold" style={{ color: "var(--primary)" }}>
              <Icon name="upload" className="h-4 w-4" />
              Upload from gallery instead
              <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />
            </label>

            <p className="mt-6 text-sm font-semibold">What to talk about</p>
            <div className="mt-3 flex flex-col gap-2.5 rounded-xl p-4" style={{ background: "var(--line-light)" }}>
              {TALKING_POINTS.map((p) => (
                <div key={p.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base" style={{ background: "var(--surface)" }}>
                    {p.emoji}
                  </span>
                  <p className="text-sm">{p.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
              A video is optional, but profiles with one get noticed first.
            </p>
          </>
        )}

        {/* Footer actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {step > 1 ? (
            <button type="button" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)} className="btn btn-outline">
              ← Back
            </button>
          ) : (
            <span />
          )}
          {step === 1 && (
            <button type="button" onClick={handleSubmit(onStep1)} className="btn btn-primary">
              Continue
            </button>
          )}
          {step === 2 && (
            <button type="button" onClick={onStep2} className="btn btn-primary">
              Continue
            </button>
          )}
          {step === 3 && (
            <button type="button" onClick={onStep3} className="btn btn-primary">
              Continue
            </button>
          )}
          {step === 4 && (
            <button type="button" onClick={onFinalSubmit} disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Submitting…" : "Submit Profile"}
            </button>
          )}
        </div>
      </div>

    </section>
  );
}
