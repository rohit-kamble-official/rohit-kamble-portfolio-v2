import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects.js'
import { Cover, Picture, StatusStamp } from './ui.jsx'

const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]))
const pad = (n) => String(n).padStart(2, '0')

/** A project opened as its own chapter, in a native modal <dialog>. */
export default function ProjectChapter({ slug, order, onClose, onNavigate }) {
  const ref = useRef(null)
  const scroller = useRef(null)
  const [shot, setShot] = useState(0)
  const project = slug ? bySlug[slug] : null
  const idx = slug ? order.indexOf(slug) : -1
  const prev = idx > 0 ? order[idx - 1] : null
  const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (project && !d.open) d.showModal()
    if (!project && d.open) d.close()
  }, [project])

  useEffect(() => {
    setShot(0)
    scroller.current?.scrollTo({ top: 0 })
  }, [slug])

  useEffect(() => {
    if (!project) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return
      if (e.key === 'ArrowRight' && next) onNavigate(next)
      if (e.key === 'ArrowLeft' && prev) onNavigate(prev)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [project, next, prev, onNavigate])

  const onCancel = (e) => {
    e.preventDefault()
    onClose()
  }
  const onBackdrop = (e) => {
    if (e.target === ref.current) onClose()
  }

  const p = project
  const images = p?.images || []
  const name = p ? p.shortTitle || p.title : ''

  return (
    <dialog ref={ref} className="chapter-dialog" onCancel={onCancel} onClick={onBackdrop} aria-labelledby="pc-title">
      {p && (
        <div className="flex max-h-[calc(100dvh-30px)] flex-col">
          <div className="flex items-center justify-between gap-3 border-b-[3px] border-ink bg-ink px-4 py-2.5 text-paper sm:px-6">
            <p className="mono truncate">
              Volume {pad(idx + 1)} / {pad(order.length)} · {p.categoryLabel}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" className="mono px-2 py-1.5 disabled:opacity-30" disabled={!prev} onClick={() => onNavigate(prev)} aria-label="Previous project">
                ←
              </button>
              <button type="button" className="mono px-2 py-1.5 disabled:opacity-30" disabled={!next} onClick={() => onNavigate(next)} aria-label="Next project">
                →
              </button>
              <button type="button" className="mono ml-2 border-2 border-paper px-3 py-1.5" onClick={onClose}>
                Close
              </button>
            </div>
          </div>

          <div ref={scroller} className="overflow-y-auto overscroll-contain">
            <div className="relative aspect-[16/8] border-b-[3px] border-ink bg-paper-2">
              {images.length ? (
                <Picture
                  key={images[shot]}
                  k={images[shot]}
                  alt={`Screenshot ${shot + 1} of ${images.length}: ${p.title}`}
                  sizes="(min-width: 1100px) 1080px, 100vw"
                  loading="eager"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover object-top"
                />
              ) : (
                <Cover project={p} />
              )}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-3 flex gap-1.5" role="group" aria-label="Screenshots">
                  {images.map((k, i) => (
                    <button
                      key={k}
                      type="button"
                      className={`h-3 w-8 border-2 border-ink ${i === shot ? 'bg-accent' : 'bg-paper'}`}
                      aria-label={`Show screenshot ${i + 1}`}
                      aria-pressed={i === shot}
                      onClick={() => setShot(i)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusStamp status={p.status} />
                  {p.role && <span className="stamp stamp-line">{p.role}</span>}
                </div>
                <h2 id="pc-title" className="display mt-5 text-[clamp(44px,7vw,84px)]">
                  {name}
                </h2>
                {p.shortTitle && p.shortTitle !== p.title && <p className="serif mt-2 text-[22px] text-ink-2">{p.title}</p>}
                <p className="mt-6 text-[17px] leading-relaxed text-ink-2">{p.description}</p>

                {p.features?.length > 0 && (
                  <>
                    <h3 className="mono mt-10 text-accent">// What it does</h3>
                    <ol className="mt-4 space-y-3">
                      {p.features.map((f, i) => (
                        <li key={f} className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 border-b border-ink/25 pb-3 text-[15.5px] leading-relaxed">
                          <span className="font-display text-[20px] leading-[1.2] text-ink-3">{pad(i + 1)}</span>
                          {f}
                        </li>
                      ))}
                    </ol>
                  </>
                )}

                {p.architecture && (
                  <>
                    <h3 className="mono mt-10 text-accent">// {p.architecture.label}</h3>
                    <ol className="mt-4 flex flex-wrap items-center gap-2">
                      {p.architecture.steps.map((s, i) => (
                        <li key={s} className="flex items-center gap-2">
                          <span className="tag bg-paper">{s}</span>
                          {i < p.architecture.steps.length - 1 && <span aria-hidden="true">→</span>}
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </div>

              <aside className="space-y-8">
                {p.metrics && (
                  <div>
                    <dl className="grid grid-cols-2 border-l-2 border-t-2 border-ink">
                      {p.metrics.map((m) => (
                        <div key={m.label} className="flex flex-col-reverse gap-2 border-b-2 border-r-2 border-ink p-4">
                          <dt className="mono text-[10px] text-ink-3">{m.label}</dt>
                          <dd className="font-display text-[34px] leading-none">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                    {p.metricsNote && <p className="mt-2 text-[13px] text-ink-3">{p.metricsNote}</p>}
                  </div>
                )}

                <div>
                  <h3 className="mono text-accent">// Stack</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {p.stack.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {(p.links.live || p.links.github) && (
                  <div className="flex flex-col gap-3">
                    {p.links.live && (
                      <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
                        {p.liveLabel || 'Open live site'} ↗<span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                    {p.links.github && (
                      <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                        Source on GitHub ↗<span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                    {p.liveNote && <p className="text-[13px] text-ink-3">{p.liveNote}</p>}
                  </div>
                )}
                {!p.links.live && !p.links.github && (
                  <p className="border-2 border-dashed border-ink/50 p-4 text-[14px] text-ink-2">
                    No public link yet. {p.status === 'concept' ? 'This is a concept at the design stage.' : 'The code is not public.'}
                  </p>
                )}
                {p.note && <p className="border-l-4 border-accent pl-4 text-[14px] leading-relaxed text-ink-2">{p.note}</p>}
              </aside>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
