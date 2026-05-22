import { useState, useRef } from 'react'
import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { projects } from '../utils/data'

const colorMap = {
  purple: {
    badge: 'bg-[rgba(124,58,237,0.2)] border-[rgba(124,58,237,0.5)] text-violet-300',
    tag: 'text-violet-400',
    hover: 'group-hover:border-violet-500/50 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(124,58,237,0.15)]',
  },
  cyan: {
    badge: 'bg-[rgba(6,182,212,0.2)] border-[rgba(6,182,212,0.5)] text-cyan-300',
    tag: 'text-cyan-400',
    hover: 'group-hover:border-cyan-500/50 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(6,182,212,0.15)]',
  },
  pink: {
    badge: 'bg-[rgba(236,72,153,0.2)] border-[rgba(236,72,153,0.5)] text-pink-300',
    tag: 'text-pink-400',
    hover: 'group-hover:border-pink-500/50 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(236,72,153,0.15)]',
  },
  gold: {
    badge: 'bg-[rgba(251,191,36,0.2)] border-[rgba(251,191,36,0.5)] text-yellow-300',
    tag: 'text-yellow-400',
    hover: 'group-hover:border-yellow-500/50 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(251,191,36,0.15)]',
  },
}

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const ExternalIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

const FILTERS = [
  { label: 'All Projects', value: 'all' },
  { label: 'Full Stack', value: 'fullstack' },
  { label: 'AI / ML', value: 'ai' },
  { label: 'IoT', value: 'iot' },
]

function ProjectCard({ project, index }) {
  const { ref, isVisible } = useScrollReveal()
  const cardRef = useRef(null)
  const c = colorMap[project.color] || colorMap.purple

  // 3D tilt on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2, cy = rect.height / 2
    const rx = ((y - cy) / cy) * 5
    const ry = (-(x - cx) / cx) * 5
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`
  }
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group glass-card rounded-2xl overflow-hidden tilt-card ${c.hover} border transition-all duration-300 h-full flex flex-col`}
      >
        {/* Image area */}
        <div className="relative h-44 bg-[#141428] overflow-hidden">
          <div className={`absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-[rgba(124,58,237,0.12)] to-[rgba(6,182,212,0.06)] group-hover:scale-105 transition-transform duration-500`}>
            {project.emoji}
          </div>

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
              ⭐ Featured
            </div>
          )}

          {/* Category badge */}
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${c.badge}`}>
            {project.categoryLabel}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-60" />
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-syne font-bold text-white text-lg mb-2 leading-snug group-hover:text-violet-200 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-slate-400">
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-slate-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <GithubIcon />
                GitHub
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300"
              >
                <ExternalIcon />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [active, setActive] = useState('all')

  const filtered = active === 'all' ? projects : projects.filter(p => p.category === active)

  return (
    <div
      id="projects"
      className="py-24"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 60%, #0a0a0f 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Featured projects"
          title="What I've Built"
          subtitle="Real-world applications solving real problems — from AI safety systems to full-stack trading platforms."
        />

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`filter-btn px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                active === f.value
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-transparent text-white shadow-lg shadow-violet-900/30'
                  : 'border-[rgba(255,255,255,0.1)] text-slate-400 hover:border-violet-500 hover:text-violet-300 bg-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <div className="text-4xl mb-4">🔍</div>
            <p>No projects in this category yet. Check back soon!</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/rohit-kamble-official"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[rgba(124,58,237,0.4)] text-violet-300 text-sm font-semibold hover:bg-[rgba(124,58,237,0.08)] hover:border-violet-400 hover:-translate-y-0.5 transition-all duration-300"
          >
            <GithubIcon size={16} />
            View All on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
