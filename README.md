# Ritesh Jena · Portfolio

Personal portfolio for Ritesh Jena, Software Consultant at ITPlusPoint. Next.js (App Router) + TypeScript, Tailwind CSS v4, Motion, GSAP ScrollTrigger, Lenis and React Three Fiber.

## Structure

```
src/
  app/                layout, page, not-found, error, robots, sitemap, opengraph-image
    api/contact/      contact form handler (Resend)
  components/
    sections/         loader, nav, hero, about, services, stack, experience, work, recognition, contact, footer
    motion/           motion root (Lenis + GSAP), reveal, split-text, tilt, magnetic, cursor
    three/            stack-scene (3D hero)
    ui/               section-head, project-diagram
  content/profile.ts  every fact and line of copy on the site
  lib/                contact form validation (zod)
public/               resume PDF, profile photo
scripts/              build-preview.mjs (static preview build)
```

To change text, add a project or set the GitHub link, edit `src/content/profile.ts`.

## Local development

```bash
npm install
cp .env.example .env.local   # then add your Resend API key
npm run dev                  # http://localhost:3000
```

## Checks and production build

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes, for the contact form | API key from resend.com |
| `CONTACT_TO_EMAIL` | Yes, for the contact form | Inbox that receives messages |
| `CONTACT_FROM_EMAIL` | No | Sender address on a domain verified in Resend |

Without the first two, the site works and the form shows a "not set up yet" message instead of sending.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose Add New → Project and import the repository. The Next.js preset needs no changes.
3. Add the environment variables above under Settings → Environment Variables.
4. Deploy. To use riteshjena.co.in, add it under Settings → Domains and update DNS as Vercel shows.

## Static preview

`npm run build:preview` writes a server-free copy to `out/` (contact sending disabled) for sharing as a preview.
