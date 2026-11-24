import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { featuredProjects, moreProjects, projects } from '../data/projects.js'
import { ChapterHead, Cover, Picture, Reveal, StatusStamp, Tapes } from '../components/ui.jsx'

const ProjectChapter = lazy(() => import('../components/ProjectChapter.jsx'))
const preload = () => import('../components/ProjectChapter.jsx')
const KNOWN = new Set(projects.map((p) => p.slug))
const ORDER = projects.map((p) => p.slug)
const pad = (n) => String(n).padStart(2, '0')

function Media({ project, sizes }) {
  const key = project.images?.[0]
  if (key) return <Picture k={key} alt="" sizes={sizes} imgClassName="h-full w-full object-cover object-top" className="ink-img block h-full w-full" />
  return <Cover project={project} />
}

function WorkPanel({ project, index, onOpen }) {
  const name = project.shortTitle || project.title
  return (
    <li>
      <Reveal as="article" delay={(index % 2) * 90} className="panel work-card group" aria-labelledby={`w-${project.slug}`}>
        <div className="work-media">
          <Media project={project} sizes="(min-width: 1320px) 620px, (min-width: 900px) 47vw, 94vw" />
          <span className="work-num" aria-hidden="true">
            {pad(index + 1)}
          </span>
          <div className="absolute right-3 top-3 z-[2]">
            <StatusStamp status={project.status} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-7">
          <p className="mono text-ink-3">{project.categoryLabel}</p>
          <h3 id={`w-${project.slug}`} className="display mt-3 text-[clamp(34px,4.2vw,52px)]">
            {name}
          </h3>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink-2">{project.summary}</p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
            <p className="mono max-w-[70%] text-[10.5px] leading-[1.7] text-ink-2">{project.stack.slice(0, 4).join(' · ')}</p>
            <button
              type="button"
              className="stretched link-arrow text-ink"
              onClick={() => onOpen(project.slug)}
              onPointerEnter={preload}
              onFocus={preload}
              aria-label={`Read the chapter on ${name}`}
            >
              Read <span className="arr" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </Reveal>
    </li>
  )
}

// Spine colours cycle through paper, ink and accent like a mixed shelf of volumes.
const SPINES = [
  { bg: 'var(--color-paper)', fg: 'var(--color-ink)' },
  { bg: 'var(--color-ink)', fg: 'var(--color-paper)' },
  { bg: 'var(--accent)', fg: 'var(--accent-ink)' },
  { bg: 'var(--color-paper-3)', fg: 'var(--color-ink)' },
]

function Shelf({ onOpen }) {
  return (
    <ul className="shelf no-scrollbar" aria-label="All projects as volumes">
      {projects.map((p, i) => {
        const s = SPINES[i % SPINES.length]
        const name = p.shortTitle || p.title
        const h = 210 + ((name.length * 7 + i * 13) % 70)
        const w = 50 + ((i * 5) % 16)
        return (
          <li key={p.slug} className="contents">
            <button
              type="button"
              className="spine"
              style={{ '--bg': s.bg, '--fg': s.fg, '--h': `${h}px`, '--w': `${w}px` }}
              onClick={() => onOpen(p.slug)}
              onPointerEnter={preload}
              aria-label={`Volume ${pad(i + 1)}: ${name}`}
            >
              <span className="spine-no">{pad(i + 1)}</span>
              <span className="spine-title">{name}</span>
              <span className="spine-band" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function IndexRow({ project, index, onOpen }) {
  const name = project.shortTitle || project.title
  const live = project.links.live
  return (
    <li className="index-row">
      <span className="mono text-ink-3">A{index + 1}</span>
      <h4 className="display text-[clamp(26px,3vw,38px)]">{name}</h4>
      <p className="col-span-2 text-[15px] leading-relaxed text-ink-2 md:col-span-1">{project.summary}</p>
      <div className="col-start-2 flex items-center gap-3 md:col-start-auto">
        <StatusStamp status={project.status} />
        <button type="button" className="stretched mono text-ink" onClick={() => onOpen(project.slug)} onFocus={preload}>
          <span className="sr-only">Read the chapter on {name}</span>
          <span aria-hidden="true">{live ? '↗' : '→'}</span>
        </button>
      </div>
    </li>
  )
}

export default function Work() {
  const [openSlug, setOpenSlug] = useState(null)
  const [mounted, setMounted] = useState(false)
  const lastFocus = useRef(null)

  const open = useCallback((slug) => {
    if (!KNOWN.has(slug)) return
    lastFocus.current = document.activeElement
    setMounted(true)
    setOpenSlug(slug)
    history.replaceState(null, '', `#project-${slug}`)
  }, [])

  const close = useCallback(() => {
    setOpenSlug(null)
    history.replaceState(null, '', '#work')
    requestAnimationFrame(() => lastFocus.current?.focus?.({ preventScroll: true }))
  }, [])

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

  return (
    <>
      <section id="work" className="chapter" aria-labelledby="work-title">
        <div className="wrap">
          <ChapterHead
            id="work"
            titleId="work-title"
            lines={['Selected', 'Work']}
            lead={`${featuredProjects.length} builds across the web, machine learning and hardware: a live legal-tech platform, a SCADA analytics suite, ESP32 robots and more. Every one is labelled honestly. Open a panel for the full chapter.`}
          />

          <ul className="work-grid">
            {featuredProjects.map((p, i) => (
              <WorkPanel key={p.slug} project={p} index={i} onOpen={open} />
            ))}
          </ul>

          <div className="mt-28">
            <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="display text-[clamp(40px,6vw,72px)]">Also on the shelf</h3>
                <p className="mt-3 text-[16px] text-ink-2">Every project as a volume. Pull one out.</p>
              </div>
              <a href="https://github.com/rohit-kamble-official?tab=repositories" target="_blank" rel="noopener noreferrer" className="link-arrow">
                All repositories <span className="arr" aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Reveal>
            <Reveal>
              <Shelf onOpen={open} />
            </Reveal>

            <ul className="mt-14 border-t-2 border-ink">
              {moreProjects.map((p, i) => (
                <IndexRow key={p.slug} project={p} index={i} onOpen={open} />
              ))}
            </ul>
          </div>
        </div>

        {mounted && (
          <Suspense fallback={null}>
            <ProjectChapter slug={openSlug} order={ORDER} onClose={close} onNavigate={open} />
          </Suspense>
        )}
      </section>
      <Tapes
        a={['Full stack', 'No fluff', 'Real builds', 'Open to full-time roles']}
        b={['Python', 'TypeScript', 'React', 'FastAPI', 'Arduino', 'MongoDB', 'scikit-learn']}
      />
    </>
  )
}
