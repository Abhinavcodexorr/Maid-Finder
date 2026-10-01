const PALETTE = [
  { color: "var(--violet-1)", soft: "var(--violet-1-soft)" },
  { color: "var(--violet-2)", soft: "var(--violet-2-soft)" },
  { color: "var(--violet-3)", soft: "var(--violet-3-soft)" },
  { color: "var(--violet-4)", soft: "var(--violet-4-soft)" },
  { color: "var(--violet-5)", soft: "var(--violet-5-soft)" },
  { color: "var(--violet-6)", soft: "var(--violet-6-soft)" },
];

export function colorForIndex(index: number) {
  return PALETTE[index % PALETTE.length];
}
