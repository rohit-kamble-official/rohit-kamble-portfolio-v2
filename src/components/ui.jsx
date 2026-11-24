import { useEffect, useRef } from 'react'
import { imageSources } from '../lib/images.js'
import { STATUS } from '../data/projects.js'
import { chapterById } from '../data/chapters.js'

// ---------- Reveal on scroll (one shared IntersectionObserver) ----------
let observer
function getObserver() {
  if (observer || typeof window === 'undefined' || !('IntersectionObserver' in window)) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = 'true'
          observer.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
  )
  return observer
}

export function Reveal({ as: Tag = 'div', delay = 0, className, style, children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = getObserver()
    if (!io) {
      el.dataset.visible = 'true'
      return
    }
    io.observe(el)
    return () => io.unobserve(el)
  }, [])
  return (
    <Tag ref={ref} data-reveal="" className={className} style={delay ? { ...style, '--delay': `${delay}ms` } : style} {...rest}>
      {children}
    </Tag>
  )
}

// ---------- Chapter header ----------
// lines: array of strings; the last line is drawn in outline.
export function ChapterHead({ id, titleId, lines, lead, dark = false, children }) {
  const c = chapterById[id]
  return (
    <header className="relative mb-14 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 md:mb-20 md:gap-x-10">
      <div className="flex flex-col items-center gap-4 pt-2">
        <span className={`chapter-num ${dark ? '!text-transparent [-webkit-text-stroke-color:var(--color-paper)]' : ''}`} aria-hidden="true">
          {c.no}
        </span>
        <span className="chapter-kanji" aria-hidden="true">
          {c.kanji}
        </span>
      </div>
      <Reveal>
        <p className={`mono flex flex-wrap items-center gap-x-3 ${dark ? 'text-paper/70' : 'text-ink-3'}`}>
          <span className="text-accent">//</span> Chapter {c.no} — {c.label}
        </p>
        <h2 id={titleId} className="chapter-title mt-4">
          {lines.map((l, i) => (
            <span key={l} className={`ln ${i === lines.length - 1 && lines.length > 1 ? (dark ? 'outline-paper' : 'outline') : ''}`}>
              {l}
            </span>
          ))}
        </h2>
        {lead && <p className={`mt-7 max-w-xl text-[17px] leading-relaxed ${dark ? 'text-paper/80' : 'text-ink-2'}`}>{lead}</p>}
        {children}
      </Reveal>
    </header>
  )
}

// ---------- Tapes: two crossing marquee bands ----------
function Track({ items }) {
  // Repeat enough times to overflow wide screens, then double for a seamless loop.
  const row = Array.from({ length: 4 }, () => items).flat()
  return (
    <div className="tape-track">
      {[0, 1].map((half) => (
        <span key={half} className="inline-flex" aria-hidden={half === 1 ? 'true' : undefined}>
          {row.map((t, i) => (
            <span key={`${t}-${i}`} className="tape-item">
              {t}
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}

export function Tapes({ a, b, label }) {
  return (
    <div className="tapes" role="presentation">
      {label && <p className="sr-only">{label}</p>}
      {b && (
        <div className="tape tape-b" aria-hidden="true">
          <Track items={b} />
        </div>
      )}
      <div className="tape tape-a" aria-hidden="true">
        <Track items={a} />
      </div>
    </div>
  )
}

// ---------- Responsive image ----------
export function Picture({ k, alt, sizes = '(min-width: 1024px) 33vw, 100vw', className, imgClassName, loading = 'lazy', fetchPriority }) {
  const src = imageSources(k)
  if (!src) return null
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={src.avif} sizes={sizes} />
      <source type="image/webp" srcSet={src.webp} sizes={sizes} />
      <img
        src={src.fallback}
        alt={alt}
        width={src.width}
        height={src.height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={imgClassName}
      />
    </picture>
  )
}

// ---------- Project status stamp ----------
const TONE = { live: 'stamp', completed: 'stamp stamp-ink', 'in-progress': 'stamp stamp-line', prototype: 'stamp stamp-line', concept: 'stamp stamp-line' }

export function StatusStamp({ status, className = '' }) {
  const s = STATUS[status]
  if (!s) return null
  return (
    <span className={`${TONE[status]} ${className}`} title={s.hint}>
      {status === 'live' && <span className="status-dot" aria-hidden="true" />}
      {s.label}
    </span>
  )
}

// ---------- Cover art for projects without a screenshot ----------
export function Cover({ project, size = 'md' }) {
  const words = (project.shortTitle || project.title).split(' ').slice(0, 3)
  const fs = size === 'sm' ? 'text-[22px]' : 'text-[clamp(40px,6vw,76px)]'
  return (
    <div className="cover" aria-hidden="true">
      <div className="speedlines absolute inset-[-40%] opacity-[0.12]" />
      <div className="halftone absolute inset-0 opacity-[0.16] [mask-image:linear-gradient(115deg,transparent_35%,#000)]" />
      <p className={`cover-word ${fs}`}>
        {words.map((w) => (
          <span key={w} className="block">
            {w}
          </span>
        ))}
      </p>
      {size !== 'sm' && <span className="mono absolute right-4 top-4 text-ink-3">{project.categoryLabel}</span>}
    </div>
  )
}
