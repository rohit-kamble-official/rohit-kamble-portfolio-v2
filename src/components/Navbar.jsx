import { useEffect, useRef, useState } from 'react'
import { navLinks, profile } from '../data/profile.js'
import { useActiveSection } from '../lib/hooks.js'
import Icon from './Icon.jsx'

const SECTION_IDS = navLinks.map((l) => l.id)

export function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6d9bff" />
          <stop offset="1" stopColor="#a274ff" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0b0d14" />
      <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="2" />
      <g fill="none" stroke="url(#logo-g)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 47V17h9.5a7.5 7.5 0 0 1 0 15H13M22 32l8 15" />
        <path d="M38 17v30M51 17 38.5 33M43.5 27.5 52 47" />
      </g>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const [indicator, setIndicator] = useState({ x: 0, w: 0, visible: false })
  const active = useActiveSection(SECTION_IDS)
  const listRef = useRef(null)
  const burgerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sliding active-link indicator (desktop)
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const update = () => {
      const el = list.querySelector(`[data-id="${active}"]`)
      if (!el || el.offsetParent === null) return setIndicator((i) => ({ ...i, visible: false }))
      setIndicator({ x: el.offsetLeft, w: el.offsetWidth, visible: true })
    }
    update()
    document.fonts?.ready?.then(update)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [active])

  // Mobile menu: scroll lock, Escape to close, close when resizing to desktop
  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    const mq = window.matchMedia('(min-width: 1024px)')
    const onMq = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className="nav-shell fixed inset-x-0 top-0 z-50" data-scrolled={scrolled || open ? 'true' : 'false'}>
        <nav aria-label="Primary" className="container-x flex h-[var(--nav-h)] items-center justify-between gap-4">
          <a href="#home" className="group flex items-center gap-3 rounded-xl" aria-label="Rohit Kamble, back to top" onClick={close}>
            <Logo />
            <span className="hidden text-[15px] font-semibold tracking-tight text-white sm:block">
              Rohit Kamble
              <span className="ml-2 align-middle font-mono text-[10px] font-medium tracking-widest text-fg-3">V3</span>
            </span>
          </a>

          <div className="relative hidden lg:block">
            <span
              aria-hidden="true"
              className="nav-indicator"
              style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w, opacity: indicator.visible ? 1 : 0 }}
            />
            <ul ref={listRef} className="flex items-center gap-0.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} data-id={link.id} className="nav-link" aria-current={active === link.id ? 'true' : undefined}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <a href={profile.resume} download={profile.resumeFileName} className="btn btn-secondary btn-sm hidden sm:inline-flex">
              <Icon name="download" size={16} />
              Resume
            </a>
            <button
              ref={burgerRef}
              type="button"
              className="burger icon-btn lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => {
                setMenuMounted(true)
                // let the menu mount before toggling so the open transition runs
                requestAnimationFrame(() => setOpen((o) => !o))
              }}
            >
              <span>
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </header>
      {menuMounted && (
        <div
          id="mobile-menu"
          className="mobile-menu fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-40 overflow-y-auto bg-ink-950 lg:hidden"
          data-open={open ? 'true' : 'false'}
          inert={!open}
        >
          <div className="container-x flex min-h-full flex-col justify-between gap-8 py-6">
            <ul className="space-y-1">
              {navLinks.map((link, i) => (
                <li key={link.id} className="mm-item" style={{ '--i': i }}>
                  <a
                    href={`#${link.id}`}
                    onClick={close}
                    className="flex items-center justify-between border-b border-white/[0.06] py-3.5 text-[26px] font-semibold tracking-tight text-white/90"
                    aria-current={active === link.id ? 'true' : undefined}
                  >
                    {link.label}
                    <Icon name="arrowRight" size={20} className={active === link.id ? 'text-brand-blue' : 'text-fg-3'} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mm-item space-y-5" style={{ '--i': navLinks.length }}>
              <a href={profile.resume} download={profile.resumeFileName} className="btn btn-primary w-full" onClick={close}>
                <Icon name="download" size={17} />
                Download Resume
              </a>
              <div className="flex items-center justify-center gap-3">
                <a className="icon-btn" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                  <Icon name="github" size={18} />
                </a>
                <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                  <Icon name="linkedin" size={17} />
                </a>
                <a className="icon-btn" href={`mailto:${profile.email}`} aria-label="Email Rohit">
                  <Icon name="mail" size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
