import manifest from '../data/image-manifest.json'

/** Responsive source sets for an optimised image key (see scripts/optimize-images.mjs). */
export function imageSources(key) {
  const entry = manifest[key]
  if (!entry) return null
  const base = `/images/${key}`
  const set = (ext) => entry.widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ')
  return {
    avif: set('avif'),
    webp: set('webp'),
    fallback: `${base}-${entry.widths[0]}.webp`,
    largest: `${base}-${entry.width}.webp`,
    width: entry.width,
    height: entry.height,
  }
}
