import { useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../data/profile.js'
import { useInView } from '../lib/hooks.js'
import { Reveal, SectionHeader } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

const USER = profile.githubUser
const CACHE_KEY = `gh-activity:${USER}:v1`
const TTL = 60 * 60 * 1000

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#663399',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
}

async function getJSON(url, signal, headers) {
  const res = await fetch(url, { signal, headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function summarise(user, repos, calendar) {
  const own = repos.filter((r) => !r.fork)
  const langCounts = {}
  own.forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1
  })
  const totalWithLang = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1
  const languages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count, pct: (count / totalWithLang) * 100 }))
  const recent = own
    .filter((r) => !r.archived)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      pushed: r.pushed_at,
      homepage: r.homepage,
    }))
  const stars = own.reduce((a, r) => a + (r.stargazers_count || 0), 0)

  let weeks = null
  let total = null
  if (calendar?.contributions?.length) {
    const days = calendar.contributions.slice(-371)
    total = calendar.total?.lastYear ?? days.reduce((a, d) => a + d.count, 0)
    weeks = []
    const firstDow = new Date(`${days[0].date}T00:00:00`).getDay()
    let week = new Array(firstDow).fill(null)
    days.forEach((d) => {
      week.push({ date: d.date, count: d.count, level: d.level })
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    })
    if (week.length) weeks.push(week)
  }

  return {
    user: {
      name: user.name || USER,
      login: user.login,
      avatar: user.avatar_url,
      url: user.html_url,
      repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      since: new Date(user.created_at).getFullYear(),
      bio: user.bio,
    },
    languages,
    recent,
    stars,
    weeks,
    total,
  }
}

function useGitHub(enabled) {
  const [state, setState] = useState({ status: 'idle' })
  useEffect(() => {
    if (!enabled) return
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
      if (cached && Date.now() - cached.t < TTL) {
        setState({ status: 'ready', data: cached.data })
        return
      }
    } catch {
      /* storage unavailable */
    }
    const ctrl = new AbortController()
    setState({ status: 'loading' })
    ;(async () => {
      const gh = { Accept: 'application/vnd.github+json' }
      const [user, repos] = await Promise.all([
        getJSON(`https://api.github.com/users/${USER}`, ctrl.signal, gh),
        getJSON(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, ctrl.signal, gh),
      ])
      let calendar = null
      try {
        calendar = await getJSON(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, ctrl.signal)
      } catch {
        /* the contribution calendar is optional */
      }
      const data = summarise(user, repos, calendar)
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }))
      } catch {
        /* ignore */
      }
      setState({ status: 'ready', data })
    })().catch((err) => {
      if (err.name !== 'AbortError') setState({ status: 'error' })
    })
    return () => ctrl.abort()
  }, [enabled])
  return state
}

