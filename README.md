# 🚀 Rohit Kamble — Futuristic Portfolio

A premium, award-worthy developer portfolio built with **React + Vite + Tailwind CSS + Framer Motion**.

## ✨ Features

- 🎨 **Dark Futuristic UI** — Deep space aesthetic with neon violet/cyan accents
- 🖱️ **Custom Animated Cursor** — Dot + ring trail with hover scaling
- ✍️ **Typing Animation** — Multi-role text cycler in the hero
- 🌀 **Particle System** — Floating particles rising through the hero
- 📊 **Counter Animation** — Stats count up when scrolled into view
- 🃏 **3D Tilt Cards** — Projects tilt on mouse move (perspective transform)
- 🔍 **Project Filter** — Filter by Full Stack, AI/ML, IoT, Safety Tech
- 🕐 **Animated Timeline** — Color-coded experience & education timeline
- 📜 **Scroll Progress Bar** — Gradient progress line at the top
- 🔄 **Scroll Reveal** — Elements fade + slide in on intersection
- 📱 **Fully Responsive** — Mobile-first, works perfectly on all screens
- ⚡ **Vite Optimized** — Lightning-fast HMR and production builds
- 🌐 **SEO Ready** — Meta tags, OG tags, descriptive title

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI Framework |
| Vite 5 | Build Tool + Dev Server |
| Tailwind CSS 3 | Utility-first Styling |
| React Icons | Icon library |
| Custom Hooks | Scroll reveal, typing, count-up |

## 📁 Project Structure

```
src/
├── components/
│   ├── Cursor.jsx          # Custom animated cursor
│   ├── Navbar.jsx          # Sticky nav with mobile menu
│   ├── ScrollProgress.jsx  # Top progress bar
│   ├── SectionHeader.jsx   # Reusable section titles
│   └── Footer.jsx          # Footer with social links
│
├── sections/
│   ├── Hero.jsx            # Full-screen hero with particles
│   ├── About.jsx           # About + stats counters
│   ├── Skills.jsx          # Tech skill category cards
│   ├── Projects.jsx        # Projects with filter + 3D tilt
│   ├── Experience.jsx      # Animated experience timeline
│   ├── Services.jsx        # Service offering cards
│   ├── Achievements.jsx    # Certs & hackathon wins
│   └── Contact.jsx         # Contact form + social links
│
├── hooks/
│   ├── useScrollReveal.js  # IntersectionObserver + count-up
│   └── useTypingEffect.js  # Typing animation hook
│
├── utils/
│   └── data.js             # All portfolio content (edit here)
│
├── App.jsx                 # Root component
├── main.jsx                # Entry point
└── index.css               # Global styles + animations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# 1. Navigate to the project
cd rohit-portfolio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

### Production Build

```bash
npm run build
# Output → dist/ folder
```

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts — auto-detects Vite config
```

Or drag & drop the `dist/` folder at [vercel.com/new](https://vercel.com/new)

### Option 2: Netlify

```bash
npm run build
# Drag dist/ to netlify.com/drop
```

Or connect your GitHub repo at [netlify.com](https://netlify.com) with:
- Build command: `npm run build`
- Publish directory: `dist`

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

npm run build
npm run deploy
```

## 📧 EmailJS Integration (Contact Form)

To enable real email sending:

1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Create a service + email template
3. Get your **Service ID**, **Template ID**, **Public Key**
4. Install: `npm install emailjs-com`
5. Update `src/sections/Contact.jsx`:

```js
import emailjs from 'emailjs-com'

// In handleSubmit:
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  { name: form.name, email: form.email, message: form.message },
  'YOUR_PUBLIC_KEY'
)
```

## ✏️ Customization

All content lives in **`src/utils/data.js`** — just edit that file!

- `personalInfo` — name, email, GitHub, LinkedIn, resume URL
- `stats` — the 4 achievement counters
- `skills` — tech categories and their chips
- `projects` — project cards with links
- `experience` — internship timeline
- `education` — academic background
- `achievements` — certs and awards
- `services` — service offerings

## 🎨 Color Palette

| Variable | Value | Use |
|----------|-------|-----|
| `#0a0a0f` | Deep Space Black | Background |
| `#0f0f1a` | Midnight Navy | Section bg |
| `#7c3aed` | Neon Violet | Primary accent |
| `#06b6d4` | Electric Cyan | Secondary accent |
| `#a78bfa` | Soft Violet | Highlights |
| `#ec4899` | Hot Pink | Special badges |
| `#fbbf24` | Amber Gold | Achievements |

## 📄 License

MIT — Built with ❤️ for Rohit Kamble's portfolio.

