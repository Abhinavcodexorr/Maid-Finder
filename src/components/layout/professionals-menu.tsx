"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { HoverMenu } from "@/components/layout/hover-menu";
import { fetchCatalogServices, fetchLiveProviders, getCategoryById } from "@/lib/services";
import { getFeaturedProvidersFrom } from "@/lib/services/providers";
import { colorForCategory } from "@/lib/category-colors";
import type { Provider } from "@/types/marketplace";

const MENU_PROFESSIONALS = 6;

/** "Find Professionals" nav item: opens a short list of professionals, each linking to their profile. */
export function ProfessionalsMenu({ active }: { active: boolean }) {
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});
  const requested = useRef(false);

  // Loaded the first time the menu opens, so pages that never use it don't pay for the request.
  const load = () => {
    if (requested.current) return;
    requested.current = true;
    fetchCatalogServices()
      .then((list) => setServiceNames(Object.fromEntries(list.map((svc) => [svc.key, svc.name]))))
      .catch(() => {});
    fetchLiveProviders()
      .then((list) => setProviders(getFeaturedProvidersFrom(list, MENU_PROFESSIONALS)))
      .catch(() => setProviders([]));
  };

  return (
    <HoverMenu label="Find Professionals" href="/providers" active={active} onOpen={load}>
      {(close) => (
        <>
          {providers === null && <p className="p-4 text-sm" style={{ color: "var(--muted)" }}>Loading professionals…</p>}
          {providers !== null && providers.length === 0 && (
            <p className="p-4 text-sm" style={{ color: "var(--muted)" }}>No professionals listed yet.</p>
          )}

          <div className="grid grid-cols-2 gap-1">
            {(providers ?? []).map((p) => {
              const color = colorForCategory(p.categoryId);
              return (
                <Link
                  key={p.id}
                  href={`/providers/${p.id}`}
                  role="menuitem"
                  onClick={close}
                  className="flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-[var(--primary-soft)]"
                >
                  <Avatar
                    initials={`${p.firstName[0]}${p.lastName[0] ?? ""}`}
                    imageUrl={p.photo}
                    color={color.color}
                    soft={color.soft}
                    rounded="rounded-full"
                    ring={false}
                    className="h-10 w-10 text-xs"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {p.firstName} {p.lastName ? `${p.lastName[0]}.` : ""}
                    </span>
                    <span className="block truncate text-xs" style={{ color: "var(--muted)" }}>
                      {serviceNames[p.categoryId] ?? getCategoryById(p.categoryId)?.name ?? "Professional"} · {p.city || p.area}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <Link
            href="/providers"
            onClick={close}
            className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold"
            style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
          >
            Browse all professionals
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </>
      )}
    </HoverMenu>
  );
}
