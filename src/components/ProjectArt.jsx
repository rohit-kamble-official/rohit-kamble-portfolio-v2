import { useId } from 'react'

// Illustrated visuals for projects without public screenshots.
// Stylised line art only: no fake UI numbers or invented results.

export const ACCENTS = {
  blue: '#6f9bff',
  violet: '#a98bff',
  cyan: '#42d9ff',
  green: '#3ee6a0',
  amber: '#ffc25c',
  pink: '#ff7ac6',
  teal: '#2fd6c3',
  indigo: '#8a93ff',
}

function Leaf({ s, f }) {
  return (
    <g>
      <path d="M150 300C150 190 230 110 360 92c-6 120-70 214-210 208Z" stroke={s} strokeWidth="2.5" fill={f} />
      <path
        d="M150 300C210 240 270 176 352 100M215 236l-6-58M250 200l-4-56M285 166l2-46M236 216l52 6M268 182l48 4M196 258l44 10"
        stroke={s}
        strokeWidth="1.6"
        opacity=".7"
      />
      <circle cx="250" cy="170" r="9" fill={s} opacity=".35" />
      <circle cx="292" cy="146" r="6" fill={s} opacity=".45" />
      <circle cx="226" cy="214" r="7" fill={s} opacity=".3" />
      {/* scan brackets */}
      <path d="M200 120h-24v24M330 120h24v24M200 262h-24v-24M330 262h24v-24" stroke="#fff" strokeWidth="2.5" opacity=".85" />
      <line className="art-scan" x1="180" y1="190" x2="350" y2="190" stroke={s} strokeWidth="2" opacity=".9" />
      {/* network */}
      <g transform="translate(420 120)" stroke={s} strokeWidth="1.4" opacity=".9">
        {[0, 1, 2].map((c) =>
          [0, 1, 2, 3].slice(0, c === 1 ? 4 : 3).map((r) => {
            const x = c * 60
            const y = (c === 1 ? r * 40 : r * 48 + 12) + 10
            return <circle key={`${c}${r}`} cx={x} cy={y} r="7" fill="#0b0d14" />
          }),
        )}
        <path
          d="M7 22l46-20M7 22l46 20M7 22l46 60M7 22l46 100M7 70l46-68M7 70l46-28M7 70l46 12M7 70l46 52M7 118l46-116M7 118l46-76M7 118l46-36M7 118l46 4M67 2l46 20M67 42l46-20M67 82l46-12M67 122l46-4M67 2l46 116M67 42l46 28M67 82l46 36M67 122l46-52"
          opacity=".35"
        />
      </g>
      <rect x="410" y="290" width="150" height="40" rx="12" stroke={s} strokeWidth="1.5" fill="#0b0d14" />
      <circle cx="432" cy="310" r="6" fill={s} />
      <path d="M448 304h70M448 316h44" stroke="#fff" strokeOpacity=".5" strokeWidth="3" />
    </g>
  )
}

function Car({ s, f }) {
  return (
    <g>
      {/* phone controller */}
      <rect x="430" y="96" width="120" height="210" rx="22" stroke={s} strokeWidth="2" fill="#0b0d14" />
      <circle cx="490" cy="168" r="34" stroke={s} strokeWidth="1.6" opacity=".9" />
      <path d="M490 140v-6M490 202v-6M462 168h-6M524 168h-6" stroke="#fff" strokeOpacity=".8" strokeWidth="3" />
      <circle cx="490" cy="168" r="10" fill={s} opacity=".85" />
      <rect x="452" y="226" width="34" height="18" rx="9" stroke={s} strokeOpacity=".7" />
      <rect x="494" y="226" width="34" height="18" rx="9" fill={s} opacity=".5" />
      <path d="M458 270h64" stroke="#fff" strokeOpacity=".35" strokeWidth="3" />
      {/* websocket link */}
      <path d="M420 200C380 200 380 210 330 210" stroke={s} strokeWidth="2" strokeDasharray="6 8" opacity=".9" />
      {/* car top-down */}
      <g transform="translate(110 104)">
        <rect x="40" y="0" width="140" height="210" rx="34" stroke={s} strokeWidth="2.5" fill={f} />
        {[
          [18, 30],
          [18, 140],
          [182, 30],
          [182, 140],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="20" height="44" rx="6" fill="#0b0d14" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
        ))}
        <rect x="70" y="58" width="80" height="60" rx="10" stroke={s} strokeOpacity=".6" />
        <circle cx="110" cy="88" r="17" stroke="#fff" strokeOpacity=".85" strokeWidth="2" />
        <circle cx="110" cy="88" r="6" fill={s} />
        <path d="M78 8h20M122 8h20" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".9" />
        <path d="M80 150h60M80 166h60M80 182h60" stroke={s} strokeOpacity=".45" strokeWidth="2" />
        <path d="M86 -18a36 36 0 0 1 48 0M76 -32a52 52 0 0 1 68 0" stroke={s} strokeWidth="2" opacity=".75" />
      </g>
    </g>
  )
}

