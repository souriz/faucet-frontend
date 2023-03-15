/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: { min: "375px", max: "479px" },
        md: { min: "480px", max: "767px" },
        lg: { min: "768px", max: "1023px" },
        xl: { min: "1024px", max: "1289px" },
        "2xl": { min: "1290px" },
      },
    },
  },
  plugins: [],
};
