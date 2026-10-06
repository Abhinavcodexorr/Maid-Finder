"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitProviderApplication, getCategories, getDistinctAreas } from "@/lib/services";
import { ApiError } from "@/lib/api-client";
import { Icon } from "@/components/ui/icon";
import { LogoMark } from "@/components/ui/logo";
import { toast } from "@/components/ui/toaster";

/* ================================================================
   STEP 1 SCHEMA — Personal & Contact Details
   ================================================================ */
const detailsSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    gender: z.enum(["Male", "Female"], { error: "Select your gender" }),
    nationality: z.string().min(2, "Enter your nationality"),
    categoryId: z.string().min(1, "Select the service you provide"),
    area: z.string().min(1, "Enter your area"),
    city: z.string().min(1, "Enter your city"),
    mobileNumber: z.string().regex(/^[0-9]{7,10}$/, "Enter a valid mobile number"),
    whatsappNumber: z.string().regex(/^[0-9]{7,10}$/, "Enter a valid WhatsApp number"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "At least 8 characters").regex(/[A-Za-z]/, "Must include a letter").regex(/\d/, "Must include a number"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

type DetailsValues = z.infer<typeof detailsSchema>;

const ID_TYPES = ["Aadhaar Card", "Passport", "National ID", "Driving License"];

const STEP_LABELS = ["Your Details", "KYC Documents", "Review & Submit"];

/* ================================================================
   COMPONENT
   ================================================================ */
export default function RegisterProviderPage() {
  const categories = getCategories();
  const areas = getDistinctAreas();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [details, setDetails] = useState<DetailsValues | null>(null);

  // Step 2: KYC
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [kycError, setKycError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isValidatingStep1 },
  } = useForm<DetailsValues>({ resolver: zodResolver(detailsSchema) });

  const onStep1 = (values: DetailsValues) => {
    setDetails(values);
    setStep(2);
  };

  const isAadhaar = idType === "Aadhaar Card";

  const onStep2 = () => {
    if (!idType) return setKycError("Select your ID type.");
    if (!idNumber.trim()) return setKycError("Enter your ID number.");
    if (isAadhaar && idNumber.replace(/\s/g, "").length !== 12) {
      return setKycError("Aadhaar number must be 12 digits.");
    }
    if (!idDocumentFile) return setKycError("Upload a photo of your ID document.");
    if (!photoFile) return setKycError("Upload a recent photo of yourself.");
    setKycError("");
    setStep(3);
  };

  const onFinalSubmit = async () => {
    if (!details || !idDocumentFile || !photoFile || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitProviderApplication({
        fullName: details.fullName.trim(),
        gender: details.gender,
        nationality: details.nationality.trim(),
        categoryId: details.categoryId,
        area: details.area.trim(),
        city: details.city.trim(),
        mobileNumber: details.mobileNumber,
        whatsappNumber: details.whatsappNumber,
        email: details.email.trim().toLowerCase(),
        password: details.password,
        kyc: {
          idType,
          idNumber: idNumber.trim(),
          idDocumentFile,
          photoFile,
        },
      });
      setSubmitted(true);
      toast({ title: "Application submitted", description: "Our team will verify your documents and get in touch.", variant: "success" });
    } catch (err) {
      const description = err instanceof ApiError ? err.message : err instanceof Error ? err.message : undefined;
      toast({ title: "Couldn't submit application", description, variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryName = categories.find((c) => c.id === details?.categoryId)?.name;

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
          <h1 className="font-display text-h2">Application received!</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
            Thanks for registering with Help Zone. Our team will verify your documents and reach out on WhatsApp once your profile is approved.
          </p>
          <Link href="/" className="btn btn-primary btn-lg mt-6">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-center gap-2.5">
        <LogoMark size={28} />
        <span className="font-display text-lg font-semibold">Help Zone</span>
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

        {/* ===== Step 1: Your Details ===== */}
        {step === 1 && (
          <>
            <span
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
            >
              <Icon name="briefcase" className="h-6 w-6" />
            </span>
            <h1 className="font-display text-h2">Register as a Provider</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              List your profile for free. Verified providers get more requests from customers.
            </p>

            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onStep1)}>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="fullName">Full Name</label>
                <input id="fullName" placeholder="Full Name" className={`field ${errors.fullName ? "field-error" : ""}`} {...register("fullName")} />
                {errors.fullName && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="gender">Gender</label>
                <select id="gender" defaultValue="" className={`field ${errors.gender ? "field-error" : ""}`} {...register("gender")}>
                  <option value="" disabled>Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                {errors.gender && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.gender.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="nationality">Nationality</label>
                <input id="nationality" placeholder="e.g. Filipino" className={`field ${errors.nationality ? "field-error" : ""}`} {...register("nationality")} />
                {errors.nationality && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.nationality.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="categoryId">Service you provide</label>
                <select id="categoryId" defaultValue="" className={`field ${errors.categoryId ? "field-error" : ""}`} {...register("categoryId")}>
                  <option value="" disabled>Select a service</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="area">Area</label>
                <input id="area" placeholder="e.g. Koramangala" list="area-options" className={`field ${errors.area ? "field-error" : ""}`} {...register("area")} />
                <datalist id="area-options">
                  {areas.map((a) => <option key={a} value={a} />)}
                </datalist>
                {errors.area && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.area.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="city">City</label>
                <input id="city" placeholder="e.g. Bengaluru" className={`field ${errors.city ? "field-error" : ""}`} {...register("city")} />
                {errors.city && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.city.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="mobileNumber">Mobile Number</label>
                <input id="mobileNumber" placeholder="Enter Mobile No" inputMode="numeric" className={`field ${errors.mobileNumber ? "field-error" : ""}`} {...register("mobileNumber")} />
                {errors.mobileNumber && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.mobileNumber.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="whatsappNumber">WhatsApp Number</label>
                <input id="whatsappNumber" placeholder="Enter WhatsApp No" inputMode="numeric" className={`field ${errors.whatsappNumber ? "field-error" : ""}`} {...register("whatsappNumber")} />
                {errors.whatsappNumber && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.whatsappNumber.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">Email Address</label>
                <input id="email" placeholder="Email Address" type="email" className={`field ${errors.email ? "field-error" : ""}`} {...register("email")} />
                {errors.email && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">Password</label>
                <div className="relative">
                  <input id="password" placeholder="Password" className={`field pr-12 ${errors.password ? "field-error" : ""}`} type={showPassword ? "text" : "password"} {...register("password")} />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name={showPassword ? "eye-off" : "eye"} className="h-4 w-4" style={{ color: "var(--muted)" }} />
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.password.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" placeholder="Confirm Password" className={`field ${errors.confirmPassword ? "field-error" : ""}`} type={showPassword ? "text" : "password"} {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={isValidatingStep1} className="btn btn-primary btn-lg sm:col-span-2">
                Continue to KYC →
              </button>
            </form>
          </>
        )}

        {/* ===== Step 2: KYC Documents ===== */}
        {step === 2 && (
          <>
            <span
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: "var(--locked-soft)", color: "var(--locked)" }}
            >
              <Icon name="shield" className="h-6 w-6" />
            </span>
            <h1 className="font-display text-h2">Verify your identity</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              We verify every provider&apos;s ID before they go live — this keeps customers safe and gets you more bookings.
            </p>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="idType">ID Type</label>
                <select id="idType" value={idType} onChange={(e) => setIdType(e.target.value)} className="field">
                  <option value="" disabled>Select ID type</option>
                  {ID_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="idNumber">
                  {isAadhaar ? "Aadhaar Number" : "ID Number"}
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
                {isAadhaar && <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Your 12-digit Aadhaar number, as printed on the card.</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  {idType ? `Upload ${idType}` : "Upload ID Document"}
                </label>
                <label
                  htmlFor="idDocument"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors hover:border-[var(--primary)]"
                  style={{ borderColor: "var(--line)" }}
                >
                  <Icon name="upload" className="h-6 w-6" style={{ color: "var(--muted)" }} />
                  <span className="text-sm font-semibold">
                    {idDocumentFile ? idDocumentFile.name : "Click to upload (JPG, PNG or PDF)"}
                  </span>
                  <input
                    id="idDocument"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setIdDocumentFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">Upload Your Photo</label>
                <label
                  htmlFor="photo"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors hover:border-[var(--primary)]"
                  style={{ borderColor: "var(--line)" }}
                >
                  <Icon name="image" className="h-6 w-6" style={{ color: "var(--muted)" }} />
                  <span className="text-sm font-semibold">
                    {photoFile ? photoFile.name : "Click to upload a recent photo"}
                  </span>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              {kycError && <p className="text-xs" style={{ color: "var(--error)" }}>{kycError}</p>}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
              <button type="button" onClick={onStep2} className="btn btn-primary">Review Application →</button>
            </div>
          </>
        )}

        {/* ===== Step 3: Review & Submit ===== */}
        {step === 3 && details && (
          <>
            <span
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: "var(--success-soft)", color: "var(--success)" }}
            >
              <Icon name="check-circle" className="h-6 w-6" />
            </span>
            <h1 className="font-display text-h2">Review &amp; submit</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Double-check your details before submitting for verification.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="rounded-xl p-4" style={{ background: "var(--line-light)" }}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Personal &amp; Contact</p>
                <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
                  <dt style={{ color: "var(--muted)" }}>Name</dt><dd className="font-medium">{details.fullName}</dd>
                  <dt style={{ color: "var(--muted)" }}>Gender</dt><dd className="font-medium">{details.gender}</dd>
                  <dt style={{ color: "var(--muted)" }}>Nationality</dt><dd className="font-medium">{details.nationality}</dd>
                  <dt style={{ color: "var(--muted)" }}>Service</dt><dd className="font-medium">{categoryName}</dd>
                  <dt style={{ color: "var(--muted)" }}>Location</dt><dd className="font-medium">{details.area}, {details.city}</dd>
                  <dt style={{ color: "var(--muted)" }}>Mobile</dt><dd className="font-medium">{details.mobileNumber}</dd>
                  <dt style={{ color: "var(--muted)" }}>WhatsApp</dt><dd className="font-medium">{details.whatsappNumber}</dd>
                  <dt style={{ color: "var(--muted)" }}>Email</dt><dd className="font-medium">{details.email}</dd>
                </dl>
              </div>

              <div className="rounded-xl p-4" style={{ background: "var(--line-light)" }}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>KYC Documents</p>
                <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
                  <dt style={{ color: "var(--muted)" }}>ID Type</dt><dd className="font-medium">{idType}</dd>
                  <dt style={{ color: "var(--muted)" }}>ID Number</dt><dd className="font-medium">{idNumber}</dd>
                  <dt style={{ color: "var(--muted)" }}>ID Document</dt>
                  <dd className="flex items-center gap-1.5 font-medium"><Icon name="check-circle" className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />{idDocumentFile?.name}</dd>
                  <dt style={{ color: "var(--muted)" }}>Photo</dt>
                  <dd className="flex items-center gap-1.5 font-medium"><Icon name="check-circle" className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />{photoFile?.name}</dd>
                </dl>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setStep(2)} disabled={isSubmitting} className="btn btn-outline">← Back</button>
              <button type="button" onClick={onFinalSubmit} disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? "Submitting…" : "Submit Application"}
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <p className="mt-5 text-center text-sm" style={{ color: "var(--muted)" }}>
            Looking to hire instead?{" "}
            <Link href="/signup" className="font-semibold" style={{ color: "var(--primary)" }}>
              Create a customer account
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
