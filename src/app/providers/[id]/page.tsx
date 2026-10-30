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
import { ServiceGlyph } from "@/components/ui/service-glyph";

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

  const whatsappHref = masked.phone ? `https://wa.me/${masked.phone.replace(/\D/g, "")}` : undefined;
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
  const facts: Array<{ icon: "briefcase" | "clock" | "award" | "user" | "globe" | "calendar"; label: string; value: string }> = [
    provider.experienceYears > 0 ? { icon: "briefcase" as const, label: "Experience", value: `${provider.experienceYears} ${provider.experienceYears === 1 ? "year" : "years"}` } : null,
    { icon: "clock" as const, label: "Availability", value: titleCase(availability) },
    provider.education ? { icon: "award" as const, label: "Education", value: provider.education } : null,
    provider.age > 0 ? { icon: "calendar" as const, label: "Age", value: `${provider.age} years` } : null,
    provider.nationality ? { icon: "globe" as const, label: "Nationality", value: provider.nationality } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  const card = "rounded-3xl border bg-white p-6 shadow-sm";
  const cardStyle = { borderColor: "var(--line)" };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="container-page py-3">
          <Link href="/providers" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
            <Icon name="arrow-left" className="h-4 w-4" /> Back to professionals
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <section className="border-b" style={{ borderColor: "var(--line)", background: "var(--gradient-hero)" }}>
        <div className="container-page py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-[2rem] border-4 border-white shadow-xl md:h-44 md:w-44">
                {provider.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={provider.photo} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <Avatar
                    initials={`${provider.firstName[0] ?? ""}${provider.lastName[0] ?? ""}`}
                    className="h-full w-full text-5xl"
                    rounded="rounded-none"
                    color={catColor.color}
                    soft={catColor.soft}
                  />
                )}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.05)} className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-h1">{fullName}</h1>
                {provider.verified && (
                  <span className="pill pill-success">
                    <Icon name="shield" className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>

              {category?.name && (
                <p className="mt-1 text-base font-semibold" style={{ color: "var(--primary)" }}>
                  {category.name}
                  {services.length > 1 && <span className="font-medium" style={{ color: "var(--muted)" }}> · +{services.length - 1} more</span>}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                {provider.experienceYears > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 font-medium" style={{ borderColor: "var(--line)" }}>
                    <Icon name="briefcase" className="h-4 w-4" style={{ color: "var(--primary)" }} />
                    {provider.experienceYears} yrs experience
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 font-medium" style={{ borderColor: "var(--line)" }}>
                    <Icon name="map-pin" className="h-4 w-4" style={{ color: "var(--primary)" }} />
                    {location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 font-medium capitalize" style={{ borderColor: "var(--line)" }}>
                  <Icon name="clock" className="h-4 w-4" style={{ color: "var(--primary)" }} />
                  {availability}
                </span>
                {typeof provider.rating === "number" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 font-semibold" style={{ borderColor: "var(--line)" }}>
                    <Icon name="star" className="h-4 w-4" style={{ color: "var(--accent)" }} />
                    {provider.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={onToggleSave} className="btn btn-outline btn-sm !rounded-full !bg-white">
                  <Icon name={saved ? "heart-filled" : "heart"} className="h-4 w-4" style={saved ? { color: "var(--error)" } : {}} />
                  {saved ? "Saved" : "Save"}
                </button>
                <button type="button" onClick={onShare} className="btn btn-outline btn-sm !rounded-full !bg-white">
                  <Icon name="share" className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {provider.about.trim() && (
            <motion.div {...fadeUp(0.1)} className={card} style={cardStyle}>
              <h2 className="font-display text-h3 mb-3">About</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>{provider.about}</p>
            </motion.div>
          )}

          <motion.div {...fadeUp(0.15)} className={card} style={cardStyle}>
            <h2 className="font-display text-h3 mb-4">At a glance</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--surface-muted)" }}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white" style={{ color: "var(--primary)" }}>
                    <Icon name={f.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>{f.label}</p>
                    <p className="truncate text-sm font-semibold">{f.value}</p>
                  </div>
                </div>
              ))}
              {provider.price > 0 && (
                <div className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--surface-muted)" }}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white" style={{ color: "var(--primary)" }}>
                    <Icon name={isSubscribed ? "tag" : "lock"} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>Expected salary</p>
                    <p className="truncate text-sm font-semibold">{masked.priceMasked}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {services.length > 0 && (
            <motion.div {...fadeUp(0.2)} className={card} style={cardStyle}>
              <h2 className="font-display text-h3 mb-4">Services offered</h2>
              <div className="flex flex-wrap gap-2.5">
                {services.map((name) => (
                  <span key={name} className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold" style={{ background: "var(--primary-soft)", color: "var(--primary-dark)" }}>
                    <ServiceGlyph name={name} className="h-4 w-4" />
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {provider.languages.length > 0 && (
            <motion.div {...fadeUp(0.25)} className={card} style={cardStyle}>
              <h2 className="font-display text-h3 mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {provider.languages.map((lang) => (
                  <span key={lang} className="rounded-full border px-3.5 py-1.5 text-sm font-medium" style={{ borderColor: "var(--line)" }}>{lang}</span>
                ))}
              </div>
            </motion.div>
          )}

          {provider.previousWork && (
            <motion.div {...fadeUp(0.3)} className={card} style={cardStyle}>
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

          {provider.introVideoUrl && (
            <motion.div {...fadeUp(0.35)} className={card} style={cardStyle}>
              <h2 className="font-display text-h3 mb-4">Video introduction</h2>
              <video src={provider.introVideoUrl} controls playsInline preload="metadata" className="max-h-[28rem] w-full rounded-2xl bg-black" />
            </motion.div>
          )}

          {provider.verified && (
            <motion.div {...fadeUp(0.4)} className="flex items-start gap-3 rounded-3xl p-5" style={{ background: "var(--success-soft)" }}>
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

        {/* Right Column — Contact Card */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="h-fit lg:sticky lg:top-24">
          {isSubscribed ? (
            <div className="overflow-hidden rounded-3xl p-6 text-white shadow-xl" style={{ background: "var(--gradient-primary)" }}>
              <div className="mb-4 flex items-center gap-2">
                <Icon name="unlock" className="h-4 w-4 text-white/70" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Contact details</span>
              </div>
              <div className="space-y-3">
                {provider.price > 0 && (
                  <div>
                    <p className="text-xs text-white/60">Expected salary</p>
                    <p className="font-display text-xl font-semibold">{masked.priceMasked}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-white/60">Phone</p>
                  <p className="text-lg font-semibold">{masked.phoneMasked}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a href={`tel:${masked.phone}`} className="btn" style={{ background: "white", color: "var(--primary)" }}>
                  <Icon name="phone" className="h-4 w-4" /> Call
                </a>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn" style={{ background: "#25D366", color: "white" }}>
                  <Icon name="chat" className="h-4 w-4" /> WhatsApp
                </a>
              </div>
              <div className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-center text-xs text-white/70">
                <Icon name="check" className="mr-1 inline h-3 w-3" />
                Unlocked with your active membership
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border p-6 shadow-xl" style={{ background: "var(--locked-soft)", borderColor: "var(--line)" }}>
              <div className="mb-4 flex items-center gap-2" style={{ color: "var(--locked)" }}>
                <Icon name="lock" className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Contact details</span>
              </div>
              <div className="space-y-3">
                {["Phone", "WhatsApp"].map((label) => (
                  <div key={label} className="flex items-center justify-between rounded-xl border bg-white/60 p-3" style={{ borderColor: "var(--locked)", borderStyle: "dashed" }}>
                    <span className="text-sm font-medium">{label}</span>
                    <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--locked)" }}>
                      <Icon name="lock" className="h-3.5 w-3.5" /> Protected
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm" style={{ color: "var(--ink-light)" }}>
                Contact details are available to members.
              </p>
              <button type="button" onClick={onUnlock} className="btn btn-locked mt-4 w-full">
                <Icon name="unlock" className="h-4 w-4" />
                Unlock contact details
              </button>
              <div className="mt-3 rounded-xl px-3 py-2 text-center text-xs" style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <Icon name="shield" className="mr-1 inline h-3 w-3" />
                One membership unlocks all providers
              </div>
            </div>
          )}
        </motion.div>
      </section>

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