const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days < 1) return 'today'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`
}

function Heatmap({ weeks, total }) {
  const scroller = useRef(null)
  const [tip, setTip] = useState(null)
  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth
  }, [weeks])
  const cell = 11
  const gap = 3
  const step = cell + gap
  const width = weeks.length * step
  const height = 7 * step

  // One <path> per intensity level keeps the DOM tiny (5 nodes instead of ~370 rects).
  const paths = useMemo(() => {
    const d = ['', '', '', '', '']
    weeks.forEach((w, wi) =>
      w.forEach((day, di) => {
        if (!day) return
        const x = wi * step
        const y = di * step
        d[Math.min(4, day.level)] +=
          `M${x + 2.5} ${y}h${cell - 5}a2.5 2.5 0 0 1 2.5 2.5v${cell - 5}a2.5 2.5 0 0 1-2.5 2.5h-${cell - 5}a2.5 2.5 0 0 1-2.5-2.5v-${cell - 5}a2.5 2.5 0 0 1 2.5-2.5Z`
      }),
    )
    return d
  }, [weeks, step])

  const months = useMemo(() => {
    const out = []
    let last = -1
    weeks.forEach((w, i) => {
      const day = w.find(Boolean)
      if (!day) return
      const m = new Date(`${day.date}T00:00:00`).getMonth()
      if (m !== last) {
        out.push({ i, label: new Date(`${day.date}T00:00:00`).toLocaleString('en', { month: 'short' }) })
        last = m
      }
    })
    return out.filter((m, idx) => idx === 0 || m.i - out[idx - 1].i > 2)
  }, [weeks])

  const onMove = (e) => {
    const svg = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - svg.left
    const y = e.clientY - svg.top - 18
    const wi = Math.floor(x / step)
    const di = Math.floor(y / step)
    const day = weeks[wi]?.[di]
    if (!day || y < 0) return setTip(null)
    setTip({ x: wi * step + cell / 2, y: di * step + 18, text: `${day.count} contribution${day.count === 1 ? '' : 's'} on ${fmtDate(day.date)}` })
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[15px] text-fg-2">
          <span className="text-[1.6rem] font-semibold tracking-tight text-white">{total?.toLocaleString('en-IN')}</span> contributions in the last year
        </p>
        <div className="flex items-center gap-1.5 text-[11.5px] text-fg-3" aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <svg key={l} width="11" height="11">
              <rect width="11" height="11" rx="2.5" className={`heat-${l}`} />
            </svg>
          ))}
          More
        </div>
      </div>
      <div ref={scroller} className="relative mt-4 overflow-x-auto pb-2">
        <div className="relative" style={{ width }}>
          <svg
            width={width}
            height={height + 18}
            role="img"
            aria-label={`GitHub contribution calendar: ${total} contributions in the last year`}
            onPointerMove={onMove}
            onPointerLeave={() => setTip(null)}
          >
            {months.map((m) => (
              <text key={m.i} x={m.i * step} y="10" fill="#7c8394" fontSize="10" fontFamily="var(--font-mono)">
                {m.label}
              </text>
            ))}
            <g transform="translate(0 18)">{paths.map((d, level) => (d ? <path key={level} d={d} className={`heat-${level}`} /> : null))}</g>
          </svg>
          {tip && (
            <span
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-white/10 bg-[#11141d] px-2.5 py-1.5 text-[11.5px] text-white shadow-xl"
              style={{ left: Math.min(Math.max(tip.x, 90), width - 90), top: tip.y - 6 }}
              role="status"
            >
              {tip.text}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GitHubActivity() {
  const [ref, inView] = useInView({ rootMargin: '300px 0px' })
  const gh = useGitHub(inView)
  const data = gh.data

  return (
    <section id="github" ref={ref} className="section" aria-labelledby="github-title">
      <div className="container-x relative">
        <SectionHeader
          id="github-title"
          eyebrow="GitHub activity"
          title={
            <>
              Code, <span className="text-gradient">in the open.</span>
            </>
          }
          lead="Live from the GitHub API: what I've been pushing lately and the languages across my public repositories."
        />

        {gh.status === 'error' ? (
          <Reveal className="card flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-fg-2">
              <Icon name="alert" size={18} className="text-[#ffc25c]" />
              Live GitHub data couldn&apos;t be loaded right now (the public API may be rate-limited).
            </p>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
              <Icon name="github" size={15} /> Open GitHub profile
            </a>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]">
            {/* profile + languages */}
            <Reveal className="card flex min-w-0 flex-col p-6 sm:p-7">
              <div className="flex items-center gap-4">
                {data ? (
                  <img
                    src={data.user.avatar}
                    alt=""
                    width="56"
                    height="56"
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-14 rounded-2xl border border-white/10"
                  />
                ) : (
                  <span className="skeleton h-14 w-14 !rounded-2xl" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold text-white">{data?.user.name || profile.name}</p>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] text-fg-2 hover:text-white">
                    @{USER}
                  </a>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-2">
                {[
                  ['Repos', data?.user.repos],
                  ['Followers', data?.user.followers],
                  ['Since', data?.user.since],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3">
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-3">{label}</dt>
                    <dd className="mt-1 text-[1.2rem] font-semibold tracking-tight text-white">
                      {value ?? <span className="skeleton inline-block h-5 w-10 align-middle" />}
                    </dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">Top languages · by repository</h3>
              {data ? (
                <>
                  <div
                    className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-white/5"
                    role="img"
                    aria-label={data.languages.map((l) => `${l.name} ${Math.round(l.pct)}%`).join(', ')}
                  >
                    {data.languages.map((l) => (
                      <span key={l.name} style={{ width: `${l.pct}%`, background: LANG_COLORS[l.name] || '#8a93ff' }} />
                    ))}
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                    {data.languages.map((l) => (
                      <li key={l.name} className="flex items-center gap-2 text-[13.5px] text-fg-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[l.name] || '#8a93ff' }} aria-hidden="true" />
                        {l.name}
                        <span className="ml-auto font-mono text-[11.5px] text-fg-3">{Math.round(l.pct)}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="mt-4 space-y-3">
                  <span className="skeleton block h-2.5 w-full" />
                  <span className="skeleton block h-16 w-full" />
                </div>
              )}
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm mt-auto self-start !mt-8">
                <Icon name="github" size={15} />
                View profile
              </a>
            </Reveal>

            <div className="grid min-w-0 gap-4">
              <Reveal delay={80} className="card min-w-0 p-6 sm:p-7">
                {data?.weeks ? (
                  <Heatmap weeks={data.weeks} total={data.total} />
                ) : data ? (
                  <p className="text-[14.5px] text-fg-2">The contribution calendar is unavailable right now. See it on GitHub.</p>
                ) : (
                  <div className="space-y-4">
                    <span className="skeleton block h-7 w-64" />
                    <span className="skeleton block h-[100px] w-full" />
                  </div>
                )}
              </Reveal>

              <Reveal delay={140} className="min-w-0">
                <h3 className="sr-only">Recently updated repositories</h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {(data?.recent || Array.from({ length: 4 }, () => null)).slice(0, 4).map((r, i) =>
                    r ? (
                      <li key={r.name}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card group flex h-full flex-col p-5 transition-colors hover:border-white/15"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="flex min-w-0 items-center gap-2 font-mono text-[13.5px] font-medium text-white">
                              <Icon name="code" size={15} className="shrink-0 text-fg-3" />
                              <span className="truncate">{r.name}</span>
                            </p>
                            <Icon
                              name="arrowUpRight"
                              size={15}
                              className="shrink-0 text-fg-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                            />
                          </div>
                          <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-fg-2">{r.description || 'No description provided.'}</p>
                          <div className="mt-4 flex items-center gap-4 text-[12px] text-fg-3">
                            {r.language && (
                              <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[r.language] || '#8a93ff' }} aria-hidden="true" />
                                {r.language}
                              </span>
                            )}
                            {r.stars > 0 && (
                              <span className="flex items-center gap-1">
                                <Icon name="star" size={13} /> {r.stars}
                              </span>
                            )}
                            <span className="ml-auto font-mono">Updated {timeAgo(r.pushed)}</span>
                          </div>
                        </a>
                      </li>
                    ) : (
                      <li key={i} className="card p-5">
                        <span className="skeleton block h-4 w-40" />
                        <span className="skeleton mt-3 block h-10 w-full" />
                      </li>
                    ),
                  )}
                </ul>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
