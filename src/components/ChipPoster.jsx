import { useMemo } from 'react'
import { generateCircuit } from '../lib/circuit.js'

// Lightweight CSS-3D version of the hero scene. Server-rendered, so it appears instantly,
// and it is the permanent visual for reduced-motion users and devices without WebGL.
export default function ChipPoster({ hidden = false }) {
  const traces = useMemo(() => generateCircuit({ pinsPerSide: 8, half: 0.2, seed: 7 }), [])
  const toSvg = ([x, y]) => `${(x * 50 + 50).toFixed(2)},${(y * 50 + 50).toFixed(2)}`

  return (
    <div className="chip-poster" data-hidden={hidden ? 'true' : 'false'} aria-hidden="true">
      <div className="chip-shift">
        <div className="hero-orb" />
        <div className="chip-plane">
          <svg className="chip-traces" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="trace-grad" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
                <stop offset="0.2" stopColor="#8fb0ff" />
                <stop offset="0.65" stopColor="#8b74ff" stopOpacity="0.7" />
                <stop offset="1" stopColor="#8b74ff" stopOpacity="0" />
              </radialGradient>
            </defs>
            {traces.map((t, i) => (
              <polyline key={`t${i}`} className="trace" points={t.points.map(toSvg).join(' ')} vectorEffect="non-scaling-stroke" />
            ))}
            {traces.map((t, i) =>
              i % 3 === 0 ? (
                <polyline
                  key={`p${i}`}
                  className="pulse"
                  points={t.points.map(toSvg).join(' ')}
                  pathLength="1"
                  style={{ '--delay': `${(i * 0.37) % 3.6}s` }}
                  vectorEffect="non-scaling-stroke"
                />
              ) : null,
            )}
            {traces.map((t, i) => {
              const end = t.points[t.points.length - 1]
              return (
                <circle
                  key={`v${i}`}
                  className="via"
                  cx={(end[0] * 50 + 50).toFixed(2)}
                  cy={(end[1] * 50 + 50).toFixed(2)}
                  r="0.42"
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </svg>
          <div className="chip-body">
            <div className="chip-die" />
          </div>
        </div>
      </div>
    </div>
  )
}
