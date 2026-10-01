"use client";

import React from "react";

export function Shimmer({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`shimmer rounded-lg ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function ProviderCardSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="card flex flex-col sm:flex-row gap-5 p-5 bg-white border border-[var(--line)]">
        {/* Photo Box Shimmer */}
        <div className="relative h-44 sm:h-36 sm:w-36 shrink-0 rounded-xl overflow-hidden shimmer" />

        <div className="flex flex-1 flex-col justify-between py-1">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Shimmer className="h-5 w-40" />
              <Shimmer className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <Shimmer className="h-3.5 w-16" />
              <Shimmer className="h-3.5 w-24" />
              <Shimmer className="h-3.5 w-20" />
            </div>
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-4/5" />
            <div className="flex gap-2 pt-1">
              <Shimmer className="h-5 w-20 rounded-md" />
              <Shimmer className="h-5 w-24 rounded-md" />
              <Shimmer className="h-5 w-16 rounded-md" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--line-light)] pt-3">
            <Shimmer className="h-5 w-28" />
            <Shimmer className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Grid Card Skeleton
  return (
    <div className="card overflow-hidden p-0 bg-white border border-[var(--line)] flex flex-col">
      {/* Photo Header Shimmer */}
      <div className="relative h-52 w-full shimmer">
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <div className="h-6 w-24 rounded-full bg-white/70 backdrop-blur-sm" />
          <div className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm" />
        </div>
        <div className="absolute bottom-3 inset-x-3 space-y-1.5">
          <div className="h-5 w-36 rounded bg-white/80" />
          <div className="h-3.5 w-24 rounded bg-white/60" />
        </div>
      </div>

      {/* Body Shimmer */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-2.5">
          {/* Rating, Experience, City */}
          <div className="flex items-center justify-between">
            <Shimmer className="h-3.5 w-16" />
            <Shimmer className="h-3.5 w-24" />
            <Shimmer className="h-3.5 w-20" />
          </div>

          {/* Description lines */}
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-4/5" />

          {/* Skills tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Shimmer className="h-5 w-20 rounded-md" />
            <Shimmer className="h-5 w-24 rounded-md" />
            <Shimmer className="h-5 w-16 rounded-md" />
          </div>
        </div>

        {/* Footer Shimmer */}
        <div className="border-t border-[var(--line-light)] pt-3 mt-auto flex items-center justify-between">
          <Shimmer className="h-5 w-28" />
          <Shimmer className="h-7 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="card flex flex-col justify-between p-6 bg-white border border-[var(--line)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Shimmer className="h-14 w-14 rounded-2xl" />
          <Shimmer className="h-6 w-28 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <Shimmer className="h-6 w-36" />
          <Shimmer className="h-3.5 w-full" />
          <Shimmer className="h-3.5 w-4/5" />
        </div>
        <Shimmer className="h-11 w-full rounded-xl" />
        <div className="flex gap-2">
          <Shimmer className="h-5 w-16 rounded-md" />
          <Shimmer className="h-5 w-20 rounded-md" />
          <Shimmer className="h-5 w-20 rounded-md" />
        </div>
      </div>
      <div className="mt-6 border-t border-[var(--line-light)] pt-4">
        <Shimmer className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--surface-muted)] pb-20">
      {/* Hero Header Shimmer */}
      <div className="border-b border-[var(--line)] bg-white py-12">
        <div className="container-page text-center space-y-4 max-w-2xl mx-auto">
          <div className="mx-auto h-6 w-44 rounded-full shimmer" />
          <div className="mx-auto h-10 sm:h-12 w-3/4 rounded-xl shimmer" />
          <div className="mx-auto h-4 w-full rounded shimmer" />
          <div className="mx-auto h-4 w-2/3 rounded shimmer" />
          <div className="mx-auto mt-6 h-12 max-w-lg rounded-2xl shimmer" />
        </div>
      </div>

      {/* Grid of Shimmer Cards */}
      <div className="container-page py-10">
        <div className="mb-6 flex items-center justify-between">
          <Shimmer className="h-7 w-48" />
          <Shimmer className="h-9 w-32 rounded-xl" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <Shimmer className="h-5 w-32" />
        <Shimmer className="h-8 w-24 rounded-lg" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2 border-b border-[var(--line-light)] last:border-none">
          <Shimmer className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Shimmer className="h-4 w-1/3" />
            <Shimmer className="h-3 w-1/4" />
          </div>
          <Shimmer className="h-6 w-20 rounded-md" />
          <Shimmer className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
