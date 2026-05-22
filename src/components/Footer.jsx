import { personalInfo } from '../utils/data'

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)] py-12 px-6 text-center">
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="font-syne font-extrabold text-3xl text-gradient-neon mb-3">RK.</div>

        {/* Tagline */}
        <p className="text-slate-500 text-sm mb-6">Full Stack Developer · AI Enthusiast · Creative Problem Solver</p>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { href: personalInfo.github, label: 'GitHub', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            )},
            { href: personalInfo.linkedin, label: 'LinkedIn', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
              </svg>
            )},
            { href: `mailto:${personalInfo.email}`, label: 'Email', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>
              </svg>
            )},
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={s.label}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] text-slate-500 hover:text-cyan-400 hover:border-cyan-400 hover:bg-[rgba(6,182,212,0.06)] hover:-translate-y-1 transition-all duration-300"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          {['About', 'Skills', 'Projects', 'Experience', 'Achievements', 'Contact'].map(label => (
            <button
              key={label}
              onClick={() => {
                const el = document.getElementById(label.toLowerCase())
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-slate-600 hover:text-slate-300 text-xs uppercase tracking-widest transition-colors duration-300"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-[rgba(255,255,255,0.04)] pt-6">
          <p className="text-slate-600 text-xs">
            © 2026 <span className="text-violet-400">Rohit Kamble</span>. All rights reserved.
            Built with <span className="text-red-400">❤</span> using React + Vite + Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}
