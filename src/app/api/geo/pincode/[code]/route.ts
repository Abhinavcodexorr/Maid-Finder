// Same-origin proxy for India Post's free, no-key pincode lookup
// (api.postalpincode.in) — used to resolve a provider's work state/city
// from the 6-digit pincode they type, instead of a hardcoded list of
// states and cities. Normalizes the (sometimes verbose, multi-post-office)
// upstream response down to the one state/city pair the form needs.
import { NextRequest, NextResponse } from "next/server";

interface PostOffice {
  State: string;
  District: string;
}
interface PincodeResult {
  Status: string;
  PostOffice: PostOffice[] | null;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ success: false, message: "Enter a valid 6-digit pincode." }, { status: 400 });
  }
  try {
    const upstream = await fetch(`https://api.postalpincode.in/pincode/${code}`, { cache: "no-store" });
    const data: PincodeResult[] = await upstream.json();
    const postOffice = data?.[0]?.PostOffice?.[0];
    if (data?.[0]?.Status !== "Success" || !postOffice) {
      return NextResponse.json({ success: false, message: "No location found for this pincode." }, { status: 404 });
    }
    return NextResponse.json({ success: true, state: postOffice.State, city: postOffice.District });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the pincode lookup service." },
      { status: 502 }
    );
  }
}
