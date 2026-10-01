"use client";

import { useState } from "react";

export function Avatar({
  initials,
  imageUrl,
  color = "var(--accent-dark)",
  soft = "var(--accent-soft)",
  className = "h-12 w-12 text-sm",
  rounded = "rounded-xl",
  ring = true,
}: {
  initials: string;
  imageUrl?: string;
  color?: string;
  soft?: string;
  className?: string;
  rounded?: string;
  ring?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (imageUrl && !failed) {
    return (
      <span
        className={`relative shrink-0 overflow-hidden ${rounded} ${ring ? "ring-2" : ""} ${className}`}
        style={{ ["--tw-ring-color" as string]: color }}
      >
        {!loaded && <div className="absolute inset-0 shimmer" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={initials}
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span className={`font-display flex shrink-0 items-center justify-center font-bold ${rounded} ${className}`} style={{ background: soft, color }}>
      {initials}
    </span>
  );
}
