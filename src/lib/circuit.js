// Deterministic PCB-style circuit generator shared by the CSS poster (SVG) and the WebGL scene.
// Coordinates are normalised to a board of [-1, 1] on both axes, chip centred at the origin.

export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SIDES = [
  { out: [1, 0], along: [0, 1] }, // east
  { out: [0, 1], along: [-1, 0] }, // south (y down in SVG)
  { out: [-1, 0], along: [0, -1] }, // west
  { out: [0, -1], along: [1, 0] }, // north
]

/**
 * @param {object} opts
 * @param {number} opts.pinsPerSide  traces per chip side
 * @param {number} opts.half         chip half-size (normalised)
 * @param {number} opts.seed
 * @returns {{ points: [number, number][], length: number }[]}
 */
export function generateCircuit({ pinsPerSide = 10, half = 0.2, seed = 7, reach = 0.96 } = {}) {
  const rand = mulberry32(seed)
  const traces = []
  const D = Math.SQRT1_2

  SIDES.forEach((side) => {
    for (let i = 0; i < pinsPerSide; i++) {
      const t = pinsPerSide === 1 ? 0 : i / (pinsPerSide - 1) // 0..1 along the side
      const offset = (t - 0.5) * 2 * half * 0.82
      const fan = Math.sign(offset) || (rand() > 0.5 ? 1 : -1) // bend away from the side centre
      const start = [side.out[0] * (half + 0.02) + side.along[0] * offset, side.out[1] * (half + 0.02) + side.along[1] * offset]
      const pts = [start]
      let [x, y] = start

      // segment 1: straight out
      const l1 = 0.03 + rand() * 0.1 + Math.abs(t - 0.5) * 0.06
      x += side.out[0] * l1
      y += side.out[1] * l1
      pts.push([x, y])

      // segment 2: 45° fan-out bend
      const l2 = (0.04 + rand() * 0.16) * (0.4 + Math.abs(t - 0.5) * 1.6)
      x += (side.out[0] * D + side.along[0] * D * fan) * l2
      y += (side.out[1] * D + side.along[1] * D * fan) * l2
      pts.push([x, y])

      // segment 3: straight out again
      const l3 = 0.08 + rand() * 0.42
      x += side.out[0] * l3
      y += side.out[1] * l3
      pts.push([x, y])

      // optional segment 4: another 45° jog for variety
      if (rand() > 0.55) {
        const l4 = 0.03 + rand() * 0.12
        const dir = rand() > 0.5 ? fan : -fan
        x += (side.out[0] * D + side.along[0] * D * dir) * l4
        y += (side.out[1] * D + side.along[1] * D * dir) * l4
        pts.push([x, y])
        const l5 = 0.04 + rand() * 0.2
        x += side.out[0] * l5
        y += side.out[1] * l5
        pts.push([x, y])
      }

      // keep within the board radius
      const r = Math.hypot(x, y)
      if (r > reach) {
        const k = reach / r
        pts[pts.length - 1] = [x * k, y * k]
      }

      let length = 0
      for (let p = 1; p < pts.length; p++) length += Math.hypot(pts[p][0] - pts[p - 1][0], pts[p][1] - pts[p - 1][1])
      traces.push({ points: pts, length })
    }
  })
  return traces
}
