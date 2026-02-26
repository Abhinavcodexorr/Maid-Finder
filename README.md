# MaidFinder (Next.js Migration)

Production-grade Next.js App Router migration of the Angular MaidFinder app, preserving the same primary routes and flows.

## Included Flows

- Customer auth: `/login`, `/register`
- Maid auth: `/maid-login`, `/maid-register`
- Search/listing routes: `/search`, `/maid/[id]`
- Dashboard/profile routes: `/profile`, `/profile/dashboard`
- Content routes: `/about`, `/services`, `/pricing`, `/how-it-works`, `/blog`, `/faqs`, `/reviews`, `/testimonials`, `/contact`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- react-hook-form + zod
- Framer Motion

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npx eslint src --max-warnings=0
npm run build
```

## Vercel deployment

1. Import repository in Vercel.
2. Set **Root Directory** to `nextjs`.
3. Build command: `npm run build`.
4. Use default Next.js output settings.

After first setup, all pushes auto-deploy.
