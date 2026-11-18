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
import { FacePhotoCapture } from "@/components/ui/face-photo-capture";
import { VideoRecorder } from "@/components/ui/video-recorder";
import { toast } from "@/components/ui/toaster";
import type { ProviderApplicationProvider } from "@/lib/services";
import { COUNTRIES, COUNTRY_LIST, DEFAULT_COUNTRY, isCountryCode, normalizeMobile, type CountryCode, type IdDocument } from "@/lib/countries";

/* ================================================================
   CONSTANTS
   ================================================================ */
const OTP_LENGTH = 6;
const OTP_RESEND_SECONDS = 60;
/** Longest video KYC recording, in seconds — short enough to upload through the site's request-size limit. */
const VIDEO_MAX_SECONDS = 60;
const STEP_COUNT = 4;

type Phase = "mobile" | "otp" | "steps";
type Step = 1 | 2 | 3 | 4;

const detailsSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name"),
  lastName: z.string().trim().min(1, "Enter your last name"),
  state: z.string().min(1, "Select your state"),
  city: z.string().trim().min(1, "Select your city"),
  area: z.string().trim().optional(),
  pincode: z.string().optional(),
});

type DetailsValues = z.infer<typeof detailsSchema>;

/**
 * Where a returning provider should pick up: the first screen whose part of the
 * profile is still missing, or null when everything has been submitted.
 * A rejected application goes back to the start so it can be corrected.
 */
function nextStepFor(provider: ProviderApplicationProvider): Step | null {
  if (provider.applicationStatus === "rejected") return 1;
  const detailsDone = Boolean((provider.firstName || provider.fullName) && provider.categoryIds?.length && provider.city && provider.state);
  if (!detailsDone) return 1;
  const idDone = Boolean((provider.aadhaarFrontUrl && provider.aadhaarBackUrl) || provider.panCardUrl || provider.kycDocuments?.length);
  if (!idDone) return 2;
  if (!provider.imageUrl) return 3;
  if (!provider.introVideoUrl) return 4;
  return null;
}

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
      <div className="flex flex-1 items-center justify-center" role="progressbar" aria-valuemin={1} aria-valuemax={STEP_COUNT} aria-valuenow={step}>
        {Array.from({ length: STEP_COUNT }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex items-center">
            <span className="h-3.5 w-3.5 rounded-full" style={{ background: step >= s ? "var(--primary)" : "var(--line)" }} />
            {s < STEP_COUNT && <span className="h-0.5 w-10 sm:w-14" style={{ background: step > s ? "var(--primary)" : "var(--line)" }} />}
          </div>
        ))}
      </div>
      <span className="w-8" />
    </div>
  );
}

