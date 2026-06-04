/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: '#070B12',
          surface: '#121823',
          card: '#1C2431',
          white: '#F5F7FA',
          muted: '#9CA6B7',
          border: '#313B4A',
          gold: {
            DEFAULT: '#9CA6B7',
            light: '#F5F7FA',
            dark: '#9CA6B7'
          },
          purple: {
            deep: '#121823',
            nebula: '#070B12'
          }
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #070B12, #121823, #1C2431)',
        'nebula-radial': 'radial-gradient(circle, #121823, #070B12, #070B12)',
      },
      boxShadow: {
        'cosmic': '0 0 30px rgba(156, 166, 183, 0.16)',
        'gold-glow': '0 0 40px rgba(245, 247, 250, 0.18)',
      },
      fontFamily: {
        montserrat: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

