// Verifies every external link in the portfolio data (projects, profile, certifications).
// Usage: npm run check:links
import { profile } from '../src/data/profile.js'
import { projects } from '../src/data/projects.js'
import { certifications } from '../src/data/credentials.js'

const urls = new Map()
const add = (url, where) => url && /^https?:/.test(url) && urls.set(url, [...(urls.get(url) || []), where])

add(profile.github, 'profile.github')
add(profile.linkedin, 'profile.linkedin')
add(`${profile.github}?tab=repositories`, 'projects: all repositories')
projects.forEach((p) => {
  add(p.links.live, `${p.slug}.live`)
  add(p.links.github, `${p.slug}.github`)
})
certifications.forEach((c) => add(c.url, `cert:${c.id}`))

// Sites that refuse automated requests: a non-2xx here is expected, verify by hand.
const BOT_BLOCKED = [/linkedin\.com/]

async function check(url) {
  const opts = { redirect: 'follow', signal: AbortSignal.timeout(60000), headers: { 'User-Agent': 'Mozilla/5.0 (link-check)' } }
  try {
    let res = await fetch(url, { ...opts, method: 'HEAD' })
    if (res.status === 405 || res.status === 403 || res.status >= 500) res = await fetch(url, { ...opts, method: 'GET' })
    return res.status
  } catch (err) {
    return err.name === 'TimeoutError' ? 'timeout' : `error: ${err.message}`
  }
}

let failed = 0
const results = await Promise.all([...urls.keys()].map(async (url) => [url, await check(url)]))
for (const [url, status] of results) {
  const ok = typeof status === 'number' && status < 400
  const blocked = !ok && BOT_BLOCKED.some((re) => re.test(url))
  if (!ok && !blocked) failed++
  console.log(`${ok ? '✓' : blocked ? '~' : '✗'} ${String(status).padEnd(8)} ${url}  (${urls.get(url).join(', ')})`)
}
console.log(`\n${results.length} links checked, ${failed} failed${failed ? '' : ' (~ = site blocks bots; check manually)'}`)
process.exitCode = failed ? 1 : 0
