import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      keyframes: {
        // Expanding ring on the mic button. A box-shadow rather than a scaled
        // pseudo-element, so it never affects layout or hit area.
        'mic-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(79,70,229,0.40)' },
          '70%': { boxShadow: '0 0 0 18px rgba(79,70,229,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(79,70,229,0)' },
        },
      },
      animation: {
        'mic-ring': 'mic-ring 2.4s ease-out infinite',
      },
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [],
}

export default config
