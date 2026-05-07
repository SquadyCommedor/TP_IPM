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
        comic: ['Comic Neue', 'cursive'],
      },
      colors: {
        // Cores suaves e calmantes para crianças com PEA
        sky: {
          50: '#E8F4F8',
          100: '#D1E9F1',
          200: '#A3D3E3',
          300: '#5DADE2',
          400: '#3498DB',
          500: '#2980B9',
        },
        mint: {
          50: '#E8F8F0',
          100: '#D1F1E1',
          200: '#A3E3C3',
          300: '#58D68D',
          400: '#2ECC71',
          500: '#27AE60',
        },
        peach: {
          50: '#FEF5E7',
          100: '#FDEBD0',
          200: '#FAD7A0',
          300: '#F8C471',
          400: '#F5B041',
          500: '#E67E22',
        },
        lavender: {
          50: '#F4ECF7',
          100: '#E8DAEF',
          200: '#D2B4DE',
          300: '#BB8FCE',
          400: '#A569BD',
          500: '#8E44AD',
        },
        coral: {
          50: '#FADBD8',
          100: '#F5B7B1',
          200: '#F1948A',
          300: '#EC7063',
          400: '#E74C3C',
          500: '#C0392B',
        },
        // Cores de estado
        calm: '#58D68D',
        warn: '#F8C471',
        alert: '#EC7063',
        // Cores de fundo
        bg: '#E8F4F8',
        card: '#FFFFFF',
        // Cores de texto
        text: {
          DEFAULT: '#2C3E50',
          light: '#5D6D7E',
          muted: '#85929E',
        },
      },
      borderRadius: {
        'kid': '24px',
        'kid-lg': '32px',
      },
      boxShadow: {
        'kid': '0 8px 32px rgba(93, 173, 226, 0.12)',
        'kid-lg': '0 12px 48px rgba(93, 173, 226, 0.18)',
      },
    },
  },
  plugins: [],
}
