/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coink: {
          green: '#1EEB00',
          teal: '#004B40',
          dark: '#003336',
          black: '#000000',
          white: '#FFFFFF',
        }
      }
    },
  },
  plugins: [],
}