function Sofa({ s, f }) {
  return (
    <g>
      {/* room perspective */}
      <g stroke="#fff" strokeOpacity=".2" strokeWidth="1.5">
        <rect x="200" y="70" width="240" height="170" />
        <path d="M40 360 200 240M600 360 440 240M40 40l160 30M600 40 440 70" />
        <path d="M120 300h400M160 270h320" strokeOpacity=".08" />
      </g>
      <rect x="250" y="96" width="70" height="80" rx="4" stroke={s} strokeOpacity=".55" />
      <path d="M285 96v80M250 136h70" stroke={s} strokeOpacity=".35" />
      {/* sofa */}
      <g transform="translate(230 200)">
        <path d="M20 20c0-12 10-22 22-22h126c12 0 22 10 22 22v36H20Z" stroke={s} strokeWidth="2.5" fill={f} />
        <path d="M0 46c0-10 8-18 18-18s18 8 18 18v40h138V46c0-10 8-18 18-18s18 8 18 18v58H0Z" stroke={s} strokeWidth="2.5" fill="#0d1018" />
        <path d="M18 104v12M192 104v12" stroke={s} strokeWidth="3" />
        <path d="M105 2v54" stroke={s} strokeOpacity=".4" />
      </g>
      <rect x="216" y="186" width="238" height="146" rx="8" stroke="#fff" strokeOpacity=".7" strokeDasharray="7 7" />
      {/* sparkles */}
      <path d="M470 168l5 13 13 5-13 5-5 13-5-13-13-5 13-5Z" fill={s} />
      <path d="M200 150l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#fff" opacity=".8" />
      {/* product photo card */}
      <g transform="translate(490 250)">
        <rect width="96" height="80" rx="12" stroke={s} strokeWidth="1.6" fill="#0b0d14" />
        <path d="M18 52c0-6 5-10 10-10h40c5 0 10 4 10 10v8H18Z" stroke={s} strokeOpacity=".8" />
        <path d="M14 22h40" stroke="#fff" strokeOpacity=".45" strokeWidth="3" />
      </g>
      <path d="M486 270c-20-6-30-10-40-20" stroke={s} strokeWidth="1.8" strokeDasharray="4 6" />
    </g>
  )
}

