import { skillMap } from '../data/skills.js'
import { openProject } from '../lib/hooks.js'
import { ChapterHead, Reveal } from '../components/ui.jsx'

// One layer per level of a product, from the language up to the hardware it ships on.
const LAYER = {
  programming: { name: 'Languages', sub: 'What I write in' },
  frontend: { name: 'Interface', sub: 'What people touch' },
  backend: { name: 'API', sub: 'What answers' },
  database: { name: 'Data', sub: 'What remembers' },
  ai: { name: 'AI / ML', sub: 'What thinks' },
  embedded: { name: 'Hardware', sub: 'What moves' },
  tools: { name: 'Ship', sub: 'What gets it live' },
}
const ORDER = ['programming', 'frontend', 'backend', 'database', 'ai', 'embedded', 'tools']

const layers = ORDER.map((id) => {
  const g = skillMap.find((x) => x.id === id)
  const used = new Map()
  for (const s of g.skills) for (const u of s.usedIn) used.set(u.slug, u.title)
  const roles = new Set(g.skills.flatMap((s) => s.roles.map((r) => r.title)))
  return { ...g, ...LAYER[id], used: [...used], roles: [...roles] }
})

export default function Stack() {
  return (
    <section id="stack" className="chapter" aria-labelledby="stack-title">
      <div className="wrap">
        <ChapterHead
          id="stack"
          titleId="stack-title"
          lines={['Every', 'Layer']}
          lead="Not a wall of logos and no made-up percentages. Keep scrolling and the layers stack up: what I use at each level of a product, and where I have actually used it."
        />

        <ol className="relative">
          {layers.map((l, i) => (
            <li key={l.id} className="layer" style={{ '--i': i }}>
              <article
                className={`panel grid gap-6 p-5 sm:p-7 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 ${i % 2 ? '!bg-paper-2' : ''}`}
                aria-labelledby={`layer-${l.id}`}
              >
                <div>
                  <p className="mono text-accent">
                    {String(i).padStart(2, '0')} · {l.sub}
                  </p>
                  <h3 id={`layer-${l.id}`} className="display mt-2 text-[clamp(40px,5vw,64px)]">
                    {l.name}
                  </h3>
                </div>
                <div className="min-w-0">
                  <ul className="flex flex-wrap gap-x-2 gap-y-2">
                    {l.skills.map((s) => (
                      <li
                        key={s.name}
                        className="border-2 border-ink bg-paper px-3 py-1.5 text-[15px] font-medium"
                        title={s.note || (s.usedIn.length ? `Used in ${s.usedIn.map((u) => u.title).join(', ')}` : undefined)}
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                  {(l.used.length > 0 || l.roles.length > 0) && (
                    <p className="mono mt-5 text-[10.5px] leading-[1.9] text-ink-3">
                      <span className="text-ink">Used in </span>
                      {l.used.map(([slug, title], j) => (
                        <span key={slug}>
                          <button type="button" className="underline decoration-1 underline-offset-4 hover:text-accent" onClick={() => openProject(slug)}>
                            {title}
                          </button>
                          {j < l.used.length - 1 || l.roles.length ? ' · ' : ''}
                        </span>
                      ))}
                      {l.roles.map((r, j) => (
                        <span key={r}>
                          {r} (internship){j < l.roles.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>

        <Reveal className="mt-10">
          <p className="mono text-ink-3">Currently learning: system design · cloud architecture · Docker &amp; Kubernetes · GraphQL</p>
        </Reveal>
      </div>
    </section>
  )
}
