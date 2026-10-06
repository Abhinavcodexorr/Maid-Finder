// One-off codegen script: generates local, deterministic illustrated avatar
// SVGs (via @dicebear) for every provider and testimonial, so the app never
// depends on an external photo CDN (which is what caused images not to load).
//
// Run with: node scripts/generate-avatars.mjs
// Writes to: public/images/providers/<id>.svg, public/images/testimonials/<id>.svg
//
// The (firstName, lastName) lists below are copied from src/data/providers.ts
// and src/data/testimonials.ts purely to regenerate ids/filenames — they are
// not the source of truth for app data, just for naming these static assets.

import { createAvatar } from "@dicebear/core";
import * as personas from "@dicebear/personas";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public", "images");

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Same order as the RAW array in src/data/providers.ts
const PROVIDER_NAMES = [
  "Suresh Mehra", "Ramesh Babu", "Zoya Ahmed", "Harpreet Kaur", "Imran Qureshi",
  "Radha Kumari", "Anitha P.", "Lakshmi M.", "Geeta N.", "Kamala R.", "Fatima Sheikh",
  "Vinod Yadav", "Rakesh Chauhan", "Sanjay Tiwari", "Dinesh Kumar",
  "Mahesh Joshi", "Anil Verma", "Bablu Shah", "Om Prakash",
  "Shyam Lal", "Naveen Rawat", "Pappu Mandal",
  "Rajendra Singh", "Pawan Kumar", "Deepak Negi",
  "Pooja Nair", "Tanvi Joshi", "Ayesha Khan", "Simran Kaur",
  "Lalitha Reddy", "George Mathew", "Susheela Iyer",
  "Mukesh Soni", "Yogesh Pawar", "Birju Thakur",
  "Meena Devi", "Sunita Bisht", "Kavita Rawal", "Farhan Ali", "Ritu Sharma",
  "Naresh Gupta", "Ajay Solanki", "Vikram Chandel", "Komal Yadav", "Ismail Sheikh",
];

const TESTIMONIAL_IDS = ["t1", "t2", "t3", "t4", "t5"];

function writeAvatar(dir, filename, seed) {
  const avatar = createAvatar(personas, { seed, size: 160 });
  writeFileSync(path.join(dir, `${filename}.svg`), avatar.toString(), "utf8");
}

function main() {
  const providersDir = path.join(PUBLIC_DIR, "providers");
  const testimonialsDir = path.join(PUBLIC_DIR, "testimonials");
  mkdirSync(providersDir, { recursive: true });
  mkdirSync(testimonialsDir, { recursive: true });

  PROVIDER_NAMES.forEach((fullName, i) => {
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");
    const id = `${slugify(firstName)}-${slugify(lastName)}-${i + 1}`;
    writeAvatar(providersDir, id, id);
  });
  console.log(`Generated ${PROVIDER_NAMES.length} provider avatars -> public/images/providers/`);

  TESTIMONIAL_IDS.forEach((id) => writeAvatar(testimonialsDir, id, id));
  console.log(`Generated ${TESTIMONIAL_IDS.length} testimonial avatars -> public/images/testimonials/`);
}

main();
