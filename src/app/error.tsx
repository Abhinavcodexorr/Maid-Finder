"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto mt-12 max-w-xl px-4 text-center">
      <div className="card">
        <h1 className="text-3xl font-extrabold">Something went wrong</h1>
        <p className="mt-2 text-slate-600">Please try again in a moment.</p>
        <button className="btn btn-primary mt-6" onClick={reset}>
          Try again
        </button>
      </div>
    </section>
  );
}
