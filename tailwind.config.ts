// © Janus — yashxsanjay
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#080810',
        surface: '#12121e',
        'surface-2': '#1c1c30',
        border: '#2d2d4a',
        text: '#e8e8f0',
        'text-muted': '#8888aa',
        brand: '#4f6ef7',
        'brand-dark': '#3b5bdb',
        accent: '#818cf8',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4f6ef7 0%, #818cf8 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'spin-slow': 'spin-slow 1s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
