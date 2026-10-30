export interface Article {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readMinutes: number;
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "how-to-hire-a-maid",
    title: "How to hire a maid: five things to check first",
    summary: "A simple checklist to run through before you let someone into your home.",
    category: "Hiring guide",
    readMinutes: 4,
    body: [
      "Hiring someone to work in your home is a decision about trust, so start with the basics. Look at the profile first: does it list real experience, the languages the person speaks and the areas they can work in? A complete profile is a good sign that the person took the time to register properly.",
      "Check that identity has been verified. On Help Zone every professional submits Aadhaar and PAN and records an intro video before the profile goes live, but it is still worth asking to see the original ID when you meet.",
      "Talk before you decide. Call the professional, explain the work, the timings and the household size, and listen to how they respond. A short conversation tells you a lot about reliability and fit.",
      "Agree a trial period. A week or two of working together lets both sides see whether the arrangement suits them, and gives you a natural moment to adjust timings or tasks.",
      "Put the terms in plain words: working hours, days off, salary, and how much notice either side gives. Writing it down, even as a simple message, prevents most misunderstandings later.",
    ],
  },
  {
    slug: "questions-to-ask-before-hiring-a-cook",
    title: "Questions to ask before hiring a cook",
    summary: "From cuisines to kitchen hygiene, what to cover in the first conversation.",
    category: "Hiring guide",
    readMinutes: 3,
    body: [
      "A good cook is a match for your kitchen as much as your taste. Start by describing what you eat every day: the cuisines, whether the household is vegetarian, Jain or has allergies, and how many people you cook for.",
      "Ask which dishes they cook confidently and how they handle planning. Some cooks like a weekly menu, others prefer to decide each morning; knowing this up front avoids friction.",
      "Talk about hygiene and routine: handwashing, how food is stored, who buys groceries and how the kitchen is left at the end of the day.",
      "Finally, agree the schedule. Cooking for one meal a day is a different arrangement from full-time cooking, and the time you need them to arrive matters more than most people expect.",
    ],
  },
  {
    slug: "nanny-and-elderly-care-safety-checklist",
    title: "Hiring a nanny or elderly caregiver: a safety checklist",
    summary: "Extra care to take when the person you hire looks after someone you love.",
    category: "Safety",
    readMinutes: 4,
    body: [
      "When the work involves caring for a child or an older family member, take extra time. Meet the person more than once, and let them spend time with the person they will be caring for while you are nearby.",
      "Ask about relevant experience and training: infant care, first aid, helping someone with mobility, or managing medicines. Be specific about what you will need on a normal day and on a difficult one.",
      "Make sure the professional is comfortable with the routine: feeding, naps, medicines, outings. Write down emergency contacts and the nearest doctor or hospital, and share them on day one.",
      "Stay involved in the first weeks. Drop in at different times, ask the person you care for how things went, and keep communication open so small concerns are raised early.",
    ],
  },
  {
    slug: "agreeing-salary-and-terms-directly",
    title: "Agreeing salary and terms directly",
    summary: "How to have a fair, clear conversation about pay, leave and notice.",
    category: "Hiring guide",
    readMinutes: 3,
    body: [
      "Because Help Zone lets you contact professionals directly, you agree the terms yourselves. That is an advantage, as long as the conversation is open and specific.",
      "Start with the work: tasks, hours and days. Then discuss pay and how it will be paid, for example on a fixed date each month. Be clear about what is included, such as travel, meals or festival bonus.",
      "Talk about leave and notice. How many days off in a month, how absences are handled, and how much notice either side will give if the arrangement ends.",
      "Be fair and be consistent. Pay on time, respect the agreed hours and treat the person as a professional; people who feel respected are far more likely to stay.",
    ],
  },
  {
    slug: "why-help-zone-has-no-commission",
    title: "Why Help Zone doesn't take a commission",
    summary: "How the platform works and where your money goes.",
    category: "About Help Zone",
    readMinutes: 2,
    body: [
      "Traditional agencies often charge a placement fee and sometimes take a share of the professional's wages. Help Zone works differently: browsing is free, and a one-time membership unlocks contact details for every verified profile.",
      "Once you have the number, you speak to the professional yourself and agree the terms. We do not sit between you, and we never take a cut of the salary.",
      "For professionals, listing is free. Registering takes a few minutes: verify your mobile number, add your details and upload your documents and a short video.",
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
