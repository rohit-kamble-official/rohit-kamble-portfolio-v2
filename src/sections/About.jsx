import { useRef } from 'react'
import SectionHeader from '../components/SectionHeader'
import { useScrollReveal, useCountUp } from '../hooks/useScrollReveal'
import { personalInfo, stats, quickFacts } from '../utils/data'

function StatCard({ label, value, suffix }) {
  const { ref, isVisible } = useScrollReveal()
  const count = useCountUp(value, isVisible)

  return (
    <div
      ref={ref}
      className={`p-5 rounded-2xl border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.05)] text-center hover:border-violet-500 hover:bg-[rgba(124,58,237,0.1)] hover:-translate-y-1 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transition: 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s, background 0.3s' }}
    >
      <div className="font-syne font-extrabold text-3xl text-gradient-neon">
        {count}{suffix}
      </div>
      <div className="text-slate-400 text-xs mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}

export default function About() {
  const { ref: textRef, isVisible: textVisible } = useScrollReveal()
  const { ref: cardRef, isVisible: cardVisible } = useScrollReveal()

  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeader
        label="About me"
        title="The Developer Behind the Code"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Text + Stats */}
        <div
          ref={textRef}
          className={`transition-all duration-700 ${textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
        >
          <div className="space-y-4 mb-8">
            {personalInfo.bio.map((para, i) => (
              <p key={i} className="text-slate-400 leading-relaxed text-[0.93rem]">
                {para
                  .split(/(Full-Stack Web Development|Zonovva Creative Agency|MERN|impactful, scalable|B\.Tech Electrical Engineering|SDE)/g)
                  .map((part, j) =>
                    ['Full-Stack Web Development', 'Zonovva Creative Agency', 'MERN', 'impactful, scalable', 'B.Tech Electrical Engineering', 'SDE'].includes(part)
                      ? <span key={j} className="text-violet-300 font-medium">{part}</span>
                      : part
                  )
                }
              </p>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* Right: Cards */}
        <div
          ref={cardRef}
          className={`space-y-4 transition-all duration-700 delay-200 ${cardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
        >
          {/* Quick Facts */}
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(124,58,237,0.25)] bg-gradient-to-br from-[rgba(124,58,237,0.08)] to-[rgba(6,182,212,0.04)] p-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[rgba(124,58,237,0.1)] rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-syne font-bold text-white text-lg mb-5">⚡ Quick Facts</h3>
            <div className="space-y-3">
              {quickFacts.map((fact, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{fact.icon}</span>
                  <span className="text-slate-400 text-sm leading-relaxed">
                    {fact.text
                      .split(/(7\.8|Zonovva Creative Agency|IIT Delhi|Codemate IT Services|Nagpur, Maharashtra|Full-Time SDE Roles)/g)
                      .map((p, j) =>
                        ['7.8', 'Zonovva Creative Agency', 'IIT Delhi', 'Codemate IT Services', 'Nagpur, Maharashtra', 'Full-Time SDE Roles'].includes(p)
                          ? <strong key={j} className="text-white font-semibold">{p}</strong>
                          : p
                      )
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Strengths */}
          <div className="rounded-2xl border border-[rgba(6,182,212,0.15)] bg-[rgba(6,182,212,0.04)] p-5">
            <p className="section-label mb-4">Core Strengths</p>
            <div className="flex flex-wrap gap-2">
              {['Problem Solving', 'Team Collaboration', 'Fast Learner', 'Communication', 'Adaptability', 'Critical Thinking', 'Time Management'].map(s => (
                <span key={s} className="px-3 py-1 text-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg text-slate-300 hover:border-violet-500 hover:text-violet-300 transition-all duration-300 cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Currently status */}
          <div className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.04)] p-5 flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_#22c55e] flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-white font-semibold text-sm">Open to Opportunities</p>
              <p className="text-slate-400 text-xs mt-0.5">Actively seeking Full-Time SDE roles from 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
