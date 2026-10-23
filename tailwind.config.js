/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#0d1117',
          800: '#161b22',
          700: '#21262d',
        },
        accent: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#93c5fd',
        },
      },
      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Home page photo mosaic: each row holds its tiles twice, so shifting by half loops seamlessly.
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-reverse': { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 90s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--marquee-duration, 90s) linear infinite',
      },
    },
  },
  plugins: [
    // line-clamp is built-in from Tailwind v3.3+ — no plugin needed
  ],
}
