import { FEATURED_MAIDS } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function MaidProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const maid = FEATURED_MAIDS.find((m) => m.id === id);
  if (!maid) notFound();

  return (
    <section className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
      <article className="card">
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <div className="relative h-56 overflow-hidden rounded-xl md:h-full">
            <Image src={maid.imageUrl} alt={maid.fullName} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">{maid.fullName}</h1>
            <p className="mt-1 text-slate-600">
              {maid.nationality} • {maid.emirate} • {maid.visaStatus}
            </p>
            <p className="mt-4 text-sm">Experience: {maid.experienceYears} years</p>
            <p className="text-sm">Expected salary: AED {maid.monthlySalaryAed}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {maid.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
