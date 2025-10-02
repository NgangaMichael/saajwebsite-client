import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",   // ✅ important for React
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}
