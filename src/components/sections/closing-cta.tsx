import Link from "next/link";

/** "Ready when you are" band shown above the footer on the home page. */
export function ClosingCta() {
  return (
    <section className="container-page pb-16">
      <div className="relative overflow-hidden rounded-[2rem] px-6 py-12 text-center text-white sm:px-12 sm:py-16" style={{ background: "var(--gradient-dark)" }}>
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.7), transparent 70%)" }} />
        <p className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-[#93b4ff]">Ready when you are</p>
        <h2 className="font-display relative mx-auto mt-3 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
          Find a professional you can trust, today
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-white/70">Browse for free, compare verified profiles and contact them directly — no agency, no commission.</p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/find-my-match" className="btn btn-lg !rounded-full bg-white font-bold" style={{ color: "var(--primary-dark)" }}>Find my match</Link>
          <Link href="/providers" className="btn btn-lg !rounded-full border border-white/30 font-bold text-white hover:bg-white/10">Browse professionals</Link>
        </div>
      </div>
    </section>
  );
}
