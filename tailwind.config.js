/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Nunito', 'sans-serif'],
        display: ['Fredoka', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FF8C42',
          dark: '#E8732A',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          dark: '#3DBDB5',
        },
        accent: {
          DEFAULT: '#FFE66D',
          dark: '#F0D750',
        },
        pink: '#FF6B9D',
        purple: '#9B5DE5',
        blue: '#00BBF9',
        green: '#00F5D4',
        red: '#FF6B6B',
        bg: '#FFF8F0',
        card: '#FFFFFF',
        text: {
          DEFAULT: '#2D3436',
          light: '#636E72',
        },
      },
    },
  },
  plugins: [],
}
