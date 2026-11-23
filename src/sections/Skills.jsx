import { useEffect, useMemo, useRef, useState } from 'react'
import { skillMap, allSkills } from '../data/skills.js'
import { openProject, useInView, useReducedMotion } from '../lib/hooks.js'
import { Reveal, SectionHeader } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

// Even distribution of n points on a unit sphere.
function fibonacciSphere(n) {
  const pts = []
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = phi * i
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r])
  }
  return pts
}

const RADIUS = 0.39 // fraction of the globe size
const INITIAL = { x: -0.22, y: 0.4 }

function project([x, y, z], rx, ry) {
  const cy = Math.cos(ry)
  const sy = Math.sin(ry)
  const cx = Math.cos(rx)
  const sx = Math.sin(rx)
  const x1 = x * cy + z * sy
  const z1 = -x * sy + z * cy
  const y2 = y * cx - z1 * sx
  const z2 = y * sx + z1 * cx
  return [x1, y2, z2]
}

/** CSS-3D "tech globe": every skill orbits on a sphere; drag to spin, click to pick a category. */
function SkillGlobe({ activeGroup, onSelect }) {
  const reduced = useReducedMotion()
  const [viewRef, inView] = useInView({ once: false, rootMargin: '100px' })
  const box = useRef(null)
  const tags = useRef([])
  const rot = useRef({ ...INITIAL, vy: 0, dragging: false, lastX: 0, lastY: 0, hover: false, size: 0 })
  const points = useMemo(() => fibonacciSphere(allSkills.length), [])

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      rot.current.size = entry.contentRect.width
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let raf = 0
    let switched = false
    const tick = () => {
      const r = rot.current
      if (!r.dragging) {
        const auto = reduced ? 0 : r.hover ? 0.0009 : 0.0034
        r.y += auto + r.vy
        r.vy *= 0.94
      }
      const R = r.size * (r.size < 420 ? 0.33 : RADIUS)
      if (R > 0) {
        for (let i = 0; i < points.length; i++) {
          const el = tags.current[i]
          if (!el) continue
          if (!switched) {
            el.style.left = '50%'
            el.style.top = '50%'
          }
          const [x, y, z] = project(points[i], r.x, r.y)
          const depth = (z + 1) / 2 // 0 back, 1 front
          el.style.transform = `translate3d(${(x * R).toFixed(1)}px, ${(y * R).toFixed(1)}px, 0) scale(${(0.64 + depth * 0.46).toFixed(3)})`
          el.style.opacity = (0.18 + depth * 0.82).toFixed(3)
          el.style.zIndex = String(Math.round(depth * 100))
        }
        switched = true
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, points, reduced])

  const onPointerDown = (e) => {
    const r = rot.current
    r.dragging = true
    r.lastX = e.clientX
    r.lastY = e.clientY
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const r = rot.current
    if (!r.dragging) return
    const dx = e.clientX - r.lastX
    const dy = e.clientY - r.lastY
    r.lastX = e.clientX
    r.lastY = e.clientY
    r.y += dx * 0.006
    r.x = Math.max(-1.1, Math.min(1.1, r.x - dy * 0.006))
    r.vy = dx * 0.0009
  }
  const endDrag = () => (rot.current.dragging = false)

  return (
    <div
      ref={(el) => {
        box.current = el
        viewRef.current = el
      }}
      className="globe"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => (rot.current.hover = true)}
      onPointerLeave={() => {
        rot.current.hover = false
        endDrag()
      }}
    >
      <div className="globe-ring" />
      {allSkills.map((s, i) => {
        const [x, y, z] = project(points[i], INITIAL.x, INITIAL.y)
        const depth = (z + 1) / 2
        const isActive = s.group === activeGroup
        return (
          <span
            key={`${s.group}-${s.name}`}
            ref={(el) => (tags.current[i] = el)}
            className="globe-tag"
            data-hue={s.hue}
            data-active={isActive ? 'true' : 'false'}
            data-dim={isActive ? 'false' : 'true'}
            onClick={() => onSelect(s.group)}
            style={{
              left: `${50 + x * RADIUS * 100}%`,
              top: `${50 + y * RADIUS * 100}%`,
              opacity: 0.18 + depth * 0.82,
              transform: `scale(${(0.64 + depth * 0.46).toFixed(3)})`,
              zIndex: Math.round(depth * 100),
            }}
          >
            {s.name}
          </span>
        )
      })}
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState(skillMap[0].id)
  const tabRefs = useRef([])
  const group = skillMap.find((g) => g.id === active)

  const onKeyDown = (e, index) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    let next = null
    if (e.key in keys) next = (index + keys[e.key] + skillMap.length) % skillMap.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = skillMap.length - 1
    if (next === null) return
    e.preventDefault()
    setActive(skillMap[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div aria-hidden="true" className="section-glow right-[-8%] top-[10%] h-[460px] w-[460px] bg-[#6b3fd8]/25" />
      <div className="container-x relative">
        <SectionHeader
          id="skills-title"
          eyebrow="Technical skills"
          title={
            <>
              One toolkit, <span className="text-gradient">software to silicon.</span>
            </>
          }
          lead="Pick a category or spin the globe. Every skill links to the projects and roles where I actually used it, with no made-up percentages."
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <div
              role="tablist"
              aria-label="Skill categories"
              aria-orientation="vertical"
              className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {skillMap.map((g, i) => (
                <button
                  key={g.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  role="tab"
                  type="button"
                  id={`skill-tab-${g.id}`}
                  aria-selected={active === g.id}
                  aria-controls="skills-panel"
                  tabIndex={active === g.id ? 0 : -1}
                  data-hue={g.hue}
                  className="skill-tab shrink-0 max-lg:w-auto"
                  onClick={() => setActive(g.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className="dot">
                    <Icon name={g.icon} size={16} />
                  </span>
                  <span className="whitespace-nowrap text-[14.5px] font-medium">{g.label}</span>
                  <span className="ml-auto pl-3 font-mono text-[11px] text-fg-3 max-lg:hidden">{String(g.skills.length).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <SkillGlobe activeGroup={active} onSelect={setActive} />
            <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-fg-3 max-sm:hidden">Drag to rotate · click a skill</p>
          </Reveal>
        </div>

        <div id="skills-panel" role="tabpanel" aria-labelledby={`skill-tab-${active}`} className="mt-14" data-hue={group.hue}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-[1.35rem] font-semibold tracking-tight text-white">{group.label}</h3>
              <p className="mt-1 text-[15px] text-fg-2">{group.blurb}</p>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-3">{group.skills.length} skills</p>
          </div>
          <ul key={active} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.skills.map((s, i) => {
              const uses = s.usedIn.length + s.roles.length
              return (
                <li key={s.name} className="skill-item" data-hue={group.hue} style={{ animation: `fade-up .6s var(--ease-out-expo) both ${i * 40}ms` }}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2.5 text-[15px] font-semibold text-white">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--hue)', boxShadow: '0 0 10px var(--hue)' }} aria-hidden="true" />
                      {s.name}
                    </p>
                    {uses > 0 && (
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">
                        {s.usedIn.length > 0 && `${s.usedIn.length} project${s.usedIn.length > 1 ? 's' : ''}`}
                        {s.usedIn.length > 0 && s.roles.length > 0 && ' · '}
                        {s.roles.length > 0 && `${s.roles.length} role${s.roles.length > 1 ? 's' : ''}`}
                      </span>
                    )}
                  </div>
                  {(s.usedIn.length > 0 || s.roles.length > 0 || s.note) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.usedIn.slice(0, 3).map((p) => (
                        <button
                          key={p.slug}
                          type="button"
                          className="chip chip-mono transition-colors hover:border-white/20 hover:text-white"
                          onClick={() => openProject(p.slug)}
                        >
                          {p.title}
                        </button>
                      ))}
                      {s.usedIn.length > 3 && <span className="chip chip-mono text-fg-3">+{s.usedIn.length - 3}</span>}
                      {s.roles.slice(0, 2).map((r) => (
                        <a key={r.id} href="#experience" className="chip chip-mono text-fg-2 hover:text-white">
                          <Icon name="briefcase" size={12} />
                          {r.title}
                        </a>
                      ))}
                      {s.note && <span className="chip chip-mono text-fg-2">{s.note}</span>}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
