import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/20 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="mb-3 text-base font-bold">Customers</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/login" className="footer-link">
                Customer Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="footer-link">
                Register as Customer
              </Link>
            </li>
            <li>
              <Link href="/subscriptions" className="footer-link">
                Access Packages
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-base font-bold">Maids</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/maid-login" className="footer-link">
                Maid Login
              </Link>
            </li>
            <li>
              <Link href="/maid-register" className="footer-link">
                Register as Maid
              </Link>
            </li>
            <li>
              <Link href="/search" className="footer-link">
                Browse Jobs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-base font-bold">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="footer-link">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="footer-link">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="footer-link">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-base font-bold">Contact</h3>
          <p className="text-sm text-slate-300">052 189 3330</p>
          <p className="text-sm text-slate-300">04 4427 686</p>
          <p className="mt-3 text-sm text-slate-400">Dubai, UAE</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} MaidFinder. All rights reserved.
      </div>
    </footer>
  );
}
