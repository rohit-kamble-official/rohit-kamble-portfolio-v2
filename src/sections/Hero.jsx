import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile.js'
import { canUseWebGL, detectTier, onInteractionOrIdle, useInView } from '../lib/hooks.js'
import ChipPoster from '../components/ChipPoster.jsx'
import ErrorBoundary from '../components/ErrorBoundary.jsx'
import Icon from '../components/Icon.jsx'

const HeroScene = lazy(() => import('../three/HeroScene.jsx'))

const LINE_ONE = ['Building', 'Intelligent']
const LINE_TWO = ['Digital', 'Experiences.']

const FLOATING = [
  { label: 'React', color: '#61dafb', glyph: 'react', pos: 'left-[57%] top-[25%]', depth: 18, bob: '0s' },
  { label: 'PyTorch', color: '#ff7a45', glyph: 'flame', pos: 'right-[8%] top-[19%]', depth: 26, bob: '1.2s' },
  { label: 'ESP32', color: '#ffc25c', glyph: 'chip', pos: 'right-[3%] top-[50%]', depth: 14, bob: '2.1s' },
  { label: 'Node.js', color: '#5fd068', glyph: 'hex', pos: 'left-[59%] top-[71%]', depth: 22, bob: '0.6s' },
  { label: 'OpenCV', color: '#7aa2ff', glyph: 'eye', pos: 'right-[13%] top-[79%]', depth: 30, bob: '1.7s' },
  { label: 'FastAPI', color: '#2fd6c3', glyph: 'bolt', pos: 'left-[70%] top-[11%]', depth: 12, bob: '2.6s' },
]

function Glyph({ type, color }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  switch (type) {
    case 'react':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.6" fill={color} />
        </svg>
      )
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 3c3.5 3.2 6 6.4 6 10a6 6 0 0 1-12 0c0-2.4 1.2-4.5 3-6l.5 3.5L12 3Z" />
        </svg>
      )
    case 'chip':
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
        </svg>
      )
    case 'hex':
      return (
        <svg {...common}>
          <path d="M12 2.5 20.5 7.3v9.4L12 21.5l-8.5-4.8V7.3Z" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...common}>
          <circle cx="7" cy="8" r="3.2" />
          <circle cx="17" cy="8" r="3.2" />
          <circle cx="12" cy="16.5" r="3.2" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12Z" />
        </svg>
      )
  }
}

