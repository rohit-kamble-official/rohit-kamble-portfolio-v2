import { useEffect, useState } from 'react'
import { chapters, chapterById, TOTAL } from '../data/chapters.js'
import { profile } from '../data/profile.js'
import { useActiveSection } from '../lib/hooks.js'

const IDS = chapters.map((c) => c.id)
const LINKS = chapters.filter((c) => c.nav)
const ACCENTS = [
  { id: 'red', label: 'Red ink', color: '#b3231a' },
  { id: 'blue', label: 'Blue ink', color: '#1d47c9' },
  { id: 'green', label: 'Green ink', color: '#1c6e3a' },
]

const read = (k) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k, v) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* storage unavailable: preference lasts for this visit only */
  }
}

export default function Navbar() {
  const active = useActiveSection(IDS)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [accent, setAccent] = useState('red')
  const [motion, setMotion] = useState(true)

  useEffect(() => {
    const a = read('rk-accent')
    if (a && ACCENTS.some((x) => x.id === a)) setAccent(a)
    const m = read('rk-motion')
    if (m === 'off') setMotion(false)
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (accent === 'red') delete root.dataset.accent
    else root.dataset.accent = accent
  }, [accent])

  useEffect(() => {
    const root = document.documentElement
    if (motion) delete root.dataset.motion
    else root.dataset.motion = 'off'
  }, [motion])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pickAccent = (id) => {
    setAccent(id)
    write('rk-accent', id)
  }
  const toggleMotion = () => {
    setMotion((m) => {
      write('rk-motion', m ? 'off' : 'on')
      return !m
    })
  }

  const current = chapterById[active] || chapters[0]

  return (
    <>
      <header className="nav" data-solid={solid || open ? 'true' : 'false'}>
        <nav className="wrap flex h-full items-center justify-between gap-4" aria-label="Primary">
          <a href="#home" className="flex items-center gap-3 no-underline" aria-label={`${profile.name}, back to the cover`}>
            <span className="grid h-9 w-9 place-items-center bg-ink font-display text-[17px] leading-none text-paper">{profile.initials}</span>
            <span className="mono hidden text-ink sm:inline">{profile.githubUser}</span>
          </a>

          <ul className="hidden items-center gap-6 lg:flex">
            {LINKS.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="nav-link" aria-current={active === c.id ? 'true' : undefined}>
                  <span>{c.no}</span>
                  {c.nav}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex" role="group" aria-label="Ink colour">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="swatch"
                  style={{ background: a.color }}
                  aria-label={a.label}
                  aria-pressed={accent === a.id}
                  onClick={() => pickAccent(a.id)}
                />
              ))}
            </div>
            <button type="button" className="mono hidden items-center gap-2 text-ink sm:flex" onClick={toggleMotion} aria-pressed={motion}>
              <span className={`status-dot ${motion ? 'text-accent' : 'text-ink-3'}`} aria-hidden="true" />
              Motion {motion ? 'on' : 'off'}
            </button>
            <button
              type="button"
              className="mono flex h-10 items-center gap-2 border-2 border-ink px-3 text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? 'Close' : 'Index'}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div id="mobile-menu" className="mobile-menu on-dark lg:hidden">
          <div className="wrap py-8">
            <p className="mono text-paper/60">Contents</p>
            <ul className="mt-4">
              {chapters.map((c) => (
                <li key={c.id} className="border-b border-paper/20">
                  <a href={`#${c.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4 no-underline">
                    <span className="mono text-accent">{c.no}</span>
                    <span className="font-display text-[34px] uppercase leading-none">{c.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2" role="group" aria-label="Ink colour">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="swatch"
                    style={{ background: a.color }}
                    aria-label={a.label}
                    aria-pressed={accent === a.id}
                    onClick={() => pickAccent(a.id)}
                  />
                ))}
              </div>
              <button type="button" className="mono text-paper" onClick={toggleMotion} aria-pressed={motion}>
                Motion {motion ? 'on' : 'off'}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="rail" aria-hidden="true">
        {current.no} / {TOTAL} — {current.label}
      </p>
    </>
  )
}
