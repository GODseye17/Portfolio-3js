/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        display: ['Crimson Text', 'serif'], // Using Crimson Text as a serif alternative to ITC Serif Gothic
        heading: ['Crimson Text', 'serif'],
      },
      colors: {
        'space-dark': '#030014',
        'space-blue': '#4facfe',
        'space-purple': '#9c88ff',
        'space-pink': '#ff9ff3',
        'space-green': '#0abde3',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'space-grid': 'linear-gradient(rgba(79, 172, 254, 0.1) 1px, transparent 1px), linear-gradient(to right, rgba(79, 172, 254, 0.1) 1px, transparent 1px)',
      },
      boxShadow: {
        'neon-blue': '0 0 5px rgba(79, 172, 254, 0.5), 0 0 20px rgba(79, 172, 254, 0.3)',
        'neon-purple': '0 0 5px rgba(156, 136, 255, 0.5), 0 0 20px rgba(156, 136, 255, 0.3)',
      },
    },
  },
  plugins: [],
};