import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";

export interface LiveJoin {
  id: string;
  name: string;
  service: string;
  place: string;
  joinedAt: string;
  photo?: string;
}

/** Keeps the strip long enough to scroll seamlessly even when only a few helpers exist. */
const MIN_ITEMS = 8;

function timeAgo(iso: string): string {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

/** "Live" strip of the newest verified helpers, scrolling on its own. Real data only. */
export function LiveJoinFeed({ items }: { items: LiveJoin[] }) {
  if (items.length === 0) return null;

  const repeated = Array.from({ length: Math.ceil(MIN_ITEMS / items.length) }, () => items).flat();

  return (
    <section className="border-y bg-white" style={{ borderColor: "var(--line)" }} aria-label="Recently joined professionals">
      <div className="container-page flex items-center gap-4 py-3">
        <span className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: "var(--success-soft)", color: "var(--success)" }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: "var(--success)" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--success)" }} />
          </span>
          Live
        </span>
        <p className="hidden shrink-0 text-xs font-semibold sm:block" style={{ color: "var(--muted)" }}>Recently joined</p>

        <div className="live-marquee relative min-w-0 flex-1 overflow-hidden">
          <div className="live-marquee-track flex w-max gap-3">
            {[...repeated, ...repeated].map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                aria-hidden={i >= repeated.length}
                className="flex shrink-0 items-center gap-2.5 rounded-full border py-1 pl-1 pr-4 text-xs"
                style={{ borderColor: "var(--line)", background: "var(--surface)" }}
              >
                <Avatar initials={item.name[0]} imageUrl={item.photo} className="h-7 w-7 text-[10px]" rounded="rounded-full" ring={false} />
                <span className="font-semibold">{item.name}</span>
                <span style={{ color: "var(--muted)" }}>{item.service}</span>
                <span className="flex items-center gap-1" style={{ color: "var(--muted)" }}>
                  <Icon name="map-pin" className="h-3 w-3" />
                  {item.place}
                </span>
                <span style={{ color: "var(--faint)" }}>{timeAgo(item.joinedAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
