 "use client";

import Image from "next/image";
import Link from "next/link";
import { FEATURED_MAIDS } from "@/lib/mock-data";
import { motion } from "framer-motion";

export function MaidsGrid() {
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Featured Maids</h2>
        <Link href="/search" className="text-sm font-semibold text-brand">
          View all →
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURED_MAIDS.map((maid, idx) => (
          <motion.article
            key={maid.id}
            className="card"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.06 }}
            whileHover={{ y: -6 }}
          >
            <div className="relative mb-4 h-48 overflow-hidden rounded-xl">
              <Image src={maid.imageUrl} alt={maid.fullName} fill className="object-cover" />
            </div>
            <h3 className="text-lg font-bold">{maid.fullName}</h3>
            <p className="text-sm text-slate-600">
              {maid.nationality} • {maid.emirate} • {maid.visaStatus}
            </p>
            <p className="mt-2 text-sm text-slate-700">{maid.experienceYears} years experience</p>
            <p className="mt-1 text-sm text-slate-700">AED {maid.monthlySalaryAed}/month</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {maid.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {skill}
                </span>
              ))}
            </div>
            <Link href={`/maid/${maid.id}`} className="btn btn-primary mt-4 w-full">
              View Profile
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
