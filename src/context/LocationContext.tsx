"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_RADIUS_KM, type UserLocation } from "@/lib/geo";

const LOCATION_KEY = "helpzone_user_location";
const RADIUS_KEY = "helpzone_user_radius";
const DISMISSED_KEY = "helpzone_location_prompt_dismissed";

interface LocationContextValue {
  location: UserLocation | null;
  /** Search radius in km, or null for "any distance". */
  radiusKm: number | null;
  /** True once saved values have been read from the browser, so UI doesn't flash the "ask" prompt first. */
  ready: boolean;
  promptDismissed: boolean;
  busy: boolean;
  error: string;
  detectFromDevice: () => Promise<boolean>;
  setFromPincode: (pincode: string) => Promise<boolean>;
  setRadiusKm: (radius: number | null) => void;
  clear: () => void;
  dismissPrompt: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

interface PlaceResponse {
  success: boolean;
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  pincode?: string;
  message?: string;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be blocked (private mode); the choice then lasts for this visit only.
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [radiusKm, setRadius] = useState<number | null>(DEFAULT_RADIUS_KM);
  const [ready, setReady] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Saved values can only be read in the browser, after hydration (reading them during the first render would not match the server's HTML).
  useEffect(() => {
    setLocation(readJson<UserLocation>(LOCATION_KEY));
    const savedRadius = readJson<{ km: number | null }>(RADIUS_KEY);
    if (savedRadius) setRadius(savedRadius.km);
    setPromptDismissed(readJson<boolean>(DISMISSED_KEY) === true);
    setReady(true);
  }, []);

  const save = useCallback((next: UserLocation) => {
    setLocation(next);
    writeJson(LOCATION_KEY, next);
    setPromptDismissed(true);
    writeJson(DISMISSED_KEY, true);
  }, []);

  const lookup = useCallback(async (query: string): Promise<PlaceResponse> => {
    const response = await fetch(`/api/geo/locate?${query}`);
    return (await response.json().catch(() => ({ success: false }))) as PlaceResponse;
  }, []);

  const detectFromDevice = useCallback(async () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Your browser can't share its location. Enter your pincode instead.");
      return false;
    }
    setBusy(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, maximumAge: 600000 })
      );
      const { latitude, longitude } = position.coords;
      const place = await lookup(`lat=${latitude}&lng=${longitude}`);
      save({ lat: latitude, lng: longitude, city: place.city ?? "", state: place.state ?? "", pincode: place.pincode || undefined });
      return true;
    } catch (err) {
      const denied = (err as GeolocationPositionError)?.code === 1;
      setError(denied ? "Location access was blocked. Enter your pincode instead." : "Couldn't get your location. Enter your pincode instead.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [lookup, save]);

  const setFromPincode = useCallback(
    async (pincode: string) => {
      setError("");
      if (!/^\d{6}$/.test(pincode)) {
        setError("Enter a valid 6-digit pincode.");
        return false;
      }
      setBusy(true);
      try {
        const place = await lookup(`pincode=${pincode}`);
        if (!place.success || place.lat === undefined || place.lng === undefined) {
          setError("We couldn't find that pincode.");
          return false;
        }
        save({ lat: place.lat, lng: place.lng, city: place.city ?? "", state: place.state ?? "", pincode });
        return true;
      } catch {
        setError("Couldn't look that up right now. Please try again.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [lookup, save]
  );

  const setRadiusKm = useCallback((km: number | null) => {
    setRadius(km);
    writeJson(RADIUS_KEY, { km });
  }, []);

  const clear = useCallback(() => {
    setLocation(null);
    setError("");
    try {
      window.localStorage.removeItem(LOCATION_KEY);
    } catch {
      // nothing saved to remove
    }
  }, []);

  const dismissPrompt = useCallback(() => {
    setPromptDismissed(true);
    writeJson(DISMISSED_KEY, true);
  }, []);

  const value = useMemo(
    () => ({ location, radiusKm, ready, promptDismissed, busy, error, detectFromDevice, setFromPincode, setRadiusKm, clear, dismissPrompt }),
    [location, radiusKm, ready, promptDismissed, busy, error, detectFromDevice, setFromPincode, setRadiusKm, clear, dismissPrompt]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside LocationProvider");
  return ctx;
}
