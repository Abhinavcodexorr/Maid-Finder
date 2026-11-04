import { getCustomerToken } from "@/lib/services/live-customer-auth";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  /** Shown as "Ananya G." — never a full name. */
  name: string;
  createdAt: string;
  mine: boolean;
}

export interface ReviewSummary {
  count: number;
  average: number | null;
  reviews: Review[];
}

function authHeaders(): Record<string, string> {
  const token = getCustomerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Reviews for one professional. A failure (or an unknown id) reads as "no reviews yet". */
export async function fetchReviews(providerId: string): Promise<ReviewSummary> {
  try {
    const response = await fetch(`/api/providers/${encodeURIComponent(providerId)}/reviews`, { cache: "no-store", headers: authHeaders() });
    const data = await response.json();
    if (!response.ok || !data?.success) return { count: 0, average: null, reviews: [] };
    return { count: data.count ?? 0, average: data.average ?? null, reviews: data.data ?? [] };
  } catch {
    return { count: 0, average: null, reviews: [] };
  }
}

/** Posts (or edits) the signed-in customer's review. Throws with the backend's message when refused. */
export async function submitReview(providerId: string, rating: number, comment: string): Promise<Review> {
  const response = await fetch(`/api/providers/${encodeURIComponent(providerId)}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ rating, comment }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) throw new Error(data?.message || "Couldn't post your review. Please try again.");
  return data.data as Review;
}
