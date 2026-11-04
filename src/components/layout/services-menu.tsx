"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { HoverMenu, MenuHeading } from "@/components/layout/hover-menu";
import { fetchCatalogServices } from "@/lib/services";
import type { CatalogService } from "@/lib/services";
import { ServiceGlyph, serviceImage } from "@/components/ui/service-glyph";
import { Shimmer } from "@/components/ui/shimmer";

/** "Services" nav item: opens a list of every service, each linking to that service's professionals. */
export function ServicesMenu({ active }: { active: boolean }) {
  const [services, setServices] = useState<CatalogService[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCatalogServices()
      .then((list) => { if (!cancelled) setServices(list); })
      .catch(() => { if (!cancelled) setServices([]); });
    return () => { cancelled = true; };
  }, []);

  return (
    <HoverMenu label="Services" href="/services" active={active}>
      {(close) => (
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <MenuHeading>All services</MenuHeading>
            {services === null && (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3" aria-busy="true">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Shimmer key={i} className="h-12 rounded-2xl" />
                ))}
              </div>
            )}
            {services !== null && services.length === 0 && (
              <p className="text-sm" style={{ color: "var(--muted)" }}>Services are unavailable right now.</p>
            )}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 lg:grid-cols-3">
              {(services ?? []).map((svc) => (
                <Link
                  key={svc.key}
                  href={`/providers?category=${svc.key}`}
                  role="menuitem"
                  onClick={close}
                  className="group flex items-center gap-3 py-2.5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--line-light)]">
                    {serviceImage(svc) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={serviceImage(svc)!} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ServiceGlyph name={svc.name} className="h-4 w-4 text-[var(--primary)]" />
                    )}
                  </span>
                  <span className="text-[16px] font-semibold transition-colors group-hover:text-[var(--primary)]" style={{ color: "var(--ink)" }}>{svc.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/services" onClick={close} className="flex flex-col justify-between rounded-3xl p-6" style={{ background: "var(--surface-muted)" }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--primary)" }}>Every home need</p>
              <p className="font-display mt-2 text-xl font-extrabold leading-snug" style={{ color: "var(--ink)" }}>Verified help for every job at home</p>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>From cooking and cleaning to drivers and elder care — all ID-checked.</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--primary)" }}>
              View all services <Icon name="arrow-right" className="h-4 w-4" />
            </span>
          </Link>
        </div>
      )}
    </HoverMenu>
  );
}
