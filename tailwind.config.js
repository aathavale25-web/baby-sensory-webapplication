/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High contrast colors for infant vision
        'baby-red': '#FF4444',
        'baby-blue': '#4444FF',
        'baby-yellow': '#FFFF00',
        'baby-green': '#44FF44',
        'baby-purple': '#AA44FF',
        'baby-orange': '#FF8844',
        'baby-pink': '#FF88CC',
        'baby-cyan': '#44FFFF',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