function Bed({ s, f }) {
  return (
    <g>
      <g stroke="#fff" strokeOpacity=".18" strokeWidth="1.5">
        <path d="M40 330 170 250h300l130 80" />
        <path d="M170 250V70M470 250V70" strokeOpacity=".1" />
      </g>
      {/* bed */}
      <g transform="translate(150 140)">
        <rect x="20" y="0" width="280" height="70" rx="14" stroke={s} strokeOpacity=".7" strokeWidth="2" fill="#0d1018" />
        <rect x="46" y="44" width="90" height="40" rx="12" stroke="#fff" strokeOpacity=".6" fill="#10131c" />
        <rect x="184" y="44" width="90" height="40" rx="12" stroke="#fff" strokeOpacity=".6" fill="#10131c" />
        <path d="M0 96h320l-20 100H20Z" stroke={s} strokeWidth="2.5" fill={f} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M${34 + i * 42} 100l-${6 + i} 92`} stroke={s} strokeOpacity=".35" strokeWidth="6" />
        ))}
        <path d="M20 196v18M300 196v18" stroke={s} strokeWidth="3" />
      </g>
      {/* swatches */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${56} ${60 + i * 62})`}>
          <rect width="48" height="48" rx="10" stroke={i === 0 ? '#fff' : s} strokeOpacity={i === 0 ? 0.9 : 0.6} strokeWidth="1.6" fill="#0b0d14" />
          {i === 0 && [0, 1, 2].map((k) => <path key={k} d={`M${10 + k * 12} 6v36`} stroke={s} strokeOpacity=".5" strokeWidth="5" />)}
          {i === 1 && <circle cx="24" cy="24" r="10" stroke={s} strokeOpacity=".7" strokeWidth="3" />}
          {i === 2 && <path d="M6 30l12-12 12 12 12-12" stroke={s} strokeOpacity=".7" strokeWidth="3" />}
        </g>
      ))}
      {/* QR */}
      <g transform="translate(500 60)">
        <rect width="88" height="88" rx="12" stroke={s} strokeWidth="1.6" fill="#0b0d14" />
        {[
          [12, 12],
          [56, 12],
          [12, 56],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="20" height="20" rx="3" stroke="#fff" strokeWidth="3" />
            <rect x={x + 7} y={y + 7} width="6" height="6" fill="#fff" />
          </g>
        ))}
        {[
          [44, 14],
          [44, 30],
          [60, 44],
          [72, 56],
          [44, 60],
          [56, 70],
          [72, 72],
          [30, 44],
          [14, 44],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" fill={s} />
        ))}
      </g>
      <g transform="translate(500 170)">
        <rect width="88" height="58" rx="10" stroke="#fff" strokeOpacity=".25" fill="#0b0d14" />
        <path d="M12 18h40M12 32h56M12 44h28" stroke={s} strokeOpacity=".7" strokeWidth="3" />
      </g>
    </g>
  )
}

