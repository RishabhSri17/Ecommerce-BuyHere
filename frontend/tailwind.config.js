/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      rotate: {
        'x-60': '60deg',
      },
      animation: {
        box1: 'box1 800ms linear infinite',
        box2: 'box2 800ms linear infinite',
        box3: 'box3 800ms linear infinite',
        box4: 'box4 800ms linear infinite',
      },
      keyframes: {
        box1: {
          '0%, 50%': { transform: 'translate(100%, 0)' },
          '100%': { transform: 'translate(200%, 0)' },
        },
        box2: {
          '0%': { transform: 'translate(0, 100%)' },
          '50%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(100%, 0)' },
        },
        box3: {
          '0%, 50%': { transform: 'translate(100%, 100%)' },
          '100%': { transform: 'translate(0, 100%)' },
        },
        box4: {
          '0%': { transform: 'translate(200%, 0)' },
          '50%': { transform: 'translate(200%, 100%)' },
          '100%': { transform: 'translate(100%, 100%)' },
        },
      },
    },
  },
  plugins: [],
}

