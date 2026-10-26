import { Icon } from "@/components/ui/icon";
import type { Faq } from "@/types/marketplace";

/** Accordion built on native <details>, so it works without client JS. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((faq) => (
        <details key={faq.question} className="card group !p-0 open:shadow-md">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            {faq.question}
            <Icon
              name="chevron-down"
              className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
              style={{ color: "var(--muted)" }}
            />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
