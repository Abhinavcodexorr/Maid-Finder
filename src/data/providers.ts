import type { AvailabilityType, Gender, PriceUnit, Provider } from "@/types/marketplace";

type RawProvider = {
  firstName: string;
  lastName: string;
  gender: Gender;
  photoSeed: number;
  categoryId: string;
  skills: string[];
  experienceYears: number;
  age: number;
  languages: string[];
  area: string;
  city: string;
  availabilityType: AvailabilityType;
  price: number;
  priceUnit: PriceUnit;
  about: string;
  verified: boolean;
  rating: number;
  joinedDaysAgo: number;
};

const RAW: RawProvider[] = [
  // ---- Cook ----
  { firstName: "Suresh", lastName: "Mehra", gender: "male", photoSeed: 32, categoryId: "cat-cook", skills: ["North Indian", "South Indian"], experienceYears: 6, age: 34, languages: ["Hindi", "English"], area: "Karol Bagh", city: "Delhi", availabilityType: "part-time", price: 9500, priceUnit: "per month", about: "Home chef specializing in North and South Indian cuisine for daily meals or events.", verified: true, rating: 4.7, joinedDaysAgo: 420 },
  { firstName: "Ramesh", lastName: "Babu", gender: "male", photoSeed: 76, categoryId: "cat-cook", skills: ["South Indian", "Tiffin Service"], experienceYears: 10, age: 41, languages: ["Kannada", "Tamil", "English", "Hindi"], area: "Indiranagar", city: "Bengaluru", availabilityType: "full-time", price: 14000, priceUnit: "per month", about: "Veteran home cook known for authentic South Indian breakfast and weekly tiffin boxes.", verified: true, rating: 4.9, joinedDaysAgo: 610 },
  { firstName: "Zoya", lastName: "Ahmed", gender: "female", photoSeed: 22, categoryId: "cat-cook", skills: ["North Indian", "Continental", "Baking"], experienceYears: 5, age: 29, languages: ["Hindi", "Urdu", "English"], area: "Bandra West", city: "Mumbai", availabilityType: "part-time", price: 550, priceUnit: "per visit", about: "Trained chef offering North Indian and continental home-cooked meals, plus weekend baking.", verified: true, rating: 4.7, joinedDaysAgo: 210 },
  { firstName: "Harpreet", lastName: "Kaur", gender: "female", photoSeed: 44, categoryId: "cat-cook", skills: ["North Indian", "Jain Food"], experienceYears: 8, age: 38, languages: ["Punjabi", "Hindi", "English"], area: "Rohini", city: "Delhi", availabilityType: "full-time", price: 12500, priceUnit: "per month", about: "Specializes in Jain and Punjabi home food with strict hygiene practices.", verified: true, rating: 4.8, joinedDaysAgo: 505 },
  { firstName: "Imran", lastName: "Qureshi", gender: "male", photoSeed: 51, categoryId: "cat-cook", skills: ["Chinese", "Continental"], experienceYears: 4, age: 27, languages: ["Hindi", "Telugu", "English"], area: "Jubilee Hills", city: "Hyderabad", availabilityType: "one-time", price: 1200, priceUnit: "per visit", about: "Available for party and event cooking — Chinese and continental menus a specialty.", verified: false, rating: 4.4, joinedDaysAgo: 95 },

  // ---- Maid / Cleaning ----
  { firstName: "Radha", lastName: "Kumari", gender: "female", photoSeed: 68, categoryId: "cat-maid", skills: ["Deep Cleaning", "Utensils"], experienceYears: 5, age: 32, languages: ["Marathi", "Hindi", "English"], area: "Andheri West", city: "Mumbai", availabilityType: "part-time", price: 6500, priceUnit: "per month", about: "Experienced house help specializing in deep cleaning and everyday utensils. Punctual and tidy.", verified: true, rating: 4.8, joinedDaysAgo: 380 },
  { firstName: "Anitha", lastName: "P.", gender: "female", photoSeed: 65, categoryId: "cat-maid", skills: ["Sweeping & Mopping", "Dusting"], experienceYears: 3, age: 26, languages: ["Kannada", "Hindi", "English"], area: "Koramangala", city: "Bengaluru", availabilityType: "part-time", price: 4200, priceUnit: "per month", about: "Reliable daily help for sweeping, mopping and dusting. Available mornings and evenings.", verified: true, rating: 4.6, joinedDaysAgo: 260 },
  { firstName: "Lakshmi", lastName: "M.", gender: "female", photoSeed: 44, categoryId: "cat-maid", skills: ["Deep Cleaning", "Laundry & Ironing"], experienceYears: 7, age: 36, languages: ["Hindi", "English"], area: "Dwarka", city: "Delhi", availabilityType: "full-time", price: 9000, priceUnit: "per month", about: "Full-time live-out help with 7 years of experience across households of all sizes.", verified: true, rating: 4.9, joinedDaysAgo: 700 },
  { firstName: "Geeta", lastName: "N.", gender: "female", photoSeed: 50, categoryId: "cat-maid", skills: ["Utensils", "Laundry & Ironing"], experienceYears: 2, age: 24, languages: ["Kannada", "Hindi"], area: "HSR Layout", city: "Bengaluru", availabilityType: "part-time", price: 3600, priceUnit: "per month", about: "Focused on utensils and laundry, flexible with timing.", verified: false, rating: 4.5, joinedDaysAgo: 140 },
  { firstName: "Kamala", lastName: "R.", gender: "female", photoSeed: 56, categoryId: "cat-maid", skills: ["Deep Cleaning", "Bathroom Cleaning"], experienceYears: 4, age: 30, languages: ["Marathi", "Hindi"], area: "Powai", city: "Mumbai", availabilityType: "part-time", price: 5200, priceUnit: "per month", about: "Thorough and friendly house help, great with pets and happy to do light ironing on request.", verified: true, rating: 4.6, joinedDaysAgo: 300 },
  { firstName: "Fatima", lastName: "Sheikh", gender: "female", photoSeed: 62, categoryId: "cat-maid", skills: ["Deep Cleaning", "Laundry & Ironing"], experienceYears: 8, age: 39, languages: ["Telugu", "Urdu", "Hindi", "English"], area: "Banjara Hills", city: "Hyderabad", availabilityType: "live-in", price: 11000, priceUnit: "per month", about: "Senior house help with 8 years in city households. Meticulous, discreet and reliable.", verified: true, rating: 4.9, joinedDaysAgo: 820 },

  // ---- Plumber ----
  { firstName: "Vinod", lastName: "Yadav", gender: "male", photoSeed: 11, categoryId: "cat-plumber", skills: ["Leak Repair", "Pipe Fitting"], experienceYears: 9, age: 37, languages: ["Hindi", "Haryanvi"], area: "Gurgaon Sector 14", city: "Gurgaon", availabilityType: "one-time", price: 350, priceUnit: "per visit", about: "Quick response for leaks and pipe fitting across Gurgaon. 9 years in residential plumbing.", verified: true, rating: 4.7, joinedDaysAgo: 540 },
  { firstName: "Rakesh", lastName: "Chauhan", gender: "male", photoSeed: 15, categoryId: "cat-plumber", skills: ["Bathroom Fitting", "Water Tank"], experienceYears: 12, age: 44, languages: ["Kannada", "Hindi", "English"], area: "Whitefield", city: "Bengaluru", availabilityType: "one-time", price: 450, priceUnit: "per visit", about: "Specialist in bathroom fittings and water tank installation and cleaning.", verified: true, rating: 4.8, joinedDaysAgo: 900 },
  { firstName: "Sanjay", lastName: "Tiwari", gender: "male", photoSeed: 19, categoryId: "cat-plumber", skills: ["Drainage", "Emergency Service"], experienceYears: 6, age: 33, languages: ["Marathi", "Hindi", "English"], area: "Andheri East", city: "Mumbai", availabilityType: "full-time", price: 280, priceUnit: "per hour", about: "On-call plumber for drainage issues and emergency repairs, available most evenings.", verified: false, rating: 4.3, joinedDaysAgo: 180 },
  { firstName: "Dinesh", lastName: "Kumar", gender: "male", photoSeed: 23, categoryId: "cat-plumber", skills: ["Pipe Fitting", "Emergency Service"], experienceYears: 5, age: 30, languages: ["Hindi"], area: "Janakpuri", city: "Delhi", availabilityType: "one-time", price: 300, priceUnit: "per visit", about: "Affordable pipe fitting and emergency leak repair, same-day service in Delhi.", verified: true, rating: 4.5, joinedDaysAgo: 260 },

  // ---- Electrician ----
  { firstName: "Mahesh", lastName: "Joshi", gender: "male", photoSeed: 8, categoryId: "cat-electrician", skills: ["Wiring", "Switchboard"], experienceYears: 11, age: 40, languages: ["Marathi", "Hindi", "English"], area: "Juhu", city: "Mumbai", availabilityType: "one-time", price: 300, priceUnit: "per visit", about: "Licensed electrician for house wiring, switchboard upgrades and safety checks.", verified: true, rating: 4.8, joinedDaysAgo: 760 },
  { firstName: "Anil", lastName: "Verma", gender: "male", photoSeed: 12, categoryId: "cat-electrician", skills: ["Appliance Repair", "Inverter & UPS"], experienceYears: 7, age: 34, languages: ["Kannada", "Hindi", "English"], area: "JP Nagar", city: "Bengaluru", availabilityType: "full-time", price: 320, priceUnit: "per visit", about: "Appliance and inverter/UPS repair specialist, quick diagnosis and fair pricing.", verified: true, rating: 4.6, joinedDaysAgo: 400 },
  { firstName: "Bablu", lastName: "Shah", gender: "male", photoSeed: 16, categoryId: "cat-electrician", skills: ["Fan & Light Fitting", "Wiring"], experienceYears: 4, age: 28, languages: ["Marathi", "Hindi"], area: "Baner", city: "Pune", availabilityType: "one-time", price: 250, priceUnit: "per visit", about: "Fast fan and light fitting service, also handles minor wiring repairs.", verified: false, rating: 4.4, joinedDaysAgo: 150 },
  { firstName: "Om", lastName: "Prakash", gender: "male", photoSeed: 20, categoryId: "cat-electrician", skills: ["Safety Audit", "Wiring"], experienceYears: 14, age: 46, languages: ["Hindi", "English"], area: "Mayur Vihar", city: "Delhi", availabilityType: "one-time", price: 400, priceUnit: "per visit", about: "Full home electrical safety audits plus rewiring for older properties.", verified: true, rating: 4.9, joinedDaysAgo: 980 },

  // ---- Carpenter ----
  { firstName: "Shyam", lastName: "Lal", gender: "male", photoSeed: 24, categoryId: "cat-carpenter", skills: ["Furniture Repair", "Door & Window"], experienceYears: 10, age: 42, languages: ["Marathi", "Hindi"], area: "Bandra", city: "Mumbai", availabilityType: "one-time", price: 500, priceUnit: "per visit", about: "Furniture repair and door/window fitting with a decade of experience.", verified: true, rating: 4.7, joinedDaysAgo: 650 },
  { firstName: "Naveen", lastName: "Rawat", gender: "male", photoSeed: 28, categoryId: "cat-carpenter", skills: ["Modular Kitchen", "Custom Furniture"], experienceYears: 8, age: 35, languages: ["Kannada", "Hindi", "English"], area: "Indiranagar", city: "Bengaluru", availabilityType: "one-time", price: 1200, priceUnit: "per visit", about: "Modular kitchen installation and custom furniture builds, portfolio available on request.", verified: true, rating: 4.8, joinedDaysAgo: 500 },
  { firstName: "Pappu", lastName: "Mandal", gender: "male", photoSeed: 31, categoryId: "cat-carpenter", skills: ["Polishing", "Furniture Repair"], experienceYears: 6, age: 31, languages: ["Bengali", "Hindi"], area: "Salt Lake", city: "Kolkata", availabilityType: "one-time", price: 400, priceUnit: "per visit", about: "Furniture polishing and repair, known for neat finishing work.", verified: false, rating: 4.3, joinedDaysAgo: 110 },

  // ---- Driver ----
  { firstName: "Rajendra", lastName: "Singh", gender: "male", photoSeed: 61, categoryId: "cat-driver", skills: ["City Driving", "Manual & Automatic"], experienceYears: 12, age: 45, languages: ["Hindi"], area: "Rohini", city: "Delhi", availabilityType: "full-time", price: 22000, priceUnit: "per month", about: "Full-time driver experienced with both manual and automatic cars, clean record.", verified: true, rating: 4.8, joinedDaysAgo: 800 },
  { firstName: "Pawan", lastName: "Kumar", gender: "male", photoSeed: 64, categoryId: "cat-driver", skills: ["Outstation", "Night Driving"], experienceYears: 9, age: 38, languages: ["Kannada", "Hindi", "English"], area: "Koramangala", city: "Bengaluru", availabilityType: "full-time", price: 25000, priceUnit: "per month", about: "Comfortable with long outstation trips and city driving, well-mannered and punctual.", verified: true, rating: 4.7, joinedDaysAgo: 430 },
  { firstName: "Deepak", lastName: "Negi", gender: "male", photoSeed: 69, categoryId: "cat-driver", skills: ["Commercial License", "City Driving"], experienceYears: 15, age: 48, languages: ["Marathi", "Hindi", "English"], area: "Worli", city: "Mumbai", availabilityType: "part-time", price: 15000, priceUnit: "per month", about: "Holds a commercial license, available part-time for daily office commute runs.", verified: true, rating: 4.9, joinedDaysAgo: 1100 },

  // ---- Babysitter / Nanny ----
  { firstName: "Pooja", lastName: "Nair", gender: "female", photoSeed: 29, categoryId: "cat-babysitter", skills: ["Infant Care", "Homework Help"], experienceYears: 4, age: 27, languages: ["Malayalam", "English", "Kannada", "Hindi"], area: "HSR Layout", city: "Bengaluru", availabilityType: "full-time", price: 15000, priceUnit: "per month", about: "Early-childhood trained caregiver, great with infants and toddlers. First-aid certified.", verified: true, rating: 4.8, joinedDaysAgo: 360 },
  { firstName: "Tanvi", lastName: "Joshi", gender: "female", photoSeed: 33, categoryId: "cat-babysitter", skills: ["Toddler Care", "Activities & Play"], experienceYears: 3, age: 25, languages: ["Marathi", "Hindi", "English"], area: "Dadar", city: "Mumbai", availabilityType: "part-time", price: 220, priceUnit: "per hour", about: "Creative and energetic sitter who plans activities and games suited to each child's age.", verified: true, rating: 4.6, joinedDaysAgo: 230 },
  { firstName: "Ayesha", lastName: "Khan", gender: "female", photoSeed: 41, categoryId: "cat-babysitter", skills: ["Newborn Care", "Night Shifts"], experienceYears: 6, age: 31, languages: ["Telugu", "Urdu", "Hindi", "English"], area: "Gachibowli", city: "Hyderabad", availabilityType: "live-in", price: 20000, priceUnit: "per month", about: "Specializes in newborn and night-shift care so new parents can rest easy.", verified: true, rating: 4.9, joinedDaysAgo: 540 },
  { firstName: "Simran", lastName: "Kaur", gender: "female", photoSeed: 36, categoryId: "cat-babysitter", skills: ["Homework Help", "Toddler Care"], experienceYears: 2, age: 23, languages: ["Punjabi", "Hindi", "English"], area: "Gurgaon Sector 56", city: "Gurgaon", availabilityType: "part-time", price: 180, priceUnit: "per hour", about: "Patient with school-age kids, helps with homework and evening routines.", verified: false, rating: 4.4, joinedDaysAgo: 90 },

  // ---- Elderly Care ----
  { firstName: "Lalitha", lastName: "Reddy", gender: "female", photoSeed: 54, categoryId: "cat-elderly-care", skills: ["Mobility Support", "Medication Reminders"], experienceYears: 9, age: 43, languages: ["Tamil", "Telugu", "Hindi", "English"], area: "Anna Nagar", city: "Chennai", availabilityType: "full-time", price: 18000, priceUnit: "per month", about: "Compassionate elder-care attendant with 9 years supporting seniors with daily living and mobility.", verified: true, rating: 4.9, joinedDaysAgo: 700 },
  { firstName: "George", lastName: "Mathew", gender: "male", photoSeed: 45, categoryId: "cat-elderly-care", skills: ["Companionship", "Mobility Support"], experienceYears: 7, age: 39, languages: ["Malayalam", "English", "Kannada", "Hindi"], area: "Indiranagar", city: "Bengaluru", availabilityType: "full-time", price: 17000, priceUnit: "per month", about: "Trained caregiver offering companionship and mobility assistance for elderly clients.", verified: true, rating: 4.8, joinedDaysAgo: 480 },
  { firstName: "Susheela", lastName: "Iyer", gender: "female", photoSeed: 71, categoryId: "cat-elderly-care", skills: ["Dementia Care", "Medication Reminders"], experienceYears: 11, age: 47, languages: ["Tamil", "Marathi", "English", "Hindi"], area: "Matunga", city: "Mumbai", availabilityType: "live-in", price: 24000, priceUnit: "per month", about: "Specialist in dementia and memory care with over a decade of experience in senior support.", verified: true, rating: 5.0, joinedDaysAgo: 950 },

  // ---- Painter ----
  { firstName: "Mukesh", lastName: "Soni", gender: "male", photoSeed: 73, categoryId: "cat-painter", skills: ["Interior Painting", "Texture Work"], experienceYears: 10, age: 41, languages: ["Bengali", "Hindi"], area: "Salt Lake", city: "Kolkata", availabilityType: "one-time", price: 8000, priceUnit: "per visit", about: "Interior painting and texture wall finishes for homes, free sample patch before full job.", verified: true, rating: 4.7, joinedDaysAgo: 610 },
  { firstName: "Yogesh", lastName: "Pawar", gender: "male", photoSeed: 77, categoryId: "cat-painter", skills: ["Exterior Painting", "Waterproofing"], experienceYears: 13, age: 44, languages: ["Marathi", "Hindi"], area: "Kothrud", city: "Pune", availabilityType: "one-time", price: 12000, priceUnit: "per visit", about: "Exterior painting with waterproofing treatment, handles independent houses and villas.", verified: true, rating: 4.8, joinedDaysAgo: 720 },
  { firstName: "Birju", lastName: "Thakur", gender: "male", photoSeed: 79, categoryId: "cat-painter", skills: ["Wood Polish", "Interior Painting"], experienceYears: 5, age: 29, languages: ["Marathi", "Hindi"], area: "Powai", city: "Mumbai", availabilityType: "one-time", price: 5500, priceUnit: "per visit", about: "Affordable interior painting and wood polishing for apartments.", verified: false, rating: 4.3, joinedDaysAgo: 130 },

  // ---- More Pan-India candidates ----
  { firstName: "Meena", lastName: "Devi", gender: "female", photoSeed: 80, categoryId: "cat-maid", skills: ["Deep Cleaning", "Sweeping & Mopping"], experienceYears: 6, age: 34, languages: ["Marathi", "Hindi"], area: "Viman Nagar", city: "Pune", availabilityType: "part-time", price: 5800, priceUnit: "per month", about: "Dependable daily cleaning help, flexible with schedule changes.", verified: true, rating: 4.6, joinedDaysAgo: 340 },
  { firstName: "Sunita", lastName: "Bisht", gender: "female", photoSeed: 83, categoryId: "cat-maid", skills: ["Laundry & Ironing", "Utensils"], experienceYears: 3, age: 27, languages: ["Tamil", "Hindi", "English"], area: "T. Nagar", city: "Chennai", availabilityType: "part-time", price: 4000, priceUnit: "per month", about: "Careful with delicate fabrics, also manages utensils and basic tidying.", verified: false, rating: 4.4, joinedDaysAgo: 120 },
  { firstName: "Kavita", lastName: "Rawal", gender: "female", photoSeed: 85, categoryId: "cat-cook", skills: ["North Indian", "Diet Cooking"], experienceYears: 7, age: 35, languages: ["Marathi", "Hindi", "English"], area: "Kothrud", city: "Pune", availabilityType: "part-time", price: 11000, priceUnit: "per month", about: "Prepares diet-friendly meals, works closely with nutrition plans.", verified: true, rating: 4.8, joinedDaysAgo: 460 },
  { firstName: "Farhan", lastName: "Ali", gender: "male", photoSeed: 87, categoryId: "cat-driver", skills: ["City Driving", "Outstation"], experienceYears: 5, age: 30, languages: ["Telugu", "Hindi", "Urdu"], area: "Jubilee Hills", city: "Hyderabad", availabilityType: "full-time", price: 18000, priceUnit: "per month", about: "Safe city driver, also available for weekend outstation trips.", verified: false, rating: 4.3, joinedDaysAgo: 160 },
  { firstName: "Ritu", lastName: "Sharma", gender: "female", photoSeed: 89, categoryId: "cat-babysitter", skills: ["Infant Care", "Night Shifts"], experienceYears: 5, age: 28, languages: ["Marathi", "Hindi", "English"], area: "Wakad", city: "Pune", availabilityType: "live-in", price: 19000, priceUnit: "per month", about: "Live-in nanny experienced with infants, flexible with night shifts.", verified: true, rating: 4.7, joinedDaysAgo: 390 },
  { firstName: "Naresh", lastName: "Gupta", gender: "male", photoSeed: 91, categoryId: "cat-electrician", skills: ["Wiring", "Appliance Repair"], experienceYears: 8, age: 36, languages: ["Telugu", "Hindi"], area: "Madhapur", city: "Hyderabad", availabilityType: "one-time", price: 280, priceUnit: "per visit", about: "General electrical repairs and appliance servicing at home.", verified: true, rating: 4.6, joinedDaysAgo: 410 },
  { firstName: "Ajay", lastName: "Solanki", gender: "male", photoSeed: 93, categoryId: "cat-plumber", skills: ["Bathroom Fitting", "Leak Repair"], experienceYears: 7, age: 34, languages: ["Telugu", "Hindi"], area: "Gachibowli", city: "Hyderabad", availabilityType: "one-time", price: 380, priceUnit: "per visit", about: "Bathroom fitting specialist, also handles general leak repairs.", verified: true, rating: 4.5, joinedDaysAgo: 290 },
  { firstName: "Vikram", lastName: "Chandel", gender: "male", photoSeed: 95, categoryId: "cat-carpenter", skills: ["Custom Furniture", "Door & Window"], experienceYears: 9, age: 37, languages: ["Hindi", "English"], area: "Lajpat Nagar", city: "Delhi", availabilityType: "one-time", price: 900, priceUnit: "per visit", about: "Custom furniture and door/window carpentry with a focus on precise measurements.", verified: true, rating: 4.7, joinedDaysAgo: 520 },
  { firstName: "Komal", lastName: "Yadav", gender: "female", photoSeed: 97, categoryId: "cat-elderly-care", skills: ["Companionship", "Post-surgery Care"], experienceYears: 4, age: 29, languages: ["Hindi"], area: "Dwarka", city: "Delhi", availabilityType: "part-time", price: 9500, priceUnit: "per month", about: "Attentive companion care, also trained in basic post-surgery assistance.", verified: false, rating: 4.4, joinedDaysAgo: 170 },
  { firstName: "Ismail", lastName: "Sheikh", gender: "male", photoSeed: 99, categoryId: "cat-painter", skills: ["Interior Painting", "Texture Work"], experienceYears: 6, age: 32, languages: ["Telugu", "Hindi", "Urdu"], area: "Madhapur", city: "Hyderabad", availabilityType: "one-time", price: 7000, priceUnit: "per visit", about: "Neat interior painting work, available on short notice for touch-ups.", verified: false, rating: 4.3, joinedDaysAgo: 100 },
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makePhone(index: number): string {
  const base = 7000000000 + index * 37 + 123;
  return `+91 ${String(base).slice(0, 5)} ${String(base).slice(5, 10)}`;
}

function makeJoinedDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const PROVIDERS: Provider[] = RAW.map((p, i) => ({
  id: `${slugify(p.firstName)}-${slugify(p.lastName)}-${i + 1}`,
  firstName: p.firstName,
  lastName: p.lastName,
  photo: `https://randomuser.me/api/portraits/${p.gender === "male" ? "men" : "women"}/${p.photoSeed}.jpg`,
  categoryId: p.categoryId,
  skills: p.skills,
  experienceYears: p.experienceYears,
  gender: p.gender,
  age: p.age,
  languages: p.languages,
  area: p.area,
  city: p.city,
  availabilityType: p.availabilityType,
  price: p.price,
  priceUnit: p.priceUnit,
  phone: makePhone(i),
  about: p.about,
  verified: p.verified,
  rating: p.rating,
  joinedDate: makeJoinedDate(p.joinedDaysAgo),
}));

export function getAllProviders(): Provider[] {
  return PROVIDERS;
}

export function getProviderByIdRaw(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
