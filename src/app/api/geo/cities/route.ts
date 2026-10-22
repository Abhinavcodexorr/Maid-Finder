// Same-origin proxy for the free India districts-by-state dataset — see
// src/app/api/providers/list/route.ts for why this exists (CORS), and
// src/lib/india-geo.ts for the actual free, no-key source. "Districts"
// are shown as "city" in the UI — the closest granularity this free
// dataset offers, and what a state-then-city picker actually needs.
import { NextRequest, NextResponse } from "next/server";
import { fetchIndiaGeoData } from "@/lib/india-geo";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");
  if (!state) {
    return NextResponse.json({ success: false, message: "A state is required." }, { status: 400 });
  }
  try {
    const entries = await fetchIndiaGeoData();
    const match = entries.find((e) => e.name.toLowerCase() === state.toLowerCase());
    if (!match) {
      return NextResponse.json({ success: false, message: "Unknown state." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: [...match.districts].sort((a, b) => a.localeCompare(b)) });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not load the cities list." },
      { status: 502 }
    );
  }
}
