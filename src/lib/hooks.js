import { useEffect, useRef, useState, useCallback } from 'react'

const isBrowser = typeof window !== 'undefined'

/** True once the element has entered the viewport (or always, when `once` is false, mirrors visibility). */
export function useInView({ rootMargin = '0px 0px -10% 0px', threshold = 0, once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, threshold, once])
  return [ref, inView]
}

export function useMediaQuery(query, initial = false) {
  const [matches, setMatches] = useState(initial)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

/** Section id currently under the navbar: the last nav section whose top has passed 40% of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
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
  }, [ids])
  return active
}

/** Pointer-driven CSS 3D tilt + spotlight. Returns props to spread on the element. */
export function useTilt({ max = 7, disabled = false } = {}) {
  const ref = useRef(null)
  const frame = useRef(0)
  const onPointerMove = useCallback(
    (e) => {
      if (disabled || e.pointerType !== 'mouse') return
      const el = ref.current
      if (!el) return
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        el.style.setProperty('--rx', `${(0.5 - y) * max}deg`)
        el.style.setProperty('--ry', `${(x - 0.5) * max}deg`)
        el.style.setProperty('--mx', `${x * 100}%`)
        el.style.setProperty('--my', `${y * 100}%`)
        el.dataset.active = 'true'
      })
    },
    [max, disabled],
  )
  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.dataset.active = 'false'
  }, [])
  return { ref, onPointerMove, onPointerLeave }
}

/** Static capability check for the WebGL hero (reduced motion, Save-Data, WebGL support). Client-only. */
export function canUseWebGL() {
  if (!isBrowser) return false
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (navigator.connection?.saveData) return false
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * Size/device tier for the WebGL hero: 'high' | 'low' | 'none'.
 * Phones keep the CSS-3D chip (no WebGL download); tablets and modest laptops get a lighter scene.
 */
export function detectTier() {
  if (!isBrowser || !window.innerWidth) return 'none'
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const minSide = Math.min(window.screen?.width || window.innerWidth, window.screen?.height || window.innerHeight)
  if (window.innerWidth < 768 || (coarse && minSide < 600)) return 'none'
  const memory = navigator.deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency ?? 8
  if (coarse || memory <= 4 || cores <= 4) return 'low'
  return 'high'
}

/** Run `cb` after the first user interaction or after `timeout` ms of idle time, whichever comes first. */
export function onInteractionOrIdle(cb, timeout = 2500) {
  let done = false
  const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll']
  const run = () => {
    if (done) return
    done = true
    cleanup()
    cb()
  }
  const cleanup = () => {
    events.forEach((ev) => window.removeEventListener(ev, run))
    clearTimeout(timer)
    if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId)
  }
  events.forEach((ev) => window.addEventListener(ev, run, { passive: true, once: true }))
  let idleId = 0
  const timer = setTimeout(() => {
    if (window.requestIdleCallback) idleId = window.requestIdleCallback(run, { timeout: 1500 })
    else run()
  }, timeout)
  return cleanup
}

/** Spotlight tracking for `.spotlight` cards (sets --mx / --my in px). */
export function spot(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/** Ask the Projects section to open a project's detail view. */
export function openProject(slug) {
  window.dispatchEvent(new CustomEvent('project:open', { detail: slug }))
}
