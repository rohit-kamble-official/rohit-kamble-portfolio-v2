import { useEffect, useRef } from 'react'
import { experience } from '../data/experience.js'
import { spot } from '../lib/hooks.js'
import { Reveal, SectionHeader } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

export default function Experience() {
  const timeline = useRef(null)

  // Fill the rail as the timeline scrolls through the viewport.
  useEffect(() => {
    const el = timeline.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, (vh * 0.65 - r.top) / r.height))
      el.style.setProperty('--progress', progress.toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container-x relative">
        <SectionHeader
          id="experience-title"
          eyebrow="Professional experience"
          title={
            <>
              Learning by <span className="text-gradient">shipping real software.</span>
            </>
          }
          lead="Four internships across web development, data analytics, Android and machine learning, from production client apps to predictive models."
        />

        <div ref={timeline} className="timeline">
          <span className="timeline-rail" aria-hidden="true" />
          <ol className="space-y-6 lg:space-y-8">
            {experience.map((job, i) => (
              <Reveal as="li" key={job.id} delay={60} className="relative grid gap-4 pl-12 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-20 lg:pl-0">
                <span className="timeline-node" data-current={job.current ? 'true' : 'false'} aria-hidden="true" />
                <div className="lg:pt-5 lg:text-right">
                  <p className="font-mono text-[12.5px] tracking-wide text-white/85">{job.period}</p>
                  <p className="mt-1 text-[13px] text-fg-3">{job.location}</p>
                  <span className={`chip mt-3 ${job.current ? 'border-[#3ee6a0]/35 text-[#8ff0c4]' : ''}`}>
                    {job.current && <span className="pulse-dot !h-1.5 !w-1.5" aria-hidden="true" />}
                    {job.current ? 'Current' : job.type}
                  </span>
                </div>

                <article className="card spotlight p-6 sm:p-7" onPointerMove={spot} aria-labelledby={`job-${job.id}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 id={`job-${job.id}`} className="text-[1.2rem] font-semibold tracking-tight text-white">
                        {job.role}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-[15px] text-fg-2">
                        <Icon name="briefcase" size={15} className="text-brand-blue" />
                        {job.company}
                        {job.current && <span className="text-fg-3">· {job.type}</span>}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-fg-3" aria-hidden="true">
                      {String(experience.length - i).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-4 text-[15px] text-white/80">{job.summary}</p>
                  <ul className="mt-4 space-y-2.5">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-[14.5px] leading-relaxed text-fg-2">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand-blue" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Skills used">
                    {job.tags.map((t) => (
                      <li key={t} className="chip chip-mono">
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
