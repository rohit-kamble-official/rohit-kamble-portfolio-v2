import { personalInfo } from '../utils/data'

const year = new Date().getFullYear()

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const sections = [
    { label: 'About',        id: 'about' },
    { label: 'Skills',       id: 'skills' },
    { label: 'Projects',     id: 'projects' },
    { label: 'Experience',   id: 'experience' },
    { label: 'Achievements', id: 'achievements' },
    { label: 'Contact',      id: 'contact' },
  ]

  return (
    <footer
      className="relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background:'linear-gradient(90deg,transparent,rgba(124,58,237,0.6),transparent)' }} />

      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="font-syne font-extrabold text-3xl text-gradient-neon mb-3">RK.</div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-xs">
              Full Stack Developer &amp; AI Enthusiast from Nagpur, India. Building scalable MERN, Docker &amp; AWS solutions.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { href: personalInfo.github, label: 'GitHub', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                )},
                { href: personalInfo.linkedin, label: 'LinkedIn', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
                  </svg>
                )},
                { href: `mailto:${personalInfo.email}`, label: 'Email', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
                  </svg>
                )},
              ].map(s => (
                <a key={s.label} href={s.href} target={s.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-cyan-400 hover:-translate-y-0.5 transition-all duration-300"
                  style={{ border:'1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div>
            <p className="section-label mb-4">Quick Links</p>
            <div className="grid grid-cols-2 gap-2">
              {sections.map(s => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className="text-left text-slate-500 hover:text-violet-300 text-sm transition-colors duration-300 py-1">
                  → {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact + Status */}
          <div>
            <p className="section-label mb-4">Get In Touch</p>
            <div className="space-y-3">
              <a href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 text-slate-500 hover:text-violet-300 text-sm transition-colors duration-300">
                <span className="text-violet-400">✉</span> {personalInfo.email}
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-slate-500 hover:text-cyan-300 text-sm transition-colors duration-300">
                <span className="text-cyan-400">in</span> LinkedIn Profile
              </a>
              <a href={personalInfo.github} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors duration-300">
                <span>⬡</span> GitHub Projects
              </a>
              <a href={personalInfo.resumeUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-slate-500 hover:text-yellow-300 text-sm transition-colors duration-300">
                <span className="text-yellow-400">↓</span> Download Resume
              </a>
            </div>

            {/* Open to work badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ border:'1px solid rgba(34,197,94,0.3)', background:'rgba(34,197,94,0.06)', color:'#86efac' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                style={{ boxShadow:'0 0 6px #22c55e' }} />
              Open to Full-Time SDE Roles · 2026
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs text-center md:text-left">
            © {year}{' '}
            <span className="text-violet-400 font-semibold">Rohit Kamble</span>
            {' '}· Full Stack Developer · Nagpur, India · All rights reserved.
          </p>
          <p className="text-slate-700 text-xs">
            Built with <span className="text-red-500">❤</span> using{' '}
            <span className="text-violet-400">React</span> ·{' '}
            <span className="text-cyan-400">Vite</span> ·{' '}
            <span className="text-green-400">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
