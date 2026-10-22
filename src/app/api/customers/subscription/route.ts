// Same-origin proxy for recording a plan purchase on the real backend (so the admin
// panel sees it). Bearer-token protected there, so the Authorization header is forwarded.
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/user/subscription`, {
      method: "POST",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ success: false, message: "Could not reach the subscription service." }, { status: 502 });
  }
}
