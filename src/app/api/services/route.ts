// Same-origin proxy for the live Maid Finder BE's public service catalog —
// see src/app/api/providers/list/route.ts for why this exists (CORS).
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function GET() {
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/services`, {
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the services catalog." },
      { status: 502 }
    );
  }
}
