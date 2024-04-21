/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontSize: {
			'9px': '9px',
		  },
		extend: {},
	},
	// eslint-disable-next-line no-undef
	plugins: [require("daisyui")],
};
