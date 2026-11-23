import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { CATEGORIES, STATUS, featuredProjects, moreProjects } from '../data/projects.js'
import { spot, useInView, useTilt } from '../lib/hooks.js'
import { Picture, Reveal, SectionHeader, StatusBadge } from '../components/ui.jsx'
import ProjectArt, { ACCENTS } from '../components/ProjectArt.jsx'
import Icon from '../components/Icon.jsx'

const ProjectModal = lazy(() => import('../components/ProjectModal.jsx'))
const preloadModal = () => import('../components/ProjectModal.jsx')
const KNOWN_SLUGS = new Set([...featuredProjects, ...moreProjects].map((p) => p.slug))

function LazyArt({ project }) {
  const [ref, inView] = useInView({ rootMargin: '300px 0px' })
  return (
    <div ref={ref} className="h-full w-full" role="img" aria-label={`Illustration of ${project.title}`}>
      {inView && <ProjectArt variant={project.art} accent={project.accent} className="h-full w-full" />}
    </div>
  )
}

function Media({ project, sizes, eager = false }) {
  const key = project.images?.[0]
  if (key) {
    return <Picture k={key} alt={`Screenshot of ${project.title}`} sizes={sizes} loading={eager ? 'eager' : 'lazy'} imgClassName="h-full w-full object-cover" />
  }
  return <LazyArt project={project} />
}

function ProjectLinks({ project, compact = false }) {
  const { live, github } = project.links
  return (
    <>
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className={compact ? 'icon-btn above-stretch' : 'btn btn-secondary btn-sm above-stretch'}
          aria-label={`${project.shortTitle || project.title}: ${project.liveLabel || 'live demo'} (opens in a new tab)`}
        >
          <Icon name="arrowUpRight" size={16} />
          {!compact && (project.liveLabel || 'Live')}
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className={compact ? 'icon-btn above-stretch' : 'btn btn-secondary btn-sm above-stretch'}
          aria-label={`${project.shortTitle || project.title} source code on GitHub (opens in a new tab)`}
        >
          <Icon name="github" size={15} />
          {!compact && 'GitHub'}
        </a>
      )}
    </>
  )
}

function ProjectCard({ project, onOpen }) {
  const tilt = useTilt({ max: 4.5 })
  const accent = ACCENTS[project.accent] || ACCENTS.blue
  const name = project.shortTitle || project.title
  return (
    <li className="h-full" style={{ viewTransitionName: `p-${project.slug}` }}>
      <article {...tilt} className="tilt card spotlight project-card" aria-labelledby={`pc-${project.slug}`}>
        <div className="project-media">
          <Media project={project} sizes="(min-width: 1280px) 384px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw" />
          <div className="absolute left-3 top-3 z-[1]">
            <StatusBadge status={project.status} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: accent }}>
            {project.categoryLabel}
          </p>
          <h3 id={`pc-${project.slug}`} className="mt-2 text-[1.16rem] font-semibold leading-snug tracking-tight text-white">
            {name}
          </h3>
          <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-fg-2">{project.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.stack.slice(0, 4).map((t) => (
              <li key={t} className="chip chip-mono">
                {t}
              </li>
            ))}
            {project.stack.length > 4 && <li className="chip chip-mono text-fg-3">+{project.stack.length - 4}</li>}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            <button
              type="button"
              className="stretched btn btn-primary btn-sm mr-auto"
              onClick={() => onOpen(project.slug)}
              onPointerEnter={preloadModal}
              onFocus={preloadModal}
              aria-label={`View project details: ${name}`}
            >
              View Project
              <Icon name="arrowRight" size={15} />
            </button>
            <ProjectLinks project={project} compact />
          </div>
        </div>
      </article>
    </li>
  )
}

