 "use client";

import Image from "next/image";
import Link from "next/link";
import { FEATURED_MAIDS } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { MaidProfile } from "@/types";
import { API_BASE_URL, apiRoutes } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth-mock";

const MAIDS_API_BASE_URL = `${API_BASE_URL}${apiRoutes.maid.list}`;

type ApiMaid = Partial<MaidProfile> & { _id?: string };
export type MaidQuery = {
  page?: number;
  limit?: number;
  emirate?: string;
  minSalary?: number;
  maxSalary?: number;
  skills?: string;
};

function buildMaidsUrl(query: MaidQuery = {}): string {
  const url = new URL(MAIDS_API_BASE_URL);
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.emirate) params.set("emirate", query.emirate);
  if (query.minSalary) params.set("minSalary", String(query.minSalary));
  if (query.maxSalary) params.set("maxSalary", String(query.maxSalary));
  if (query.skills) params.set("skills", query.skills);

  url.search = params.toString();
  return url.toString();
}

function resolveImageUrl(imageUrl?: string): string {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop";
  }

  const trimmed = imageUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop";
}

function normalizeMaid(maid: ApiMaid, index: number): MaidProfile {
  return {
    id: String(maid.id ?? maid._id ?? `maid-${index}`),
    fullName: maid.fullName ?? "Unknown Maid",
    nationality: maid.nationality ?? "N/A",
    emirate: maid.emirate ?? "N/A",
    visaStatus: maid.visaStatus ?? "N/A",
    experienceYears: Number(maid.experienceYears ?? 0),
    rating: Number(maid.rating ?? 0),
    monthlySalaryAed: Number(maid.monthlySalaryAed ?? 0),
    skills: Array.isArray(maid.skills) ? maid.skills : [],
    imageUrl: resolveImageUrl(maid.imageUrl),
  };
}

function formatSalary(value: number): string {
  return new Intl.NumberFormat("en-AE").format(value || 0);
}

export function MaidsGrid() {
  return <MaidsGridContent query={{ page: 1, limit: 20 }} fallbackOnError />;
}

export function MaidsGridContent({
  query,
  fallbackOnError = false,
}: {
  query: MaidQuery;
  fallbackOnError?: boolean;
}) {
  const router = useRouter();
  const [maids, setMaids] = useState<MaidProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const queryKey = JSON.stringify(query);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setApiError(null);

    const fetchMaids = async () => {
      try {
        const response = await fetch(buildMaidsUrl(query), { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch maids.");
        }

        const payload = await response.json();
        const list: ApiMaid[] = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        const normalized = list.map(normalizeMaid);

        if (isMounted) {
          setMaids(normalized);
          setTotal(typeof payload?.total === "number" ? payload.total : normalized.length);
        }
      } catch {
        if (isMounted) {
          setApiError("Unable to load maids. Please adjust filters or try again.");
          setTotal(0);
          setMaids(fallbackOnError ? FEATURED_MAIDS : []);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchMaids();

    return () => {
      isMounted = false;
    };
  }, [queryKey]);

  const goToCustomerProtectedPage = (target: string) => {
    const session = getSession();
    if (session?.role === "customer") {
      router.push(target);
      return;
    }
    router.push(`/register?redirect=${encodeURIComponent(target)}`);
  };

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Top Maid Profiles</h2>
        <Link href="/search" className="text-sm font-semibold text-brand">
          View all →
        </Link>
      </div>
      {!isLoading ? (
        <p className="mb-4 text-sm text-slate-600">
          {total !== null ? `${total} maid${total === 1 ? "" : "s"} found` : `${maids.length} maid${maids.length === 1 ? "" : "s"} found`}
        </p>
      ) : null}
      {apiError ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{apiError}</p> : null}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <article key={item} className="card animate-pulse">
              <div className="mb-4 h-48 rounded-xl bg-slate-200" />
              <div className="mb-2 h-5 rounded bg-slate-200" />
              <div className="mb-2 h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
            </article>
          ))}
        </div>
      ) : null}
      {!isLoading && maids.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900">No maids found</h3>
          <p className="mt-1 text-sm text-slate-600">Try changing skills, emirate, or salary filters.</p>
        </div>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {maids.map((maid, idx) => (
          <motion.article
            key={maid.id}
            className="card flex h-full flex-col border border-slate-100"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.06 }}
            whileHover={{ y: -6 }}
          >
            <div className="relative mb-4 h-48 overflow-hidden rounded-xl">
              <Image
                src={maid.imageUrl}
                alt={maid.fullName}
                fill
                className="object-cover"
                loader={({ src }) => src}
                unoptimized
              />
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                {maid.emirate}
              </div>
            </div>
            <h3 className="line-clamp-1 text-lg font-bold">{maid.fullName}</h3>
            <p className="line-clamp-1 text-sm text-slate-600">
              {maid.nationality} • {maid.emirate} • {maid.visaStatus}
            </p>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <span className="font-semibold text-slate-700">{maid.experienceYears} yrs exp</span>
              <span className="font-bold text-brand">AED {formatSalary(maid.monthlySalaryAed)}/mo</span>
            </div>
            <div className="mt-3 flex min-h-14 flex-wrap gap-2">
              {maid.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {skill}
                </span>
              ))}
              {maid.skills.length === 0 ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">No skills added</span>
              ) : null}
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <button
                type="button"
                className="btn btn-soft w-full"
                onClick={() => goToCustomerProtectedPage(`/maid/${maid.id}`)}
              >
                View Profile
              </button>
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={() => goToCustomerProtectedPage(`/bookings?maidId=${maid.id}`)}
              >
                Hire Now
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
