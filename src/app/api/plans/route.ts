// Same-origin proxy for the live Maid Finder BE's public plan list — see
// src/app/api/providers/list/route.ts for why this exists (CORS).
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function GET() {
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/plans`, {
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the plans service." },
      { status: 502 }
    );
  }
}
