import { achievements, certifications, education } from '../data/credentials.js'
import { openProject, spot, useTilt } from '../lib/hooks.js'
import { Reveal, SectionHeader } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

const KIND_HUE = { Course: 'blue', Internship: 'cyan', Recognition: 'violet' }

function CertCard({ cert, index }) {
  const tilt = useTilt({ max: 5 })
  const hue = KIND_HUE[cert.kind] || 'blue'
  return (
    <Reveal as="li" delay={index * 70} className="h-full">
      <article {...tilt} className="tilt card spotlight flex h-full flex-col p-6" data-hue={hue} aria-labelledby={`cert-${cert.id}`}>
        <div className="flex items-start justify-between gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-xl"
            style={{
              color: 'var(--hue)',
              background: 'color-mix(in oklab, var(--hue) 13%, transparent)',
              border: '1px solid color-mix(in oklab, var(--hue) 30%, transparent)',
            }}
          >
            <Icon name={cert.icon} size={20} />
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {cert.badge && (
              <span className="chip chip-mono" style={{ color: 'var(--hue)', borderColor: 'color-mix(in oklab, var(--hue) 35%, transparent)' }}>
                {cert.badge}
              </span>
            )}
            <span className="chip chip-mono">{cert.kind}</span>
          </div>
        </div>
        <h3 id={`cert-${cert.id}`} className="mt-5 text-[1.05rem] font-semibold leading-snug tracking-tight text-white">
          {cert.title}
        </h3>
        <p className="mt-1.5 text-[14px] text-fg-2">{cert.issuer}</p>
        <p className="mt-3 flex-1 text-[14px] leading-relaxed text-fg-3">{cert.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4 text-[12.5px]">
          <span className="flex items-center gap-1.5 font-mono text-fg-3">
            <Icon name="calendar" size={14} />
            {cert.date || 'Completed'}
          </span>
          {cert.url ? (
            <a href={cert.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-white/85 hover:text-white">
              View credential <Icon name="arrowUpRight" size={14} />
            </a>
          ) : null}
        </div>
      </article>
    </Reveal>
  )
}

export function Certifications() {
  return (
    <section id="certifications" className="section" aria-labelledby="certifications-title">
      <div className="container-x relative">
        <SectionHeader
          id="certifications-title"
          eyebrow="Certifications"
          title={
            <>
              Credentials, <span className="text-gradient">earned the hard way.</span>
            </>
          }
          lead="Courses, programmes and recognitions that shaped how I code and lead."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <CertCard key={c.id} cert={c} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function CgpaRing({ value, scale }) {
  const r = 52
  const c = 2 * Math.PI * r
  const pct = value / scale
  return (
    <div className="relative grid h-[136px] w-[136px] place-items-center">
      <svg viewBox="0 0 128 128" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="cgpa-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6d9bff" />
            <stop offset="1" stopColor="#a274ff" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="url(#cgpa-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="cgpa-arc"
          style={{ '--len': c }}
        />
      </svg>
      <div className="text-center">
        <p className="text-[2rem] font-semibold leading-none tracking-tight text-white">{value}</p>
        <p className="mt-1 font-mono text-[11px] text-fg-3">CGPA / {scale}</p>
      </div>
    </div>
  )
}

export function Education() {
  return (
    <section id="education" className="section !pt-0" aria-labelledby="education-title">
      <div className="container-x relative">
        <SectionHeader id="education-title" eyebrow="Education" title={<>Engineering foundations.</>} />
        <Reveal className="card spotlight overflow-hidden" onPointerMove={spot}>
          <div className="grid grid-cols-1 gap-10 p-6 sm:p-9 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-brand-blue">
                  <Icon name="graduation" size={22} />
                </span>
                <div>
                  <h3 className="text-[1.35rem] font-semibold leading-snug tracking-tight text-white">{education.degree}</h3>
                  <p className="mt-1 text-[15px] text-fg-2">
                    {education.minor} · {education.institute}, {education.location}
                  </p>
                  <p className="mt-2 font-mono text-[12.5px] text-fg-3">{education.period}</p>
                </div>
              </div>

              <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Relevant coursework</h4>
              <ul className="mt-4 flex flex-wrap gap-2">
                {education.coursework.map((c) => (
                  <li key={c} className="chip">
                    {c}
                  </li>
                ))}
              </ul>

              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                {education.highlights.map((h) => (
                  <div key={h.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-3">{h.label}</dt>
                    <dd className="mt-2 text-[14.5px] leading-snug text-white/90">
                      {h.project ? (
                        <button
                          type="button"
                          onClick={() => openProject(h.project)}
                          className="text-left underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-[#8fa4ff]"
                        >
                          {h.value}
                        </button>
                      ) : (
                        h.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col items-start gap-8 border-t border-white/[0.07] pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <CgpaRing value={education.cgpa} scale={education.cgpaScale} />
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Currently learning</h4>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {education.learning.map((l) => (
                    <li key={l} className="chip border-dashed">
                      <Icon name="sparkles" size={13} className="text-brand-violet" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Achievements() {
  return (
    <section id="achievements" className="section" aria-labelledby="achievements-title">
      <div aria-hidden="true" className="section-glow right-[5%] top-[20%] h-[360px] w-[360px] bg-[#6b3fd8]/25" />
      <div className="container-x relative">
        <SectionHeader
          id="achievements-title"
          eyebrow="Achievements"
          title={
            <>
              Competing, winning, <span className="text-gradient">leading.</span>
            </>
          }
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 70} className={a.featured ? 'md:col-span-2 lg:row-span-2 lg:col-span-1' : ''}>
              <article
                className={`card spotlight relative flex h-full flex-col overflow-hidden p-6 sm:p-7 ${a.featured ? 'bg-[radial-gradient(120%_90%_at_0%_0%,rgba(90,110,255,0.16),transparent_60%)]' : ''}`}
                onPointerMove={spot}
                aria-labelledby={`ach-${a.id}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-semibold leading-none tracking-tight ${a.featured ? 'text-gradient text-[3.4rem]' : 'text-[2.1rem] text-white'}`}>
                    {a.rank}
                  </span>
                  <span className="chip chip-mono">{a.year}</span>
                </div>
                <h3 id={`ach-${a.id}`} className="mt-5 text-[1.08rem] font-semibold leading-snug tracking-tight text-white">
                  {a.title}
                </h3>
                <p className="mt-1 text-[13.5px] text-fg-3">{a.org}</p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-fg-2">{a.body}</p>
                {a.stat && (
                  <div className="mt-auto pt-8">
                    <div className="hairline mb-5" />
                    <p className="text-[2.4rem] font-semibold leading-none tracking-tight text-white">{a.stat.value}</p>
                    <p className="mt-1.5 text-[13px] text-fg-3">{a.stat.label} · three selection rounds · final six</p>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
