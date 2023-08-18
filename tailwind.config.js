/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: [
    'src/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    'modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        sm: '375px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      container: {
        center: true,
      },
      fontFamily: {
        notojp: ['Noto Sans JP', 'sans-serif'],
        zenmincho: ['Zen Old Mincho'],
        allura: ['Allura'],
        b612mono: ['B612 Mono'],
      },
      colors: {
        primary: '#71645D',
        secondary: '#EFEBE9',
        accent: '#FF9933',
        white: '#FEFEFE',
        green: '#06C755',
        'gray-10': '#EEEEEE',
        'gray-25': '#AAAAAA',
        'gray-50': '#707070',
        'gray-75': '#444444',
      },
      keyframes: {
        popping: {
          '0%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(0.5em)' },
          '60%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        popping: 'popping 2s infinite ease-out',
      },
    },
  },
  plugins: [],
});
