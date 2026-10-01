import type { Testimonial } from "@/types/marketplace";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya Gupta",
    area: "Bandra West, Mumbai",
    text: "Found a reliable cook within a day of signing up. The plan paid for itself the moment I called the first number — direct connect with zero agency hassle.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    id: "t2",
    name: "Rohit Malhotra",
    area: "Indiranagar, Bengaluru",
    text: "Needed a reliable house help after relocating. Browsed for free, unlocked contact details, and had an experienced helper starting the next morning. Zero commission.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
  },
  {
    id: "t3",
    name: "Priya Nair",
    area: "Jubilee Hills, Hyderabad",
    text: "I loved that I could inspect full profiles, verified ID checks, and previous experience before paying. Found a wonderful infant nanny within 48 hours.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  {
    id: "t4",
    name: "Vikas Chaudhary",
    area: "Dwarka, Delhi NCR",
    text: "Hired our family cook and a daily cleaner through Help Zone. The verified badge gave us total confidence and background peace of mind.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
  },
  {
    id: "t5",
    name: "Simran Bedi",
    area: "Kothrud, Pune",
    text: "The language and schedule filters saved me hours. Found a Marathi and Hindi-speaking full-time helper near my society immediately.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export function getTestimonials(): Testimonial[] {
  return TESTIMONIALS;
}
