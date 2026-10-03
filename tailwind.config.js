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
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        income: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#047857'
        },
        expense: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c'
        }
      }
    },
  },
  plugins: [],
}
