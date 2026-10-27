import type { ReactNode } from "react";

/** Highlights a word in the brand colour. */
export function Underlined({ children }: { children: ReactNode }) {
  return <span style={{ color: "var(--primary)" }}>{children}</span>;
}
