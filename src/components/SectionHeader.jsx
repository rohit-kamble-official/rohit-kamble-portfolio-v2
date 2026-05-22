import { useScrollReveal } from '../hooks/useScrollReveal'

export default function SectionHeader({ label, title, subtitle }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <p className="section-label mb-2">// {label}</p>
      <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-4 leading-tight">
        {title}
      </h2>
      <div className="gradient-line mb-4" />
      {subtitle && (
        <p className="text-slate-400 text-base leading-relaxed max-w-xl">{subtitle}</p>
      )}
    </div>
  )
}
