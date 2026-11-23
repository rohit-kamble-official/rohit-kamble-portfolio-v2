import { useEffect, useRef } from 'react'
import { imageSources } from '../lib/images.js'
import { STATUS } from '../data/projects.js'

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
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
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

// ---------- Section header ----------
export function SectionHeader({ eyebrow, title, lead, id, align = 'left', children }) {
  return (
    <Reveal className={`mb-12 md:mb-16 max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="h-section mt-4">
        {title}
      </h2>
      {lead && <p className="lead mt-5 max-w-2xl">{lead}</p>}
      {children}
    </Reveal>
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

// ---------- Status badge ----------
export function StatusBadge({ status, className = '' }) {
  const s = STATUS[status]
  if (!s) return null
  return (
    <span className={`status ${className}`} data-tone={s.tone} title={s.hint}>
      {s.label}
    </span>
  )
}

export function ExternalLink({ href, children, className, ...rest }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
    </a>
  )
}
