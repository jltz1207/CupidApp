/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  theme: {
    extend: {},
    colors: {
      'trans-nav-blue': '#315272',
      'nav-blue': '#15304B',
      'theme-orange': '#CC311B',
      'trans-gray': '#2C2C2CCC', //rgba(44, 44, 44, 0.80)
      'warn-red': '#ed4956',
      'tag-grey': '#b2b8b4', //cancel grey
      'tag-red' : '#dd2716'
    },
  },
  plugins: [],
}

