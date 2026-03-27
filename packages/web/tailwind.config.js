/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(215, 25, 32)",
        accent: "rgb(247, 201, 72)",
      },
      fontFamily: {
        body: "var(--font-body)",
      },
    },
  },
  plugins: [],
}
