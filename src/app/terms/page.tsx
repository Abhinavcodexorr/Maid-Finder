import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = { title: "Terms of Service — Help Zone" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="November 2026"
      sections={[
        { heading: "About Help Zone", body: ["Help Zone is a marketplace where families browse verified home-help professionals and contact them directly. Help Zone is not the employer of any professional and does not take a commission on their pay."] },
        { heading: "Your account", body: ["You must provide accurate details when you register and keep your login private. You are responsible for activity under your account."] },
        { heading: "Memberships", body: ["A membership unlocks professionals' contact details for the period shown on the plan you choose. Plan prices and durations are shown on the Membership page at the time you buy."] },
        { heading: "Hiring and safety", body: ["Professionals are ID-checked by our team, but you should confirm documents and references yourself before hiring and agree pay and duties directly with the professional."] },
        { heading: "Professionals", body: ["Professionals must give accurate information and genuine documents. Profiles with false details may be removed."] },
        { heading: "Changes", body: ["We may update these terms from time to time. Continued use of Help Zone means you accept the updated terms."] },
      ]}
    />
  );
}
