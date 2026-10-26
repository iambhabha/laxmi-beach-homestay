/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        marathi: ['"Tiro Devanagari Marathi"', 'serif'],
      },
      // Taken from the Laxmi logo: night-navy ground, saffron mark,
      // wave cyan and sindoor red.
      colors: {
        // Rich black for the dark theme (softer than pure #000).
        ink: { DEFAULT: '#0B0B0D', 2: '#151518', 3: '#202024' },
        sea: { deep: '#04202F', DEFAULT: '#0B4A63', mid: '#0E7490', light: '#7DD3E8' },
        wave: { DEFAULT: '#38BDF8', soft: '#E0F4FB' },
        saffron: { DEFAULT: '#F5B400', dark: '#D99A00', soft: '#FFF4D1' },
        sindoor: { DEFAULT: '#E11D2E', soft: '#FDE4E6' },
        sand: { DEFAULT: '#F6EBDD', 2: '#EFDDC6', deep: '#8A5A2B' },
        foam: '#FFFCF7',
        muted: '#5B6577',
        // Theme-aware tokens for the sections that flip between dark and light
        // (values live in index.css under :root and [data-theme='light']).
        on: 'rgb(var(--on) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        star: 'rgb(var(--star) / <alpha-value>)',
        scrim: 'rgb(var(--scrim) / <alpha-value>)',
        highlight: 'rgb(var(--highlight) / <alpha-value>)',
        surface: {
          sports: 'rgb(var(--surface-sports) / <alpha-value>)',
          reviews: 'rgb(var(--surface-reviews) / <alpha-value>)',
          footer: 'rgb(var(--surface-footer) / <alpha-value>)',
        },
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,11,13,.06), 0 8px 24px -8px rgba(11,11,13,.18)',
        lift: '0 2px 4px rgba(11,11,13,.08), 0 24px 48px -16px rgba(11,11,13,.35)',
      },
      maxWidth: {
        page: '1240px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(.2,.7,.2,1)',
      },
    },
  },
  plugins: [],
}
