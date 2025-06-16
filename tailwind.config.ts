import type { Config } from 'tailwindcss'

/**
 * Tailwind matches the design tokens defined in globals.css.
 * – Every colour points at a CSS variable that already exists
 * – All background-image utilities were removed (you dropped them)
 * – “popover”, “sidebar”, and “chart” groups were removed because the
 *   variables don’t exist in the CSS source-of-truth you shared
 */
const config: Config = {
  darkMode: ['class'], // .dark { … } in your CSS

  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
  ],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },

    extend: {
      /* 1. COLOURS — one entry per CSS variable ------------------------- */
      colors: {
        /* single-token scales */
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',

        /* paired tokens */
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },

        /* Pokémon-type swatches (kept verbatim) */
        pokemonTypes: {
          fire: '#EE8130',
          water: '#6390F0',
          grass: '#7AC74C',
          electric: '#F7D02C',
          psychic: '#F95587',
          ice: '#96D9D6',
          dragon: '#6F35FC',
          dark: '#705746',
          fairy: '#D685AD',
          normal: '#A8A77A',
          fighting: '#C22E28',
          poison: '#A33EA1',
          ground: '#E2BF65',
          flying: '#A98FF3',
          bug: '#A6B91A',
          rock: '#B6A136',
          ghost: '#735797',
          steel: '#B7B7CE',
        },
        generations: {
          gen1: '#FF1111',
          gen2: '#DAA520',
          gen3: '#3B4CCA',
          gen4: '#4F7942',
          gen5: '#8B008B',
          gen6: '#00BFFF',
          gen7: '#FF8C00',
          gen8: '#9400D3',
        },
      },

      /* 2. RADIUS ------------------------------------------------------- */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /* 3. ANIMATION & EFFECTS ----------------------------------------- */
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        'pokemon-card':
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
}

export default config
