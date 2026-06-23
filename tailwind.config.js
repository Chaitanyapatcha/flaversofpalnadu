/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'deep-green': '#1a4d2e',
        'deep-green-light': '#2d6a4f',
        'deep-green-dark': '#0f3d1e',
        'gold': '#c9a84c',
        'gold-light': '#ddb96b',
        'gold-dark': '#a3883a',
        'cream': '#fdf8f0',
        'cream-dark': '#f5e6d3',
        'olive': '#5b7c4f',
        'terracotta': '#c95a3a',
        'sand': '#e8ddd0',
        'charcoal': '#1f1f1f',
      },
    },
  },
  plugins: [],
}
