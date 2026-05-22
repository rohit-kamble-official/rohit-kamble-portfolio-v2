import { useEffect, useRef } from 'react'
import { useTypingEffect } from '../hooks/useTypingEffect'
import { personalInfo, techStack, typedRoles } from '../utils/data'

// Social icons
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 .0.77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)

export default function Hero() {
  const typed = useTypingEffect(typedRoles, 80, 50, 2200)
  const heroRef = useRef(null)

  // Spawn particles
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const particles = []
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      const drift = (Math.random() - 0.5) * 200
      const size = Math.random() < 0.3 ? 3 : 2
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        animation-duration: ${10 + Math.random() * 12}s;
        animation-delay: ${Math.random() * 10}s;
        --drift: ${drift}px;
        opacity: 0.5;
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid z-0" />

      {/* Orbs */}
      <div className="orb w-[500px] h-[500px] bg-[rgba(124,58,237,0.15)] -top-24 -right-24" style={{ animationDelay: '0s' }} />
      <div className="orb w-[400px] h-[400px] bg-[rgba(6,182,212,0.1)] -bottom-24 -left-24" style={{ animationDelay: '3s' }} />
      <div className="orb w-[300px] h-[300px] bg-[rgba(236,72,153,0.08)] top-1/2 left-1/3" style={{ animationDelay: '5s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Available badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(124,58,237,0.4)] bg-[rgba(124,58,237,0.08)] text-violet-300 text-xs uppercase tracking-widest mb-8"
          style={{ animation: 'fadeUp 0.8s ease both' }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#22c55e] animate-pulse" />
          Available for opportunities
        </div>

        {/* Name */}
        <div style={{ animation: 'fadeUp 0.8s 0.1s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <p className="text-slate-400 text-sm tracking-widest uppercase mb-3 font-grotesk">Hi, I'm</p>
          <h1 className="font-syne font-extrabold leading-tight text-gradient glow-text"
            style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)' }}>
            Rohit Kamble
          </h1>
        </div>

        {/* Typed Role */}
        <div
          className="mt-4 mb-8 text-lg md:text-2xl text-slate-400 font-grotesk"
          style={{ animation: 'fadeUp 0.8s 0.2s ease both', opacity: 0, animationFillMode: 'forwards' }}
        >
          <span className="text-white">{typed}</span>
          <span className="typed-cursor text-cyan-400 ml-0.5">|</span>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
          style={{ animation: 'fadeUp 0.8s 0.3s ease both', opacity: 0, animationFillMode: 'forwards' }}
        >
          <a
            href={personalInfo.resumeUrl}
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[rgba(124,58,237,0.5)] text-violet-300 font-semibold text-sm hover:bg-[rgba(124,58,237,0.1)] hover:border-violet-500 hover:-translate-y-1 transition-all duration-300"
          >
            <GridIcon />
            View Projects
          </a>
        </div>

        {/* Social Links */}
        <div
          className="flex items-center justify-center gap-4 mb-10"
          style={{ animation: 'fadeUp 0.8s 0.4s ease both', opacity: 0, animationFillMode: 'forwards' }}
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
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.1)] text-slate-400 hover:text-cyan-400 hover:border-cyan-400 hover:bg-[rgba(6,182,212,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Tech pills */}
        <div
          className="flex flex-wrap justify-center gap-2"
          style={{ animation: 'fadeUp 0.8s 0.5s ease both', opacity: 0, animationFillMode: 'forwards' }}
        >
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full border border-[rgba(255,255,255,0.08)] text-slate-500 text-xs font-mono bg-[rgba(255,255,255,0.02)] hover:border-cyan-500 hover:text-cyan-400 hover:bg-[rgba(6,182,212,0.05)] transition-all duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-[10px] uppercase tracking-widest"
        style={{ animation: 'fadeUp 1s 0.8s ease both', opacity: 0, animationFillMode: 'forwards' }}>
        <span>Scroll</span>
        <div className="w-px bg-gradient-to-b from-cyan-400 to-transparent" style={{ height: '40px', animation: 'scrollPulse 2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}
