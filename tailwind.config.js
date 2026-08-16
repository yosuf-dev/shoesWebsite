/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
        },
        accent: {
          50: 'rgb(var(--accent-50) / <alpha-value>)',
          100: 'rgb(var(--accent-100) / <alpha-value>)',
          200: 'rgb(var(--accent-200) / <alpha-value>)',
          300: 'rgb(var(--accent-300) / <alpha-value>)',
          400: 'rgb(var(--accent-400) / <alpha-value>)',
          500: 'rgb(var(--accent-500) / <alpha-value>)',
          600: 'rgb(var(--accent-600) / <alpha-value>)',
          700: 'rgb(var(--accent-700) / <alpha-value>)',
          800: 'rgb(var(--accent-800) / <alpha-value>)',
          900: 'rgb(var(--accent-900) / <alpha-value>)',
        },
      },
      fontFamily: {
        dana: ['Dana', 'DanaFaNum', 'Tahoma', 'sans-serif'],
        morabba: ['Morabba', 'Dana', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', '1rem'],
        'display': ['clamp(2.75rem, 6vw, 5.5rem)', '1.08'],
        'hero': ['clamp(2.25rem, 4.5vw, 4rem)', '1.12'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(2, 6, 23, 0.06)',
        softer: '0 4px 18px rgba(2, 6, 23, 0.05)',
        lift: '0 16px 45px rgba(2, 6, 23, 0.12)',
        glow: '0 0 0 1px rgb(var(--brand-500) / 0.35), 0 10px 45px rgb(var(--brand-500) / 0.35)',
        'glow-sm': '0 4px 20px rgb(var(--brand-500) / 0.3)',
        'inner-border': 'inset 0 0 0 1px rgb(var(--border) / 0.6)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, rgb(var(--brand-500)) 0%, rgb(var(--brand-700)) 100%)',
        'accent-gradient': 'linear-gradient(135deg, rgb(var(--accent-500)) 0%, rgb(var(--accent-600)) 100%)',
        'hero-mesh': 'radial-gradient(60% 60% at 80% 10%, rgb(var(--brand-500) / 0.18) 0%, transparent 60%), radial-gradient(50% 50% at 10% 90%, rgb(var(--accent-500) / 0.14) 0%, transparent 60%)',
        'dark-mesh': 'radial-gradient(60% 60% at 80% 10%, rgb(var(--brand-500) / 0.22) 0%, transparent 60%), radial-gradient(50% 50% at 10% 90%, rgb(var(--accent-500) / 0.16) 0%, transparent 60%)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(50%)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'pulse-ring': 'pulseRing 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
