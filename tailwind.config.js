/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        neon: '#7c3aed',
        cyan: '#06b6d4',
        violet: '#a78bfa',
        pink: '#ec4899',
        gold: '#fbbf24',
        dark: {
          900: '#0a0a0f',
          800: '#0f0f1a',
          700: '#141428',
          600: '#1a1a35',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'grid': 'gridMove 20s linear infinite',
        'particle': 'particleDrift linear infinite',
        'blink': 'blink 1s step-end infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 20px rgba(124,58,237,0.4)' },
          '50%': { textShadow: '0 0 40px rgba(124,58,237,0.8), 0 0 60px rgba(6,182,212,0.3)' },
        },
        gridMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 60px' },
        },
        blink: { '50%': { opacity: 0 } },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '60px 60px',
      }
    },
  },
  plugins: [],
}
