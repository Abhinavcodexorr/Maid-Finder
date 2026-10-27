import type { ReactNode } from "react";

/** Highlights a word with a hand-drawn wavy underline that draws itself in. */
export function Underlined({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className="absolute -bottom-1.5 left-0 h-2.5 w-full"
        fill="none"
      >
        <path
          className="squiggle-path"
          d="M2 8 C 22 2, 42 12, 62 6 S 102 2, 122 7 S 162 12, 198 4"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
