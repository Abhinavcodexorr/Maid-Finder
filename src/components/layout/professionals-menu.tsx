"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { HoverMenu, MenuHeading, MenuItem } from "@/components/layout/hover-menu";
import type { CatalogService } from "@/lib/services";
import { fetchCatalogServices, fetchLiveProviders, getCategoryById } from "@/lib/services";
import { getFeaturedProvidersFrom } from "@/lib/services/providers";
import { colorForCategory } from "@/lib/category-colors";
import type { Provider } from "@/types/marketplace";
import { Shimmer } from "@/components/ui/shimmer";
import { ServiceGlyph, serviceImage } from "@/components/ui/service-glyph";

const MENU_PROFESSIONALS = 3;

const MENU_SPECIALISTS = 8;

const SCHEDULE_NOTE = {
  "full-time": "Full-day work",
  "part-time": "A few hours a day",
  "one-time": "Hours that suit you",
} as const;

/** "Find Professionals" nav item: opens a short list of professionals, each linking to their profile. */
export function ProfessionalsMenu({ active }: { active: boolean }) {
  const [all, setAll] = useState<Provider[] | null>(null);
  const [services, setServices] = useState<CatalogService[]>([]);
  const requested = useRef(false);

  // Loaded the first time the menu opens, so pages that never use it don't pay for the request.
  const load = () => {
    if (requested.current) return;
    requested.current = true;
    fetchCatalogServices()
      .then(setServices)
      .catch(() => {});
    fetchLiveProviders()
      .then(setAll)
      .catch(() => setAll([]));
  };

  // Start loading as soon as the header mounts so the menu is already filled the first time it opens.
  useEffect(load, []);

  const serviceNames = Object.fromEntries(services.map((svc) => [svc.key, svc.name]));
  const providers = all === null ? null : getFeaturedProvidersFrom(all, MENU_PROFESSIONALS);

  const specialists = services.slice(0, MENU_SPECIALISTS);
  const schedules = [
    { id: "full-time", label: "Full-time", note: SCHEDULE_NOTE["full-time"] },
    { id: "part-time", label: "Part-time", note: SCHEDULE_NOTE["part-time"] },
    { id: "one-time", label: "Flexible", note: SCHEDULE_NOTE["one-time"] },
  ];

  return (
    <HoverMenu label="Find Professionals" href="/providers" active={active} onOpen={load}>
      {(close) => (
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.4fr_340px]">
          <div>
            <MenuHeading>By type</MenuHeading>
            <MenuItem href="/providers" title="All professionals" note="Browse every verified profile" onClick={close} />
            {schedules.map((x) => (
              <MenuItem key={x.id} href={`/providers?availability=${x.id}`} title={x.label} note={x.note} onClick={close} />
            ))}
          </div>

          <div>
            <MenuHeading>Specialists</MenuHeading>
            {services.length === 0 && (
              <div className="space-y-3" aria-busy="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Shimmer key={i} className="h-12 rounded-2xl" />
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-6">
              {specialists.map((svc) => (
                <Link key={svc.key} href={`/providers?category=${svc.key}`} role="menuitem" onClick={close} className="group flex items-center gap-3 py-2.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--line-light)]">
                    {serviceImage(svc) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={serviceImage(svc)!} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ServiceGlyph name={svc.name} className="h-4 w-4 text-[var(--primary)]" />
                    )}
                  </span>
                  <span className="text-[16px] font-semibold leading-snug transition-colors group-hover:text-[var(--primary)]" style={{ color: "var(--ink)" }}>{svc.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-6" style={{ background: "var(--surface-muted)" }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--primary)" }}>New profiles</p>
            {providers === null && (
              <div className="mt-4 space-y-3" aria-busy="true">
                {Array.from({ length: MENU_PROFESSIONALS }).map((_, i) => (
                  <Shimmer key={i} className="h-12 rounded-2xl" />
                ))}
              </div>
            )}
            {providers !== null && providers.length === 0 && (
              <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>No professionals listed yet.</p>
            )}
            <div className="mt-3 space-y-1">
              {(providers ?? []).map((p) => {
                const color = colorForCategory(p.categoryId);
                return (
                  <Link key={p.id} href={`/providers/${p.id}`} role="menuitem" onClick={close} className="flex items-center gap-3 rounded-2xl py-2 transition-colors hover:text-[var(--primary)]">
                    <Avatar
                      initials={`${p.firstName[0]}${p.lastName[0] ?? ""}`}
                      imageUrl={p.photo}
                      color={color.color}
                      soft={color.soft}
                      rounded="rounded-full"
                      ring={false}
                      className="h-11 w-11 text-xs"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold">{p.firstName} {p.lastName ? `${p.lastName[0]}.` : ""}</span>
                      <span className="block truncate text-xs" style={{ color: "var(--muted)" }}>
                        {serviceNames[p.categoryId] ?? getCategoryById(p.categoryId)?.name ?? "Professional"} · {p.city || p.area}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
            <Link href="/providers" onClick={close} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--primary)" }}>
              Browse all professionals <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </HoverMenu>
  );
}
