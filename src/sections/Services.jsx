import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { services } from '../utils/data'

const colorMap = {
  purple: 'hover:border-violet-500/40 hover:shadow-[0_20px_40px_rgba(124,58,237,0.1)]',
  cyan: 'hover:border-cyan-500/40 hover:shadow-[0_20px_40px_rgba(6,182,212,0.08)]',
  pink: 'hover:border-pink-500/40 hover:shadow-[0_20px_40px_rgba(236,72,153,0.08)]',
  gold: 'hover:border-yellow-500/40 hover:shadow-[0_20px_40px_rgba(251,191,36,0.08)]',
  green: 'hover:border-green-500/40 hover:shadow-[0_20px_40px_rgba(34,197,94,0.08)]',
}

function ServiceCard({ svc, index }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`group glass-card rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 ${colorMap[svc.color] || colorMap.purple} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{svc.icon}</div>
      <h3 className="font-syne font-bold text-white text-base mb-2">{svc.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{svc.desc}</p>
    </div>
  )
}

export default function Services() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeader
        label="Services"
        title="What I Can Do For You"
        subtitle="From concept to deployment — I deliver end-to-end digital solutions with precision and passion."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc, i) => (
          <ServiceCard key={svc.title} svc={svc} index={i} />
        ))}
      </div>
    </section>
  )
}
