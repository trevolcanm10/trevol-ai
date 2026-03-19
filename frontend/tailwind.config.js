/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        lams: {
          orange: '#EF7D24',
          navy: '#3B3C6E',
          'navy-light': '#4E4F8A',
        }
      }
    },
  },
  plugins: [],
};