"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  completeProviderProfile,
  fetchCatalogServices,
  sendProviderOtp,
  uploadMedia,
  verifyProviderOtp,
} from "@/lib/services";
import type { CatalogService } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { toast } from "@/components/ui/toaster";

/* ================================================================
   CONSTANTS
   ================================================================ */
const OTP_LENGTH = 6;
const OTP_RESEND_SECONDS = 60;
const MOBILE_PATTERN = /^[6-9][0-9]{9}$/;

type Phase = "mobile" | "otp" | "steps";
type Step = 1 | 2 | 3;

const detailsSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name"),
  lastName: z.string().trim().min(1, "Enter your last name"),
  gender: z.enum(["Male", "Female"], { error: "Select your gender" }),
  nationality: z.string().trim().min(1, "Enter your nationality"),
  categoryId: z.string().min(1, "Select the work you do"),
  state: z.string().min(1, "Select your state"),
  city: z.string().min(1, "Select your city"),
  area: z.string().trim().optional(),
  pincode: z.string().optional(),
});

type DetailsValues = z.infer<typeof detailsSchema>;

function formatCountdown(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong. Please try again.");

/* ================================================================
   SMALL PIECES
   ================================================================ */
function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>{message}</p> : null;
}

function StepHeader({ step, onBack }: { step: Step; onBack: () => void }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <button type="button" onClick={onBack} aria-label="Go back" className="-ml-1 rounded-full p-1.5 hover:bg-[var(--line-light)]">
        <Icon name="arrow-left" className="h-5 w-5" />
      </button>
      <div className="flex flex-1 items-center justify-center" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <span className="h-3.5 w-3.5 rounded-full" style={{ background: step >= s ? "var(--primary)" : "var(--line)" }} />
            {s < 3 && <span className="h-0.5 w-12 sm:w-16" style={{ background: step > s ? "var(--primary)" : "var(--line)" }} />}
          </div>
        ))}
      </div>
      <span className="w-8" />
    </div>
  );
}

