# Rohit Kamble: Portfolio V3

A fast, interactive 3D developer portfolio for **Rohit Kamble**: Full Stack Developer, AI/ML enthusiast and Robotics & IoT engineer (B.Tech Electrical Engineering, 2026).

V3 grows out of [Portfolio V2](https://rohit-kamble-portfolio-v2.vercel.app). All V2 content is kept, restructured and updated from the latest resume.

## Highlights

- **WebGL hero (React Three Fiber + GSAP):** a floating microchip whose circuit traces fire data pulses outward. It has cursor-reactive lighting, a particle field, orbit rings and a scroll-driven camera.
- **Loads only when useful:** the 3D chunk is lazy-loaded after the first interaction or after idle, and only on desktops and tablets. Phones, reduced-motion users and devices without WebGL get a CSS-3D version of the same chip.
- **Interactive skill map:** a CSS-3D "tech globe" with category tabs. Each skill links to the projects and roles that actually used it, with no made-up percentages.
- **Project cards with 3D tilt** and an animated detail view: screenshot gallery, features, metrics, tech stack, architecture flow, prev/next and deep links (`#project-<slug>`).
- **Honest status labels** on every project: Live, Completed, In progress, Prototype or Concept.
- **Live GitHub activity:** profile stats, top languages, recent repositories and a contribution heatmap.
- **Working contact form** (Vercel Function + Resend), with validation, a honeypot, rate limiting and an email fallback.
- **Prerendered HTML** (React 19 `prerender`) with selective hydration of lazy sections. Content is visible and crawlable before any JavaScript runs.

## Tech stack

React 19 · Vite 8 · Tailwind CSS 4 · Three.js · @react-three/fiber · GSAP (ScrollTrigger) · Framer Motion (detail view only) · Vercel Functions · sharp (image pipeline)

## Lighthouse (production build, local)

| Form factor | Performance | Accessibility | Best Practices | SEO |
| ----------- | ----------- | ------------- | -------------- | --- |
| Mobile      | 92          | 100           | 100            | 100 |
| Desktop     | 92          | 100           | 100            | 100 |

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

**Adding a project screenshot:** drop a 16:10 image into `assets-src/projects/<name>.jpg`, run `npm run images`, then add `images: ['projects/<name>']` to the project. Projects without screenshots use an illustrated visual (`art: 'leaf' | 'car' | 'sofa' | 'bed' | 'network' | 'chart' | 'music' | 'shield' | 'heart'`).

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
  components/               Navbar, Footer, ProjectModal, ProjectArt, ChipPoster, Icon, UI helpers
  sections/                 Hero, About, Skills, Experience, Projects, Credentials, GitHubActivity, Contact
  three/HeroScene.jsx       WebGL scene (lazy chunk)
  data/                     All portfolio content
  lib/                      Hooks, circuit generator, image helpers
  styles/index.css          Design tokens, components, animations
```

## Accessibility

Semantic landmarks and headings, a skip link, visible focus states, keyboard-operable tabs, filters and dialog (with focus trap, Escape and focus return), `aria-live` feedback for the form and filters, AA colour contrast, and full `prefers-reduced-motion` support.

---

© Rohit Kamble
