/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bodoni: ['"Bodoni Moda"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        luxe:     { light: '#FDE68A', mid: '#D4A96A', dark: '#1A0F00' },
        bloom:    { light: '#FBCFE8', mid: '#EC4899', dark: '#2D0A1E' },
        midnight: { light: '#BFDBFE', mid: '#1E3A5F', dark: '#020617' },
        earth:    { light: '#E5C5A0', mid: '#8B5E3C', dark: '#1A0E07' },
      },
      animation: {
        'spin-slow': 'spin 120s linear infinite',
      },
    },
  },
  plugins: [],
}
