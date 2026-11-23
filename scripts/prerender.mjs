// Build step 3/3: render the React app to static HTML and inject it into dist/index.html.
// Content is visible before JavaScript runs (fast LCP, crawlable), then React hydrates it.
import { readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js')
const htmlPath = path.join(root, 'dist', 'index.html')

const { render } = await import(pathToFileURL(ssrEntry).href)
const template = await readFile(htmlPath, 'utf8')
if (!template.includes('<!--app-html-->')) throw new Error('dist/index.html is missing the <!--app-html--> placeholder')

const appHtml = await render()
let html = template.replace('<!--app-html-->', appHtml)

// Inline the (single, small) stylesheet to remove a render-blocking request on first load.
const cssLink = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = await readFile(path.join(root, 'dist', cssLink[1]), 'utf8')
  html = html.replace(cssLink[0], () => `<style>${css}</style>`)
  console.log(`✓ inlined ${cssLink[1]} (${(css.length / 1024).toFixed(1)} KB)`)
}
await writeFile(htmlPath, html)
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`✓ prerendered dist/index.html (${(appHtml.length / 1024).toFixed(1)} KB of markup)`)
