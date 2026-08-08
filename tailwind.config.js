/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#121417',
          dark: '#0A0B0D',
          light: '#181C20',
        },
        slate: {
          DEFAULT: '#1C1F24',
          elevated: '#262A30',
          border: '#2E333C',
        },
        crimson: {
          DEFAULT: '#C4302B',
          dark: '#99221E',
          glow: 'rgba(196, 48, 43, 0.4)',
        },
        gold: {
          DEFAULT: '#D9A441',
          dark: '#B0802B',
          glow: 'rgba(217, 164, 65, 0.3)',
        },
        cyan: {
          DEFAULT: '#5FA8B0',
          dark: '#447D84',
          glow: 'rgba(95, 168, 176, 0.3)',
        },
        surface: {
          text: '#EDEDED',
          muted: '#9A9A9A',
          subtle: '#646870',
        },
      },
      fontFamily: {
        display: ['var(--font-barlow)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(196, 48, 43, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(196, 48, 43, 0.8)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
