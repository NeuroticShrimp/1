'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const themes = [
  'light',
  'dark',
  'yellow',
  'diamond-pearl',
  'black-white',
  'x-y',
  'sun-moon',
  'sword-shield',
  'legends-arceus',
  'scarlet-violet',
  'system',
] as const

type Theme = (typeof themes)[number]

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'pokemon-theme',
  ...props
}: any) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null

    if (savedTheme) {
      setTheme(savedTheme)
    } else if (defaultTheme === 'system') {
      setTheme(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
      )
    }
  }, [defaultTheme, storageKey])

  useEffect(() => {
    const root = document.documentElement

    // Remove all theme classes
    themes.forEach((theme) => root.classList.remove(theme))

    // Handle system theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    // Add the current theme class
    root.classList.add(theme)
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
      console.log('theme is', theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
