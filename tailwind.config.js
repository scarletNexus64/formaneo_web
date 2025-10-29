/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Formaneo brand colors extracted from logo
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1e40af', // Main navy blue from logo
          700: '#1e3a8a',
          800: '#1e293b',
          900: '#0f172a',
        },
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24', // Golden yellow from logo
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Formaneo specific brand colors
        formaneo: {
          navy: '#1e3a8a',
          gold: '#fbbf24',
          'navy-dark': '#1e293b',
          'gold-light': '#fde68a',
          gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        }
      },
      fontFamily: {
        'sans': ['SF Pro Display', 'SF Pro Text', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'sf-pro': ['SF Pro Display', 'SF Pro Text', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}