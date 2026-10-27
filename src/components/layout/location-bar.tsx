"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useLocation } from "@/context/LocationContext";
import { RADIUS_OPTIONS } from "@/lib/geo";

/** Pages where asking for a location would just be noise. */
const HIDDEN_PREFIXES = ["/login", "/signup", "/register-helper", "/checkout", "/dashboard", "/forgot-password"];

/**
 * Sits under the navbar on public pages. Until the visitor picks a place it
 * asks for one (device location or pincode); afterwards it shows the place
 * and the search radius, with a way to change either.
 */
export function LocationBar() {
  const pathname = usePathname();
  const { location, radiusKm, ready, promptDismissed, busy, error, detectFromDevice, setFromPincode, setRadiusKm, clear, dismissPrompt } = useLocation();
  const [editing, setEditing] = useState(false);
  const [pincode, setPincode] = useState("");

  if (!ready || HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  const asking = !location && !promptDismissed;
  const showForm = asking || editing;
  if (!location && !showForm) return null;

  const submitPincode = async () => {
    if (await setFromPincode(pincode)) {
      setPincode("");
      setEditing(false);
    }
  };

  const useDevice = async () => {
    if (await detectFromDevice()) setEditing(false);
  };

  return (
    <div className="border-b" style={{ background: showForm ? "var(--primary-soft)" : "var(--surface)", borderColor: "var(--line)" }}>
      <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5 text-sm">
        <span className="flex items-center gap-2 font-semibold" style={{ color: "var(--ink)" }}>
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
            <span className="text-xs" style={{ color: "var(--muted)" }}>or</span>
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                submitPincode();
              }}
            >
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="Enter pincode"
                aria-label="Pincode"
                className="field !w-36 !py-1.5 text-sm"
              />
              <button type="submit" disabled={busy || pincode.length !== 6} className="btn btn-outline btn-sm">
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
