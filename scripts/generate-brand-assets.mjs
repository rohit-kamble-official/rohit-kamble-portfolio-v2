// Generates favicon PNGs/ICO from public/favicon.svg and the 1200x630 Open Graph image
// from scripts/og/og-template.html (rendered with a local Chrome/Edge in headless mode).
//
// Usage: node scripts/generate-brand-assets.mjs
// Optional: set BROWSER_PATH to a Chrome/Edge/Chromium executable.

import sharp from 'sharp'
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = (...p) => path.join(root, 'public', ...p)

// ---------- Icons ----------
const svg = await readFile(pub('favicon.svg'))
const png = (size) =>
  sharp(svg, { density: 72 * (size / 64) * 2 })
    .resize(size, size)
    .png({ compressionLevel: 9 })

await png(180).toFile(pub('apple-touch-icon.png'))
await png(192).toFile(pub('icon-192.png'))
await png(512).toFile(pub('icon-512.png'))

// Maskable icon: monogram inside the 80% safe zone on a solid background.
const inner = await sharp(svg, { density: 900 }).resize(384, 384).png().toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#07080D' } })
  .composite([{ input: inner, gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toFile(pub('icon-maskable-512.png'))

// favicon.ico containing a single 32x32 PNG entry (supported by all modern browsers).
const ico32 = await png(32).toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // image count
header.writeUInt8(32, 6) // width
header.writeUInt8(32, 7) // height
header.writeUInt8(0, 8) // palette
header.writeUInt8(0, 9) // reserved
header.writeUInt16LE(1, 10) // color planes
header.writeUInt16LE(32, 12) // bits per pixel
header.writeUInt32LE(ico32.length, 14) // size of image data
header.writeUInt32LE(22, 18) // offset of image data
await writeFile(pub('favicon.ico'), Buffer.concat([header, ico32]))
console.log('✓ icons')

// ---------- Open Graph image ----------
const candidates = [
  process.env.BROWSER_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const browser = candidates.find((p) => existsSync(p))
if (!browser) {
  console.warn('! No Chrome/Edge found, skipping OG image. Set BROWSER_PATH to generate it.')
  process.exit(0)
}

const b64 = async (p) => (await readFile(path.join(root, p))).toString('base64')
const portrait = (await sharp(path.join(root, 'assets-src/rohit-portrait.png')).resize(700).jpeg({ quality: 88 }).toBuffer()).toString('base64')
let html = await readFile(path.join(root, 'scripts/og/og-template.html'), 'utf8')
html = html
  .replace('__INTER__', await b64('public/fonts/inter-var-latin.woff2'))
  .replace('__MONO__', await b64('public/fonts/jetbrains-mono-500-latin.woff2'))
  .replace('__PORTRAIT__', portrait)

const dir = await mkdtemp(path.join(tmpdir(), 'og-'))
const htmlPath = path.join(dir, 'og.html')
const shotPath = path.join(dir, 'og.png')
await writeFile(htmlPath, html)
execFileSync(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    `--user-data-dir=${path.join(dir, 'profile')}`,
    '--window-size=1200,630',
    '--force-device-scale-factor=1',
    '--virtual-time-budget=4000',
    `--screenshot=${shotPath}`,
    pathToFileURL(htmlPath).href,
  ],
  { stdio: 'ignore' },
)
await sharp(shotPath).resize(1200, 630, { fit: 'cover', position: 'top' }).jpeg({ quality: 86, mozjpeg: true }).toFile(pub('og-image.jpg'))
await rm(dir, { recursive: true, force: true })
console.log('✓ og-image.jpg')
