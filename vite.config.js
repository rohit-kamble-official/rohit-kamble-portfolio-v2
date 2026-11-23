import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// Public site URL used for canonical/OG tags, robots.txt and sitemap.xml.
// Override per deployment with the SITE_URL environment variable (e.g. in Vercel).
const DEFAULT_SITE_URL = 'https://rohit-kamble-portfolio-v2.vercel.app'

/** Injects the site URL into index.html and emits robots.txt + sitemap.xml at build time. */
function seo(siteUrl) {
  return {
    name: 'portfolio-seo',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
    generateBundle(options) {
      if (options.format !== 'es' || this.environment?.config?.build?.ssr) return
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
          `</urlset>\n`,
      })
    },
  }
}

/** Serves api/contact.js during `npm run dev`, mimicking the Vercel Node.js function runtime. */
function devApi() {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const raw = Buffer.concat(chunks).toString('utf8')
          try {
            req.body = raw ? JSON.parse(raw) : {}
          } catch {
            req.body = raw
          }
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify(data))
          }
          const modUrl = `${pathToFileURL(path.resolve('api/contact.js')).href}?t=${Date.now()}`
          const { default: handler } = await import(modUrl)
          await handler(req, res)
        } catch (err) {
          server.config.logger.error(`[dev-api] ${err?.stack || err}`)
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, error: 'dev_api_error' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Make server-side secrets from .env.local available to the dev API middleware.
  for (const key of ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }
  const siteUrl = (env.SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), seo(siteUrl), devApi()],
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 900,
    },
  }
})
