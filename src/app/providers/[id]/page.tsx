"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getProviderById, getCategoryById, getSimilarProviders, getSimilarProvidersFrom, getCachedFavouriteIds, toggleFavouriteCached, recordContactView, fetchLiveProviderById, fetchLiveProviders } from "@/lib/services";
import { maskProvider } from "@/lib/services/providers";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toaster";
import { colorForCategory } from "@/lib/category-colors";
import type { Provider } from "@/types/marketplace";
import { Shimmer } from "@/components/ui/shimmer";
import { ProviderVideo } from "@/components/ui/provider-video";
import { ServiceGlyph } from "@/components/ui/service-glyph";
import { intlPhone } from "@/lib/phone";

const titleCase = (value: string) => value.toLowerCase().replace(/(^|[\s-])([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase());

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isSubscribed } = useAuth();
  const [provider, setProvider] = useState<Provider | null | undefined>(undefined);
  const [similar, setSimilar] = useState<Provider[]>([]);
  const [saved, setSaved] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  // Live providers first (real backend IDs); falls back to the mock catalog
  // so any link into the original demo data keeps working too.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const live = await fetchLiveProviderById(id);
      if (cancelled) return;
      if (live) {
        setProvider(live);
        fetchLiveProviders().then((list) => {
          if (!cancelled) setSimilar(getSimilarProvidersFrom(list, live, 3));
        });
        return;
      }
      const mock = getProviderById(id) ?? null;
      setProvider(mock);
      if (mock) setSimilar(getSimilarProviders(mock, 3));
    })();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!user || !provider) return;
    let cancelled = false;
    getCachedFavouriteIds()
      .then((ids) => { if (!cancelled) setSaved(ids.has(provider.id)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user, provider]);

  useEffect(() => {
    if (user && provider && isSubscribed) recordContactView(user.id, provider.id);
  }, [user, provider, isSubscribed]);

  if (provider === undefined) {
    return (
      <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_2fr]" aria-busy="true">
        <Shimmer className="h-96 rounded-3xl" />
        <div className="space-y-4">
          <Shimmer className="h-10 w-2/3" />
          <Shimmer className="h-5 w-1/3" />
          <Shimmer className="h-40 rounded-2xl" />
          <Shimmer className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (!provider) notFound();

  const category = getCategoryById(provider.categoryId);
  const catColor = colorForCategory(provider.categoryId);
  const masked = maskProvider(provider, isSubscribed);
  const redirectTo = `/providers/${provider.id}`;

  const onUnlock = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }
    router.push(`/membership?redirect=${encodeURIComponent(redirectTo)}`);
  };

  const onToggleSave = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }
    try {
      const next = await toggleFavouriteCached(provider.id, saved);
      setSaved(next);
      toast({ title: next ? "Saved to your list" : "Removed from saved", variant: "success" });
    } catch (err) {
      toast({ title: "Couldn't update saved list", description: err instanceof Error ? err.message : undefined, variant: "error" });
    }
  };

  const whatsappHref = masked.phone ? `https://wa.me/${intlPhone(masked.phone)}` : undefined;
  const fullName = titleCase(`${provider.firstName} ${provider.lastName}`.trim());
  const availability = provider.availabilityType.replace("-", " ");
  const location = [provider.area, provider.city].filter((v, i, arr) => v && arr.indexOf(v) === i).join(", ");
  const services = provider.skills.length > 0 ? provider.skills : category ? [category.name] : [];

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `${fullName} on Help Zone`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Profile link copied", variant: "success" });
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  // Only facts the API actually returned are shown — empty ones are left out.
  // Nationality is deliberately never displayed.
  const stayLabel = (provider.stay ?? []).map((s) => (s === "live-in" ? "Live-in" : "Live-out")).join(" & ");
  const facts: Array<{ label: string; value: string }> = [
    provider.experienceYears > 0 ? { label: "Experience", value: `${provider.experienceYears} ${provider.experienceYears === 1 ? "year" : "years"}` } : null,
    location ? { label: "Location", value: location } : null,
    { label: "Availability", value: titleCase(availability) },
    stayLabel ? { label: "Stay", value: stayLabel } : null,
    provider.age > 0 ? { label: "Age", value: `${provider.age} years` } : null,
    provider.education ? { label: "Education", value: provider.education } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  const personal: Array<{ label: string; value: string }> = [
    provider.age > 0 ? { label: "Age", value: `${provider.age} years old` } : null,
    provider.education ? { label: "Education", value: provider.education } : null,
    location ? { label: "Based in", value: location } : null,
    { label: "Availability", value: titleCase(availability) },
    stayLabel ? { label: "Stay", value: stayLabel } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  const card = "rounded-3xl border bg-white p-6 shadow-sm";
  const cardStyle = { borderColor: "var(--line)" };

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-page pt-5">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
          <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/providers" className="hover:text-[var(--primary)]">All professionals</Link>
          <span aria-hidden>/</span>
          <span className="font-semibold" style={{ color: "var(--ink)" }}>{fullName}</span>
        </nav>
      </div>

      <section className="container-page grid gap-6 py-6 lg:grid-cols-[380px_1fr] lg:items-start lg:gap-8 lg:py-8">
        {/* Left — profile card + unlock card */}
        <motion.aside {...fadeUp(0)} className="space-y-5 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border bg-white p-3 shadow-sm" style={{ borderColor: "var(--line)" }}>
            <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-2xl" style={{ background: "var(--surface-muted)" }}>
              {provider.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={provider.photo} alt={fullName} className="h-full w-full object-cover object-top" />
              ) : provider.introVideoUrl ? (
                <ProviderVideo src={provider.introVideoUrl} size="lg" controlsWhenPlaying className="h-full w-full" />
              ) : (
                <Avatar
                  initials={`${provider.firstName[0] ?? ""}${provider.lastName[0] ?? ""}`}
                  className="h-full w-full text-7xl"
                  rounded="rounded-none"
                  color={catColor.color}
                  soft={catColor.soft}
                />
              )}
              {provider.photo && provider.introVideoUrl && (
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  aria-label="Play video introduction"
                  className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
                  style={{ background: "var(--primary)" }}
                >
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                </button>
              )}
              {provider.verified && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-white shadow-md" style={{ background: "var(--primary)" }}>
                  <Icon name="check" className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>

            <div className="px-3 pb-3 pt-5">
              <h1 className="font-display text-3xl font-extrabold leading-tight" style={{ color: "var(--ink)" }}>{fullName}</h1>
              {category?.name && (
                <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--primary)" }}>{category.name}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 text-[13px] font-medium">
                {provider.verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5" style={{ borderColor: "var(--line)" }}>
                    <Icon name="shield" className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} /> Verified profile
                  </span>
                )}
                {provider.introVideoUrl && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5" style={{ borderColor: "var(--line)" }}>
                    <Icon name="eye" className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} /> Video introduction
                  </span>
                )}
                {stayLabel && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5" style={{ borderColor: "var(--line)" }}>
                    <Icon name="home" className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} /> {stayLabel}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5" style={{ borderColor: "var(--line)" }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: "var(--success)" }} /> Available now
                </span>
              </div>

              {provider.price > 0 && (
                <div className="mt-5 rounded-2xl px-4 py-3.5" style={{ background: "var(--primary-soft)" }}>
                  <p className="font-display text-2xl font-extrabold" style={{ color: "var(--primary-dark)" }}>
                    ₹{provider.price.toLocaleString("en-IN")}
                    <span className="ml-1.5 text-sm font-medium" style={{ color: "var(--muted)" }}>/ month</span>
                  </p>
                </div>
              )}

              {isSubscribed && masked.phone ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn btn-primary !rounded-full">
                    <Icon name="chat" className="h-4 w-4" /> WhatsApp
                  </a>
                  <a href={`tel:+${intlPhone(masked.phone)}`} className="btn btn-outline !rounded-full">
                    <Icon name="phone" className="h-4 w-4" /> Call
                  </a>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button type="button" onClick={onUnlock} className="btn btn-primary !rounded-full">
                    <Icon name="lock" className="h-4 w-4" /> WhatsApp
                  </button>
                  <button type="button" onClick={onUnlock} className="btn btn-outline !rounded-full">
                    <Icon name="lock" className="h-4 w-4" /> Phone
                  </button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm" style={{ borderColor: "var(--line-light)" }}>
                <Link href="/providers" className="inline-flex items-center gap-1.5 font-medium hover:text-[var(--primary)]" style={{ color: "var(--muted)" }}>
                  <Icon name="arrow-left" className="h-4 w-4" /> Back to results
                </Link>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={onToggleSave} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-[var(--line-light)]" style={{ color: saved ? "var(--error)" : "var(--ink-light)" }}>
                    <Icon name={saved ? "heart-filled" : "heart"} className="h-4 w-4" />
                    {saved ? "Saved" : "Save"}
                  </button>
                  <button type="button" onClick={onShare} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-[var(--line-light)]" style={{ color: "var(--ink-light)" }}>
                    <Icon name="share" className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isSubscribed ? (
            <div className="rounded-3xl p-6 text-white shadow-lg" style={{ background: "var(--gradient-dark)" }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#93b4ff]">Membership active</p>
              <p className="mt-2 font-display text-xl font-bold">Contact {provider.firstName} directly</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">Your membership unlocks phone and WhatsApp for every professional on Help Zone.</p>
            </div>
          ) : (
            <div className="rounded-3xl p-6 text-white shadow-lg" style={{ background: "var(--gradient-dark)" }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#93b4ff]">Unlock contact details</p>
              <p className="mt-2 font-display text-xl font-bold">Talk to {provider.firstName} directly</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                Get phone and WhatsApp numbers for every professional on Help Zone — one membership, no commission.
              </p>
              <button type="button" onClick={onUnlock} className="btn mt-5 w-full !rounded-full" style={{ background: "white", color: "var(--primary-dark)" }}>
                <Icon name="unlock" className="h-4 w-4" />
                {user ? "View membership plans" : "Log in to unlock"}
              </button>
            </div>
          )}
        </motion.aside>

        {/* Right — details */}
        <div className="space-y-6">
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: "var(--line)" }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>{f.label}</p>
                <p className="mt-2 text-base font-bold leading-snug" style={{ color: "var(--ink)" }}>{f.value}</p>
              </div>
            ))}
          </motion.div>

          {provider.about.trim() && (
            <motion.div {...fadeUp(0.1)} className={card} style={cardStyle}>
              <h2 className="font-display text-h3 mb-3">About</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>{provider.about}</p>
            </motion.div>
          )}

          {(provider.languages.length > 0 || services.length > 0) && (
            <motion.div {...fadeUp(0.15)} className={card} style={cardStyle}>
              <h2 className="font-display text-h3 mb-5">Skills and expertise</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {provider.languages.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-bold">Languages</h3>
                    <div className="space-y-2">
                      {provider.languages.map((lang) => (
                        <div key={lang} className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: "var(--surface-muted)" }}>{lang}</div>
                      ))}
                    </div>
                  </div>
                )}
                {services.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-bold">Key skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {services.map((name) => (
                        <span key={name} className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium" style={{ borderColor: "var(--line)", color: "var(--ink-light)" }}>
                          <ServiceGlyph name={name} className="h-3.5 w-3.5 text-[var(--primary)]" />
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {personal.length > 0 && (
            <motion.div {...fadeUp(0.2)} className={card} style={cardStyle}>
              <h2 className="font-display text-h3 mb-2">Personal information</h2>
              <dl>
                {personal.map((row) => (
                  <div key={row.label} className="grid grid-cols-[130px_1fr] gap-4 border-b py-4 last:border-b-0 sm:grid-cols-[200px_1fr]" style={{ borderColor: "var(--line-light)" }}>
                    <dt className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>{row.label}</dt>
                    <dd className="text-base font-semibold" style={{ color: "var(--ink)" }}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          )}

          {provider.previousWork && (
            <motion.div {...fadeUp(0.25)} className={card} style={cardStyle}>
              <h2 className="font-display text-h3 mb-4">Previous work</h2>
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                  <Icon name="briefcase" className="h-5 w-5" />
                </span>
                <div>
                  {provider.previousWork.title && <p className="text-sm font-bold">{provider.previousWork.title}</p>}
                  <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
                    {[
                      provider.previousWork.city,
                      provider.previousWork.years ? `${provider.previousWork.years} ${provider.previousWork.years === "1" ? "year" : "years"}` : null,
                      provider.previousWork.familySize ? `Family of ${provider.previousWork.familySize}` : null,
                    ].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {provider.verified && (
            <motion.div {...fadeUp(0.3)} className="flex items-start gap-3 rounded-3xl p-5" style={{ background: "var(--success-soft)" }}>
              <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--success)" }} />
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--success)" }}>ID verified</p>
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--ink-light)" }}>
                  This professional&apos;s identity has been checked by our team. Always confirm documents yourself before hiring.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {videoOpen && provider.introVideoUrl && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={() => setVideoOpen(false)} role="dialog" aria-modal="true" aria-label="Video introduction">
          <div className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setVideoOpen(false)} aria-label="Close video" className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
              <Icon name="x" className="h-4 w-4" />
            </button>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={provider.introVideoUrl} controls autoPlay playsInline className="max-h-[80vh] w-full rounded-2xl bg-black" />
          </div>
        </div>
      )}

      {/* Similar Providers */}
      {similar.length > 0 && (
        <section style={{ background: "var(--surface-muted)" }}>
          <div className="container-page py-12">
            <h2 className="font-display text-h2 mb-6">Similar professionals</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {similar.map((p) => {
                const cat = getCategoryById(p.categoryId);
                return (
                  <Link key={p.id} href={`/providers/${p.id}`} className="flex items-center gap-4 rounded-3xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: "var(--line)" }}>
                    <Avatar initials={`${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`} imageUrl={p.photo} className="h-14 w-14 shrink-0 text-base" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{titleCase(`${p.firstName} ${p.lastName}`.trim())}</p>
                      {cat?.name && <p className="truncate text-xs font-medium" style={{ color: "var(--primary)" }}>{cat.name}</p>}
                      {(p.experienceYears > 0 || typeof p.rating === "number") && (
                        <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                          {typeof p.rating === "number" && (
                            <span className="flex items-center gap-1">
                              <Icon name="star" className="h-3 w-3" style={{ color: "var(--accent)" }} />
                              {p.rating.toFixed(1)}
                            </span>
                          )}
                          {p.experienceYears > 0 && <span>{p.experienceYears} yrs</span>}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
