// Same-origin proxy for validating the signed-in customer's session — see
// src/app/api/providers/list/route.ts for why this exists (CORS).
// Used to detect a stale session (the account was deleted/deactivated, or
// the token is otherwise no longer valid) so the app can log out instead
// of silently failing every subsequent request.
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
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
