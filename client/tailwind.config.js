/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fefcef",
        primaryDeep: "#66001f22",
        secondary: "#66001f",
        tertiary: "#66001f",
        gold: "#C8A248",
        gray: {
          30: '#7b7b7b',
          50: '#585858',
        }
      },
    
      screens: {
        xs: "400px",
      },

      backgroundImage: {
        hero: "url('/src/assets/ban.jpg')", 
      },

      fontFamily: {
        paci: ['"Pacifico"', "cursive"],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
