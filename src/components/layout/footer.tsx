import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";

const COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Cleaning", href: "/providers?category=cat-maid" },
      { label: "Cooking", href: "/providers?category=cat-cook" },
      { label: "Plumbing", href: "/providers?category=cat-plumber" },
      { label: "Electrical", href: "/providers?category=cat-electrician" },
      { label: "All Services", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Membership", href: "/membership" },
      { label: "FAQ", href: "/faqs" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "/faqs" },
      { label: "Contact Us", href: "/contact" },
      { label: "Safety", href: "/how-it-works" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/faqs" },
      { label: "Privacy Policy", href: "/faqs" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--gradient-dark)" }} className="text-white">
      {/* CTA Band */}
      <div className="border-b border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
          <div>
            <h3 className="font-display text-xl font-semibold">Ready to find the right professional?</h3>
            <p className="mt-1 text-sm text-white/60">Browse for free. Pay only when you&apos;re ready to connect.</p>
          </div>
          <Link href="/providers" className="btn btn-primary btn-lg shrink-0">
            Find Professionals
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <Logo size={30} wordmarkClassName="text-lg text-white" />
          <p className="mt-3 max-w-xs text-sm text-white/50">
            Discover trusted professionals for everyday services. Browse free, unlock contact details with a membership.
          </p>
          <div className="mt-4 flex gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white">
              <Icon name="globe" className="h-4 w-4" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white">
              <Icon name="mail" className="h-4 w-4" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white">
              <Icon name="phone" className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Link Columns */}
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Help Zone. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <Icon name="shield" className="h-3 w-3" />
            Secure and trusted marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}
