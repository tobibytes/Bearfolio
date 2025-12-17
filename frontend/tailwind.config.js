/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0f172a',
        muted: '#475569',
        surface: '#f8fafc',
        border: '#e2e8f0',
        brand: {
          DEFAULT: '#0ea5e9',
          dark: '#0369a1',
          soft: '#e0f2fe',
        },
        type: {
          software: '#0ea5e9',
          research: '#8b5cf6',
          design: '#f97316',
          writing: '#22c55e',
          business: '#0ea5e9',
          engineering: '#1e293b',
          art: '#ec4899',
          health: '#10b981',
          education: '#6366f1',
          community: '#f59e0b',
        },
      },
      boxShadow: {
        card: '0 12px 34px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
