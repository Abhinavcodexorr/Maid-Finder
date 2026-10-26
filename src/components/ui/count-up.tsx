"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Counts a figure like "100%" or "12+" up from zero the first time it
 * scrolls into view. The number is pulled out of the text, so the prefix
 * and suffix (%, +, ₹ …) are kept as written.
 */
export function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  const hasNumber = match !== null;
  const target = match ? Number(match[2]) : 0;

  useEffect(() => {
    if (!inView || !hasNumber || reduceMotion) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCurrent(Math.round(v)),
      onComplete: () => setCurrent(target),
    });
    return () => controls.stop();
  }, [inView, hasNumber, reduceMotion, target, duration]);

  if (!match) return <span ref={ref}>{value}</span>;
  const [, prefix, , suffix] = match;
  return (
    <span ref={ref}>
      {prefix}
      {reduceMotion ? target : current}
      {suffix}
    </span>
  );
}
