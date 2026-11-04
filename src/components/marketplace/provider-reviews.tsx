"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/icon";
import { Shimmer } from "@/components/ui/shimmer";
import { toast } from "@/components/ui/toaster";
import { fetchReviews, submitReview, type ReviewSummary } from "@/lib/services/live-reviews";

const Stars = ({ value, size = "h-4 w-4" }: { value: number; size?: string }) => (
  <span className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon key={i} name="star" className={size} style={{ color: i < Math.round(value) ? "var(--accent)" : "var(--line)" }} />
    ))}
  </span>
);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Customer reviews for one professional, with a form for signed-in customers. Only real, posted reviews are shown. */
export function ProviderReviews({ providerId, providerName }: { providerId: string; providerName: string }) {
  const { user, isSubscribed } = useAuth();
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchReviews(providerId).then((s) => { if (!cancelled) setSummary(s); });
    return () => { cancelled = true; };
  }, [providerId, user?.id]);

  const mine = summary?.reviews.find((r) => r.mine);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (rating < 1) return setError("Choose a star rating.");
    if (comment.trim().length < 10) return setError("Write at least 10 characters.");
    setBusy(true);
    try {
      await submitReview(providerId, rating, comment.trim());
      toast({ title: mine ? "Review updated" : "Thanks for your review", variant: "success" });
      setSummary(await fetchReviews(providerId));
      setComment("");
      setRating(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't post your review.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm" style={{ borderColor: "var(--line)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-h3">Reviews</h2>
        {summary && summary.count > 0 && summary.average !== null && (
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-extrabold">{summary.average.toFixed(1)}</span>
            <Stars value={summary.average} />
            <span className="text-sm" style={{ color: "var(--muted)" }}>({summary.count} {summary.count === 1 ? "review" : "reviews"})</span>
          </div>
        )}
      </div>

      {summary === null ? (
        <div className="mt-5 space-y-3" aria-busy="true">
          <Shimmer className="h-16 rounded-2xl" />
          <Shimmer className="h-16 rounded-2xl" />
        </div>
      ) : summary.reviews.length === 0 ? (
        <p className="mt-4 rounded-2xl px-4 py-5 text-sm" style={{ background: "var(--surface-muted)", color: "var(--muted)" }}>
          No reviews yet. Be the first to share your experience with {providerName}.
        </p>
      ) : (
        <ul className="mt-5 divide-y" style={{ borderColor: "var(--line-light)" }}>
          {summary.reviews.map((r) => (
            <li key={r.id} className="flex gap-4 py-4 first:pt-0" style={{ borderColor: "var(--line-light)" }}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                {r.name[0]}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-sm font-bold">{r.name}{r.mine && <span className="ml-2 text-xs font-medium" style={{ color: "var(--primary)" }}>(you)</span>}</p>
                  <Stars value={r.rating} size="h-3.5 w-3.5" />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{formatDate(r.createdAt)}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>{r.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--line-light)" }}>
        {!user ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            <Link href={`/login?redirect=${encodeURIComponent(`/providers/${providerId}`)}`} className="font-semibold" style={{ color: "var(--primary)" }}>Log in</Link>{" "}
            to write a review.
          </p>
        ) : !isSubscribed && !mine ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Members who have unlocked contact details can write reviews.{" "}
            <Link href={`/membership?redirect=${encodeURIComponent(`/providers/${providerId}`)}`} className="font-semibold" style={{ color: "var(--primary)" }}>See membership</Link>
          </p>
        ) : (
          <form onSubmit={onSubmit}>
            <p className="text-sm font-bold">{mine ? "Update your review" : `Review ${providerName}`}</p>
            <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)} className="rounded p-0.5">
                  <Icon name="star" className="h-7 w-7" style={{ color: n <= rating ? "var(--accent)" : "var(--line)" }} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="How was your experience? (10–500 characters)"
              className="field mt-3 !rounded-2xl text-sm"
            />
            {error && <p className="mt-2 text-sm" style={{ color: "var(--error)" }}>{error}</p>}
            <button type="submit" disabled={busy} className="btn btn-primary btn-sm mt-3 !rounded-full">
              {busy ? "Posting…" : mine ? "Update review" : "Post review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
