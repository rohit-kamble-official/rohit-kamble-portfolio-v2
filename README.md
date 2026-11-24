# Rohit Kamble: Portfolio V4 (Volume 01)

A developer portfolio for **Rohit Kamble**: Full Stack Developer, AI/ML enthusiast and Robotics & IoT engineer (B.Tech Electrical Engineering, 2026).

V4 is designed like a printed book: paper and ink, heavy condensed headlines, one accent colour, and every section is a numbered chapter. All content comes from the resume and earlier versions of the portfolio.

## Highlights

- **Book layout:** eight chapters (Cover, Selected Work, The Stack, The Author, Experience, The Receipts, What I Bring, Contact) with chapter numbers, Japanese chapter labels, a vertical chapter rail and an "End of volume" colophon.
- **Ink effects:** the name on the cover inks itself in, colour screenshots are printed in greyscale until hovered, plus halftone dots, a paper grain and crossing marquee tapes.
- **Selected Work as comic panels**, a **bookshelf** with every project as a spine, and an index list. Any project opens as its own chapter (native `<dialog>`): screenshots, features, metrics, stack, architecture, prev/next and deep links (`#project-<slug>`).
- **Stack layers** that pile up as you scroll, each linked to the projects and roles that actually used those skills, with no made-up percentages.
- **Receipts:** hackathon results, leadership and certifications as torn paper receipts.
- **Honest status labels** on every project: Live, Completed, In progress, Prototype or Concept.
- **Reader controls:** pick red, blue or green ink and turn motion off; both are remembered. `prefers-reduced-motion` is respected.
- **Working contact form** (Vercel Function + Resend), with validation, a honeypot, rate limiting and an email fallback.
- **Prerendered HTML** (React 19 `prerender`) with selective hydration of lazy chapters. Content is visible and crawlable before any JavaScript runs. No 3D or animation libraries: effects are CSS.

## Tech stack

React 19 · Vite 8 · Tailwind CSS 4 · Vercel Functions · sharp (image pipeline). Fonts: Anton, Archivo, Instrument Serif and JetBrains Mono, self-hosted.

## Lighthouse (production build, local)

| Form factor | Performance | Accessibility | Best Practices | SEO |
| ----------- | ----------- | ------------- | -------------- | --- |
| Mobile      | 90–93       | 100           | 100            | 100 |
| Desktop     | 100         | 100           | 100            | 100 |

Measured with Lighthouse 12 against `npm run preview`. Real scores depend on the network and the device.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173 (client-rendered, includes the /api/contact dev middleware)
npm run build      # client build → SSR build → prerender + inline CSS into dist/index.html
npm run preview    # serve the production build at http://localhost:4173
```

Other scripts:

| Script                                  | What it does                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| `npm run images`                        | Converts `assets-src/**` into responsive AVIF + WebP in `public/images` and writes `src/data/image-manifest.json` |
| `npm run check:links`                   | Checks every external link in the content data                              |
| `node scripts/generate-brand-assets.mjs` | Regenerates favicons and the 1200×630 Open Graph image (needs Chrome or Edge) |

## Editing content

All content lives in `src/data/`. The sections read from it, so you rarely need to touch components.

| File                   | Content                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `profile.js`           | Name, headline, intro, links, About text and stats           |
| `experience.js`        | Roles and internships (timeline)                            |
| `projects.js`          | Projects, statuses, links, features, architecture, screenshots |
| `skills.js`            | Skill groups (each skill's usage evidence is computed from projects and roles) |
| `credentials.js`       | Education, certifications, achievements                     |
| `chapters.js`          | Chapter order, numbers and labels                           |

**Adding a project screenshot:** drop a 16:10 image into `assets-src/projects/<name>.jpg`, run `npm run images`, then add `images: ['projects/<name>']` to the project. Projects without screenshots get a generated ink cover with the project name.

**Resume:** replace `public/Rohit_Kamble_Resume.pdf` and keep the same file name.

## Contact form setup

The form posts to `api/contact.js` (a Vercel Serverless Function) which sends email through [Resend](https://resend.com).

1. Create a Resend account using the inbox that should receive messages, then create an API key.
2. In Vercel → Project → Settings → Environment Variables, add `RESEND_API_KEY`.
3. Optional: `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` (a verified sender on your own domain).

Until the key is set, the API returns `503` and the form offers an "Email instead" button with the message pre-filled. For local testing, put the variables in `.env.local` (see `.env.example`) and use `npm run dev`.

## Deploying to Vercel

The repo includes `vercel.json` (build command, output directory, cache and security headers).

1. Import the repository in Vercel (framework preset: Vite). The build command and output directory come from `vercel.json`.
2. Set `SITE_URL` to the final domain. It controls the canonical URL, Open Graph tags, `sitemap.xml` and `robots.txt`. The default is `https://rohit-kamble-portfolio-v2.vercel.app`.
3. Add `RESEND_API_KEY` for the contact form.
4. The Google Search Console verification file in `public/` is kept.

## Project structure

```
api/contact.js              Vercel Function: contact form → Resend
assets-src/                 Original images (not deployed); input for npm run images
public/                     Static files: resume, fonts, optimised images, icons, OG image, 404 page
scripts/                    Prerender, image pipeline, brand assets, link checker
src/
  App.jsx                   Page composition (lazy sections + error boundaries)
  entry-server.jsx          Static prerender entry
  main.jsx                  Hydration entry
  components/               Navbar, Footer, ProjectChapter (detail dialog), UI helpers
  sections/                 Hero, Work, Stack, About, Experience, Receipts, Bring, Contact
  data/                     All portfolio content
  lib/                      Hooks, image helpers
  styles/index.css          Paper & ink design tokens, components, animations
```

## Accessibility

Semantic landmarks and headings, a skip link, visible focus states, a native modal dialog (Escape, arrow keys for prev/next, focus return), `aria-live` feedback for the form, AA colour contrast, a motion toggle and full `prefers-reduced-motion` support.

---

© Rohit Kamble
