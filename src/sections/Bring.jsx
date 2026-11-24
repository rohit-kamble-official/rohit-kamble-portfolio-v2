import { about } from '../data/profile.js'
import { openProject } from '../lib/hooks.js'
import { ChapterHead, Reveal } from '../components/ui.jsx'

// Each strength is backed by something already built.
const PROOF = [
  [
    ['clearlaw', 'ClearLaw'],
    ['workspaceos', 'WorkspaceOS'],
  ],
  [
    ['wind-turbine-analytics', 'Wind Turbine Analytics'],
    ['plant-disease-detection', 'Plant Disease Detection'],
    ['leetcode-ai-assistant', 'LeetCode AI Assistant'],
  ],
  [
    ['substation-sentinel', 'Substation Sentinel'],
    ['esp32-smart-rc-car', 'ESP32 RC Car'],
  ],
]

export default function Bring() {
  const items = [...about.pillars.map((p, i) => ({ ...p, proof: PROOF[i] })), { title: 'Team & leadership', body: 'Agile delivery with designers and engineers, code reviews, and running IEEE events for 150+ attendees.', proof: null }]
  return (
    <section id="bring" className="chapter" aria-labelledby="bring-title">
      <div className="wrap">
        <ChapterHead
          id="bring"
          titleId="bring-title"
          lines={['What I', 'Bring']}
          lead="Four things I can do for a team from day one, each backed by something I have already built."
        />

        <ol className="border-t-2 border-ink">
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} className="grid gap-4 border-b-2 border-ink py-8 md:grid-cols-[90px_minmax(0,1fr)_minmax(0,1.1fr)] md:items-baseline md:gap-10">
              <span className="font-display text-[40px] leading-none text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="display text-[clamp(36px,4.6vw,60px)]">{it.title}</h3>
              <div>
                <p className="text-[16.5px] leading-relaxed text-ink-2">{it.body}</p>
                <p className="mono mt-4 text-[10.5px] leading-[1.9] text-ink-3">
                  <span className="text-ink">Proof </span>
                  {it.proof
                    ? it.proof.map(([slug, t], j) => (
                        <span key={slug}>
                          <button type="button" className="underline decoration-1 underline-offset-4 hover:text-accent" onClick={() => openProject(slug)}>
                            {t}
                          </button>
                          {j < it.proof.length - 1 ? ' · ' : ''}
                        </span>
                      ))
                    : 'Zonova Creative Agency · IEEE SBJITMR'}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12">
          <a href="#contact" className="btn btn-ink">
            Start a conversation <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
