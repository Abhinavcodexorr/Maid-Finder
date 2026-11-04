"use client";

import { useEffect, useRef, useState } from "react";

const UNITS = ["Days", "Hours", "Mins", "Secs"] as const;

function split(ms: number): number[] {
  const total = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(total / 86400), Math.floor((total % 86400) / 3600), Math.floor((total % 3600) / 60), total % 60];
}

/** Counts down to `endDate` second by second (days, hours, minutes, seconds). */
export function LiveCountdown({ endDate, onExpire }: { endDate: string; onExpire?: () => void }) {
  const end = new Date(endDate).getTime();
  // null until mounted, so server and browser render the same markup
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const left = now === null || Number.isNaN(end) ? null : end - now;

  const expired = left !== null && left <= 0;
  const fired = useRef(false);
  useEffect(() => {
    if (expired && !fired.current) {
      fired.current = true;
      onExpire?.();
    }
  }, [expired, onExpire]);

  const parts = left === null ? [0, 0, 0, 0] : split(left);

  return (
    <div className="flex gap-2" role="timer" aria-label="Time left on your membership">
      {UNITS.map((label, i) => (
        <div key={label} className="min-w-[64px] rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2.5 text-center">
          <div className="font-display text-2xl font-bold tabular-nums" style={{ color: "var(--success)" }}>
            {String(parts[i]).padStart(2, "0")}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

/** Inline ticking text such as "29d 04h 12m 05s" for tight spots (badges, sidebars). */
export function LiveTimeLeft({ endDate }: { endDate: string }) {
  const end = new Date(endDate).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (now === null || Number.isNaN(end)) return <span className="tabular-nums">--</span>;
  const [d, h, m, s] = split(end - now);
  const pad = (n: number) => String(n).padStart(2, "0");
  return <span className="tabular-nums">{d}d {pad(h)}h {pad(m)}m {pad(s)}s</span>;
}
