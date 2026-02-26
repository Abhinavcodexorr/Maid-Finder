import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="mx-auto mt-12 max-w-xl px-4 text-center">
      <div className="card">
        <h1 className="text-3xl font-extrabold">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
        <Link href="/" className="btn btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
