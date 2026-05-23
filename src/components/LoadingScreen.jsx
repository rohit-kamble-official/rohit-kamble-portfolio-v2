import { useEffect, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 18 + 6
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(onDone, 500)
        }, 300)
      }
      setProgress(Math.min(p, 100))
    }, 120)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: '#0a0a0f',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Grid bg */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Orb */}
      <div className="absolute w-64 h-64 rounded-full blur-3xl"
        style={{ background:'rgba(124,58,237,0.2)', animation:'orbFloat 4s ease-in-out infinite' }} />

      {/* Logo */}
      <div className="relative mb-8">
        <div
          className="font-syne font-extrabold text-7xl text-gradient glow-text"
          style={{ lineHeight:1 }}
        >
          RK.
        </div>
        {/* Rotating ring around logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-28 h-28 rounded-full border border-dashed border-violet-500/30"
            style={{ animation:'spin 6s linear infinite', margin:'-14px' }} />
        </div>
      </div>

      {/* Name */}
      <p className="font-syne font-bold text-white text-xl mb-1 relative">Rohit Kamble</p>
      <p className="text-slate-500 text-xs uppercase tracking-widest mb-10 relative font-mono">
        Full Stack Developer
      </p>

      {/* Progress bar */}
      <div className="relative w-56">
        <div className="h-px bg-white/08 rounded-full overflow-hidden" style={{ backgroundColor:'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 10px rgba(124,58,237,0.6)',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-slate-600 text-[10px] font-mono">Loading portfolio...</span>
          <span className="text-violet-400 text-[10px] font-mono">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Tech dots */}
      <div className="absolute bottom-8 flex gap-2">
        {['React', 'Node.js', 'Docker', 'AWS'].map((t, i) => (
          <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{
              border: '1px solid rgba(124,58,237,0.3)',
              color: 'rgba(167,139,250,0.7)',
              background: 'rgba(124,58,237,0.05)',
              animation: `fadeUp 0.5s ${i * 0.1 + 0.3}s ease both`,
              opacity: 0,
              animationFillMode: 'forwards',
            }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
