import { redirect } from "next/navigation";

export default async function RegisterAliasPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectParam = params.redirect ? `?redirect=${encodeURIComponent(params.redirect)}` : "";
  redirect(`/signup${redirectParam}`);
}
