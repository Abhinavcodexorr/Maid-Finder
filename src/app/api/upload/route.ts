// Same-origin proxy for the backend's generic file upload (image or video in,
// public URL out) — see src/app/api/providers/list/route.ts for why this
// exists (CORS).
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";
import { cleanBody } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData().catch(() => null);
    if (!formData || !(formData.get("file") instanceof File)) {
      return NextResponse.json({ success: false, message: "Choose a file to upload." }, { status: 400 });
    }
    const authorization = request.headers.get("authorization");
    const upstream = await fetch(`${API_BASE_URL}/api/v1/upload`, {
      method: "POST",
      headers: authorization ? { Authorization: authorization } : undefined,
      body: formData,
    });
    const data = await upstream.json();
    return NextResponse.json(cleanBody(data), { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the upload service." },
      { status: 502 }
    );
  }
}
