/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#1b2a4a',
          900: '#0b1329',
          950: '#060a17',
        },
        brand: {
          primary: '#4f46e5',
          secondary: '#7c3aed',
          accent: '#06b6d4',
          dark: '#0f172a',
          card: '#1e293b',
          cardBorder: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
