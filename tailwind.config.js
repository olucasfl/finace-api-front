/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        secondary: '#00CEC9',
        accent: '#FD79A8',
        fintech: {
          bg: '#0F172A',
          card: '#1E293B',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(108, 92, 231, 0.5)',
      }
    },
  },
  plugins: [],
}