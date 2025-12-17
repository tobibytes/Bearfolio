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
        positive: '#10b981',
        warning: '#f59e0b',
      },
      boxShadow: {
        card: '0 12px 34px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
