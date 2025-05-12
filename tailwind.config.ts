import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: 'rgb(var(--foreground-rgb))',
        'background-start': 'rgb(var(--background-start-rgb))',
        'background-end': 'rgb(var(--background-end-rgb))',
        'brand-default': 'var(--brand-default)',
        'brand-fainter': 'var(--brand-fainter)',
        'brand-faint': 'var(--brand-faint)',
        'brand-subtle': 'var(--brand-subtle)',
        'brand-muted': 'var(--brand-muted)',
        'brand-dark': 'var(--brand-dark)',
        'brand-darker': 'var(--brand-darker)',
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        }
      },
      fontFamily: {
        sans: ['GeistSans', 'system-ui', 'sans-serif'],
        mono: ['GeistMono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;