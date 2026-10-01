interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-[var(--ink)] p-8 text-white shadow-xl">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-white/70 sm:text-base">{subtitle}</p> : null}
      </div>
    </section>
  );
}
