// The geolocator package ships no type definitions; this covers the parts we call.
declare module "geolocator" {
  export interface GeolocatorLocation {
    coords: { latitude: number; longitude: number; accuracy?: number };
    address?: { city?: string; state?: string; region?: string; postalCode?: string };
    /** Set when the result came from an IP look-up instead of the device. */
    provider?: string;
  }
  export interface GeolocatorOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    fallbackToIP?: boolean;
    addressLookup?: boolean;
  }
  export interface GeoIpSource {
    provider: string;
    url: string;
    xhr?: boolean;
    schema: (response: Record<string, unknown>) => unknown;
  }
  const geolocator: {
    locate(options: GeolocatorOptions, callback: (error: Error | null, location: GeolocatorLocation | null) => void): void;
    setGeoIPSource(source: GeoIpSource): void;
  };
  export default geolocator;
}