/** Example intro video; a shimmer holds its place until the first frame is ready. */
function SampleVideo() {
  const [ready, setReady] = useState(false);
  return (
    <div className={`relative aspect-[9/16] w-full max-w-[15rem] overflow-hidden rounded-2xl shadow-lg ${ready ? "bg-black" : "shimmer"}`}>
      <video
        src="/videos/sample-intro.mp4"
        controls
        playsInline
        preload="metadata"
        onLoadedData={() => setReady(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      />
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
      {file && (
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/55 py-2 text-xs font-semibold text-white">
          <Icon name="check-circle" className="h-4 w-4" /> Tap to replace
        </span>
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

/** Multi-select for "What work do you do?" — shows the chosen services as a comma list, like the app. */
function ServiceMultiSelect({
  services,
  selected,
  onChange,
  loading,
  error,
}: {
  services: CatalogService[];
  selected: string[];
  onChange: (keys: string[]) => void;
  loading: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const names = services.filter((s) => selected.includes(s.key)).map((s) => s.name);
  const toggle = (key: string) => onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);

  return (
    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`field flex w-full items-center justify-between text-left ${error ? "field-error" : ""}`}
      >
        <span className="truncate" style={{ color: names.length ? "var(--ink)" : "var(--faint)" }}>
          {names.length ? names.join(", ") : loading ? "Loading services…" : "Select"}
        </span>
        <Icon name="chevron-down" className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul role="listbox" aria-multiselectable className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border bg-white p-1.5 shadow-xl" style={{ borderColor: "var(--line)" }}>
          {services.map((svc) => {
            const checked = selected.includes(svc.key);
            return (
              <li key={svc.key} role="option" aria-selected={checked}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[var(--primary-soft)]">
                  <input type="checkbox" checked={checked} onChange={() => toggle(svc.key)} className="h-4 w-4 accent-[var(--primary)]" />
                  {svc.name}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

/* ================================================================
   PAGE
   ================================================================ */
export default function RegisterProviderPage() {
  const [phase, setPhase] = useState<Phase>("mobile");
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  /** Set when a returning provider has already completed every screen. */
  const [alreadyRegistered, setAlreadyRegistered] = useState<ProviderApplicationProvider["applicationStatus"] | null>(null);
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState("");

  // The country drives the phone format, region lists, services and which government IDs are accepted.
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const config = COUNTRIES[country];

  // Mobile + OTP
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  // Step 1: details
  const [services, setServices] = useState<CatalogService[]>([]);
  const [servicesStatus, setServicesStatus] = useState<"loading" | "ready" | "error">("loading");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [categoryError, setCategoryError] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Step 2: government ID
  const [idKey, setIdKey] = useState("");
  /** One file per side of the chosen document, keyed by the side's name. */
  const [idFiles, setIdFiles] = useState<Record<string, File | null>>({});
  const [docsError, setDocsError] = useState("");
  const idDoc: IdDocument | undefined = config.ids.find((d) => d.key === idKey);

  // Step 3: face photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");

  // Step 4: video KYC
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
    defaultValues: { firstName: "", lastName: "", state: "", city: "", area: "", pincode: "" },
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

  // The services list is the same for every country: whatever the services listing returns.
  useEffect(() => {
    loadServices();
  }, []);

  // The region list follows the chosen country.
  useEffect(() => {
    let cancelled = false;
    if (config.states) {
      setStates(config.states);
    } else {
      fetch("/api/geo/states")
        .then((res) => res.json())
        .then((data) => { if (!cancelled && data?.success) setStates(data.data); })
        .catch(() => {});
    }
    return () => { cancelled = true; };
  }, [country, config.states]);

  useEffect(() => {
    if (!selectedState || config.states) return;
    let cancelled = false;
    // Marks the fetch as in-flight — not state derivable from render.
    setCitiesLoading(true);
    fetch(`/api/geo/cities?state=${encodeURIComponent(selectedState)}`)
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setCities(data?.success ? data.data : []); })
      .catch(() => { if (!cancelled) setCities([]); })
      .finally(() => { if (!cancelled) setCitiesLoading(false); });
    return () => { cancelled = true; };
  }, [selectedState, config.states]);

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

  const onCountryChange = (next: CountryCode) => {
    if (next === country) return;
    setCountry(next);
    setStates([]);
    setCities([]);
    setValue("state", "");
    setValue("city", "");
    setIdKey("");
    setIdFiles({});
  };

  /* ---------- Mobile + OTP ---------- */
  const onSendOtp = async () => {
    if (!config.mobilePattern.test(mobile)) return setOtpError(`Enter a valid ${config.mobileLength}-digit mobile number.`);
    setOtpError("");
    setBusy(true);
    try {
      await sendProviderOtp(mobile, country);
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
      const { token: sessionToken, provider } = await verifyProviderOtp(mobile, otp, country);
      setToken(sessionToken);
      // A returning provider keeps the country their account was created in.
      const savedCountry = provider.country?.toUpperCase();
      if (isCountryCode(savedCountry) && savedCountry !== country) setCountry(savedCountry);
      // A returning provider who already saved some details starts with them filled in.
      const [fallbackFirst, ...fallbackRest] = (provider.fullName ?? "").split(" ").filter(Boolean);
      const savedFirst = provider.firstName || fallbackFirst;
      const savedLast = provider.lastName || fallbackRest.join(" ");
      if (savedFirst) setValue("firstName", savedFirst);
      if (savedLast) setValue("lastName", savedLast);
      if (provider.categoryIds?.length) setCategoryIds(provider.categoryIds);
      if (provider.state) setValue("state", provider.state);
      if (provider.city) setValue("city", provider.city);
      if (provider.area) setValue("area", provider.area);
      if (provider.pincode) setValue("pincode", provider.pincode);
      const resumeAt = nextStepFor(provider);
      if (resumeAt === null) {
        setAlreadyRegistered(provider.applicationStatus);
      } else {
        setStep(resumeAt);
        setPhase("steps");
      }
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
  // Best-effort: the provider's work area (postcode, else city + state) is turned
  // into coordinates so families can search by distance. Failing to find them
  // must never block registration — the profile then just has no map position.
  const findCoordinates = async (values: DetailsValues): Promise<{ latitude: number; longitude: number } | null> => {
    const hasPostal = values.pincode && new RegExp(`^\\d{${config.postalLength}}$`).test(values.pincode);
    const query = hasPostal ? `pincode=${values.pincode}` : `q=${encodeURIComponent(`${values.city}, ${values.state}`)}`;
    try {
      const place = await (await fetch(`/api/geo/locate?${query}&country=${country}`)).json();
      return place?.success ? { latitude: place.lat, longitude: place.lng } : null;
    } catch {
      return null;
    }
  };

  const onDetails = async (values: DetailsValues) => {
    if (categoryIds.length === 0) return setCategoryError("Select the work you do");
    if (values.pincode && !new RegExp(`^\\d{${config.postalLength}}$`).test(values.pincode)) {
      return toast({ title: `Enter a ${config.postalLength}-digit ${config.postalLabel.toLowerCase()} or leave it empty`, variant: "error" });
    }
    setCategoryError("");
    setBusy(true);
    try {
      const coordinates = await findCoordinates(values);
      await completeProviderProfile({
        token,
        country,
        firstName: values.firstName,
        lastName: values.lastName,
        categoryIds,
        state: values.state,
        city: values.city,
        area: values.area || values.city,
        pincode: values.pincode,
        ...coordinates,
      });
      setStep(2);
    } catch (err) {
      toast({ title: "Couldn't save your details", description: errorMessage(err), variant: "error" });
    } finally {
      setBusy(false);
    }
  };

  const onDocuments = async () => {
    if (!idDoc) return setDocsError("Select which government ID you want to upload.");
    const missing = idDoc.sides.find((side) => !idFiles[side]);
    if (missing) return setDocsError(idDoc.sides.length > 1 ? `Upload the ${missing.toLowerCase()} of your ${idDoc.label}.` : `Upload your ${idDoc.label}.`);
    setDocsError("");
    setBusy(true);
    try {
      const file = (side: string) => idFiles[side] ?? undefined;
      if (idDoc.legacy === "aadhaar") {
        await completeProviderProfile({ token, aadhaarFront: file("Front"), aadhaarBack: file("Back") });
      } else if (idDoc.legacy === "pan") {
        await completeProviderProfile({ token, panCard: file("Front") });
      } else {
        await completeProviderProfile({
          token,
          idDocuments: idDoc.sides.map((side) => ({ file: idFiles[side] as File, idType: `${idDoc.key}_${slug(side)}` })),
        });
      }
      setStep(3);
    } catch (err) {
      toast({ title: "Couldn't upload your ID", description: errorMessage(err), variant: "error" });
    } finally {
      setBusy(false);
    }
  };

  const onPhoto = async () => {
    if (!photoFile) return setPhotoError("Take a photo of your face to continue.");
    setPhotoError("");
    setBusy(true);
    try {
      await completeProviderProfile({ token, photo: photoFile });
      setStep(4);
    } catch (err) {
      toast({ title: "Couldn't upload your photo", description: errorMessage(err), variant: "error" });
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

  /* ---------- Already registered ---------- */
  if (alreadyRegistered) {
    const approved = alreadyRegistered === "approved";
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <div className="card">
          <span
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: approved ? "var(--success-soft)" : "var(--primary-soft)", color: approved ? "var(--success)" : "var(--primary)" }}
          >
            <Icon name={approved ? "check-circle" : "clock"} className="h-8 w-8" />
          </span>
          <h1 className="font-display text-h2">You&apos;re already registered</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
            {approved
              ? "Your profile is approved and visible to families. Nothing more to do here."
              : "Your profile is complete and under review. We'll let you know as soon as you're approved."}
          </p>
          <Link href="/" className="btn btn-primary btn-lg mt-6">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

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

  const checklist = (items: string[]) => (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px]" style={{ color: "var(--ink-light)" }}>
          <Icon name="check-circle" className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--success)" }} />
          {item}
        </li>
      ))}
    </ul>
  );

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
            <div className="flex items-center rounded-xl border bg-white focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-soft)]" style={{ borderColor: "var(--line)" }}>
              <select
                aria-label="Country"
                value={country}
                onChange={(e) => { onCountryChange(e.target.value as CountryCode); setMobile(""); setOtpError(""); }}
                className="cursor-pointer rounded-l-xl border-0 bg-transparent py-3.5 pl-3 pr-1 text-sm font-semibold outline-none focus:ring-0"
              >
                {COUNTRY_LIST.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.dialCode}</option>
                ))}
              </select>
              <input
                id="mobile"
                placeholder={config.mobilePlaceholder}
                inputMode="numeric"
                autoComplete="tel-national"
                value={mobile}
                onChange={(e) => setMobile(normalizeMobile(country, e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && onSendOtp()}
                className="min-w-0 flex-1 border-0 bg-transparent py-3.5 pr-4 text-sm outline-none focus:ring-0"
              />
            </div>
            <FieldError message={otpError} />

            <button type="button" onClick={onSendOtp} disabled={busy || !config.mobilePattern.test(mobile)} className="btn btn-primary btn-lg mt-5 w-full">
              {busy ? "Sending…" : (<>Continue <Icon name="arrow-right" className="h-4 w-4" /></>)}
            </button>
            <p className="mt-3 text-center text-xs" style={{ color: "var(--muted)" }}>A verification code will be sent to your mobile number.</p>
            <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
              By continuing you agree to our{" "}
              <Link href="/terms" className="font-semibold" style={{ color: "var(--primary)" }}>Terms of use</Link> and{" "}
              <Link href="/privacy" className="font-semibold" style={{ color: "var(--primary)" }}>Privacy Policy</Link>.
            </p>
          </>
        )}

        {/* ===== OTP ===== */}
        {phase === "otp" && (
          <>
            <h1 className="font-display text-h1">Enter verification code</h1>
            <p className="mt-3 flex items-center gap-3 text-sm" style={{ color: "var(--muted)" }}>
              Sent to {config.dialCode} {mobile}
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
                    <p className="mb-1.5 block text-sm font-semibold">What work do you do? <span style={{ color: "var(--error)" }}>*</span></p>
                    <ServiceMultiSelect
                      services={services}
                      selected={categoryIds}
                      onChange={(keys) => { setCategoryIds(keys); setCategoryError(""); }}
                      loading={servicesStatus === "loading"}
                      error={categoryError}
                    />
                    <FieldError message={categoryError} />
                    {servicesStatus === "error" && (
                      <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>
                        Couldn&apos;t load services.{" "}
                        <button type="button" onClick={loadServices} className="font-semibold underline">Try again</button>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="country">Country <span style={{ color: "var(--error)" }}>*</span></label>
                    <select id="country" className="field" value={country} onChange={(e) => onCountryChange(e.target.value as CountryCode)}>
                      {COUNTRY_LIST.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="state">{config.regionLabel} <span style={{ color: "var(--error)" }}>*</span></label>
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
                    {config.states ? (
                      <input id="city" className={`field ${errors.city ? "field-error" : ""}`} {...register("city")} />
                    ) : (
                      <select id="city" disabled={!selectedState || citiesLoading} className={`field ${errors.city ? "field-error" : ""}`} {...register("city")}>
                        <option value="">{citiesLoading ? "Loading cities…" : "Select"}</option>
                        {cities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    )}
                    <FieldError message={errors.city?.message} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="area">Area</label>
                    <input id="area" className="field" {...register("area")} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" htmlFor="pincode">{config.postalLabel}</label>
                    <input id="pincode" inputMode="numeric" maxLength={config.postalLength} className="field" {...register("pincode")} />
                  </div>
                </div>

                <div className="sticky bottom-0 -mx-6 mt-6 bg-white px-6 pb-1 pt-3 sm:-mx-8 sm:px-8">
                  <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full">
                    {busy ? "Saving…" : "Continue"}
                  </button>
                </div>
              </form>
            )}

            {/* ===== Step 2: Government ID ===== */}
            {step === 2 && (
              <>
                <h1 className="font-display text-h1">Upload your government ID</h1>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>Your photo and video are matched against it to confirm it is you.</p>
                {checklist([
                  "Use the original ID, not a photocopy or a screenshot",
                  "All four corners visible, with no glare or blur",
                  "Your photo, name and ID number are easy to read",
                ])}

                <label className="mb-1.5 mt-6 block text-sm font-semibold" htmlFor="idType">Government ID <span style={{ color: "var(--error)" }}>*</span></label>
                <select
                  id="idType"
                  className="field"
                  value={idKey}
                  disabled={busy}
                  onChange={(e) => { setIdKey(e.target.value); setIdFiles({}); setDocsError(""); }}
                >
                  <option value="">Select</option>
                  {config.ids.map((d) => (
                    <option key={d.key} value={d.key}>{d.label}</option>
                  ))}
                </select>

                {idDoc && (
                  <>
                    <p className="mb-2 mt-5 text-sm font-bold">{idDoc.label} <span style={{ color: "var(--error)" }}>*</span></p>
                    <div className={`grid gap-3 ${idDoc.sides.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                      {idDoc.sides.map((side) => (
                        <UploadTile
                          key={`${idDoc.key}-${side}`}
                          id={`id-${idDoc.key}-${slug(side)}`}
                          label={idDoc.sides.length > 1 ? `Upload ${side}` : `Upload ${idDoc.label}`}
                          file={idFiles[side] ?? null}
                          disabled={busy}
                          onChange={(f) => setIdFiles((prev) => ({ ...prev, [side]: f }))}
                        />
                      ))}
                    </div>
                  </>
                )}

                <FieldError message={docsError} />

                <div className="sticky bottom-0 -mx-6 mt-6 bg-white px-6 pb-1 pt-3 sm:-mx-8 sm:px-8">
                  <button type="button" onClick={onDocuments} disabled={busy} className="btn btn-primary btn-lg w-full">
                    {busy ? "Uploading…" : "Continue"}
                  </button>
                </div>
              </>
            )}

            {/* ===== Step 3: Face photo ===== */}
            {step === 3 && (
              <>
                <h1 className="font-display text-h1">Take a photo of your face</h1>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>We match it with the photo on your government ID.</p>
                {checklist([
                  "Face the camera in good light",
                  "Remove glasses, mask or cap",
                  "Only you in the photo, with your whole face in the frame",
                ])}

                <div className="mt-8">
                  <FacePhotoCapture file={photoFile} onChange={(f) => { setPhotoFile(f); setPhotoError(""); }} disabled={busy} />
                </div>
                <FieldError message={photoError} />

                <div className="sticky bottom-0 -mx-6 mt-6 bg-white px-6 pb-1 pt-3 sm:-mx-8 sm:px-8">
                  <button type="button" onClick={onPhoto} disabled={busy} className="btn btn-primary btn-lg w-full">
                    {busy ? "Uploading…" : "Continue"}
                  </button>
                </div>
              </>
            )}

            {/* ===== Step 4: Video KYC ===== */}
            {step === 4 && (
              <>
                <h1 className="font-display text-h1">Complete Video KYC</h1>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  Verify your identity with a quick video KYC. This helps us build a trusted community.
                </p>

                {videoPreview ? (
                  <video src={videoPreview} controls playsInline className="mt-6 aspect-video w-full rounded-2xl bg-black object-cover" />
                ) : (
                  <div className="mt-6 flex flex-col items-center">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>Watch a sample video</p>
                    <SampleVideo />
                    <p className="mt-3 max-w-xs text-center text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                      Say your name, where you are from, the services you provide, your experience and what you are best at.
                    </p>
                  </div>
                )}

                <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl p-5 text-center text-sm" style={{ background: "var(--primary-soft)", color: "var(--ink-light)" }}>
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="clock" className="h-6 w-6" />
                    Record up to 1 minute
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
                      <VideoRecorder maxSeconds={VIDEO_MAX_SECONDS} disabled={busy} onRecorded={setVideoFile} />
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