function UploadTile({
  id,
  label,
  file,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  file: File | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}) {
  const preview = useMemo(() => (file?.type.startsWith("image/") ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  return (
    <label
      htmlFor={id}
      className={`relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border p-3 text-center transition-colors hover:border-[var(--primary)] ${disabled ? "pointer-events-none opacity-50" : ""}`}
      style={{ borderColor: file ? "var(--primary)" : "var(--line)", background: "var(--primary-soft)" }}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <Icon name={file ? "check-circle" : "upload"} className="h-7 w-7" style={{ color: "var(--primary)" }} />
          <span className="text-sm font-semibold leading-tight">{file ? file.name : label}</span>
        </>
      )}
      {preview && (
        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">{label}</span>
      )}
      <input
        id={id}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        disabled={disabled}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}

function OtpInput({ value, onChange, onComplete }: { value: string; onChange: (v: string) => void; onComplete: () => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

  const onInput = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) {
      const next = digits.slice();
      next[index] = "";
      return onChange(next.join(""));
    }
    // Pasting (or the keyboard's one-time-code suggestion) delivers several digits at once.
    const merged = (value.slice(0, index) + typed).slice(0, OTP_LENGTH);
    onChange(merged);
    refs.current[Math.min(merged.length, OTP_LENGTH - 1)]?.focus();
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "Enter") onComplete();
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={digit}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          autoFocus={i === 0}
          onChange={(e) => onInput(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="field h-14 min-w-0 flex-1 px-0 text-center text-xl font-semibold"
        />
      ))}
    </div>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function RegisterHelperPage() {
  const [phase, setPhase] = useState<Phase>("mobile");
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState("");

  // Mobile + OTP
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  // Step 1: details
  const [services, setServices] = useState<CatalogService[]>([]);
  const [servicesStatus, setServicesStatus] = useState<"loading" | "ready" | "error">("loading");
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Step 2: documents
  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const [panFront, setPanFront] = useState<File | null>(null);
  const [noPan, setNoPan] = useState(false);
  const [docsError, setDocsError] = useState("");

  // Step 3: video KYC
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoStage, setVideoStage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<DetailsValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { firstName: "", lastName: "", nationality: "Indian", categoryId: "", state: "", city: "", area: "", pincode: "" },
  });
  const selectedState = watch("state");

  const videoPreview = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : null), [videoFile]);
  useEffect(() => () => { if (videoPreview) URL.revokeObjectURL(videoPreview); }, [videoPreview]);

  const loadServices = () => {
    setServicesStatus("loading");
    fetchCatalogServices()
      .then((list) => {
        setServices(list);
        setServicesStatus("ready");
      })
      .catch(() => setServicesStatus("error"));
  };

  useEffect(() => {
    loadServices();
    fetch("/api/geo/states")
      .then((res) => res.json())
      .then((data) => { if (data?.success) setStates(data.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedState) return;
    let cancelled = false;
    // Marks the fetch as in-flight — not state derivable from render.
    setCitiesLoading(true);
    fetch(`/api/geo/cities?state=${encodeURIComponent(selectedState)}`)
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setCities(data?.success ? data.data : []); })
      .catch(() => { if (!cancelled) setCities([]); })
      .finally(() => { if (!cancelled) setCitiesLoading(false); });
    return () => { cancelled = true; };
  }, [selectedState]);

  // A prefilled city can only be selected once its options have rendered.
  useEffect(() => {
    const city = getValues("city");
    if (city && cities.includes(city)) setValue("city", city);
  }, [cities, getValues, setValue]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  /* ---------- Mobile + OTP ---------- */
  const onSendOtp = async () => {
    if (!MOBILE_PATTERN.test(mobile)) return setOtpError("Enter a valid 10-digit mobile number.");
    setOtpError("");
    setBusy(true);
    try {
      await sendProviderOtp(mobile);
      setOtp("");
      setResendIn(OTP_RESEND_SECONDS);
      setPhase("otp");
    } catch (err) {
      setOtpError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const onVerifyOtp = async () => {
    if (otp.length !== OTP_LENGTH || busy) return;
    setOtpError("");
    setBusy(true);
    try {
      const { token: sessionToken, provider } = await verifyProviderOtp(mobile, otp);
      setToken(sessionToken);
      // A returning helper who already saved some details starts with them filled in.
      const [fallbackFirst, ...fallbackRest] = (provider.fullName ?? "").split(" ").filter(Boolean);
      const savedFirst = provider.firstName || fallbackFirst;
      const savedLast = provider.lastName || fallbackRest.join(" ");
      if (savedFirst) setValue("firstName", savedFirst);
      if (savedLast) setValue("lastName", savedLast);
      if (provider.gender === "Male" || provider.gender === "Female") setValue("gender", provider.gender);
      if (provider.nationality) setValue("nationality", provider.nationality);
      if (provider.categoryIds?.[0]) setValue("categoryId", provider.categoryIds[0]);
      if (provider.state) setValue("state", provider.state);
      if (provider.city) setValue("city", provider.city);
      if (provider.area) setValue("area", provider.area);
      if (provider.pincode) setValue("pincode", provider.pincode);
      setPhase("steps");
    } catch (err) {
      setOtpError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const onChangeNumber = () => {
    setPhase("mobile");
    setOtp("");
    setOtpError("");
  };

  /* ---------- Steps ---------- */
  const onDetails = async (values: DetailsValues) => {
    setBusy(true);
    try {
      await completeProviderProfile({
        token,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        nationality: values.nationality,
        categoryIds: [values.categoryId],
        state: values.state,
        city: values.city,
        area: values.area || values.city,
        pincode: values.pincode,
      });
      setStep(2);
    } catch (err) {
      toast({ title: "Couldn't save your details", description: errorMessage(err), variant: "error" });
    } finally {
      setBusy(false);
    }
  };

  const onDocuments = async () => {
    if (!aadhaarFront || !aadhaarBack) return setDocsError("Upload both sides of your Aadhaar Card.");
    if (!noPan && !panFront) return setDocsError("Upload your PAN Card, or tick \"I don't have a PAN Card\".");
    setDocsError("");
    setBusy(true);
    try {
      await completeProviderProfile({
        token,
        aadhaarFront,
        aadhaarBack,
        panCard: noPan ? undefined : (panFront ?? undefined),
      });
      setStep(3);
    } catch (err) {
      toast({ title: "Couldn't upload your documents", description: errorMessage(err), variant: "error" });
    } finally {
      setBusy(false);
    }
  };

  const onSubmitVideo = async () => {
    if (!videoFile) return;
    setBusy(true);
    try {
      setVideoStage("Uploading video…");
      const introVideoUrl = await uploadMedia(videoFile, token);
      setVideoStage("Saving…");
      await completeProviderProfile({ token, introVideoUrl });
      setSubmitted(true);
    } catch (err) {
      toast({ title: "Couldn't upload your video", description: errorMessage(err), variant: "error" });
    } finally {
      setBusy(false);
      setVideoStage("");
    }
  };

  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  /* ---------- Success ---------- */
  if (submitted) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <div className="card">
          <span
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "var(--success-soft)", color: "var(--success)" }}
          >
            <Icon name="check-circle" className="h-8 w-8" />
          </span>
          <h1 className="font-display text-h2">You&apos;re all set!</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
            Thanks for joining Help Zone. We&apos;ll verify your documents and let you know once you&apos;re approved to start getting job requests.
          </p>
          <Link href="/" className="btn btn-primary btn-lg mt-6">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <div className="card p-6 sm:p-8">
        <div className="mb-6 flex justify-center">
          <Logo size={34} />
        </div>

        {/* ===== Mobile number ===== */}
        {phase === "mobile" && (
          <>
            <h1 className="font-display text-h1">Start earning with us.</h1>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Register as a service provider and connect with customers near you.
            </p>

            <label className="mb-1.5 mt-8 block text-sm font-semibold" htmlFor="mobile">Mobile number</label>
            <div className="flex items-center rounded-xl border bg-white pl-4 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-soft)]" style={{ borderColor: "var(--line)" }}>
              <span className="pr-3 text-sm font-semibold">+91</span>
              <input
                id="mobile"
                placeholder="98765 XXXXX"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={(e) => e.key === "Enter" && onSendOtp()}
                className="min-w-0 flex-1 border-0 bg-transparent py-3.5 pr-4 text-sm outline-none focus:ring-0"
              />
            </div>
            <FieldError message={otpError} />

            <button type="button" onClick={onSendOtp} disabled={busy || !MOBILE_PATTERN.test(mobile)} className="btn btn-primary btn-lg mt-5 w-full">
              {busy ? "Sending…" : (<>Continue <Icon name="arrow-right" className="h-4 w-4" /></>)}
            </button>
            <p className="mt-3 text-center text-xs" style={{ color: "var(--muted)" }}>A verification code will be sent to your mobile number.</p>
            <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
              By continuing you agree to our{" "}
              <Link href="/faqs" className="font-semibold" style={{ color: "var(--primary)" }}>Terms of use</Link> and{" "}
              <Link href="/faqs" className="font-semibold" style={{ color: "var(--primary)" }}>Privacy Policy</Link>.
            </p>
          </>
        )}

        {/* ===== OTP ===== */}
        {phase === "otp" && (
          <>
            <h1 className="font-display text-h1">Enter verification code</h1>
            <p className="mt-3 flex items-center gap-3 text-sm" style={{ color: "var(--muted)" }}>
              Sent to +91 {mobile.slice(0, 5)} {mobile.slice(5)}
              <button type="button" onClick={onChangeNumber} className="font-semibold" style={{ color: "var(--primary)" }}>Change</button>
            </p>

            <div className="mt-6">
              <OtpInput value={otp} onChange={setOtp} onComplete={onVerifyOtp} />
            </div>
            <FieldError message={otpError} />

            <button type="button" onClick={onVerifyOtp} disabled={busy || otp.length !== OTP_LENGTH} className="btn btn-primary btn-lg mt-6 w-full">
              {busy ? "Verifying…" : "Verify"}
            </button>
            <p className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
              {resendIn > 0 ? (
                <>Resend OTP in {formatCountdown(resendIn)}</>
              ) : (
                <button type="button" onClick={onSendOtp} disabled={busy} className="font-semibold" style={{ color: "var(--primary)" }}>
                  Resend OTP
                </button>
              )}
            </p>
          </>
        )}

        {phase === "steps" && (
          <>
            <StepHeader step={step} onBack={goBack} />

            {/* ===== Step 1: Tell us about yourself ===== */}
            {step === 1 && (
              <form onSubmit={handleSubmit(onDetails)} noValidate>
                <h1 className="font-display text-h1">Tell us about yourself</h1>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>Please provide your basic information to create your account.</p>

                <div className="mt-6 flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="firstName">First name <span style={{ color: "var(--error)" }}>*</span></label>
                    <input id="firstName" className={`field ${errors.firstName ? "field-error" : ""}`} {...register("firstName")} />
                    <FieldError message={errors.firstName?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="lastName">Last name <span style={{ color: "var(--error)" }}>*</span></label>
                    <input id="lastName" className={`field ${errors.lastName ? "field-error" : ""}`} {...register("lastName")} />
                    <FieldError message={errors.lastName?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="gender">Gender <span style={{ color: "var(--error)" }}>*</span></label>
                    <select id="gender" className={`field ${errors.gender ? "field-error" : ""}`} {...register("gender")}>
                      <option value="">Select</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    <FieldError message={errors.gender?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="nationality">Nationality <span style={{ color: "var(--error)" }}>*</span></label>
                    <input id="nationality" className={`field ${errors.nationality ? "field-error" : ""}`} {...register("nationality")} />
                    <FieldError message={errors.nationality?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="categoryId">What work do you do? <span style={{ color: "var(--error)" }}>*</span></label>
                    <select id="categoryId" className={`field ${errors.categoryId ? "field-error" : ""}`} {...register("categoryId")}>
                      <option value="">{servicesStatus === "loading" ? "Loading services…" : "Select"}</option>
                      {services.map((svc) => (
                        <option key={svc.key} value={svc.key}>{svc.name}</option>
                      ))}
                    </select>
                    <FieldError message={errors.categoryId?.message} />
                    {servicesStatus === "error" && (
                      <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>
                        Couldn&apos;t load services.{" "}
                        <button type="button" onClick={loadServices} className="font-semibold underline">Try again</button>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="state">State <span style={{ color: "var(--error)" }}>*</span></label>
                    <select
                      id="state"
                      className={`field ${errors.state ? "field-error" : ""}`}
                      {...register("state", { onChange: () => { setCities([]); setValue("city", ""); } })}
                    >
                      <option value="">Select</option>
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <FieldError message={errors.state?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="city">City <span style={{ color: "var(--error)" }}>*</span></label>
                    <select id="city" disabled={!selectedState || citiesLoading} className={`field ${errors.city ? "field-error" : ""}`} {...register("city")}>
                      <option value="">{citiesLoading ? "Loading cities…" : "Select"}</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <FieldError message={errors.city?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="area">Area</label>
                    <input id="area" className="field" {...register("area")} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="pincode">Pincode</label>
                    <input id="pincode" inputMode="numeric" maxLength={6} className="field" {...register("pincode")} />
                  </div>
                </div>

                <div className="sticky bottom-0 -mx-6 mt-6 bg-white px-6 pb-1 pt-3 sm:-mx-8 sm:px-8">
                  <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full">
                    {busy ? "Saving…" : "Continue"}
                  </button>
                </div>
              </form>
            )}

            {/* ===== Step 2: Upload your documents ===== */}
            {step === 2 && (
              <>
                <h1 className="font-display text-h1">Upload your documents</h1>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>Please upload clear and valid documents.</p>

                <p className="mb-3 mt-6 text-sm font-semibold">Aadhaar Card <span style={{ color: "var(--error)" }}>*</span></p>
                <div className="grid grid-cols-2 gap-3">
                  <UploadTile id="aadhaarFront" label="Upload Aadhaar Front" file={aadhaarFront} disabled={busy} onChange={setAadhaarFront} />
                  <UploadTile id="aadhaarBack" label="Upload Aadhaar Back" file={aadhaarBack} disabled={busy} onChange={setAadhaarBack} />
                </div>

                <hr className="my-6" style={{ borderColor: "var(--line)" }} />

                <p className="mb-3 text-sm font-semibold">PAN Card <span style={{ color: "var(--error)" }}>*</span></p>
                <div className="grid grid-cols-2 gap-3">
                  <UploadTile id="panFront" label="Upload PAN Front" file={noPan ? null : panFront} disabled={busy || noPan} onChange={setPanFront} />
                </div>
                <label className="mt-4 flex items-center gap-2.5 text-sm">
                  <input type="checkbox" checked={noPan} onChange={(e) => setNoPan(e.target.checked)} />
                  I don&apos;t have a PAN Card
                </label>

                <FieldError message={docsError} />

                <div className="sticky bottom-0 -mx-6 mt-6 bg-white px-6 pb-1 pt-3 sm:-mx-8 sm:px-8">
                  <button type="button" onClick={onDocuments} disabled={busy} className="btn btn-primary btn-lg w-full">
                    {busy ? "Uploading…" : "Continue"}
                  </button>
                </div>
              </>
            )}

            {/* ===== Step 3: Video KYC ===== */}
            {step === 3 && (
              <>
                <h1 className="font-display text-h1">Complete Video KYC</h1>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  Verify your identity with a quick video KYC. This helps us build a trusted community.
                </p>

                {videoPreview ? (
                  <video src={videoPreview} controls playsInline className="mt-6 aspect-video w-full rounded-2xl bg-black object-cover" />
                ) : (
                  <div className="mt-8 flex justify-center">
                    <div className="relative flex h-48 w-48 items-center justify-center rounded-full" style={{ background: "var(--primary-soft)" }}>
                      <Icon name="user" className="h-24 w-24" style={{ color: "var(--primary)" }} />
                      <span className="absolute bottom-3 right-1 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-white" style={{ background: "var(--error)" }}>
                        <Icon name="video" className="h-6 w-6" />
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl p-5 text-center text-sm" style={{ background: "var(--primary-soft)", color: "var(--ink-light)" }}>
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="clock" className="h-6 w-6" />
                    Takes 2 to 5 minutes
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="shield" className="h-6 w-6" />
                    Safe and secure
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {videoFile ? (
                    <>
                      <button type="button" onClick={onSubmitVideo} disabled={busy} className="btn btn-primary btn-lg w-full">
                        {busy ? videoStage || "Submitting…" : "Submit"}
                      </button>
                      <button type="button" onClick={() => setVideoFile(null)} disabled={busy} className="btn btn-outline w-full">
                        Record again
                      </button>
                    </>
                  ) : (
                    <>
                      <label htmlFor="videoKyc" className="btn btn-primary btn-lg w-full cursor-pointer">
                        Start Video KYC
                        <input
                          id="videoKyc"
                          type="file"
                          accept="video/*"
                          capture="user"
                          className="hidden"
                          onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      <button type="button" onClick={() => setSubmitted(true)} className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                        Skip for now
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
