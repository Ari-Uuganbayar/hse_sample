/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary_yellow: "#FCDC4C",
        primary_green: "#00C489",
        primary_blue: "#082A5B",
        primary_cyan: "#27C0FE",
      },
    },
  },
  plugins: [],
};
