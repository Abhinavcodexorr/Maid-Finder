import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = { title: "Privacy Policy — Help Zone" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 2026"
      sections={[
        { heading: "What we collect", body: ["Customers: name, email, mobile number and the area and services you are interested in. Professionals: name, mobile number, location, work details, identity documents and an intro video."] },
        { heading: "How we use it", body: ["To run your account, show professionals' profiles to families, verify identities and contact you about your account. Professionals' phone numbers are shown only to members."] },
        { heading: "Identity documents", body: ["Documents uploaded by professionals are used only for verification by our team and are not shown publicly."] },
        { heading: "Sharing", body: ["We do not sell your personal data. We share it only with service providers who help us run Help Zone, or when the law requires it."] },
        { heading: "Your choices", body: ["You can ask us to correct or delete your account and data at any time by contacting our team."] },
      ]}
    />
  );
}
