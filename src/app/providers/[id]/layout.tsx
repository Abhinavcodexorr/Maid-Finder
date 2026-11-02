import { notFound } from "next/navigation";
import { API_BASE_URL } from "@/lib/api-client";
import { PROVIDERS } from "@/data/providers";

/**
 * The profile page is a client component, so it can't set an HTTP status. This
 * server layout does: an id that matches no provider answers with a real 404.
 */
export default async function ProviderLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  let missing = false;
  if (/^[a-f0-9]{24}$/i.test(id)) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/providers/${id}`, { cache: "no-store" });
      missing = res.status === 404;
    } catch {
      // Backend unreachable: let the page show its own state instead of a false 404.
    }
  } else {
    missing = !PROVIDERS.some((p) => p.id === id);
  }
  if (missing) notFound();
  return <>{children}</>;
}
