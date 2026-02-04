/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a1628',      // Very dark blue background
        'cyber-navy': '#0d2847',      // Navy blue
        'cyber-blue': '#00b4d8',      // Cyan accent
        'cyber-light': '#1a3a5c',     // Light navy
        'cyber-purple': '#7b2cbf',    // Purple accent
        'cyber-pink': '#e0aaff',      // Pink accent
        'cyber-green': '#06ffa5',     // Green accent
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0, 180, 216, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 216, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}