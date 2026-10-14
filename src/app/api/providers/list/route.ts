// Same-origin proxy for the live Maid Finder BE's provider listing.
//
// The browser calls this route (same origin as the site, so no CORS), and
// this route — running server-side in Next.js — forwards the request to the
// real backend. Server-to-server requests aren't subject to CORS at all, so
// this works regardless of the backend's allowedOrigins list, and keeps
// working no matter which port `next dev` happens to pick locally.
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const qs = request.nextUrl.search;
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/providers/list${qs}`, {
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the provider service." },
      { status: 502 }
    );
  }
}
