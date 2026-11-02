import { API_BASE_URL } from "@/lib/api-client";

// Identity documents are never sent to the browser, for anyone.
const NEVER_PUBLIC = [
  "aadhaarFrontUrl", "aadhaarBackUrl", "panCardUrl", "passportFrontUrl", "passportUrl",
  "otherIdProofUrl", "otherIdProof", "kycDocuments", "adminNotes", "moderationLog",
];
// Contact details are sent only to a signed-in customer with a membership.
const MEMBERS_ONLY = ["mobileNumber", "phone", "whatsappNumber", "email", "countryCode"];

/** True when the request carries a customer token whose account has a membership plan on the backend. */
export async function viewerIsMember(authorization: string | null): Promise<boolean> {
  if (!authorization) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/user/me`, { headers: { Authorization: authorization }, cache: "no-store" });
    if (!res.ok) return false;
    const body = await res.json();
    return Boolean(body?.success && body?.user?.planName);
  } catch {
    return false;
  }
}

function clean(provider: unknown, member: boolean): unknown {
  if (!provider || typeof provider !== "object") return provider;
  const copy: Record<string, unknown> = { ...(provider as Record<string, unknown>) };
  for (const key of NEVER_PUBLIC) delete copy[key];
  if (!member) for (const key of MEMBERS_ONLY) delete copy[key];
  // Favourites responses nest the provider under `maid`.
  if (copy.maid) copy.maid = clean(copy.maid, member);
  return copy;
}

/** Strips private fields from a backend response holding one provider, a list, or `{ data: provider(s) }`. */
export function sanitizeProviders<T>(body: T, member: boolean): T {
  if (!body || typeof body !== "object") return body;
  const out = { ...(body as Record<string, unknown>) };
  const data = out.data;
  out.data = Array.isArray(data) ? data.map((p) => clean(p, member)) : clean(data, member);
  return out as T;
}
