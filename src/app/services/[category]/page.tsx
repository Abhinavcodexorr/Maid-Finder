import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/services";
import { BrowseProviders } from "@/components/marketplace/browse-providers";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  const label = category.name.includes("/") ? category.name : `${category.name}s`;
  return {
    title: `${label} Across India | Help Zone`,
    description: `Browse verified ${category.name.toLowerCase()} across India — Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Chennai, and more. ${category.shortDescription}`,
  };
}

export default async function CategoryServicesPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const title = category.name.includes("/") ? `${category.name} Across India` : `${category.name}s Across India`;

  return (
    <Suspense fallback={null}>
      <BrowseProviders lockedCategoryId={category.id} title={title} subtitle={category.shortDescription} />
    </Suspense>
  );
}
