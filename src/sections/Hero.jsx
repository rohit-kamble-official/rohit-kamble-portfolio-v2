import { useEffect, useState } from 'react'
import { profile } from '../data/profile.js'
import { experience } from '../data/experience.js'
import { Tapes } from '../components/ui.jsx'

const STACK_TAPE = ['React', 'Node.js', 'FastAPI', 'Python', 'PyTorch', 'OpenCV', 'ESP32', 'PostgreSQL', 'Docker']
const MOTTO_TAPE = ['Full stack', 'AI that works', 'Hardware that moves', 'Real builds', 'Open to full-time roles']

/** "Inking page 01…" counter that settles into the page number. Decorative only. */
function PageCounter() {
  const [n, setN] = useState(1)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off'
    if (reduce) {
      setDone(true)
      return
    }
    let i = 1
    const t = setInterval(() => {
      i += 1
      setN(i)
      if (i >= 100) {
        clearInterval(t)
        setDone(true)
      }
    }, 16)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="pointer-events-none flex items-end justify-between gap-6" aria-hidden="true">
      <p className="mono text-ink-3">{done ? 'Page 01 · inked' : 'Inking page 01…'}</p>
      <p className="font-display text-[clamp(56px,8vw,104px)] leading-[0.8] tabular-nums">{done ? '001' : String(n).padStart(3, '0')}</p>
    </div>
  )
}

export default function Hero() {
  const now = experience[0]
  return (
    <section id="home" className="relative pt-[calc(var(--nav-h)+28px)]" aria-labelledby="hero-title">
      <div className="wrap relative grid min-h-[calc(100svh-var(--nav-h)-28px)] grid-rows-[1fr_auto] pb-8">
        <div className="relative flex flex-col justify-center py-8">
          <div className="flex items-start gap-5 md:gap-8">
            <p className="chapter-kanji mt-1 hidden sm:block" aria-hidden="true">
              第一章
            </p>
            <div className="min-w-0 flex-1">
              <p className="mono flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-3">
                <span className="text-accent">Chapter 01</span>
                <span aria-hidden="true">·</span>
                <span>Full stack · AI/ML · Robotics</span>
                <span aria-hidden="true">·</span>
                <span>Nagpur, India</span>
              </p>

              <h1 id="hero-title" className="display mt-6 text-[23vw] md:text-[clamp(70px,min(15vw,24vh),230px)]">
                <span className="sr-only">{profile.name}</span>
                {['Rohit', 'Kamble'].map((w, i) => (
                  <span key={w} aria-hidden="true" className={`ink-name outline ${i === 1 ? 'pl-[0.55em]' : ''}`}>
                    {w}
                    <span className={`fill ${i === 1 ? 'pl-[0.55em]' : ''}`}>{w}</span>
                  </span>
                ))}
              </h1>

              <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <p className="max-w-xl text-[clamp(20px,2.3vw,28px)] leading-[1.25] text-ink">
                  I build software that runs from the browser{' '}
                  <span className="serif text-[1.15em] text-accent">all the way down</span> to the circuit board.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#work" className="btn btn-ink">
                    Read the work <span aria-hidden="true">→</span>
                  </a>
                  <a href={profile.resume} download={profile.resumeFileName} className="btn btn-line">
                    Resume (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <dl className="grid grid-cols-1 border-y-2 border-ink sm:grid-cols-3">
            {[
              ['Last role', `${now.role}, ${now.company.split(' ')[0]}`],
              ['Stack', 'React · Node.js · Python · ESP32'],
              ['Status', profile.availability],
            ].map(([k, v], i) => (
              <div key={k} className={`flex flex-col gap-1 py-3.5 sm:px-5 ${i ? 'border-t-2 border-ink sm:border-l-2 sm:border-t-0' : 'sm:pl-0'}`}>
                <dt className="mono text-accent">{k}</dt>
                <dd className="text-[15px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <PageCounter />
        </div>
      </div>

      <Tapes a={STACK_TAPE} b={MOTTO_TAPE} label={`Core stack: ${STACK_TAPE.join(', ')}`} />
    </section>
  )
}
