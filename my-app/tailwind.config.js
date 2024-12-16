/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundSize: {
        '400%': '400% 400%',
      },
      keyframes: {
        gradientButton: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '50% 100%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        gradientButton: 'gradientButton 2s ease infinite',
      },
      colors: {
        primary: "#FFFFFF",
        secondary: "#000000",
        ternary: "#DAFD00",
        olistcolor: "#0a4ee4",
        blingcolor: "#5ac782",
        marc: "#666666",
      },
    },
  },
  plugins: [],
};

export default config; // Use export default para ESModules
