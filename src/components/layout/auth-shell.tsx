import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/** Shared backdrop + centered card used by login, signup and password reset. */
export function AuthShell({ children, maxWidth = "max-w-md", footer }: { children: React.ReactNode; maxWidth?: string; footer?: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-12" style={{ background: "var(--gradient-hero)" }}>
      <div aria-hidden className="blob-drift pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)" }} />
      <div aria-hidden className="blob-drift pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full opacity-50 blur-3xl" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.25), transparent 70%)" }} />
      <div className={`relative w-full ${maxWidth}`}>
        <div className="rounded-[2rem] border bg-white p-6 shadow-2xl sm:p-10" style={{ borderColor: "var(--line)" }}>
          <Link href="/" className="mb-7 flex justify-center">
            <Logo size={34} />
          </Link>
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}
