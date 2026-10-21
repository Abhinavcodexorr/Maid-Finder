// Same-origin proxy for adding/removing one favourited provider — see
// src/app/api/providers/list/route.ts for why this exists (CORS), and
// favourites/route.ts for the Bearer-token forwarding this also does.
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

export async function POST(request: NextRequest, { params }: { params: Promise<{ maidId: string }> }) {
  const { maidId } = await params;
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/user/favourites/${maidId}`, {
      method: "POST",
      headers: { Authorization: authorization },
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ maidId: string }> }) {
  const { maidId } = await params;
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ success: false, message: "Not authorized." }, { status: 401 });
  }
  try {
    const upstream = await fetch(`${API_BASE_URL}/api/v1/user/favourites/${maidId}`, {
      method: "DELETE",
      headers: { Authorization: authorization },
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
