// Same-origin proxy for a customer updating their own profile (location, interests) on the real
// backend, so the admin panel can show it. Bearer-token protected there; the header is forwarded.
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

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
