import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/** Replace public/images/auth-family.jpg to change the picture on the left of every auth screen. */
const AUTH_IMAGE = "/images/auth-family.jpg";

/** Shared split card used by login, signup and password reset: a photo panel on the left, the form on the right. */
export function AuthShell({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-108px)] items-center justify-center overflow-hidden px-4 py-8 sm:py-12" style={{ background: "var(--gradient-hero)" }}>
      <div aria-hidden className="blob-drift pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)" }} />
      <div aria-hidden className="blob-drift pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full opacity-50 blur-3xl" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.25), transparent 70%)" }} />

      <div className="relative w-full max-w-[1200px]">
        <div className="grid overflow-hidden rounded-[2rem] border bg-white shadow-2xl lg:grid-cols-[1fr_1fr]" style={{ borderColor: "var(--line)" }}>
          {/* Photo panel */}
          <aside className="relative hidden min-h-[720px] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AUTH_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(13,21,48,0.92) 0%, rgba(13,21,48,0.6) 24%, rgba(13,21,48,0) 48%)" }}
            />
            <Link href="/" className="absolute left-10 top-10 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur">
              <Logo size={28} wordmarkClassName="text-lg" />
            </Link>
            <div className="absolute inset-x-0 bottom-0 p-10 text-white">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#93b4ff]">
                <span className="h-px w-8 bg-[#93b4ff]" /> Help Zone
              </p>
              <h2 className="font-display mt-3 text-[38px] font-extrabold leading-[1.1]">Find the right professional for your home.</h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/75">
                Verified maids, cooks, nannies, drivers and more across India — no agencies, no middlemen.
              </p>
            </div>
          </aside>

          {/* Form panel */}
          <div className="p-6 sm:p-10 lg:flex lg:flex-col lg:justify-center lg:p-16">
            <Link href="/" className="mb-7 flex justify-center lg:hidden">
              <Logo size={34} />
            </Link>
            {children}
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
}
