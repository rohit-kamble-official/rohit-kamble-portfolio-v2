import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { experience, education } from '../utils/data'

const dotColors = {
  neon: 'bg-violet-500 shadow-[0_0_12px_#7c3aed]',
  cyan: 'bg-cyan-400 shadow-[0_0_12px_#06b6d4]',
  pink: 'bg-pink-400 shadow-[0_0_12px_#ec4899]',
  gold: 'bg-yellow-400 shadow-[0_0_12px_#fbbf24]',
}

const periodColors = {
  neon: 'bg-[rgba(124,58,237,0.1)] border-[rgba(124,58,237,0.25)] text-violet-300',
  cyan: 'bg-[rgba(6,182,212,0.1)] border-[rgba(6,182,212,0.25)] text-cyan-300',
  pink: 'bg-[rgba(236,72,153,0.1)] border-[rgba(236,72,153,0.25)] text-pink-300',
  gold: 'bg-[rgba(251,191,36,0.1)] border-[rgba(251,191,36,0.25)] text-yellow-300',
}

function TimelineItem({ item, delay }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`relative pl-8 pb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Dot */}
      <div className={`absolute left-0 top-4 w-2.5 h-2.5 rounded-full -translate-x-[5px] ${dotColors[item.color] || dotColors.neon}`} />

      <div className="glass-card rounded-2xl p-5 hover:border-[rgba(124,58,237,0.3)] hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
          <h4 className="font-syne font-bold text-white text-base">{item.title}</h4>
          <span className={`text-xs font-mono px-3 py-1 rounded-full border ${periodColors[item.color] || periodColors.neon}`}>
            {item.period}
          </span>
        </div>
        <p className="text-sm font-medium mb-3" style={{ color: item.color === 'neon' ? '#a78bfa' : item.color === 'cyan' ? '#06b6d4' : item.color === 'pink' ? '#ec4899' : '#fbbf24' }}>
          🏢 {item.company}{item.location ? `, ${item.location}` : ''}
        </p>
        <ul className="space-y-1.5">
          {item.highlights.map((h, i) => (
            <li key={i} className="text-slate-400 text-sm leading-relaxed flex gap-2">
              <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
              <span dangerouslySetInnerHTML={{
                __html: h.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-200">$1</strong>')
              }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function EducationCard({ edu }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`relative pl-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="absolute left-0 top-4 w-2.5 h-2.5 rounded-full -translate-x-[5px] bg-violet-300 shadow-[0_0_12px_#a78bfa]" />
      <div className="glass-card rounded-2xl p-6 hover:border-[rgba(124,58,237,0.3)] hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
          <h4 className="font-syne font-bold text-white text-base">{edu.degree}</h4>
          <span className="text-xs font-mono px-3 py-1 rounded-full border bg-[rgba(167,139,250,0.1)] border-[rgba(167,139,250,0.25)] text-violet-300">
            {edu.period}
          </span>
        </div>
        {edu.minor && (
          <p className="text-violet-400 text-sm font-medium mb-1">{edu.minor}</p>
        )}
        <p className="text-cyan-400 text-sm mb-1">🏛️ {edu.institute}</p>
        <p className="text-slate-400 text-sm mb-4">
          CGPA: <strong className="text-white font-bold text-base">{edu.cgpa}</strong>
          <span className="text-slate-500"> / 10.0</span>
        </p>
        <div>
          <p className="section-label mb-2">Relevant Coursework</p>
          <div className="flex flex-wrap gap-1.5">
            {edu.coursework.map(c => (
              <span key={c} className="px-2 py-0.5 text-[11px] font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded text-slate-400">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeader
        label="Experience & Education"
        title="My Journey"
        subtitle="4 internships across full-stack dev, ML engineering, Android, and data analytics — building real-world expertise."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Internships */}
        <div>
          <p className="section-label mb-6">💼 Professional Internships</p>
          <div className="relative">
            <div className="timeline-line" />
            {experience.map((exp, i) => (
              <TimelineItem key={exp.title} item={exp} delay={i * 100} />
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <p className="section-label mb-6">🎓 Academic Background</p>
          <div className="relative">
            <div className="timeline-line" />
            {education.map((edu) => (
              <EducationCard key={edu.degree} edu={edu} />
            ))}
          </div>

          {/* Currently studying */}
          <div className="mt-6 p-5 rounded-2xl border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.04)]">
            <p className="section-label mb-3">📚 Currently Learning</p>
            <div className="flex flex-wrap gap-2">
              {['System Design', 'Cloud Architecture', 'Docker & Kubernetes', 'GraphQL', 'Next.js 15'].map(s => (
                <span key={s} className="px-3 py-1 text-xs font-mono rounded-lg border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.05)] text-cyan-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
