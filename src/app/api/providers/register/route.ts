// Same-origin proxy for provider (helper) registration — see
// src/app/api/providers/list/route.ts for why this exists (CORS).
// Forwards the multipart form (photo + ID document files included) through
// to the real backend untouched.
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const upstream = await fetch(`${API_BASE_URL}/api/v1/providers/register`, {
      method: "POST",
      body: formData,
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
