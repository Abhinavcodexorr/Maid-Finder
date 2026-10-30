const MESSAGES = [
  "Browse verified professionals across India",
  "No agency fees — contact professionals directly",
  "One membership unlocks every profile",
  "Every professional ID-checked before going live",
];

/** Slim dark strip above the navbar with scrolling highlights. */
export function AnnouncementBar() {
  const items = [...MESSAGES, ...MESSAGES];
  return (
    <div className="marquee overflow-hidden text-xs font-medium text-white" style={{ background: "var(--gradient-dark)" }} aria-label="Highlights">
      <div className="marquee-track flex w-max">
        {[...items, ...items].map((message, i) => (
          <span key={i} aria-hidden={i >= MESSAGES.length} className="flex shrink-0 items-center gap-6 px-6 py-2">
            {message}
            <span style={{ color: "var(--primary)" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
