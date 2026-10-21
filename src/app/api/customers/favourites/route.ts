// Same-origin proxy for a customer's favourited providers — see
// src/app/api/providers/list/route.ts for why this exists (CORS).
// This endpoint is Bearer-token protected on the real backend, so the
// caller's Authorization header is forwarded through untouched.
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/user/favourites`, {
      headers: { Authorization: authorization },
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the customer service." },
      { status: 502 }
    );
  }
}
