// Image pipeline: assets-src/* -> public/images/* (AVIF + WebP, responsive widths)
// and src/data/image-manifest.json (real output widths/heights for srcset + CLS-free layout).
//
// Usage: npm run images
// Add a new project screenshot as assets-src/projects/<slug>.jpg|png (16:10 works best), then re-run.

import sharp from 'sharp'
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'assets-src')
const outDir = path.join(root, 'public', 'images')

const jobs = [{ input: 'rohit-portrait.png', key: 'rohit-portrait', widths: [400, 720], aspect: 4 / 5, position: 'centre' }]

for (const file of (await readdir(path.join(srcDir, 'projects'))).sort()) {
  if (!/\.(png|jpe?g|webp)$/i.test(file)) continue
  jobs.push({
    input: `projects/${file}`,
    key: `projects/${file.replace(/\.[^.]+$/, '')}`,
    widths: [640, 1280],
    aspect: 16 / 10,
    position: 'top',
  })
}

const manifest = {}
for (const job of jobs) {
  const inputPath = path.join(srcDir, job.input)
  const meta = await sharp(inputPath).metadata()
  const widths = [...new Set(job.widths.map((w) => Math.min(w, meta.width)))]
  const outBase = path.join(outDir, job.key)
  await mkdir(path.dirname(outBase), { recursive: true })

  for (const width of widths) {
    const height = Math.round(width / job.aspect)
    const pipeline = sharp(inputPath).resize({ width, height, fit: 'cover', position: job.position })
    await pipeline.clone().avif({ quality: 55, effort: 6 }).toFile(`${outBase}-${width}.avif`)
    await pipeline.clone().webp({ quality: 80, effort: 6 }).toFile(`${outBase}-${width}.webp`)
  }
  const largest = widths[widths.length - 1]
  manifest[job.key] = { widths, width: largest, height: Math.round(largest / job.aspect) }
  console.log(`✓ ${job.key} -> ${widths.join(', ')}w`)
}

await writeFile(path.join(root, 'src', 'data', 'image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`\nWrote ${Object.keys(manifest).length} entries to src/data/image-manifest.json`)
