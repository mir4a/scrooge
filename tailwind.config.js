/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      boxShadow: {
        button: {
          base: {
            default: "4px 4px 0 0",
            active: "2px 2px 0 0",
          },
          outline: {
            default: "4px 4px 0 1px",
            active: "2px 2px 0 1px",
          },
        },
      },
    },
  },
  plugins: [],
};
