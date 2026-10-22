// Same-origin proxy for the free India states dataset — see
// src/app/api/providers/list/route.ts for why this exists (CORS), and
// src/lib/india-geo.ts for the actual free, no-key source.
import { NextResponse } from "next/server";
import { fetchIndiaGeoData } from "@/lib/india-geo";

export async function GET() {
  try {
    const entries = await fetchIndiaGeoData();
    const states = entries.map((e) => e.name).sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ success: true, data: states });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not load the states list." },
      { status: 502 }
    );
  }
}
