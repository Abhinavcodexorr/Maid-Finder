"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getProviderById, getCategoryById, getSimilarProviders, isSaved, toggleSaved, recordContactView } from "@/lib/services";
import { maskProvider } from "@/lib/services/providers";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toaster";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isSubscribed } = useAuth();
  const provider = getProviderById(id);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user && provider) setSaved(isSaved(user.id, provider.id));
  }, [user, provider]);

  useEffect(() => {
    if (user && provider && isSubscribed) recordContactView(user.id, provider.id);
  }, [user, provider, isSubscribed]);

  if (!provider) notFound();

  const category = getCategoryById(provider.categoryId);
  const masked = maskProvider(provider, isSubscribed);
  const similar = getSimilarProviders(provider, 3);
  const redirectTo = `/providers/${provider.id}`;

  const onUnlock = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }
    router.push(`/membership?redirect=${encodeURIComponent(redirectTo)}`);
  };

  const onToggleSave = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }
    const next = toggleSaved(user.id, provider.id);
    setSaved(next);
    toast({ title: next ? "Saved to your list" : "Removed from saved", variant: "success" });
  };

  const whatsappHref = masked.phone ? `https://wa.me/${masked.phone.replace(/\D/g, "")}` : undefined;

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
      <section className="border-b" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        <div className="container-page py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl shadow-lg md:h-40 md:w-40">
                {provider.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={provider.photo} alt={provider.firstName} className="h-full w-full object-cover" />
                ) : (
                  <Avatar
                    initials={`${provider.firstName[0]}${provider.lastName[0]}`}
                    className="h-full w-full text-4xl"
                    rounded="rounded-none"
                  />
                )}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div {...fadeUp(0.05)} className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-h1">{provider.firstName} {provider.lastName}</h1>
                {provider.verified && (
                  <span className="pill pill-success">
                    <Icon name="shield" className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm font-medium" style={{ color: "var(--primary)" }}>
                {category?.name}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <span className="flex items-center gap-1.5">
                  <Icon name="star" className="h-4 w-4" style={{ color: "var(--accent)" }} />
                  <span className="font-semibold" style={{ color: "var(--ink)" }}>{provider.rating.toFixed(1)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="briefcase" className="h-4 w-4" />
                  {provider.experienceYears} years experience
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="map-pin" className="h-4 w-4" />
                  {provider.area}, {provider.city}
                </span>
                <span className="flex items-center gap-1.5 capitalize">
                  <Icon name="clock" className="h-4 w-4" />
                  {provider.availabilityType}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={onToggleSave} className="btn btn-outline btn-sm">
                  <Icon
                    name={saved ? "heart-filled" : "heart"}
                    className="h-4 w-4"
                    style={saved ? { color: "var(--error)" } : {}}
                  />
                  {saved ? "Saved" : "Save"}
                </button>
                <button type="button" className="btn btn-outline btn-sm">
                  <Icon name="share" className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_340px]">
        {/* Left Column */}
        <div>
          {/* About */}
          <motion.div {...fadeUp(0.1)}>
            <h2 className="font-display text-h3 mb-3">About</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>
              {provider.about}
            </p>
          </motion.div>

          {/* Services */}
          <motion.div {...fadeUp(0.15)} className="mt-8">
            <h2 className="font-display text-h3 mb-3">Services</h2>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border px-3 py-1.5 text-sm font-medium"
                  style={{ borderColor: "var(--line)", color: "var(--ink-light)" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div {...fadeUp(0.2)} className="mt-8">
            <h2 className="font-display text-h3 mb-3">Experience & Details</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="card py-4 text-center">
                <p className="font-display text-2xl font-bold" style={{ color: "var(--primary)" }}>{provider.experienceYears}+</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Years Experience</p>
              </div>
              <div className="card py-4 text-center">
                <p className="font-display text-2xl font-bold" style={{ color: "var(--primary)" }}>{provider.rating}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Rating</p>
              </div>
              <div className="card py-4 text-center">
                <p className="font-display text-2xl font-bold capitalize" style={{ color: "var(--primary)" }}>{provider.availabilityType.split("-")[0]}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Availability</p>
              </div>
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div {...fadeUp(0.25)} className="mt-8">
            <h2 className="font-display text-h3 mb-3">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {provider.languages.map((lang) => (
                <span key={lang} className="pill pill-primary">{lang}</span>
              ))}
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div {...fadeUp(0.3)} className="mt-8">
            <h2 className="font-display text-h3 mb-3">Availability</h2>
            <div className="card flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--success-soft)", color: "var(--success)" }}>
                <Icon name="clock" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold capitalize">{provider.availabilityType}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Currently accepting new clients</p>
              </div>
            </div>
          </motion.div>

          {/* Verification */}
          {provider.verified && (
            <motion.div {...fadeUp(0.35)} className="mt-8">
              <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: "var(--success-soft)" }}>
                <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--success)" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--success)" }}>ID Verified</p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--ink-light)" }}>
                    This professional&apos;s identity has been checked by our team. Always confirm documents yourself before hiring.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column — Contact Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-fit lg:sticky lg:top-24"
        >
          {isSubscribed ? (
            /* UNLOCKED STATE */
            <div className="card border-0 text-white shadow-lg" style={{ background: "var(--gradient-primary)" }}>
              <div className="mb-4 flex items-center gap-2">
                <Icon name="unlock" className="h-4 w-4 text-white/70" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Contact Details</span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/60">Price</p>
                  <p className="font-display text-xl font-semibold">{masked.priceMasked}</p>
                </div>
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

              <div className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-center text-xs text-white/70">
                <Icon name="check" className="mr-1 inline h-3 w-3" />
                Unlocked with your active membership
              </div>
            </div>
          ) : (
            /* LOCKED STATE */
            <div className="card overflow-hidden border-0 shadow-lg" style={{ background: "var(--locked-soft)" }}>
              <div className="mb-4 flex items-center gap-2" style={{ color: "var(--locked)" }}>
                <Icon name="lock" className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Contact Details</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: "var(--locked)", borderStyle: "dashed", opacity: 0.6 }}>
                  <span className="text-sm">Phone</span>
                  <span className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--locked)" }}>
                    <Icon name="lock" className="h-3.5 w-3.5" /> Protected
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: "var(--locked)", borderStyle: "dashed", opacity: 0.6 }}>
                  <span className="text-sm">Email</span>
                  <span className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--locked)" }}>
                    <Icon name="lock" className="h-3.5 w-3.5" /> Protected
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: "var(--locked)", borderStyle: "dashed", opacity: 0.6 }}>
                  <span className="text-sm">WhatsApp</span>
                  <span className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--locked)" }}>
                    <Icon name="lock" className="h-3.5 w-3.5" /> Protected
                  </span>
                </div>
              </div>

              <p className="mt-4 text-center text-sm" style={{ color: "var(--ink-light)" }}>
                This professional&apos;s contact details are available to members.
              </p>

              <button type="button" onClick={onUnlock} className="btn btn-locked mt-4 w-full">
                <Icon name="unlock" className="h-4 w-4" />
                Unlock Contact Details
              </button>

              <div className="mt-3 rounded-lg px-3 py-2 text-center text-xs" style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <Icon name="shield" className="mr-1 inline h-3 w-3" />
                One membership unlocks all providers
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Similar Providers */}
      {similar.length > 0 && (
        <section style={{ background: "var(--line-light)" }}>
          <div className="container-page py-12">
            <h2 className="font-display text-h2 mb-6">Similar Professionals</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {similar.map((p) => {
                const cat = getCategoryById(p.categoryId);
                return (
                  <Link key={p.id} href={`/providers/${p.id}`} className="card card-hover flex gap-4">
                    <Avatar initials={`${p.firstName[0]}${p.lastName[0]}`} imageUrl={p.photo} className="h-14 w-14 shrink-0 text-base" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{p.firstName} {p.lastName[0]}.</p>
                      <p className="text-xs" style={{ color: "var(--primary)" }}>{cat?.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                        <span className="flex items-center gap-1">
                          <Icon name="star" className="h-3 w-3" style={{ color: "var(--accent)" }} />
                          {p.rating.toFixed(1)}
                        </span>
                        <span>{p.experienceYears} yrs</span>
                      </div>
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
