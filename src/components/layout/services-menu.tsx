"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { HoverMenu } from "@/components/layout/hover-menu";
import { fetchCatalogServices } from "@/lib/services";
import type { CatalogService } from "@/lib/services";
import { emojiForService } from "@/lib/service-emoji";

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
    <HoverMenu label="Services" href="/services" active={active} width="min(760px,92vw)">
      {(close) => (
        <>
          {services === null && <p className="p-4 text-sm" style={{ color: "var(--muted)" }}>Loading services…</p>}
          {services !== null && services.length === 0 && (
            <p className="p-4 text-sm" style={{ color: "var(--muted)" }}>Services are unavailable right now.</p>
          )}

          <div className="grid max-h-[calc(100vh-11rem)] grid-cols-2 gap-1 overflow-y-auto lg:grid-cols-3">
            {(services ?? []).map((svc) => (
              <Link
                key={svc.key}
                href={`/providers?category=${svc.key}`}
                role="menuitem"
                onClick={close}
                className="flex items-center gap-3 rounded-2xl p-2.5 text-sm font-semibold transition-colors hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--line-light)] text-lg">
                  {svc.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={svc.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    emojiForService(svc.name)
                  )}
                </span>
                {svc.name}
              </Link>
            ))}
          </div>

          <Link
            href="/services"
            onClick={close}
            className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold"
            style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
          >
            View all services
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </>
      )}
    </HoverMenu>
  );
}
