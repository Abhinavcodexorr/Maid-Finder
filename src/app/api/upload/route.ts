// Same-origin proxy for the backend's generic file upload (image or video in,
// public URL out) — see src/app/api/providers/list/route.ts for why this
// exists (CORS).
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const authorization = request.headers.get("authorization");
    const upstream = await fetch(`${API_BASE_URL}/api/v1/upload`, {
      method: "POST",
      headers: authorization ? { Authorization: authorization } : undefined,
      body: formData,
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the upload service." },
      { status: 502 }
    );
  }
}