function Network({ s, f }) {
  const nodes = [
    [320, 200, 16],
    [180, 120, 9],
    [460, 110, 9],
    [150, 270, 9],
    [480, 290, 9],
    [320, 80, 8],
    [320, 330, 8],
    [90, 190, 6],
    [560, 200, 6],
  ]
  return (
    <g>
      <g stroke="#fff" strokeOpacity=".07">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 50}h640`} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 50} 0v400`} />
        ))}
      </g>
      {nodes.slice(1).map(([x, y], i) => (
        <path key={i} d={`M320 200L${x} ${y}`} stroke={s} strokeOpacity=".45" strokeWidth="1.6" strokeDasharray={i % 2 ? '4 6' : undefined} />
      ))}
      <path d="M180 120 90 190M460 110l100 90M150 270l-60-80M480 290l80-90" stroke="#fff" strokeOpacity=".18" />
      {nodes.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r + 8} fill={s} opacity=".08" />
          <circle cx={x} cy={y} r={r} fill="#0b0d14" stroke={i === 0 ? '#fff' : s} strokeWidth={i === 0 ? 2.5 : 2} />
        </g>
      ))}
      <path d="M320 186v28M306 200h28" stroke={s} strokeWidth="2.5" />
      {[
        [180, 96],
        [460, 86],
        [480, 266],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 16}c-9 0-15 6-15 14 0 10 15 22 15 22s15-12 15-22c0-8-6-14-15-14Z`} fill={s} opacity=".85" />
      ))}
    </g>
  )
}

function Chart({ s, f }) {
  const candles = [
    [80, 230, 270, 210, 290],
    [120, 220, 240, 200, 260],
    [160, 200, 230, 185, 245],
    [200, 210, 180, 165, 225],
    [240, 175, 195, 160, 210],
    [280, 160, 185, 150, 200],
    [320, 170, 140, 125, 185],
    [360, 135, 150, 120, 165],
    [400, 140, 115, 100, 150],
    [440, 110, 125, 95, 140],
    [480, 120, 92, 80, 130],
    [520, 95, 80, 66, 106],
  ]
  return (
    <g>
      <path d="M70 330h500M70 80v250" stroke="#fff" strokeOpacity=".15" />
      <path d="M80 270C160 240 220 200 300 170S440 110 540 78V330H80Z" fill={f} opacity=".8" />
      <path d="M80 270C160 240 220 200 300 170S440 110 540 78" stroke={s} strokeWidth="2.5" />
      {candles.map(([x, o, c, h, l]) => {
        const up = c < o
        return (
          <g key={x} opacity=".95">
            <path d={`M${x} ${h}V${l}`} stroke={up ? s : '#ff7a8a'} strokeWidth="1.6" />
            <rect x={x - 7} y={Math.min(o, c)} width="14" height={Math.max(6, Math.abs(o - c))} rx="2" fill={up ? s : '#ff7a8a'} opacity=".85" />
          </g>
        )
      })}
    </g>
  )
}

function Music({ s, f }) {
  return (
    <g>
      <g transform="translate(130 110)">
        <circle cx="90" cy="90" r="80" stroke={s} strokeWidth="2.5" fill={f} />
        <circle cx="62" cy="76" r="7" fill="#fff" />
        <circle cx="118" cy="76" r="7" fill="#fff" />
        <path d="M54 112c20 24 52 24 72 0" stroke="#fff" strokeWidth="3" />
        <path d="M-4 20V-4h24M184 20V-4h-24M-4 160v24h24M184 160v24h-24" stroke={s} strokeWidth="2.5" />
      </g>
      <g transform="translate(360 150)">
        {[38, 70, 50, 96, 64, 110, 80, 54, 88, 42, 66, 30].map((h, i) => (
          <rect key={i} x={i * 18} y={60 - h / 2} width="9" height={h} rx="4.5" fill={i % 3 === 0 ? '#fff' : s} opacity={i % 3 === 0 ? 0.75 : 0.85} />
        ))}
      </g>
      <path d="M520 110v-46l40-10v46" stroke="#fff" strokeOpacity=".8" strokeWidth="3" />
      <circle cx="512" cy="112" r="10" fill={s} />
      <circle cx="552" cy="102" r="10" fill={s} />
    </g>
  )
}

function Shield({ s, f }) {
  return (
    <g>
      <path d="M320 70 420 108v86c0 70-48 116-100 136-52-20-100-66-100-136v-86Z" stroke={s} strokeWidth="2.5" fill={f} />
      <path d="M320 140c-16 0-28 12-28 27 0 21 28 46 28 46s28-25 28-46c0-15-12-27-28-27Z" stroke="#fff" strokeWidth="2.5" />
      <circle cx="320" cy="167" r="8" fill={s} />
      <path
        d="M460 140a60 60 0 0 1 0 90M490 115a96 96 0 0 1 0 140M180 140a60 60 0 0 0 0 90M150 115a96 96 0 0 0 0 140"
        stroke={s}
        strokeWidth="2"
        opacity=".7"
      />
    </g>
  )
}

function Heart({ s, f }) {
  return (
    <g>
      <path
        d="M320 320S170 236 170 150c0-44 34-74 74-74 34 0 58 20 76 46 18-26 42-46 76-46 40 0 74 30 74 74 0 86-150 170-150 170Z"
        stroke={s}
        strokeWidth="2.5"
        fill={f}
      />
      <path d="M60 210h150l22-50 30 110 26-80 16 20h276" stroke="#fff" strokeWidth="2.5" opacity=".9" />
      <g transform="translate(470 96)" opacity=".8">
        {[30, 52, 40, 70].map((h, i) => (
          <rect key={i} x={i * 20} y={70 - h} width="12" height={h} rx="3" fill={s} />
        ))}
      </g>
    </g>
  )
}

const VARIANTS = { leaf: Leaf, car: Car, sofa: Sofa, bed: Bed, network: Network, chart: Chart, music: Music, shield: Shield, heart: Heart }

export default function ProjectArt({ variant, accent = 'blue', label, className }) {
  const raw = useId()
  const id = raw.replace(/[^a-zA-Z0-9_-]/g, '')
  const color = ACCENTS[accent] || ACCENTS.blue
  const Art = VARIANTS[variant] || Network
  return (
    <svg
      viewBox="0 0 640 400"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d1019" />
          <stop offset="1" stopColor="#07080d" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="0.62" cy="0.42" r="0.6">
          <stop offset="0" stopColor={color} stopOpacity=".32" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".22" />
          <stop offset="1" stopColor={color} stopOpacity=".02" />
        </linearGradient>
        <pattern id={`${id}grid`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0v32" fill="none" stroke="#fff" strokeOpacity=".045" />
        </pattern>
      </defs>
      <rect width="640" height="400" fill={`url(#${id}bg)`} />
      <rect width="640" height="400" fill={`url(#${id}grid)`} />
      <rect width="640" height="400" fill={`url(#${id}glow)`} />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Art s={color} f={`url(#${id}fill)`} />
      </g>
    </svg>
  )
}
