/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],

  theme: {
    extend: {

      colors: {

        primary: {
          50: "#fff1f5",
          100: "#ffe4ec",
          200: "#fecdd6",
          300: "#fda4b8",
          400: "#fb718f",
          500: "#d94673",
          600: "#c23363",
          700: "#a82754"
        },

        ink: {
          50: "#f8fafc",
          100: "#e2e8f0",
          300: "#94a3b8",
          500: "#64748b",
          700: "#334155",
          900: "#0f172a"
        }

      }

    },
  },

  plugins: [],
};