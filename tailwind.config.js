// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './bot/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Uses `.dark` class for dark mode (perfect for user toggle)
  theme: {
    extend: {
      // === Colors ===
      colors: {
        primary: {
          DEFAULT: '#7C3AED', // purple-600
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        secondary: '#9333EA', // optional: use as hover variant
        accent: '#EC4899',   // pink-500
        dark: '#111827',
        light: '#F9FAFB',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },

      // === Fonts ===
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        retro: ['"VT323"', 'monospace'],
      },

      // === Shadows ===
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        glow: '0 0 15px rgba(124, 58, 237, 0.4)',
        'glow-lg': '0 0 25px rgba(124, 58, 237, 0.5)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },

      // === Animations ===
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'bounce-slow': 'bounce-slow 2s infinite',
      },

      // === Spacing & Sizing ===
      maxWidth: {
        'screen-xl': '1400px',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [
    // Optional: Add subtle utilities
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-glow': {
          textShadow: '0 0 10px rgba(124, 58, 237, 0.6)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
