import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { skills } from '../utils/data'

const colorMap = {
  purple: {
    icon: 'rgba(124,58,237,0.15)',
    chip: { bg:'rgba(124,58,237,0.1)', border:'rgba(124,58,237,0.3)', color:'#c4b5fd' },
    glow: '0 0 30px rgba(124,58,237,0.12)',
    border: 'rgba(124,58,237,0.5)',
  },
  cyan: {
    icon: 'rgba(6,182,212,0.15)',
    chip: { bg:'rgba(6,182,212,0.1)', border:'rgba(6,182,212,0.3)', color:'#67e8f9' },
    glow: '0 0 30px rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.4)',
  },
  gold: {
    icon: 'rgba(251,191,36,0.15)',
    chip: { bg:'rgba(251,191,36,0.1)', border:'rgba(251,191,36,0.3)', color:'#fde68a' },
    glow: '0 0 30px rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.4)',
  },
  pink: {
    icon: 'rgba(236,72,153,0.15)',
    chip: { bg:'rgba(236,72,153,0.1)', border:'rgba(236,72,153,0.3)', color:'#f9a8d4' },
    glow: '0 0 30px rgba(236,72,153,0.1)',
    border: 'rgba(236,72,153,0.4)',
  },
  green: {
    icon: 'rgba(34,197,94,0.15)',
    chip: { bg:'rgba(34,197,94,0.1)', border:'rgba(34,197,94,0.3)', color:'#86efac' },
    glow: '0 0 30px rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.4)',
  },
}

// Docker SVG icon
const DockerSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{display:'inline',marginRight:'3px',verticalAlign:'middle'}}>
    <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/>
  </svg>
)

function SkillCard({ skill, delay }) {
  const { ref, isVisible } = useScrollReveal()
  const c = colorMap[skill.color] || colorMap.purple
  const isDevOps = skill.category === 'DevOps & Cloud'

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-700 hover:-translate-y-1.5 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = c.border
        e.currentTarget.style.boxShadow = c.glow
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg,${c.icon},transparent)` }} />

      {/* Featured star for DevOps */}
      {isDevOps && (
        <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full"
          style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', color:'#86efac' }}>
          ⭐ In-Demand
        </div>
      )}

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: c.icon }}>
          {skill.icon}
        </div>
        <span className="font-syne font-bold text-white text-[0.95rem]">{skill.category}</span>
      </div>

      {/* Chips */}
      <div className="relative flex flex-wrap gap-2">
        {skill.chips.map((chip) => (
          <span
            key={chip}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all duration-300 hover:-translate-y-0.5 hover:brightness-125 cursor-default"
            style={{ background: c.chip.bg, borderColor: c.chip.border, color: c.chip.color }}
          >
            {chip === 'Docker' && <DockerSVG />}
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <div id="skills" className="py-24"
      style={{ background: 'linear-gradient(180deg,#0a0a0f 0%,#0f0f1a 50%,#0a0a0f 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Technical skills"
          title="Tech Arsenal"
          subtitle="Built through 4 internships, hackathons, and relentless self-study — from MERN Stack to Docker, CI/CD & AWS."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill, i) => (
            <SkillCard key={skill.category} skill={skill} delay={i * 75} />
          ))}
        </div>

        {/* DevOps highlight strip */}
        <div className="mt-8 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-5"
          style={{ border:'1px solid rgba(34,197,94,0.2)', background:'rgba(34,197,94,0.03)' }}>
          <div className="text-3xl flex-shrink-0">🐳</div>
          <div className="flex-1">
            <p className="font-syne font-bold text-white text-base mb-1">Docker · CI/CD Pipelines · AWS</p>
            <p className="text-slate-400 text-sm">Experienced in containerizing apps with Docker, setting up GitHub Actions CI/CD workflows, and deploying on AWS EC2 &amp; S3 — production-grade DevOps for real-world projects.</p>
          </div>
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            {['docker run', 'gh actions', 'aws s3 cp', 'aws ec2'].map(cmd => (
              <span key={cmd} className="px-2.5 py-1 text-[11px] font-mono rounded-lg"
                style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', color:'#86efac' }}>
                $ {cmd}
              </span>
            ))}
          </div>
        </div>

        {/* Always learning bar */}
        <div className="mt-4 p-4 rounded-2xl text-center"
          style={{ border:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.01)' }}>
          <p className="text-slate-500 text-sm">
            Always learning · Currently exploring{' '}
            <span className="text-violet-400 font-medium">System Design</span>,{' '}
            <span className="text-cyan-400 font-medium">Kubernetes</span> &amp;{' '}
            <span className="text-green-400 font-medium">Cloud Architecture</span>
          </p>
        </div>
      </div>
    </div>
  )
}
