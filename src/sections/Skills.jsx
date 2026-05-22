import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { skills } from '../utils/data'

const colorMap = {
  purple: {
    icon: 'bg-[rgba(124,58,237,0.15)]',
    chip: 'bg-[rgba(124,58,237,0.1)] border-[rgba(124,58,237,0.3)] text-violet-300 hover:border-violet-400',
    hover: 'hover:border-[rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]',
  },
  cyan: {
    icon: 'bg-[rgba(6,182,212,0.15)]',
    chip: 'bg-[rgba(6,182,212,0.1)] border-[rgba(6,182,212,0.3)] text-cyan-300 hover:border-cyan-400',
    hover: 'hover:border-[rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]',
  },
  gold: {
    icon: 'bg-[rgba(251,191,36,0.15)]',
    chip: 'bg-[rgba(251,191,36,0.1)] border-[rgba(251,191,36,0.3)] text-yellow-300 hover:border-yellow-400',
    hover: 'hover:border-[rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]',
  },
  pink: {
    icon: 'bg-[rgba(236,72,153,0.15)]',
    chip: 'bg-[rgba(236,72,153,0.1)] border-[rgba(236,72,153,0.3)] text-pink-300 hover:border-pink-400',
    hover: 'hover:border-[rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.08)]',
  },
  green: {
    icon: 'bg-[rgba(34,197,94,0.15)]',
    chip: 'bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)] text-green-300 hover:border-green-400',
    hover: 'hover:border-[rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.08)]',
  },
}

function SkillCard({ skill, delay }) {
  const { ref, isVisible } = useScrollReveal()
  const c = colorMap[skill.color] || colorMap.purple

  return (
    <div
      ref={ref}
      className={`glass-card rounded-2xl p-6 transition-all duration-700 ${c.hover} hover:-translate-y-1 relative overflow-hidden group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(124,58,237,0.04)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center text-xl flex-shrink-0`}>
          {skill.icon}
        </div>
        <span className="font-syne font-bold text-white text-base">{skill.category}</span>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {skill.chips.map((chip) => (
          <span
            key={chip}
            className={`skill-chip px-3 py-1 rounded-lg text-xs font-mono border ${c.chip} cursor-default`}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <div
      id="skills"
      className="py-24"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Technical skills"
          title="Tech Arsenal"
          subtitle="A comprehensive toolkit built through real-world projects, internships, and relentless self-study."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill, i) => (
            <SkillCard key={skill.category} skill={skill} delay={i * 80} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] text-center">
          <p className="text-slate-500 text-sm">
            Always learning · Currently exploring{' '}
            <span className="text-violet-400 font-medium">System Design</span>
            {' '}and{' '}
            <span className="text-cyan-400 font-medium">Cloud Architecture</span>
          </p>
        </div>
      </div>
    </div>
  )
}