function MoreRow({ project, onOpen }) {
  const name = project.shortTitle || project.title
  return (
    <li className="card spotlight relative flex items-center gap-4 p-4 sm:p-5" onPointerMove={spot}>
      <div className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:w-32">
        <Media project={project} sizes="128px" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-[15.5px] font-semibold tracking-tight text-white">{name}</h4>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-fg-2">{project.summary}</p>
        <p className="mt-1.5 truncate font-mono text-[11px] text-fg-3">{project.stack.slice(0, 4).join(' · ')}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2 max-sm:hidden">
        <ProjectLinks project={project} compact />
      </div>
      <button type="button" className="stretched sr-only" onClick={() => onOpen(project.slug)} onFocus={preloadModal}>
        View project details: {name}
      </button>
    </li>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [openSlug, setOpenSlug] = useState(null)
  const [modalMounted, setModalMounted] = useState(false)
  const lastFocus = useRef(null)
  const openRef = useRef(null)

  const featured = useMemo(() => (filter === 'all' ? featuredProjects : featuredProjects.filter((p) => p.category === filter)), [filter])
  const more = useMemo(() => (filter === 'all' ? moreProjects : moreProjects.filter((p) => p.category === filter)), [filter])
  const order = useMemo(() => [...featured, ...more].map((p) => p.slug), [featured, more])
  const counts = useMemo(() => {
    const all = [...featuredProjects, ...moreProjects]
    return Object.fromEntries(CATEGORIES.map((c) => [c.id, c.id === 'all' ? all.length : all.filter((p) => p.category === c.id).length]))
  }, [])

  const open = useCallback((slug) => {
    if (!KNOWN_SLUGS.has(slug)) return // ignore stale or mistyped deep links
    if (!openRef.current) lastFocus.current = document.activeElement
    openRef.current = slug
    setModalMounted(true)
    setOpenSlug(slug)
    history.replaceState(null, '', `#project-${slug}`)
  }, [])

  const close = useCallback(() => {
    openRef.current = null
    setOpenSlug(null)
    history.replaceState(null, '', '#projects')
    requestAnimationFrame(() => lastFocus.current?.focus?.({ preventScroll: true }))
  }, [])

  // Deep links (#project-<slug>) and requests from other sections (skill chips).
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(/^#project-([\w-]+)$/)
      if (m) open(m[1])
    }
    fromHash()
    const onRequest = (e) => open(e.detail)
    window.addEventListener('project:open', onRequest)
    window.addEventListener('hashchange', fromHash)
    return () => {
      window.removeEventListener('project:open', onRequest)
      window.removeEventListener('hashchange', fromHash)
    }
  }, [open])

  const changeFilter = (id) => {
    if (id === filter) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (document.startViewTransition && !reduce) document.startViewTransition(() => flushSync(() => setFilter(id)))
    else setFilter(id)
  }

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div aria-hidden="true" className="section-glow left-[30%] top-[6%] h-[380px] w-[600px] bg-[#3b4fd8]/20" />
      <div className="container-x relative">
        <SectionHeader
          id="projects-title"
          eyebrow="Featured projects"
          title={
            <>
              Things I&apos;ve built, <span className="text-gradient">and am building.</span>
            </>
          }
          lead="From a live legal-tech platform and an SCADA analytics suite to ESP32 robots and computer vision. Each card is labelled honestly: live, completed, in progress, prototype or concept."
        />

        <Reveal className="mb-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter projects by category">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" className="filter-tab" aria-pressed={filter === c.id} onClick={() => changeFilter(c.id)}>
                {c.label}
                <sup>{counts[c.id]}</sup>
              </button>
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Status legend">
            {Object.entries(STATUS).map(([key, s]) => (
              <li key={key} className="flex items-center gap-2 text-[12.5px] text-fg-3" title={s.hint}>
                <span className="status !px-0 !py-0 !border-0 !bg-transparent" data-tone={s.tone} aria-hidden="true" />
                {s.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <p className="sr-only" aria-live="polite">
          {`Showing ${featured.length + more.length} projects${filter === 'all' ? '' : ` in ${CATEGORIES.find((c) => c.id === filter)?.label}`}`}
        </p>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} onOpen={open} />
          ))}
        </ul>
        {featured.length === 0 && <p className="text-fg-2">No featured projects in this category yet.</p>}

        {more.length > 0 && (
          <div className="mt-20">
            <Reveal className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-[1.35rem] font-semibold tracking-tight text-white">More projects</h3>
                <p className="mt-1 text-[15px] text-fg-2">Earlier builds and experiments from Portfolio V2 and GitHub.</p>
              </div>
              <a
                href="https://github.com/rohit-kamble-official?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm shrink-0 max-sm:hidden"
              >
                All repositories
                <Icon name="arrowUpRight" size={15} className="btn-arrow" />
              </a>
            </Reveal>
            <ul className="grid gap-3 lg:grid-cols-2">
              {more.map((p) => (
                <MoreRow key={p.slug} project={p} onOpen={open} />
              ))}
            </ul>
          </div>
        )}
      </div>

      {modalMounted && (
        <Suspense fallback={null}>
          <ProjectModal slug={openSlug} order={order} onClose={close} onNavigate={(slug) => open(slug)} />
        </Suspense>
      )}
    </section>
  )
}
