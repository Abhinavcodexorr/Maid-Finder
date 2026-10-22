// Same-origin proxy for the signed-in customer's own profile — GET to
// validate the stored session (used by verifyCustomerSession in
// live-customer-auth.ts) and PUT to update it (location, interests, so
// the admin panel can show it). Both forward to the same real-backend
// route under different methods, so they share this one file — see
// src/app/api/providers/list/route.ts for why a proxy exists at all
// (CORS), and why: Next.js dispatches by exported method name, so a GET
// and a PUT handler for the same path must live in the same route file
// or one silently replaces the other.
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
    return NextResponse.json({ success: false, message: "Could not reach the customer service." }, { status: 502 });
  }
}

export async function PUT(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
      method: "PUT",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ success: false, message: "Could not reach the customer service." }, { status: 502 });
  }
}
