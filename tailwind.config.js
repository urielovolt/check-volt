/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F0F0F',
        surface: '#1C1C1C',
        card: '#262626',
        'card-border': '#333333',
        primary: '#F97316',
        'primary-dark': '#EA6C00',
        success: '#22C55E',
        danger: '#EF4444',
        muted: '#6B7280',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
