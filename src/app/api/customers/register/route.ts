// Same-origin proxy for customer (user) registration — see
// src/app/api/providers/list/route.ts for why this exists (CORS).
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";
import { cleanBody } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    // Same rules as the signup form, enforced here too so other callers can't create junk accounts.
    let input: { name?: unknown; email?: unknown; phone?: unknown; password?: unknown } = {};
    try {
      input = JSON.parse(raw);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
    }
    const email = typeof input.email === "string" ? input.email.trim() : "";
    const phone = typeof input.phone === "string" ? input.phone.trim() : "";
    const password = typeof input.password === "string" ? input.password : "";
    const name = typeof input.name === "string" ? input.name.trim() : "";
    let invalid: string | null = null;
    if (name.length < 2) invalid = "Enter your name.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) invalid = "Enter a valid email address.";
    else if (!/^[6-9]\d{9}$/.test(phone)) invalid = "Enter a valid 10-digit mobile number.";
    else if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) invalid = "Password must be at least 8 characters with a letter and a number.";
    if (invalid) return NextResponse.json({ success: false, message: invalid }, { status: 400 });
    const body = raw;
    const upstream = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await upstream.json();
    return NextResponse.json(cleanBody(data), { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the customer service." },
      { status: 502 }
    );
  }
}
