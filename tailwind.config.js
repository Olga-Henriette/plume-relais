/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#4F46E5', // Indigo moderne
          DEFAULT: '#6366F1',
          dark: '#4338CA',
        },
      },
    },
  },
  plugins: [],
}