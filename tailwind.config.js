/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ghost: '#8b5cf6',
        'ghost-light': '#a78bfa',
      },
    },
  },
  plugins: [],
}
