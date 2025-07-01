import type { Config } from 'tailwindcss'

/**
 * Combined config – adds <alpha-value> support to every CSS-variable colour
 * while keeping your existing container, animations, Pokémon themes, & plugins.
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },

    extend: {
      /* ------------------------------------------------- */
      /* 1. COLOURS
      /* ------------------------------------------------- */
      colors: {
        /* single-token colours */
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',

        /* grouped palettes */
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
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
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background) / <alpha-value>)',
          foreground: 'hsl(var(--sidebar-foreground) / <alpha-value>)',
          primary: 'hsl(var(--sidebar-primary) / <alpha-value>)',
          'primary-foreground':
            'hsl(var(--sidebar-primary-foreground) / <alpha-value>)',
          accent: 'hsl(var(--sidebar-accent) / <alpha-value>)',
          'accent-foreground':
            'hsl(var(--sidebar-accent-foreground) / <alpha-value>)',
          border: 'hsl(var(--sidebar-border) / <alpha-value>)',
          ring: 'hsl(var(--sidebar-ring) / <alpha-value>)',
        },

        /* Pokémon-type + generation swatches (hex stays as-is) */
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

        /* chart palette */
        chart: {
          '1': 'hsl(var(--chart-1) / <alpha-value>)',
          '2': 'hsl(var(--chart-2) / <alpha-value>)',
          '3': 'hsl(var(--chart-3) / <alpha-value>)',
          '4': 'hsl(var(--chart-4) / <alpha-value>)',
          '5': 'hsl(var(--chart-5) / <alpha-value>)',
        },
      },

      /* ------------------------------------------------- */
      /* 2. BORDER RADIUS
      /* ------------------------------------------------- */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /* ------------------------------------------------- */
      /* 3. BACKGROUND IMAGES
      /* ------------------------------------------------- */
      backgroundImage: {
        'pokeball-pattern': "url('/pokeball-bg.svg')",
        'pokedex-texture': "url('/pokedex-texture.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },

      /* ------------------------------------------------- */
      /* 4. ANIMATIONS & SHADOWS
      /* ------------------------------------------------- */
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'pokemon-card':
          '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06), 0 0 0 3px rgba(66,153,225,0.5)',
      },
      safelist: [
        'dark',
        'light',
        'yellow',
        'diamond-pearl',
        'black-white',
        'x-y',
        'sun-moon',
        'sword-shield',
        'legends-arceus',
        'scarlet-violet',
      ],
    },
  },

  plugins: [require('tailwindcss-animate')],
}

export default config
