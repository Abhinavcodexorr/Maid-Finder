// Single import surface for every page/component. Pages should only ever
// import from "@/lib/services" (or a specific file under it), never from
// "@/data" directly — that's the seam where a real backend plugs in later.

export * from "@/lib/services/categories";
export * from "@/lib/services/providers";
export * from "@/lib/services/plans";
export * from "@/lib/services/auth";
export * from "@/lib/services/subscription";
export * from "@/lib/services/payments";
export * from "@/lib/services/saved";
export * from "@/lib/services/contacts";
export * from "@/lib/services/content";
export * from "@/lib/services/provider-applications";
