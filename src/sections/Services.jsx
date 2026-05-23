import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { services } from '../utils/data'

const colorStyles = {
  purple: { border:'rgba(124,58,237,0.5)', glow:'0 20px 40px rgba(124,58,237,0.12)', icon:'rgba(124,58,237,0.15)', tag:'rgba(124,58,237,0.1)', tagBorder:'rgba(124,58,237,0.3)', tagColor:'#c4b5fd' },
  cyan:   { border:'rgba(6,182,212,0.45)',  glow:'0 20px 40px rgba(6,182,212,0.1)',   icon:'rgba(6,182,212,0.15)',   tag:'rgba(6,182,212,0.1)',   tagBorder:'rgba(6,182,212,0.3)',   tagColor:'#67e8f9' },
  pink:   { border:'rgba(236,72,153,0.45)', glow:'0 20px 40px rgba(236,72,153,0.1)',  icon:'rgba(236,72,153,0.15)', tag:'rgba(236,72,153,0.1)',  tagBorder:'rgba(236,72,153,0.3)',  tagColor:'#f9a8d4' },
  gold:   { border:'rgba(251,191,36,0.45)', glow:'0 20px 40px rgba(251,191,36,0.1)',  icon:'rgba(251,191,36,0.15)', tag:'rgba(251,191,36,0.1)',  tagBorder:'rgba(251,191,36,0.3)',  tagColor:'#fde68a' },
  green:  { border:'rgba(34,197,94,0.45)',  glow:'0 20px 40px rgba(34,197,94,0.1)',   icon:'rgba(34,197,94,0.15)',  tag:'rgba(34,197,94,0.1)',   tagBorder:'rgba(34,197,94,0.3)',   tagColor:'#86efac' },
}

function ServiceCard({ svc, index }) {
  const { ref, isVisible } = useScrollReveal()
  const c = colorStyles[svc.color] || colorStyles.purple

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl p-6 flex flex-col gap-4 transition-all duration-600 hover:-translate-y-2 cursor-default ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{
        transitionDelay: `${index * 80}ms`,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.boxShadow = c.glow }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* BG gradient on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg,${c.icon},transparent 70%)` }} />

      {/* Icon */}
      <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: c.icon }}>
        {svc.icon}
      </div>

      {/* Text */}
      <div className="relative">
        <h3 className="font-syne font-bold text-white text-base mb-2">{svc.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">{svc.desc}</p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {(svc.tags || []).map(t => (
            <span key={t} className="px-2 py-0.5 text-[10px] font-mono rounded"
              style={{ background: c.tag, border: `1px solid ${c.tagBorder}`, color: c.tagColor }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeader
        label="Services"
        title="What I Can Do For You"
        subtitle="From idea to production — full-stack, AI, mobile, DevOps and more. End-to-end solutions delivered with precision."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc, i) => <ServiceCard key={svc.title} svc={svc} index={i} />)}
      </div>
    </section>
  )
}
