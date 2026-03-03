import type { MaidProfile } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { api, apiRoutes } from "@/lib/api-client";

type ApiMaid = Partial<MaidProfile> & {
  _id?: string;
  phone?: string;
  whatsapp?: string;
  bio?: string;
};

function resolveImageUrl(imageUrl?: string): string {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop";
  }
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop";
}

function normalizeMaid(maid: ApiMaid): MaidProfile & { phone?: string; whatsapp?: string; bio?: string } {
  return {
    id: String(maid.id ?? maid._id ?? ""),
    fullName: maid.fullName ?? "Unknown Maid",
    nationality: maid.nationality ?? "N/A",
    emirate: maid.emirate ?? "N/A",
    visaStatus: maid.visaStatus ?? "N/A",
    experienceYears: Number(maid.experienceYears ?? 0),
    rating: Number(maid.rating ?? 0),
    monthlySalaryAed: Number(maid.monthlySalaryAed ?? 0),
    skills: Array.isArray(maid.skills) ? maid.skills : [],
    imageUrl: resolveImageUrl(maid.imageUrl),
    phone: maid.phone,
    whatsapp: maid.whatsapp,
    bio: maid.bio,
  };
}

async function fetchMaidById(id: string) {
  try {
    const result = await api.get<{ success: boolean; data?: ApiMaid }>(apiRoutes.maid.byId(id));
    const rawMaid: ApiMaid | null = result?.data ?? null;
    if (!rawMaid) return null;
    return normalizeMaid(rawMaid);
  } catch {
    return null;
  }
}

export default async function MaidProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const maid = await fetchMaidById(id);
  if (!maid) notFound();

  return (
    <section className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
      <article className="card">
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <div className="relative h-56 overflow-hidden rounded-xl md:h-full">
            <Image src={maid.imageUrl} alt={maid.fullName} fill className="object-cover" unoptimized />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">{maid.fullName}</h1>
            <p className="mt-1 text-slate-600">
              {maid.nationality} • {maid.emirate} • {maid.visaStatus}
            </p>
            <p className="mt-4 text-sm">Experience: {maid.experienceYears} years</p>
            <p className="text-sm">Expected salary: AED {maid.monthlySalaryAed}</p>
            {maid.phone ? <p className="text-sm">Phone: {maid.phone}</p> : null}
            {maid.whatsapp ? <p className="text-sm">WhatsApp: {maid.whatsapp}</p> : null}
            {maid.bio ? <p className="mt-3 text-sm text-slate-700">{maid.bio}</p> : null}
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
