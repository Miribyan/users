/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./public/**/*"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
