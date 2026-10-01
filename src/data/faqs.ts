import type { Faq } from "@/types/marketplace";

export const FAQS: Faq[] = [
  {
    question: "Can I browse providers without paying anything?",
    answer:
      "Yes. Browsing, searching and filtering every provider profile is completely free — you only need a plan to view the price and phone number.",
  },
  {
    question: "What exactly do I get after buying a plan?",
    answer:
      "Once a plan is active, you can see the real price and mobile number for every provider on Help Zone, plus direct Call and WhatsApp buttons, for the full duration of your plan.",
  },
  {
    question: "Are the providers verified?",
    answer:
      "Providers marked with a verified badge have had their ID checked by our team. We recommend always verifying documents yourself before hiring, especially for live-in roles.",
  },
  {
    question: "Do you charge any commission on hiring?",
    answer:
      "No. Help Zone only charges for the subscription plan. You negotiate and pay the provider directly — we never take a cut of their salary or fees.",
  },
  {
    question: "What if a provider doesn't respond?",
    answer:
      "Your plan unlocks contact details for every provider, so you can simply try another profile in the same category and area at no extra cost.",
  },
  {
    question: "Can I renew or upgrade my plan?",
    answer:
      "Yes. You can buy a new plan at any time from your dashboard. If you already have an active plan, the new duration is added to your existing expiry date.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Since contact details are unlocked immediately on payment, plans are non-refundable once activated. See our Refund Policy page for full details.",
  },
  {
    question: "Which cities and areas do you cover across India?",
    answer: "Help Zone operates across all major cities and metropolitan areas in India, including Mumbai, Bengaluru, Delhi NCR (Delhi, Gurgaon, Noida, Faridabad), Hyderabad, Pune, Chennai, Kolkata, Ahmedabad, and Jaipur, with new areas added nationwide.",
  },
];

export function getFaqs(): Faq[] {
  return FAQS;
}
