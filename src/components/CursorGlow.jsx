import { useEffect, useRef } from 'react'

/** Soft glow that follows the mouse on fine-pointer devices (purely decorative). */
export default function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    let raf = 0
    let x = -999
    let y = -999
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          el.style.setProperty('--cx', `${x}px`)
          el.style.setProperty('--cy', `${y}px`)
        })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}
