export default function GlobalLoading() {
  return (
    <div className="mx-auto mt-10 max-w-3xl px-4">
      <div className="card">
        <div className="h-6 w-44 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}
