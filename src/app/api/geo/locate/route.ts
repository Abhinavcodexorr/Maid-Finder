// Turns a pincode / "city, state" into coordinates, or coordinates into a
// place name, using OpenStreetMap's free, no-key Nominatim service. It runs
// server-side because Nominatim requires an identifying User-Agent, and its
// usage policy (max ~1 request/second) is easier to respect from one place.
import { NextRequest, NextResponse } from "next/server";

const NOMINATIM = "https://nominatim.openstreetmap.org";
const HEADERS = { "User-Agent": "HelpZone/1.0 (helper and customer location lookup)", "Accept-Language": "en" };

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
}

function toPlace(lat: number, lng: number, address: NominatimAddress) {
  return {
    success: true,
    lat,
    lng,
    city: address.city || address.town || address.state_district || address.county || address.village || "",
    state: address.state || "",
    pincode: address.postcode || "",
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const pincode = params.get("pincode");
  const query = params.get("q");
  const lat = params.get("lat");
  const lng = params.get("lng");

  try {
    let url: string;
    if (lat && lng) {
      url = `${NOMINATIM}/reverse?format=jsonv2&addressdetails=1&zoom=12&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
    } else if (pincode && /^\d{6}$/.test(pincode)) {
      url = `${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=1&countrycodes=in&postalcode=${pincode}`;
    } else if (query) {
      url = `${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=1&countrycodes=in&q=${encodeURIComponent(query)}`;
    } else {
      return NextResponse.json({ success: false, message: "Send a pincode, q, or lat and lng." }, { status: 400 });
    }

    const upstream = await fetch(url, { headers: HEADERS, next: { revalidate: 86400 } });
    const data = await upstream.json();
    const hit = Array.isArray(data) ? data[0] : data;
    if (!hit || hit.error) return NextResponse.json({ success: false, message: "Location not found." }, { status: 404 });

    return NextResponse.json(toPlace(Number(hit.lat), Number(hit.lon), hit.address ?? {}));
  } catch {
    return NextResponse.json({ success: false, message: "Could not look up that location." }, { status: 502 });
  }
}
