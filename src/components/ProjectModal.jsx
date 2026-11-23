// Project detail view (lazy-loaded). Framer Motion handles enter/exit and the gallery crossfade.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m as motion } from 'framer-motion'
import { projects, STATUS } from '../data/projects.js'
import { Picture, StatusBadge } from './ui.jsx'
import ProjectArt, { ACCENTS } from './ProjectArt.jsx'
import Icon from './Icon.jsx'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

function Gallery({ project }) {
  const [index, setIndex] = useState(0)
  const images = project.images || []
  useEffect(() => setIndex(0), [project.slug])

  if (!images.length) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
        <ProjectArt variant={project.art} accent={project.accent} label={`Illustration of ${project.title}`} className="h-full w-full" />
      </div>
    )
  }
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={images[index]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Picture
              k={images[index]}
              alt={`${project.title}: screenshot ${index + 1} of ${images.length}`}
              sizes="(min-width: 1024px) 900px, 100vw"
              loading="eager"
              imgClassName="h-full w-full object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Screenshots">
          {images.map((k, i) => (
            <button
              key={k}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-pressed={i === index}
              className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border transition-all sm:w-28 ${i === index ? 'border-[#8fa4ff] opacity-100' : 'border-white/10 opacity-55 hover:opacity-90'}`}
            >
              <Picture k={k} alt="" sizes="112px" imgClassName="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Architecture({ arch, accent }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">{arch.label}</h3>
      <ol className="mt-4 flex flex-col gap-0 md:flex-row md:items-stretch">
        {arch.steps.map((step, i) => (
          <li key={step} className="flex flex-col items-stretch md:flex-1 md:flex-row md:items-center">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 md:h-full md:min-w-0 md:flex-1">
              <span className="font-mono text-[10px] text-fg-3">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-1 text-[13px] font-medium leading-snug text-white/90">{step}</p>
            </div>
            {i < arch.steps.length - 1 && (
              <span className="flow-link" aria-hidden="true">
                <span
                  className="flow-dot h-1.5 w-1.5 rounded-full"
                  style={{ background: accent, boxShadow: `0 0 8px ${accent}`, animationDelay: `${i * 0.35}s` }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function ProjectModal({ slug, order, onClose, onNavigate }) {
  const project = projects.find((p) => p.slug === slug)
  const dialog = useRef(null)
  const closeBtn = useRef(null)
  const scroller = useRef(null)

  const idx = project ? order.indexOf(project.slug) : -1
  const prev = idx > 0 ? order[idx - 1] : null
  const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null

  // Scroll lock (with scrollbar compensation) while open
  useEffect(() => {
    if (!project) return
    const html = document.documentElement
    const gap = window.innerWidth - html.clientWidth
    const prevOverflow = html.style.overflow
    const prevPad = html.style.paddingRight
    html.style.overflow = 'hidden'
    if (gap > 0) html.style.paddingRight = `${gap}px`
    return () => {
      html.style.overflow = prevOverflow
      html.style.paddingRight = prevPad
    }
  }, [Boolean(project)]) // eslint-disable-line react-hooks/exhaustive-deps

  // Focus the dialog on open / project change; reset scroll
  useEffect(() => {
    if (!project) return
    scroller.current?.scrollTo({ top: 0 })
    closeBtn.current?.focus({ preventScroll: true })
  }, [project?.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard: Escape, focus trap, arrow navigation
  useEffect(() => {
    if (!project) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Tab' && dialog.current) {
        const nodes = [...dialog.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null)
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      } else if (e.key === 'ArrowRight' && next && !e.target.closest?.('input, textarea')) {
        onNavigate(next)
      } else if (e.key === 'ArrowLeft' && prev && !e.target.closest?.('input, textarea')) {
        onNavigate(prev)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, next, prev, onClose, onNavigate])

  const accent = project ? ACCENTS[project.accent] || ACCENTS.blue : ACCENTS.blue
  const status = project ? STATUS[project.status] : null

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {project && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-[#020308]/80 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
            <motion.div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              className="relative flex max-h-[94svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[26px] border border-white/10 bg-[#090b11] shadow-[0_40px_120px_-30px_rgba(60,70,200,0.5)] sm:rounded-[26px]"
              initial={{ y: 48, opacity: 0, scale: 0.985 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 36, opacity: 0, scale: 0.985 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            >
              {/* header */}
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-2.5">
                  <StatusBadge status={project.status} />
                  <span className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">{project.categoryLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" className="icon-btn !h-9 !w-9" onClick={() => prev && onNavigate(prev)} disabled={!prev} aria-label="Previous project">
                    <Icon name="chevronLeft" size={17} />
                  </button>
                  <button type="button" className="icon-btn !h-9 !w-9" onClick={() => next && onNavigate(next)} disabled={!next} aria-label="Next project">
                    <Icon name="chevronRight" size={17} />
                  </button>
                  <button ref={closeBtn} type="button" className="icon-btn !h-9 !w-9" onClick={onClose} aria-label="Close project details">
                    <Icon name="close" size={17} />
                  </button>
                </div>
              </div>

              {/* body */}
              <div ref={scroller} className="overflow-y-auto overscroll-contain">
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="p-4 sm:p-7"
                >
                  <Gallery project={project} />

                  <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                    <div>
                      <h2 id="project-modal-title" className="text-[clamp(1.6rem,1.2rem+1.6vw,2.3rem)] font-semibold leading-tight tracking-tight text-white">
                        {project.title}
                      </h2>
                      {project.role && <p className="mt-2 text-[14px] text-fg-2">{project.role}</p>}
                      <p className="mt-4 text-[16px] leading-relaxed text-fg-2">{project.description}</p>

                      <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Key features</h3>
                      <ul className="mt-4 space-y-2.5">
                        {project.features.map((f) => (
                          <li key={f} className="flex gap-3 text-[15px] leading-relaxed text-white/85">
                            <Icon name="check" size={17} className="mt-0.5 shrink-0" style={{ color: accent }} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {project.metrics && (
                        <div className="mt-8">
                          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                            {project.metrics.map((m) => (
                              <div key={m.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-[1.35rem] font-semibold tracking-tight text-white">{m.value}</p>
                                <p className="mt-1 text-[12px] text-fg-3">{m.label}</p>
                              </div>
                            ))}
                          </div>
                          {project.metricsNote && <p className="mt-2 text-[12.5px] text-fg-3">{project.metricsNote}</p>}
                        </div>
                      )}
                    </div>

                    <aside className="space-y-7">
                      <div>
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Tech stack</h3>
                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {project.stack.map((t) => (
                            <li key={t} className="chip">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Status</h3>
                        <p className="mt-3 text-[14.5px] leading-relaxed text-fg-2">
                          <span className="font-semibold text-white">{status.label}.</span> {status.hint}.
                        </p>
                        {project.note && (
                          <p className="mt-3 flex gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-[13.5px] leading-relaxed text-fg-2">
                            <Icon name="info" size={16} className="mt-0.5 shrink-0 text-fg-3" />
                            {project.note}
                          </p>
                        )}
                      </div>

                      {(project.links.live || project.links.github) && (
                        <div>
                          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Links</h3>
                          <div className="mt-4 flex flex-wrap gap-2.5">
                            {project.links.live && (
                              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                                <Icon name="arrowUpRight" size={16} />
                                {project.liveLabel || 'Live demo'}
                              </a>
                            )}
                            {project.links.github && (
                              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                                <Icon name="github" size={15} />
                                Source on GitHub
                              </a>
                            )}
                          </div>
                          {project.liveNote && <p className="mt-2.5 text-[12.5px] text-fg-3">{project.liveNote}</p>}
                        </div>
                      )}
                      {!project.links.live && !project.links.github && <p className="text-[13.5px] text-fg-3">No public repository or deployment yet.</p>}
                    </aside>
                  </div>

                  {project.architecture && (
                    <div className="mt-10 border-t border-white/[0.07] pt-8">
                      <Architecture arch={project.architecture} accent={accent} />
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
