"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useLocation } from "@/context/LocationContext";
import { RADIUS_OPTIONS } from "@/lib/geo";

/** Only pages that list or search professionals get the bar; everywhere else it would be noise. */
const SHOWN_PREFIXES = ["/providers", "/services", "/city", "/find-my-match"];

/**
 * Sits under the navbar on public pages. Until the visitor picks a place it
 * asks for one (device location or pincode); afterwards it shows the place
 * and the search radius, with a way to change either.
 */
export function LocationBar() {
  const pathname = usePathname();
  const { location, radiusKm, ready, promptDismissed, busy, error, detectFromDevice, setFromQuery, setRadiusKm, clear, dismissPrompt } = useLocation();
  const [editing, setEditing] = useState(false);
  const [place, setPlace] = useState("");

  const onListing = pathname === "/" || SHOWN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // First visit: raise the browser's own "Allow location access" popup. If it is blocked or
  // ignored we do not ask again on our own.
  const asked = useRef(false);
  useEffect(() => {
    if (!ready || !onListing || location || promptDismissed || asked.current) return;
    asked.current = true;
    detectFromDevice().then((ok) => {
      if (!ok) dismissPrompt();
    });
  }, [ready, onListing, location, promptDismissed, detectFromDevice, dismissPrompt]);

  if (!ready || !onListing) return null;

  const showForm = editing;

  const submitPlace = async () => {
    if (await setFromQuery(place)) {
      setPlace("");
      setEditing(false);
    }
  };

  const useDevice = async () => {
    if (await detectFromDevice()) setEditing(false);
  };

  // No saved place: the browser's own permission popup (raised above) is the only prompt — nothing is drawn.
  if (!location && !showForm) return null;

  return (
    <div className="border-b" style={{ background: showForm ? "var(--primary-soft)" : "var(--surface)", borderColor: "var(--line)" }}>
      <div className="container-page flex flex-wrap items-center gap-x-2 gap-y-2 py-2 text-sm sm:gap-x-4 sm:py-2.5">
        <span className={`items-center gap-2 font-semibold ${showForm ? "hidden sm:flex" : "flex"}`} style={{ color: "var(--ink)" }}>
          <Icon name="map-pin" className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
          {showForm ? (
            "See professionals near you"
          ) : (
            <>
              Near <span style={{ color: "var(--primary)" }}>{[location?.city, location?.state].filter(Boolean).join(", ") || "you"}</span>
            </>
          )}
        </span>

        {showForm ? (
          <>
            <button type="button" onClick={useDevice} disabled={busy} className="btn btn-primary btn-sm">
              <Icon name="compass" className="h-3.5 w-3.5" />
              {busy ? "Locating…" : "Use my location"}
            </button>
            <span className="hidden text-xs sm:inline" style={{ color: "var(--muted)" }}>or</span>
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                submitPlace();
              }}
            >
              <input
                value={place}
                onChange={(e) => setPlace(e.target.value.slice(0, 60))}
                placeholder="City or pincode"
                aria-label="City or pincode"
                className="field !w-36 !py-1.5 text-sm sm:!w-48"
              />
              <button type="submit" disabled={busy || place.trim().length < 3} className="btn btn-outline btn-sm">
                Go
              </button>
            </form>
            {error && <span className="text-xs" style={{ color: "var(--error)" }}>{error}</span>}
            <button
              type="button"
              onClick={() => {
                dismissPrompt();
                setEditing(false);
              }}
              aria-label="Not now"
              className="ml-auto rounded-full p-1 hover:bg-white/60"
            >
              <Icon name="x" className="h-4 w-4" style={{ color: "var(--muted)" }} />
            </button>
          </>
        ) : (
          <>
            <label className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--muted)" }}>
              Within
              <select
                value={radiusKm ?? "any"}
                onChange={(e) => setRadiusKm(e.target.value === "any" ? null : Number(e.target.value))}
                className="field !w-auto !py-1 !pr-8 text-xs"
                aria-label="Search radius"
              >
                {RADIUS_OPTIONS.map((km) => (
                  <option key={km} value={km}>{km} km</option>
                ))}
                <option value="any">Any distance</option>
              </select>
            </label>
            <button type="button" onClick={() => setEditing(true)} className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
              Change
            </button>
            <button type="button" onClick={clear} className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}
