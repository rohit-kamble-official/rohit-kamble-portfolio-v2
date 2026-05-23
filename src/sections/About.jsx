import SectionHeader from '../components/SectionHeader'
import { useScrollReveal, useCountUp } from '../hooks/useScrollReveal'
import { personalInfo, stats, quickFacts } from '../utils/data'

function StatCard({ label, value, suffix, delay }) {
  const { ref, isVisible } = useScrollReveal()
  const count = useCountUp(value, isVisible)
  return (
    <div
      ref={ref}
      className={`p-5 rounded-2xl border border-violet-500/20 bg-violet-500/05 text-center
        hover:border-violet-400 hover:bg-violet-500/10 hover:-translate-y-1 cursor-default
        transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{
        transitionDelay: `${delay}ms`,
        backgroundColor: 'rgba(124,58,237,0.05)',
        borderColor: 'rgba(124,58,237,0.2)',
      }}
    >
      <div className="font-syne font-extrabold text-3xl text-gradient-neon">
        {count}{suffix}
      </div>
      <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}

export default function About() {
  const { ref: imgRef,  isVisible: imgVisible  } = useScrollReveal()
  const { ref: textRef, isVisible: textVisible } = useScrollReveal()
  const { ref: cardRef, isVisible: cardVisible } = useScrollReveal()

  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeader label="About me" title="The Developer Behind the Code" />

      {/* ── Three-column: image | bio+stats | facts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_1fr] gap-10 items-start">

        {/* ── Column 1: Profile Photo ── */}
        <div
          ref={imgRef}
          className={`flex flex-col items-center gap-4 transition-all duration-700
            ${imgVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Photo */}
          <div className="relative group">
            {/* Rotating ring */}
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/25"
              style={{ animation: 'spin 20s linear infinite', margin: '-10px' }}
            />
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: '0 0 40px rgba(124,58,237,0.35), 0 0 80px rgba(124,58,237,0.1)' }}
            />
            {/* Image */}
            <div
              className="relative w-52 h-52 rounded-full overflow-hidden"
              style={{
                border: '3px solid rgba(124,58,237,0.55)',
                boxShadow: '0 0 30px rgba(124,58,237,0.3)',
              }}
            >
              <img
                src="https://rohit-kamble-official.github.io/portfolio/Images/Rohit.jpg"
                alt="Rohit Kamble — Full Stack Developer Nagpur"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div
                className="w-full h-full items-center justify-center"
                style={{
                  display: 'none',
                  background: 'linear-gradient(135deg,#1a0a3e,#0a1a2e)',
                }}
              >
                <span className="font-syne font-black text-white text-5xl" style={{ textShadow: '0 0 30px rgba(124,58,237,0.8)' }}>RK</span>
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent pointer-events-none" />
            </div>
            {/* Online dot */}
            <div
              className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-400 border-2"
              style={{ borderColor: '#0a0a0f', boxShadow: '0 0 10px #22c55e' }}
            />
          </div>

          {/* Name + title under photo */}
          <div className="text-center">
            <p className="font-syne font-bold text-white text-lg leading-tight">Rohit Kamble</p>
            <p className="text-violet-400 text-xs mt-0.5 font-mono">Full Stack Developer</p>
            <p className="text-slate-500 text-xs mt-1">📍 Nagpur, Maharashtra</p>
          </div>

          {/* Mini social row */}
          <div className="flex gap-2">
            {[
              { href: personalInfo.github, label: 'GH', color: 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white' },
              { href: personalInfo.linkedin, label: 'LI', color: 'border-cyan-500/30 text-cyan-400 hover:border-cyan-400' },
              { href: `mailto:${personalInfo.email}`, label: '✉', color: 'border-violet-500/30 text-violet-400 hover:border-violet-400' },
            ].map(s => (
              <a key={s.label} href={s.href} target={s.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                className={`w-9 h-9 flex items-center justify-center rounded-xl border text-xs font-bold font-mono transition-all duration-300 hover:-translate-y-0.5 ${s.color}`}
              >{s.label}</a>
            ))}
          </div>
        </div>

        {/* ── Column 2: Bio + Stats ── */}
        <div
          ref={textRef}
          className={`transition-all duration-700 delay-100 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="space-y-4 mb-8">
            {personalInfo.bio.map((para, i) => {
              const highlights = ['Full-Stack Web Development','Zonovva Creative Agency','MERN','impactful, scalable','B.Tech Electrical Engineering','Docker','AWS','CI/CD']
              const regex = new RegExp(`(${highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`, 'g')
              return (
                <p key={i} className="text-slate-400 leading-relaxed text-[0.93rem]">
                  {para.split(regex).map((part, j) =>
                    highlights.includes(part)
                      ? <span key={j} className="text-violet-300 font-semibold">{part}</span>
                      : part
                  )}
                </p>
              )
            })}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 80} />)}
          </div>

          {/* DevOps highlight badge */}
          <div
            className="mt-4 flex flex-wrap gap-2 p-4 rounded-2xl border"
            style={{ borderColor: 'rgba(6,182,212,0.15)', backgroundColor: 'rgba(6,182,212,0.03)' }}
          >
            <p className="w-full section-label mb-1">🐳 DevOps & Cloud Skills</p>
            {['Docker', 'CI/CD Pipelines', 'AWS EC2', 'AWS S3', 'GitHub Actions', 'Vercel', 'Netlify'].map(t => (
              <span key={t} className="px-2.5 py-1 text-[11px] font-mono rounded-lg border text-cyan-300"
                style={{ borderColor: 'rgba(6,182,212,0.25)', backgroundColor: 'rgba(6,182,212,0.07)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Column 3: Quick Facts + Strengths + Status ── */}
        <div
          ref={cardRef}
          className={`space-y-4 transition-all duration-700 delay-200 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Quick Facts card */}
          <div className="relative overflow-hidden rounded-2xl p-6"
            style={{ border: '1px solid rgba(124,58,237,0.25)', background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(6,182,212,0.04))' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'rgba(124,58,237,0.12)' }} />
            <h3 className="font-syne font-bold text-white text-base mb-4">⚡ Quick Facts</h3>
            <div className="space-y-3">
              {quickFacts.map((fact, i) => {
                const bolds = ['7.8','Zonovva Creative Agency','IIT Delhi','Codemate IT Services','Nagpur, Maharashtra','Full-Time SDE Roles','Top 6']
                const regex = new RegExp(`(${bolds.map(b=>b.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`)
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{fact.icon}</span>
                    <span className="text-slate-400 text-xs leading-relaxed">
                      {fact.text.split(regex).map((p,j) =>
                        bolds.includes(p)
                          ? <strong key={j} className="text-white font-semibold">{p}</strong>
                          : p
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Core Strengths */}
          <div className="rounded-2xl p-5" style={{ border:'1px solid rgba(6,182,212,0.15)', background:'rgba(6,182,212,0.03)' }}>
            <p className="section-label mb-3">Core Strengths</p>
            <div className="flex flex-wrap gap-2">
              {['Problem Solving','Team Collaboration','Fast Learner','Communication','Adaptability','Critical Thinking','Time Management'].map(s => (
                <span key={s} className="px-2.5 py-1 text-xs rounded-lg text-slate-300 cursor-default transition-all duration-300 hover:text-violet-300 hover:border-violet-500"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Open to work */}
          <div className="rounded-2xl p-5 flex items-center gap-4"
            style={{ border:'1px solid rgba(34,197,94,0.2)', background:'rgba(34,197,94,0.04)' }}>
            <div className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0 animate-pulse"
              style={{ boxShadow:'0 0 10px #22c55e' }} />
            <div>
              <p className="text-white font-semibold text-sm">Open to Opportunities</p>
              <p className="text-slate-400 text-xs mt-0.5">Seeking Full-Time SDE roles from 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
