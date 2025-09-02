// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2260FF',
        light: '#DDE5FF',
        grayPlaceholder: '#F3F3F3',
        white: '#FFFFFF',
        black: '#000000',
      },
      fontFamily: {
        sans: ['Yekan-Bakh', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
