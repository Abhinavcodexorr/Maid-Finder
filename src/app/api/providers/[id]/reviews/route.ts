// Same-origin proxy for a provider's customer reviews (list is public, posting needs a customer token).
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";
import { cleanBody, fetchUpstream } from "@/lib/api-proxy";

const unreachable = () => NextResponse.json({ success: false, message: "Could not reach the reviews service." }, { status: 502 });

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const authorization = request.headers.get("authorization");
    const upstream = await fetchUpstream(`${API_BASE_URL}/api/v1/providers/${encodeURIComponent(id)}/reviews`, {
      headers: authorization ? { Authorization: authorization } : undefined,
      cache: "no-store",
    });
    const data = await upstream.json();
    return NextResponse.json(cleanBody(data), { status: upstream.status });
  } catch {
    return unreachable();
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const authorization = request.headers.get("authorization");
    const body = await request.json().catch(() => ({}));
    const upstream = await fetch(`${API_BASE_URL}/api/v1/providers/${encodeURIComponent(id)}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(authorization ? { Authorization: authorization } : {}) },
      body: JSON.stringify({ rating: body?.rating, comment: body?.comment }),
      cache: "no-store",
    });
    const data = await upstream.json().catch(() => ({ success: false, message: "Unexpected response." }));
    return NextResponse.json(cleanBody(data), { status: upstream.status });
  } catch {
    return unreachable();
  }
}
