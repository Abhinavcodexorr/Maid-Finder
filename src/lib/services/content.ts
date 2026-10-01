import { TESTIMONIALS } from "@/data/testimonials";
import { FAQS } from "@/data/faqs";
import type { Faq, Testimonial } from "@/types/marketplace";

export function getTestimonials(): Testimonial[] {
  return TESTIMONIALS;
}

export function getFaqs(): Faq[] {
  return FAQS;
}
