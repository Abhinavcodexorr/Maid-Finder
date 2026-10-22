// Same-origin proxy for a provider's profile-completion step (general
// info + work preferences + multiple KYC documents + intro video) — see
// src/app/api/providers/list/route.ts for why this exists (CORS).
// Bearer-token protected on the real backend, so the caller's
// Authorization header is forwarded through untouched.
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const upstream = await fetch(`${API_BASE_URL}/api/v1/providers/me/complete-profile`, {
      method: "POST",
      headers: { Authorization: authorization },
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
