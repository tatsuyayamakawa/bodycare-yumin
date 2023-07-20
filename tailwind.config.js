/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
	mode: 'jit',
	content: [
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		"./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
		"./modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			screens: {
				'mobile': '375px',
				// => @media (min-width:375px) { ... }
				'tablet': '768px',
				// => @media (min-width:768px) { ... }
				'laptop': '1024px',
				// => @media (min-width:1024px) { ... }
				'desktop': '1280px',
				// => @media (min-width:1280px) { ... }
			},
			container: {
				center: true,
			},
			fontFamily: {
				notojp: ['var(--font-notojp)'],
				zenmincho: ['var(--font-zenmincho)'],
				allura: ['var(--font-allura)'],
				b612mono: ['var(--font-b612mono)']
			},
			colors: {
				'primary': '#71645D',
				'secondary': '#EFEBE9',
				'accent': '#FF9933',
				'white': '#FEFEFE',
				'gray-10': '#EEEEEE',
				'gray-25': '#AAAAAA',
				'gray-50': '#707070',
				'gray-75': '#444444',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			keyframes: {
				spin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				spin: 'spin 2s linear infinite',
			},
		},
	},
	plugins: [],
});
