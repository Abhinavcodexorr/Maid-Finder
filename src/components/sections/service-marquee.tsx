import Link from "next/link";
import { ServiceGlyph, serviceGradient } from "@/components/ui/service-glyph";

interface MarqueeService {
  key: string;
  name: string;
}

function Row({ services, offset }: { services: MarqueeService[]; offset: number }) {
  // The track holds two identical halves so translating by -50% loops seamlessly.
  const half = [...services, ...services];
  return (
    <div className="marquee overflow-hidden">
      <div className="marquee-track flex w-max gap-3 py-1.5 pr-3">
        {[...half, ...half].map((svc, i) => {
          const isCopy = i >= services.length;
          return (
            <Link
              key={i}
              href={`/providers?category=${svc.key}`}
              aria-hidden={isCopy || undefined}
              tabIndex={isCopy ? -1 : undefined}
              className="group flex shrink-0 items-center gap-3 rounded-full border bg-white py-2 pl-2 pr-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderColor: "var(--line)" }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110" style={{ background: serviceGradient((i % services.length) + offset) }}>
                <ServiceGlyph name={svc.name} className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-extrabold">{svc.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** A single row of service pills drifting left; every pill opens that service's search. */
export function ServiceMarquee({ services }: { services: MarqueeService[] }) {
  if (services.length === 0) return null;
  return (
    <section
      aria-label="Services"
      className="relative border-b bg-[var(--surface-muted)] py-6"
      style={{
        borderColor: "var(--line)",
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <Row services={services} offset={0} />
    </section>
  );
}
