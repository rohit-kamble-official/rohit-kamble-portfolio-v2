import SectionHeader from '../components/SectionHeader'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { achievements } from '../utils/data'

function AchievementCard({ ach, index }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden glass-card rounded-2xl p-6 hover:border-[rgba(124,58,237,0.35)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 to-cyan-500" />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(124,58,237,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

      <div className="text-3xl mb-3">{ach.icon}</div>
      <h3 className="font-syne font-bold text-white text-sm leading-snug mb-2">{ach.title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed mb-3">{ach.body}</p>
      <p className="section-label text-[10px]">// {ach.issuer}</p>
    </div>
  )
}

export default function Achievements() {
  return (
    <div
      id="achievements"
      className="py-24"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Achievements & Certifications"
          title="Recognition & Growth"
          subtitle="Hackathon wins, national competitions, elite certifications — proof of consistency and impact."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {achievements.map((ach, i) => (
            <AchievementCard key={ach.title} ach={ach} index={i} />
          ))}
        </div>

        {/* IIT Delhi highlight */}
        <div className="mt-8 p-6 rounded-2xl border border-[rgba(251,191,36,0.25)] bg-gradient-to-r from-[rgba(251,191,36,0.05)] to-[rgba(249,115,22,0.04)] flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="text-4xl">🏆</div>
          <div>
            <h4 className="font-syne font-bold text-white text-lg">Hack for Impact — Top 6 Nationwide out of 5,000+ Teams</h4>
            <p className="text-slate-400 text-sm mt-1">
              IIT Delhi E-Summit 2025 · Advanced through 3 rigorous selection rounds to become one of the top 6 finalists across India.
              Earned a Certificate of Excellence under expert mentorship.
            </p>
          </div>
          <div className="flex-shrink-0 px-4 py-2 rounded-xl border border-[rgba(251,191,36,0.4)] text-yellow-400 text-sm font-semibold font-mono whitespace-nowrap">
            Top 6 / 5,000+
          </div>
        </div>
      </div>
    </div>
  )
}
