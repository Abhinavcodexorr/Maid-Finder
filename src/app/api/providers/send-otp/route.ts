// Same-origin proxy for step 1 of helper registration (send the mobile OTP) —
// see src/app/api/providers/list/route.ts for why this exists (CORS).
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const upstream = await fetch(`${API_BASE_URL}/api/v1/providers/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobileNumber: body.mobileNumber, countryCode: body.countryCode }),
    });
    const data = await upstream.json();
    // devOtp is a dev-mode convenience the backend includes while SMS delivery
    // is stubbed; it must never reach the browser.
    delete data.devOtp;
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the provider service." },
      { status: 502 }
    );
  }
}
