import { about, profile } from '../data/profile.js'
import { spot, useTilt } from '../lib/hooks.js'
import { Picture, Reveal, SectionHeader } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

function Portrait() {
  const tilt = useTilt({ max: 6 })
  return (
    <div {...tilt} className="tilt card spotlight relative p-2.5">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-ink-800">
        <Picture
          k="rohit-portrait"
          alt="Portrait of Rohit Kamble"
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 70vw, 92vw"
          imgClassName="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-[#05060a]/10 to-transparent" aria-hidden="true" />
        <div className="tilt-layer absolute inset-x-3 bottom-3 rounded-2xl glass p-4" style={{ '--z': '40px' }}>
          <p className="text-[17px] font-semibold tracking-tight text-white">{profile.name}</p>
          <p className="mt-0.5 text-[13.5px] text-fg-2">Full Stack · AI/ML · Robotics &amp; IoT</p>
          <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-fg-3">
            <Icon name="pin" size={14} />
            {profile.location}
          </p>
        </div>
      </div>
      <div className="tilt-layer glass absolute -right-3 top-8 rounded-2xl px-4 py-3 shadow-2xl sm:-right-6" style={{ '--z': '70px' }}>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-3">B.Tech EE</p>
        <p className="text-[15px] font-semibold text-white">Class of 2026</p>
      </div>
      <div className="tilt-layer glass absolute -left-3 top-[44%] rounded-2xl px-4 py-3 shadow-2xl sm:-left-6" style={{ '--z': '55px' }}>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-3">Hack for Impact</p>
        <p className="text-[15px] font-semibold text-white">Top 6 / 5,000+</p>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div aria-hidden="true" className="section-glow left-[-10%] top-[20%] h-[420px] w-[420px] bg-[#3b4fd8]/30" />
      <div className="container-x relative">
        <SectionHeader
          id="about-title"
          eyebrow="About me"
          title={
            <>
              From circuits to code <span className="text-gradient">to intelligence.</span>
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="mx-auto w-full max-w-[440px] space-y-6 lg:sticky lg:top-[calc(var(--nav-h)+32px)]">
            <Reveal>
              <Portrait />
            </Reveal>
            <Reveal delay={120} className="card p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Quick facts</p>
              <ul className="mt-4 space-y-3.5">
                {about.facts.map((f) => (
                  <li key={f.text} className="flex gap-3 text-[14.5px] leading-snug text-fg-2">
                    <Icon name={f.icon} size={17} className="mt-0.5 shrink-0 text-brand-blue" />
                    {f.text}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div>
            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <Reveal as="p" key={i} delay={i * 80} className={i === 0 ? 'text-[1.2rem] leading-relaxed text-white/90 sm:text-[1.3rem]' : 'lead'}>
                  {p}
                </Reveal>
              ))}
            </div>

            <Reveal delay={100} className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {about.stats.map((s) => (
                <div key={s.label} className="card px-5 py-5">
                  <p className="whitespace-nowrap text-[1.75rem] font-semibold leading-none tracking-tight text-white">{s.value}</p>
                  <p className="mt-2 text-[13px] text-fg-3">{s.label}</p>
                </div>
              ))}
            </Reveal>

            <div className="mt-12">
              <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">
                What I build
              </Reveal>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {about.pillars.map((pillar, i) => (
                  <Reveal key={pillar.title} delay={i * 90} className="card spotlight group p-5" onPointerMove={spot}>
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-brand-blue transition-colors group-hover:text-white">
                      <Icon name={pillar.icon} size={19} />
                    </span>
                    <h3 className="mt-4 text-[16px] font-semibold tracking-tight text-white">{pillar.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-fg-2">{pillar.body}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={80} className="mt-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Core strengths</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {about.strengths.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
