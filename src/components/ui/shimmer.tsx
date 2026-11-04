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
  return (
    <div
      className={`flex h-full flex-col rounded-3xl border bg-white p-4 sm:p-5 ${viewMode === "list" ? "lg:flex-row lg:gap-6" : ""}`}
      style={{ borderColor: "var(--line)" }}
      aria-hidden
    >
      <div className={`flex gap-4 ${viewMode === "list" ? "lg:w-[46%] lg:shrink-0" : ""}`}>
        <div className="shimmer h-[150px] w-[118px] shrink-0 rounded-2xl sm:h-[170px] sm:w-[136px]" />
        <div className="flex flex-1 flex-col">
          <Shimmer className="h-6 w-3/4" />
          <Shimmer className="mt-3 h-3.5 w-full" />
          <Shimmer className="mt-3 h-3 w-1/2" />
          <Shimmer className="mt-auto h-7 w-28 rounded-full" />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4 lg:mt-0 lg:border-t-0 lg:pt-0" style={{ borderColor: "var(--line-light)" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-2.5 w-14" />
              <Shimmer className="h-4 w-16" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Shimmer className="h-6 w-24 rounded-full" />
          <Shimmer className="h-6 w-20 rounded-full" />
          <Shimmer className="h-6 w-28 rounded-full" />
        </div>
        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <Shimmer className="h-11 rounded-full" />
          <Shimmer className="h-11 rounded-full" />
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
