import type { Testimonial } from "@/types/marketplace";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya Gupta",
    area: "Bandra West, Mumbai",
    text: "Found a reliable cook within a day of signing up. The plan paid for itself the moment I called the first number — direct connect with zero agency hassle.",
    rating: 5,
    avatar: "/images/testimonials/t1.svg",
  },
  {
    id: "t2",
    name: "Rohit Malhotra",
    area: "Indiranagar, Bengaluru",
    text: "Needed a reliable house help after relocating. Browsed for free, unlocked contact details, and had an experienced helper starting the next morning. Zero commission.",
    rating: 5,
    avatar: "/images/testimonials/t2.svg",
  },
  {
    id: "t3",
    name: "Priya Nair",
    area: "Jubilee Hills, Hyderabad",
    text: "I loved that I could inspect full profiles, verified ID checks, and previous experience before paying. Found a wonderful infant nanny within 48 hours.",
    rating: 5,
    avatar: "/images/testimonials/t3.svg",
  },
  {
    id: "t4",
    name: "Vikas Chaudhary",
    area: "Dwarka, Delhi NCR",
    text: "Hired our family cook and a daily cleaner through Help Zone. The verified badge gave us total confidence and background peace of mind.",
    rating: 5,
    avatar: "/images/testimonials/t4.svg",
  },
  {
    id: "t5",
    name: "Simran Bedi",
    area: "Kothrud, Pune",
    text: "The language and schedule filters saved me hours. Found a Marathi and Hindi-speaking full-time helper near my society immediately.",
    rating: 5,
    avatar: "/images/testimonials/t5.svg",
  },
  {
    id: "t6",
    name: "Neha Sharma",
    area: "Sector 62, Noida",
    text: "I was nervous about letting a stranger into the house. Seeing the ID verification and an intro video on the profile made the decision easy.",
    rating: 5,
  },
  {
    id: "t7",
    name: "Arjun Menon",
    area: "Kakkanad, Kochi",
    text: "Found a plumber and an electrician in the same afternoon. Both were on time and the rates were exactly what the profile said.",
    rating: 4,
  },
  {
    id: "t8",
    name: "Kavita Deshmukh",
    area: "Baner, Pune",
    text: "Our elderly father needed a patient caregiver. We compared four profiles side by side and chose one with real experience in elder care.",
    rating: 5,
  },
  {
    id: "t9",
    name: "Sameer Khan",
    area: "Banjara Hills, Hyderabad",
    text: "One membership, unlimited calls. I spoke to six drivers before picking one, and nobody asked me for a booking fee.",
    rating: 5,
  },
  {
    id: "t10",
    name: "Divya Iyer",
    area: "Adyar, Chennai",
    text: "Simple and honest. No pushy agents calling me back — I browsed at my own pace and contacted the helper directly on WhatsApp.",
    rating: 5,
  },
  {
    id: "t11",
    name: "Manish Tiwari",
    area: "Gomti Nagar, Lucknow",
    text: "Booked a painter for the whole flat. The profile showed past work and experience, and the final cost matched the quote.",
    rating: 4,
  },
  {
    id: "t12",
    name: "Pooja Kulkarni",
    area: "Salt Lake, Kolkata",
    text: "As a working mother, finding a trustworthy nanny was my biggest worry. Help Zone made it a two-day job instead of two weeks.",
    rating: 5,
  },
];

export function getTestimonials(): Testimonial[] {
  return TESTIMONIALS;
}
