import { useEffect, useRef } from 'react'
import { useTypingEffect } from '../hooks/useTypingEffect'
import { personalInfo, techStack, typedRoles } from '../utils/data'

// ── Icons ──────────────────────────────────────────────────────────
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
  </svg>
)
const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
)
const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)

// ── Profile image with animated ring ───────────────────────────────
function ProfileImage() {
  return (
    <div className="relative flex items-center justify-center" style={{ animation: 'fadeUp 0.9s 0.2s ease both', opacity: 0, animationFillMode: 'forwards' }}>

      {/* Outer animated rotating ring */}
      <div
        className="absolute rounded-full border-2 border-dashed border-violet-500/30"
        style={{ width: 340, height: 340, animation: 'spin 18s linear infinite' }}
      />

      {/* Neon glow ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 300, height: 300,
          background: 'transparent',
          boxShadow: '0 0 60px rgba(124,58,237,0.35), 0 0 120px rgba(6,182,212,0.15)',
          animation: 'orbFloat 6s ease-in-out infinite',
        }}
      />

      {/* Floating tech badges around image */}
      {[
        { label: 'React', angle: 40,  r: 155, color: 'rgba(6,182,212,0.9)'   },
        { label: 'Node.js', angle: 140, r: 155, color: 'rgba(124,58,237,0.9)' },
        { label: 'Docker',  angle: 220, r: 155, color: 'rgba(6,182,212,0.9)'  },
        { label: 'AWS',     angle: 310, r: 155, color: 'rgba(251,191,36,0.9)' },
        { label: 'Python',  angle: 270, r: 160, color: 'rgba(236,72,153,0.9)' },
      ].map(({ label, angle, r, color }) => {
        const rad = (angle * Math.PI) / 180
        const x = Math.cos(rad) * r
        const y = Math.sin(rad) * r
        return (
          <div
            key={label}
            className="absolute text-[10px] font-mono font-bold px-2 py-0.5 rounded-full pointer-events-none select-none"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              background: 'rgba(10,10,15,0.85)',
              border: `1px solid ${color}`,
              color,
              backdropFilter: 'blur(6px)',
              whiteSpace: 'nowrap',
              animation: `orbFloat ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {label}
          </div>
        )
      })}

      {/* Main image container */}
      <div
        className="relative z-10 rounded-full overflow-hidden"
        style={{
          width: 260, height: 260,
          border: '3px solid rgba(124,58,237,0.6)',
          boxShadow: '0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.15), inset 0 0 20px rgba(124,58,237,0.05)',
        }}
      >
        {/* Real profile image */}
       <img
  src="/Rohit_Kamble_img.png"
  alt="Rohit Kamble — Full Stack Developer"
  className="w-full h-full object-cover object-top"
  onError={(e) => {
    e.target.style.display = 'none'
    e.target.nextSibling.style.display = 'flex'
  }}
/>
        {/* Fallback avatar */}
        <div
          className="w-full h-full items-center justify-center"
          style={{
            display: 'none',
            background: 'linear-gradient(135deg, #1a0a3e 0%, #0a1a2e 50%, #0a2a3e 100%)',
          }}
        >
          <span
            className="font-syne font-black text-white select-none"
            style={{ fontSize: '5rem', lineHeight: 1, textShadow: '0 0 40px rgba(124,58,237,0.8)' }}
          >
            RK
          </span>
        </div>

        {/* Subtle overlay gradient for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(160deg, rgba(124,58,237,0.08) 0%, transparent 60%, rgba(6,182,212,0.06) 100%)' }}
        />
      </div>

      {/* Status badge pinned bottom-right of image */}
      <div
        className="absolute z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
        style={{
          bottom: '60px', right: '-10px',
          background: 'rgba(10,10,15,0.92)',
          border: '1px solid rgba(34,197,94,0.5)',
          backdropFilter: 'blur(12px)',
          color: '#86efac',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#22c55e] animate-pulse" />
        Open to Work
      </div>
    </div>
  )
}

// ── Main Hero ───────────────────────────────────────────────────────
export default function Hero() {
  const typed = useTypingEffect(typedRoles, 75, 45, 2200)
  const heroRef = useRef(null)

  // Spawn particles
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const particles = []
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      const drift = (Math.random() - 0.5) * 220
      const size = Math.random() < 0.25 ? 3 : 2
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        animation-duration: ${10 + Math.random() * 12}s;
        animation-delay: ${Math.random() * 10}s;
        --drift: ${drift}px;
        opacity: 0.45;
      `
      hero.appendChild(p)
      particles.push(p)
    }
    return () => particles.forEach(p => p.remove())
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden px-6 pt-28 pb-16"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid z-0" />

      {/* Orbs */}
      <div className="orb w-[550px] h-[550px] bg-[rgba(124,58,237,0.13)] -top-32 -right-32" style={{ animationDelay: '0s' }} />
      <div className="orb w-[400px] h-[400px] bg-[rgba(6,182,212,0.09)] -bottom-24 -left-24" style={{ animationDelay: '3s' }} />
      <div className="orb w-[280px] h-[280px] bg-[rgba(236,72,153,0.07)] top-1/2 left-1/4" style={{ animationDelay: '5s' }} />

      {/* ── Two-column layout ── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* LEFT — Text content */}
        <div>
          {/* Available badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/40 bg-violet-500/08 text-violet-300 text-xs uppercase tracking-widest mb-7"
            style={{ animation: 'fadeUp 0.8s ease both', backgroundColor: 'rgba(124,58,237,0.08)' }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#22c55e] animate-pulse" />
            Available for opportunities
          </div>

          {/* Greeting + Name */}
          <div style={{ animation: 'fadeUp 0.8s 0.08s ease both', opacity: 0, animationFillMode: 'forwards' }}>
            <p className="text-slate-400 text-sm tracking-widest uppercase mb-2">Hi, I'm</p>
            <h1
              className="font-syne font-extrabold leading-[1.03] text-gradient glow-text mb-4"
              style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)' }}
            >
              Rohit Kamble
            </h1>
          </div>

          {/* Typed role */}
          <div
            className="mb-6 text-base md:text-xl text-slate-400"
            style={{ animation: 'fadeUp 0.8s 0.16s ease both', opacity: 0, animationFillMode: 'forwards' }}
          >
            <span className="text-white font-medium">{typed}</span>
            <span className="typed-cursor text-cyan-400 ml-0.5">|</span>
          </div>

          {/* Short bio */}
          <div style={{ animation: 'fadeUp 0.8s 0.22s ease both', opacity: 0, animationFillMode: 'forwards' }}>
            <p className="text-slate-400 text-sm leading-relaxed mb-7 max-w-md">
              Final-year B.Tech EE student at S.B. Jain Institute, Nagpur — building production-grade
              <span className="text-violet-300 font-medium"> MERN Stack, AI/ML, Docker & AWS</span> solutions.
              Currently interning at <span className="text-cyan-300 font-medium">Zonovva Creative Agency</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap items-center gap-3 mb-7"
            style={{ animation: 'fadeUp 0.8s 0.28s ease both', opacity: 0, animationFillMode: 'forwards' }}
          >
            <a
              href={"/Rohit_Kamble_Resume.pdf"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-violet-900/40"
            >
              <DownloadIcon />
              Download Resume
            </a>
            <a
              href="#projects"
              onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/50 text-violet-300 font-semibold text-sm hover:bg-violet-500/10 hover:border-violet-400 hover:-translate-y-1 transition-all duration-300"
            >
              <GridIcon />
              View Projects
            </a>
          </div>

          {/* Social Links */}
          <div
            className="flex items-center gap-3 mb-8"
            style={{ animation: 'fadeUp 0.8s 0.34s ease both', opacity: 0, animationFillMode: 'forwards' }}
          >
            {[
              { href: personalInfo.github, icon: <GithubIcon />, label: 'GitHub' },
              { href: personalInfo.linkedin, icon: <LinkedinIcon />, label: 'LinkedIn' },
              { href: `mailto:${personalInfo.email}`, icon: <EmailIcon />, label: 'Email' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={s.label}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400 hover:bg-cyan-400/08 hover:-translate-y-1 transition-all duration-300"
                style={{ '--hover-bg': 'rgba(6,182,212,0.08)' }}
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Tech pills */}
          <div
            className="flex flex-wrap gap-2"
            style={{ animation: 'fadeUp 0.8s 0.4s ease both', opacity: 0, animationFillMode: 'forwards' }}
          >
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full border border-white/08 text-slate-500 text-[11px] font-mono bg-white/02 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 cursor-default"
                style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — Profile image */}
        <div className="flex justify-center lg:justify-end">
          <ProfileImage />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-[10px] uppercase tracking-widest"
        style={{ animation: 'fadeUp 1s 0.9s ease both', opacity: 0, animationFillMode: 'forwards' }}
      >
        <span>Scroll</span>
        <div
          className="w-px bg-gradient-to-b from-cyan-400 to-transparent"
          style={{ height: '40px', animation: 'scrollPulse 2s ease-in-out infinite' }}
        />
      </div>
    </section>
  )
}
