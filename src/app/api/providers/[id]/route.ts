// Same-origin proxy for one live provider by id — see list/route.ts for why.
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";
import { cleanBody } from "@/lib/api-proxy";
import { sanitizeProviders, viewerIsMember } from "@/lib/provider-privacy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/providers/${id}`, {
      cache: "no-store",
    });
    const data = await upstream.json();
    const member = await viewerIsMember(request.headers.get("authorization"));
    return NextResponse.json(sanitizeProviders(cleanBody(data), member), { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the provider service." },
      { status: 502 }
    );
  }
}