export default function Hero() {
  const heroRef = useRef(null)
  const chipsRef = useRef(null)
  const [tier, setTier] = useState('none')
  const [load, setLoad] = useState(false)
  const [ready, setReady] = useState(false)
  const [visRef, visible] = useInView({ once: false, rootMargin: '0px', threshold: 0 })
  const [docVisible, setDocVisible] = useState(true)

  // Decide whether / when to load the WebGL scene.
  useEffect(() => {
    let cancel = null
    // Cheap size/device check first (phones never touch WebGL). The WebGL probe itself is
    // deferred until the scene is about to load, so it never runs during start-up.
    const evaluate = () => {
      if (cancel) return
      const t = detectTier()
      if (t === 'none') return
      setTier(t)
      cancel = onInteractionOrIdle(
        () => {
          if (canUseWebGL()) setLoad(true)
        },
        t === 'high' ? 3500 : 5000,
      )
      window.removeEventListener('resize', evaluate)
    }
    evaluate()
    if (!cancel) window.addEventListener('resize', evaluate)
    return () => {
      window.removeEventListener('resize', evaluate)
      cancel?.()
    }
  }, [])

  useEffect(() => {
    const onVis = () => setDocVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Mouse parallax for the floating tech chips (fine pointers only).
  useEffect(() => {
    const hero = heroRef.current
    const chips = chipsRef.current
    if (!hero || !chips || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect()
        chips.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
        chips.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
      })
    }
    hero.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      hero.removeEventListener('pointermove', onMove)
    }
  }, [])

  const setRefs = (el) => {
    heroRef.current = el
    visRef.current = el
  }

  let wordIndex = 0
  const word = (w) => {
    const i = wordIndex++
    const isAccent = w === 'Intelligent'
    return (
      <span key={w} className="hero-word mr-[0.22em] last:mr-0" style={{ '--i': i }}>
        <span className={isAccent ? 'shimmer' : undefined}>{w}</span>
      </span>
    )
  }

  return (
    <section id="home" ref={setRefs} className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-grid bg-grid" aria-hidden="true" />

      <div className="hero-stage" aria-hidden="true">
        <ChipPoster hidden={ready} />
        {load && (
          <div className="hero-canvas" data-ready={ready ? 'true' : 'false'}>
            <ErrorBoundary
              fallback={null}
              onError={() => {
                setLoad(false)
                setReady(false)
              }}
            >
              <Suspense fallback={null}>
                <HeroScene tier={tier} active={visible && docVisible} heroEl={heroRef.current} onReady={() => setReady(true)} />
              </Suspense>
            </ErrorBoundary>
          </div>
        )}
        <div ref={chipsRef} className="absolute inset-0">
          {FLOATING.map((c) => (
            <div key={c.label} className={`float-chip ${c.pos} max-lg:hidden`} style={{ '--depth': c.depth }}>
              <span className="bob inline-flex items-center gap-2" style={{ '--bob': c.bob }}>
                <i style={{ background: `${c.color}1f`, border: `1px solid ${c.color}40` }}>
                  <Glyph type={c.glyph} color={c.color} />
                </i>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-fade" aria-hidden="true" />

      <div className="container-x relative w-full pb-28 pt-[calc(var(--nav-h)+34svh)] sm:pb-32 lg:pb-24 lg:pt-[calc(var(--nav-h)+24px)]">
        <div className="max-w-[640px] lg:max-w-[min(760px,58vw)]">
          <a
            href="#contact"
            className="hero-fade-in glass inline-flex max-w-full items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4 text-[13px] text-fg-2 transition-colors hover:text-white"
            style={{ '--d': '40ms' }}
          >
            <span className="pulse-dot shrink-0" aria-hidden="true" />
            <span className="truncate">
              <span className="text-white/90">Open to full-time roles</span>
            </span>
            <span className="hidden h-3.5 w-px bg-white/15 sm:block" aria-hidden="true" />
            <span className="hidden sm:inline">B.Tech EE · Class of 2026</span>
          </a>

          <h1 id="hero-title" className="mt-7">
            <span className="hero-fade-in block text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] font-medium tracking-tight text-fg-2" style={{ '--d': '80ms' }}>
              Hi, I&apos;m <span className="text-white">{profile.name}</span>
            </span>
            <span className="hero-title mt-4 block">
              <span className="block">{LINE_ONE.map(word)}</span>
              <span className="block">{LINE_TWO.map(word)}</span>
            </span>
          </h1>

          <p
            className="hero-fade-in mt-7 flex flex-col gap-y-1.5 font-mono text-[12px] uppercase tracking-[0.14em] text-[#b6bdd0] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:text-[12.5px]"
            style={{ '--d': '360ms' }}
          >
            {profile.roles.map((r, i) => (
              <span key={r} className="inline-flex items-center gap-2.5 sm:gap-3">
                {i > 0 && <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden="true" />}
                <span className="h-1 w-1 rounded-full bg-brand-blue sm:hidden" aria-hidden="true" />
                {r}
              </span>
            ))}
          </p>

          <p className="lead mt-5 max-w-[34rem]">{profile.intro}</p>

          <div className="hero-fade-in mt-9 flex flex-wrap items-center gap-3" style={{ '--d': '420ms' }}>
            <a href="#projects" className="btn btn-primary max-sm:w-full">
              Explore My Work
              <Icon name="arrowRight" size={17} />
            </a>
            <a href={profile.resume} download={profile.resumeFileName} className="btn btn-secondary max-sm:flex-1">
              <Icon name="download" size={17} />
              <span className="sm:hidden">Resume</span>
              <span className="max-sm:hidden">Download Resume</span>
            </a>
            <a href="#contact" className="btn btn-ghost max-sm:flex-1">
              Let&apos;s Connect
              <Icon name="arrowRight" size={17} className="btn-arrow" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-x pointer-events-none absolute inset-x-0 bottom-7 flex items-end justify-between">
        <a
          href="#about"
          className="hero-fade-in pointer-events-auto flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.16em] text-fg-3 transition-colors hover:text-white"
          style={{ '--d': '900ms' }}
        >
          <span className="scroll-cue" aria-hidden="true" />
          <span className="max-sm:hidden">Scroll to explore</span>
          <span className="sr-only sm:hidden">Scroll to About</span>
        </a>
        <div className="hero-fade-in pointer-events-auto flex gap-2" style={{ '--d': '950ms' }}>
          <a className="icon-btn" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <Icon name="github" size={17} />
          </a>
          <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <Icon name="linkedin" size={16} />
          </a>
          <a className="icon-btn" href={`mailto:${profile.email}`} aria-label="Email Rohit">
            <Icon name="mail" size={17} />
          </a>
        </div>
      </div>
    </section>
  )
}
