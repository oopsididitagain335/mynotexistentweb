import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        mybio: {
          primary: '#6366f1',
          hover: '#4f46e5',
          dark: '#1e293b',
          light: '#f8fafc',
          gray: '#64748b',
        },
      },
    },
  },
  plugins: [],
};

export default config;
