"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import type { Testimonial } from "@/types/marketplace";

/** Pixels per second the strip drifts while idle. */
const SPEED = 40;

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="card flex w-[300px] shrink-0 flex-col sm:w-[340px]">
      <div className="mb-3 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, j) => (
          <Icon
            key={j}
            name="star"
            className="h-4 w-4"
            fill={j < t.rating ? "var(--accent)" : "none"}
            style={{ color: j < t.rating ? "var(--accent)" : "var(--line)" }}
          />
        ))}
      </div>
      <blockquote className="flex-1 text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>
        &ldquo;{t.text}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <Avatar initials={t.name[0]} imageUrl={t.avatar} className="h-9 w-9 text-xs" rounded="rounded-full" />
        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>{t.area}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Horizontally scrolling testimonial strip that drifts on its own, pauses
 * while hovered or touched, and can still be scrolled by hand. The list is
 * rendered twice so the strip loops seamlessly.
 */
export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pos = el.scrollLeft;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const half = el.scrollWidth / 2;
      if (pausedRef.current) {
        pos = el.scrollLeft;
      } else {
        pos += (SPEED * (now - last)) / 1000;
      }
      if (half > 0 && pos >= half) pos -= half;
      if (!pausedRef.current) el.scrollLeft = pos;
      last = now;
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <div
      ref={scrollerRef}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocus={pause}
      onBlur={resume}
      className="no-scrollbar flex gap-5 overflow-x-auto px-4 py-2"
    >
      {[...items, ...items].map((t, i) => (
        <div key={`${t.id}-${i}`} className="flex" aria-hidden={i >= items.length}>
          <TestimonialCard t={t} />
        </div>
      ))}
    </div>
  );
}
